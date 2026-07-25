import { Hono } from "hono";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { userRepository } from "../repositories/user.repository";
import { jobRepository } from "../repositories/job.repository";
import { freelancerRepository } from "../repositories/freelancer.repository";
import { db } from "../db/connection";
import { count, desc } from "drizzle-orm";
import { auditLogs, users, jobs, applications } from "../schema/db.schema";

const adminRouter = new Hono();

adminRouter.use("/*", requireAuth());
adminRouter.use("/*", requireRoles(["admin"]));

adminRouter.get("/dashboard", async (c) => {
  // Aggregate dashboard stats
  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [jobsCount] = await db.select({ count: count() }).from(jobs);
  const [appsCount] = await db.select({ count: count() }).from(applications);

  const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(10);

  return c.json({
    success: true,
    data: {
      metrics: {
        totalUsers: totalUsers ? Number(totalUsers.count) : 0,
        totalJobs: jobsCount ? Number(jobsCount.count) : 0,
        totalApplications: appsCount ? Number(appsCount.count) : 0,
      },
      recentLogs: logs,
    },
  });
});

adminRouter.get("/users", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  const search = c.req.query("search");

  const result = await userRepository.list(page, limit, search);
  return c.json({ success: true, ...result });
});

adminRouter.patch("/users/:id", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json().catch(() => ({}));
  
  if (!status || !["active", "banned"].includes(status)) {
    return c.json({ success: false, error: "Invalid status value" }, 400);
  }

  const updated = await userRepository.setStatus(id, status);
  if (!updated) {
    return c.json({ success: false, error: "User not found or deleted" }, 404);
  }

  return c.json({ success: true, message: `User status changed to ${status}`, data: updated });
});

adminRouter.delete("/users/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await userRepository.softDelete(id);
  if (!deleted) {
    return c.json({ success: false, error: "User not found" }, 404);
  }
  return c.json({ success: true, message: "User deleted successfully" });
});

export { adminRouter };
