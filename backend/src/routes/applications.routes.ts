import { Hono } from "hono";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { jobService } from "../services/job.service";
import { applicationRepository } from "../repositories/application.repository";
import { validateBody } from "../middleware/validation.middleware";
import { applyJobSchema } from "../validators/schema.validator";

const applicationsRouter = new Hono();

applicationsRouter.use("/*", requireAuth());

// Freelancer applies to a job
applicationsRouter.post("/", requireRoles(["freelancer"]), validateBody(applyJobSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);

  try {
    const app = await jobService.applyToJob(userId, body.jobId, body.proposal, body.amount);
    return c.json({ success: true, message: "Application submitted successfully", data: app }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
});

// Update application status (accept/reject)
applicationsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const user = c.get("user");
  const { status } = await c.req.json().catch(() => ({}));

  if (!status || !["accepted", "rejected"].includes(status)) {
    return c.json({ success: false, error: "Invalid status" }, 400);
  }

  const isAdmin = user.role === "admin";
  const updated = await applicationRepository.updateStatus(id, status, userId, isAdmin);

  if (!updated) {
    return c.json({ success: false, error: "Application not found or unauthorized to update" }, 403);
  }

  return c.json({ success: true, message: `Application status updated to ${status}`, data: updated });
});

// Get applications by job or for current freelancer
applicationsRouter.get("/", async (c) => {
  const jobId = c.req.query("jobId");
  const userId = c.get("userId");
  const user = c.get("user");

  if (jobId) {
    const apps = await applicationRepository.listByJob(jobId);
    return c.json({ success: true, data: apps });
  }

  if (user.role === "freelancer") {
    const apps = await applicationRepository.listByFreelancer(userId);
    return c.json({ success: true, data: apps });
  }

  return c.json({ success: false, error: "Missing jobId parameter or user is not a freelancer" }, 400);
});

export { applicationsRouter };
