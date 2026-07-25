import { Hono } from "hono";
import { resourceRepository } from "../repositories/resource.repository";
import { z } from "zod";
import { validateBody } from "../middleware/validation.middleware";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";

const resourcesRouter = new Hono();

// Publicly list and search resources
resourcesRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const list = await resourceRepository.list(category);
  return c.json({ success: true, data: list });
});

// Increment download counter
resourcesRouter.post("/:id/download", async (c) => {
  const id = c.req.param("id");
  await resourceRepository.incrementDownloads(id);
  return c.json({ success: true, message: "Download count incremented" });
});

// Admin only: upload/create new resource
const createResourceSchema = z.object({
  title: z.string().min(5),
  category: z.string().min(2),
  fileType: z.string(),
  description: z.string().min(10),
  fileUrl: z.string().url(),
  fileSize: z.string(),
});

resourcesRouter.post("/", requireAuth(), requireRoles(["admin"]), validateBody(createResourceSchema), async (c) => {
  const body = c.get("validBody" as any);

  const resObj = await resourceRepository.create({
    ...body,
    downloadsCount: 0,
  });

  return c.json({ success: true, message: "Resource added successfully", data: resObj }, 201);
});

export { resourcesRouter };
