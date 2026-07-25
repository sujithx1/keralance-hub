import type { MiddlewareHandler } from "hono";
import { verifyAccessToken, type JWTPayload } from "../utils/auth";

declare module "hono" {
  interface ContextVariableMap {
    user: JWTPayload;
    userId: string;
  }
}

export const requireAuth = (): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          success: false,
          error: "Unauthorized: Missing or invalid token format. Use Bearer <token>",
        },
        401
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return c.json(
        {
          success: false,
          error: "Unauthorized: Invalid or expired access token",
        },
        401
      );
    }

    c.set("user", payload);
    c.set("userId", payload.id);
    await next();
  };
};

export const requireRoles = (allowedRoles: ("admin" | "user" | "freelancer")[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        {
          success: false,
          error: "Unauthorized: User context not initialized",
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: `Forbidden: Access restricted. Requires one of: [${allowedRoles.join(", ")}]`,
        },
        403
      );
    }

    await next();
  };
};
