import type { MiddlewareHandler } from "hono";
import { z } from "zod";

export const validateBody = (schema: z.ZodSchema): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const body = await c.req.json();
      c.set("validBody" as any, await schema.parseAsync(body));
      await next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: "Validation failed",
            details: err.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          400
        );
      }
      return c.json({ success: false, error: "Invalid JSON payload structure" }, 400);
    }
  };
};
