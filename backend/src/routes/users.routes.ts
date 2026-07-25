import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { userRepository } from "../repositories/user.repository";
import { validateBody } from "../middleware/validation.middleware";
import { updateProfileSchema } from "../validators/schema.validator";

const usersRouter = new Hono();

usersRouter.use("/*", requireAuth());

usersRouter.get("/me", async (c) => {
  const userId = c.get("userId");
  const user = await userRepository.findById(userId);
  if (!user) {
    return c.json({ success: false, error: "User not found" }, 404);
  }
  return c.json({ success: true, data: user });
});

usersRouter.patch("/me", validateBody(updateProfileSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);
  const updatedUser = await userRepository.update(userId, body);
  return c.json({ success: true, message: "Profile updated successfully", data: updatedUser });
});

usersRouter.delete("/me", async (c) => {
  const userId = c.get("userId");
  await userRepository.softDelete(userId);
  return c.json({ success: true, message: "Account deleted successfully" });
});

export { usersRouter };
