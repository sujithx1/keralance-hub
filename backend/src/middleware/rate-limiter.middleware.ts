import type { MiddlewareHandler } from "hono";
import { env } from "../config/env";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const cache = new Map<string, RateLimitInfo>();

export const rateLimiter = (): MiddlewareHandler => {
  return async (c, next) => {
    // Skip rate limits in test environments
    if (env.NODE_ENV === "test") {
      return await next();
    }

    // Attempt to get client IP from headers
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for") ||
      c.req.header("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const clientLimitInfo = cache.get(ip);

    if (!clientLimitInfo) {
      cache.set(ip, {
        count: 1,
        resetTime: now + env.RATE_LIMIT_WINDOW_MS,
      });
      return await next();
    }

    if (now > clientLimitInfo.resetTime) {
      cache.set(ip, {
        count: 1,
        resetTime: now + env.RATE_LIMIT_WINDOW_MS,
      });
      return await next();
    }

    clientLimitInfo.count += 1;

    if (clientLimitInfo.count > env.RATE_LIMIT_MAX) {
      c.header("Retry-After", Math.ceil((clientLimitInfo.resetTime - now) / 1000).toString());
      return c.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        429
      );
    }

    await next();
  };
};
