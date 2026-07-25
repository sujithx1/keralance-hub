import { Hono } from "hono";
import { authService } from "../services/auth.service";
import { userRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import { validateBody } from "../middleware/validation.middleware";
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema
} from "../validators/schema.validator";
import { db } from "../db/connection";
import { OtpTable, RefreshTokenTable, UserTable } from "../schema/db.schema";
import { eq, and } from "drizzle-orm";
import { smsService } from "../services/sms.service";

const authRouter = new Hono();

authRouter.post("/register", validateBody(registerSchema), async (c) => {
  const body = c.get("validBody" as any);
  const user = await authService.register(body.name, body.email, body.password, body.role);
  return c.json({ success: true, message: "User registered successfully", data: user }, 201);
});

authRouter.post("/login", validateBody(loginSchema), async (c) => {
  const body = c.get("validBody" as any);
  const data = await authService.login(body.email, body.password);
  return c.json({ success: true, message: "Logged in successfully", data });
});

authRouter.post("/logout", async (c) => {
  const { refreshToken } = await c.req.json().catch(() => ({}));
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  return c.json({ success: true, message: "Logged out successfully" });
});

authRouter.post("/refresh", async (c) => {
  const { refreshToken } = await c.req.json().catch(() => ({}));
  if (!refreshToken) {
    return c.json({ success: false, error: "Refresh token is required" }, 400);
  }
  
  try {
    const data = await authService.refresh(refreshToken);
    return c.json({ success: true, data });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 401);
  }
});

authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), async (c) => {
  return c.json({
    success: true,
    message: "Password reset link sent to email (Mocked)",
    debugToken: "mock-reset-token-2026",
  });
});

authRouter.post("/reset-password", validateBody(resetPasswordSchema), async (c) => {
  return c.json({ success: true, message: "Password reset successfully (Mocked)" });
});

authRouter.post("/verify-email", async (c) => {
  return c.json({ success: true, message: "Email verified successfully (Mocked)" });
});

authRouter.post("/google", async (c) => {
  const { credentialToken } = await c.req.json().catch(() => ({}));
  if (!credentialToken) {
    return c.json({ success: false, error: "Google credential token is required" }, 400);
  }

  try {
    const mockEmail = "googleuser@keralancehub.com";
    const mockName = "Google Member";

    let user = await userRepository.findByEmail(mockEmail);
    if (!user) {
      user = await userRepository.create({
        name: mockName,
        email: mockEmail,
        passwordHash: "OAUTH_GOOGLE_EXTERNAL",
        role: "user",
        emailVerified: true,
      });
    }

    const payload = {
      id: user.id,
      role: user.role as "admin" | "user" | "freelancer",
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return c.json({
      success: true,
      message: "Authenticated with Google OAuth successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

authRouter.post("/otp/send", validateBody(sendOtpSchema), async (c) => {
  const { phone } = c.get("validBody" as any);

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Delegate dispatch and in-memory caching to the decoupled SMS Service
  await smsService.sendOtp(phone, code);

  return c.json({
    success: true,
    message: "OTP sent successfully to phone",
    debugCode: code,
  });
});

authRouter.post("/otp/verify", validateBody(verifyOtpSchema), async (c) => {
  const { phone, code, name, role } = c.get("validBody" as any);

  // Validate OTP locally inside SmsService cache
  const isValid = await smsService.verifyOtp(phone, code);
  if (!isValid) {
    return c.json({ success: false, error: "Invalid, expired, or rate-limited verification code" }, 400);
  }

  let user = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.phone, phone))
    .limit(1)
    .then((r) => r[0] || null);

  if (!user) {
    if (!name) {
      return c.json({ success: false, error: "Name is required for registration" }, 400);
    }
    
    const [newUser] = await db
      .insert(UserTable)
      .values({
        name,
        phone,
        role: role || "user",
        emailVerified: false,
        status: "active",
      })
      .returning();
    user = newUser;
  }

  if (user.status === "banned") {
    return c.json({ success: false, error: "Your account is suspended" }, 403);
  }

  const payload = {
    id: user.id,
    role: user.role as "admin" | "user" | "freelancer",
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  const refreshExpires = new Date();
  refreshExpires.setDate(refreshExpires.getDate() + 7);

  await db.insert(RefreshTokenTable).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshExpires,
  });

  return c.json({
    success: true,
    message: "Authenticated successfully via phone OTP",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

export { authRouter };