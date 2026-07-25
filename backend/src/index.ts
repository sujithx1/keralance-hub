import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./config/env";
import { logger } from "./lib/logger";

// Import Middlewares
import { requestLogger } from "./middleware/logger.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rate-limiter.middleware";

// Import Routers
import { authRouter } from "./routes/auth.routes";
import { usersRouter } from "./routes/users.routes";
import { adminRouter } from "./routes/admin.routes";
import { freelancersRouter } from "./routes/freelancer.routes";
import { jobsRouter } from "./routes/jobs.routes";
import { applicationsRouter } from "./routes/applications.routes";
import { reviewsRouter } from "./routes/reviews.routes";
import { messagesRouter } from "./routes/messages.routes";
import { notificationsRouter } from "./routes/notifications.routes";
import { paymentsRouter } from "./routes/payments.routes";
import { eventsRouter } from "./routes/events.routes";
import { resourcesRouter } from "./routes/resources.routes";

const app = new Hono();

// Global Middlewares
app.use("*", cors({
  origin: "*", // Adjust origins in production
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.use("*", secureHeaders());
app.use("*", requestLogger());
app.use("*", rateLimiter());

// Error Handling
app.onError(globalErrorHandler);
app.notFound((c) => c.json({ success: false, error: "Resource not found" }, 404));

// Healthcheck Route
app.get("/health", (c) => c.json({ status: "healthy", timestamp: new Date().toISOString() }));

// Mount Routers
app.route("/auth", authRouter);
app.route("/users", usersRouter);
app.route("/admin", adminRouter);
app.route("/freelancers", freelancersRouter);
app.route("/jobs", jobsRouter);
app.route("/applications", applicationsRouter);
app.route("/reviews", reviewsRouter);
app.route("/messages", messagesRouter);
app.route("/notifications", notificationsRouter);
app.route("/payments", paymentsRouter);
app.route("/events", eventsRouter);
app.route("/resources", resourcesRouter);

// Swagger Documentation UI endpoint served via unpkg CDN
app.get("/docs", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>keralance HUB API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" charset="UTF-8"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
            ],
          });
        };
      </script>
    </body>
    </html>
  `);
});

// Swagger JSON Spec Router
app.get("/swagger.json", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "keralance HUB API Spec",
      version: "1.0.0",
      description: "REST API specifications for the keralance HUB freelancer platform.",
    },
    paths: {
      "/auth/register": {
        post: {
          summary: "Register new user profile",
          tags: ["Auth"],
          responses: { "201": { description: "Success" } }
        }
      },
      "/auth/login": {
        post: {
          summary: "Log in member session",
          tags: ["Auth"],
          responses: { "200": { description: "Success" } }
        }
      },
      "/users/me": {
        get: {
          summary: "Retrieve current profile details",
          tags: ["Users"],
          responses: { "200": { description: "Success" } }
        }
      },
      "/jobs": {
        get: {
          summary: "List all jobs",
          tags: ["Jobs"],
          responses: { "200": { description: "Success" } }
        }
      }
    }
  });
});

// Start Server using Bun
logger.info(`🚀 Server running on port ${env.PORT}`);

export { app };
export default {
  port: env.PORT,
  fetch: app.fetch,
};
