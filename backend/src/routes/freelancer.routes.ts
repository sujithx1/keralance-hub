import { Hono } from "hono";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";
import { freelancerRepository } from "../repositories/freelancer.repository";
import { validateBody } from "../middleware/validation.middleware";
import { updateFreelancerProfileSchema } from "../validators/schema.validator";

const freelancersRouter = new Hono();

// Publicly browse freelancers
freelancersRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const location = c.req.query("location");
  const searchQuery = c.req.query("search");
  const onlyAvailable = c.req.query("available") === "true";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  const result = await freelancerRepository.search({
    category,
    location,
    searchQuery,
    onlyAvailable,
    page,
    limit,
  });

  return c.json({ success: true, ...result });
});

// Publicly view detailed profile
freelancersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const profile = await freelancerRepository.getProfile(id);
  if (!profile) {
    return c.json({ success: false, error: "Freelancer profile not found" }, 404);
  }
  return c.json({ success: true, data: profile });
});

// Create/Update profile - Freelancer role only
freelancersRouter.post("/profile", requireAuth(), requireRoles(["freelancer"]), validateBody(updateFreelancerProfileSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);

  const { skills, ...profileData } = body;

  const profile = await freelancerRepository.upsertProfile(userId, profileData);

  if (skills && Array.isArray(skills)) {
    await freelancerRepository.clearSkills(userId);
    await freelancerRepository.addSkills(userId, skills);
  }

  const updatedProfile = await freelancerRepository.getProfile(userId);
  return c.json({ success: true, message: "Profile created/updated successfully", data: updatedProfile });
});

freelancersRouter.patch("/profile", requireAuth(), requireRoles(["freelancer"]), validateBody(updateFreelancerProfileSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);

  const { skills, ...profileData } = body;

  await freelancerRepository.upsertProfile(userId, profileData);

  if (skills && Array.isArray(skills)) {
    await freelancerRepository.clearSkills(userId);
    await freelancerRepository.addSkills(userId, skills);
  }

  const updatedProfile = await freelancerRepository.getProfile(userId);
  return c.json({ success: true, message: "Profile updated successfully", data: updatedProfile });
});

export { freelancersRouter };
