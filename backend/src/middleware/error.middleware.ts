import type { ErrorHandler } from "hono";
import { logger } from "../lib/logger";

export const globalErrorHandler: ErrorHandler = (err, c) => {
  logger.error(err, "Unhandled error caught by global middleware");

  // Check if error is a validation error (Zod)
  if (err instanceof Error && err.name === "ZodError") {
    return c.json(
      {
        success: false,
        error: "Validation failed",
        details: JSON.parse(err.message),
      },
      400
    );
  }

  // Check HTTP response code on context or fallback to 500
  const status = c.res.status === 200 || !c.res.status ? 500 : c.res.status;
  
  return c.json(
    {
      success: false,
      error: err instanceof Error ? err.message : "Internal Server Error",
    },
    status as any
  );
};
