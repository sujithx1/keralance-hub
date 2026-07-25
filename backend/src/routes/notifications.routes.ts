import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { notificationRepository } from "../repositories/notification.repository";

const notificationsRouter = new Hono();

notificationsRouter.use("/*", requireAuth());

// Get notification history
notificationsRouter.get("/", async (c) => {
  const userId = c.get("userId");
  const notificationsList = await notificationRepository.listByUser(userId);
  return c.json({ success: true, data: notificationsList });
});

// Mark one as read
notificationsRouter.patch("/:id/read", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  const success = await notificationRepository.markAsRead(id, userId);
  if (!success) {
    return c.json({ success: false, error: "Notification not found" }, 404);
  }

  return c.json({ success: true, message: "Notification marked as read" });
});

// Mark all as read
notificationsRouter.post("/read-all", async (c) => {
  const userId = c.get("userId");
  await notificationRepository.markAllAsRead(userId);
  return c.json({ success: true, message: "All notifications marked as read" });
});

export { notificationsRouter };
