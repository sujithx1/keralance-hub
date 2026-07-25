import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

const JWT_SECRET_BYTES = new TextEncoder().encode(env.JWT_SECRET);
const JWT_REFRESH_SECRET_BYTES = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export interface JWTPayload {
  id: string;
  role: "admin" | "user" | "freelancer";
}

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Access token expires in 15 minutes
    .sign(JWT_SECRET_BYTES);
}

export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Refresh token expires in 7 days
    .sign(JWT_REFRESH_SECRET_BYTES);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET_BYTES);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
