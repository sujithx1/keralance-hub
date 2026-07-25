import { Hono } from "hono";
import { authService } from "../services/auth.service";
import { userRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import { validateBody } from "../middleware/validation.middleware";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/schema.validator";

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
  // In production, send email. For mock/dev, return code/token.
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
      email: user.email,
      role: user.role as any,
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

export { authRouter };
