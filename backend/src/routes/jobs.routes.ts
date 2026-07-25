import { Hono } from "hono";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { jobService } from "../services/job.service";
import { jobRepository } from "../repositories/job.repository";
import { validateBody } from "../middleware/validation.middleware";
import { createJobSchema } from "../validators/schema.validator";

const jobsRouter = new Hono();

// Public route to list/search jobs
jobsRouter.get("/", async (c) => {
  const searchQuery = c.req.query("search");
  const location = c.req.query("location");
  const remoteOnly = c.req.query("remote") === "true";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  const result = await jobService.listJobs({
    searchQuery,
    location,
    remoteOnly,
    page,
    limit,
  });

  return c.json({ success: true, ...result });
});

jobsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const job = await jobService.getJob(id);
    return c.json({ success: true, data: job });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 404);
  }
});

// Protected routes to create/edit/delete
jobsRouter.post("/", requireAuth(), requireRoles(["user", "admin"]), validateBody(createJobSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);

  const job = await jobService.createJob(
    userId,
    body.title,
    body.description,
    body.budget,
    body.category,
    body.deadline
  );

  return c.json({ success: true, message: "Job posted successfully", data: job }, 201);
});

jobsRouter.patch("/:id", requireAuth(), validateBody(createJobSchema.partial()), async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const user = c.get("user");
  const body = c.get("validBody" as any);

  const isAdmin = user.role === "admin";
  const updated = await jobRepository.update(id, body, userId, isAdmin);

  if (!updated) {
    return c.json({ success: false, error: "Job not found or unauthorized to update" }, 403);
  }

  return c.json({ success: true, message: "Job updated successfully", data: updated });
});

jobsRouter.delete("/:id", requireAuth(), async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const user = c.get("user");

  const isAdmin = user.role === "admin";
  const deleted = await jobRepository.softDelete(id, userId, isAdmin);

  if (!deleted) {
    return c.json({ success: false, error: "Job not found or unauthorized to delete" }, 403);
  }

  return c.json({ success: true, message: "Job deleted successfully" });
});

export { jobsRouter };
