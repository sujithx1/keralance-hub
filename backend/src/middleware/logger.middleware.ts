import type { MiddlewareHandler } from "hono";
import { logger } from "../lib/logger";

export const requestLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = Date.now();
    const { method, url } = c.req;
    
    logger.info({ method, url }, `Incoming Request`);
    
    await next();
    
    const duration = Date.now() - start;
    const status = c.res.status;
    
    logger.info(
      { method, url, status, duration: `${duration}ms` },
      `Request completed`
    );
  };
};
