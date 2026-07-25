import { eq, and } from "drizzle-orm";
import { db } from "../db/connection";
import { refreshTokens, users } from "../schema/db.schema";
import { userRepository } from "../repositories/user.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type JWTPayload,
} from "../utils/auth";

export class AuthService {
  async register(name: string, email: string, passwordPlain: string, role: "admin" | "user" | "freelancer") {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email is already registered");
    }

    // Hash password using Bun's native secure password hasher (uses Argon2)
    const passwordHash = await Bun.password.hash(passwordPlain, {
      algorithm: "argon2id",
    });

    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role,
      status: "active",
      emailVerified: false,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, passwordPlain: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status === "banned") {
      throw new Error("Your account has been banned. Contact administrator.");
    }

    // Verify password natively
    const isValid = await Bun.password.verify(passwordPlain, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role as any,
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // Save refresh token to db
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    // Revoke refresh token
    await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, token));
  }

  async refresh(token: string) {
    const payload = await verifyRefreshToken(token);
    if (!payload) {
      throw new Error("Invalid refresh token");
    }

    // Find token record in database
    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, token),
          eq(refreshTokens.isRevoked, false)
        )
      )
      .limit(1);

    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      // If token is revoked or expired, revoke all tokens for this user for security (reuse detection)
      if (tokenRecord) {
        await db
          .update(refreshTokens)
          .set({ isRevoked: true })
          .where(eq(refreshTokens.userId, tokenRecord.userId));
      }
      throw new Error("Refresh token expired or revoked");
    }

    // Revoke old token (token rotation)
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.id, tokenRecord.id));

    // Generate new tokens
    const userPayload: JWTPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    const newAccessToken = await generateAccessToken(userPayload);
    const newRefreshToken = await generateRefreshToken(userPayload);

    // Save new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(refreshTokens).values({
      userId: payload.id,
      token: newRefreshToken,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
export const authService = new AuthService();
