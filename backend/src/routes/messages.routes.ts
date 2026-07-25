import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { messageRepository } from "../repositories/message.repository";
import { validateBody } from "../middleware/validation.middleware";
import { sendMessageSchema } from "../validators/schema.validator";

const messagesRouter = new Hono();

messagesRouter.use("/*", requireAuth());

// Get conversation lists
messagesRouter.get("/conversations", async (c) => {
  const userId = c.get("userId");
  const conversations = await messageRepository.getConversations(userId);
  return c.json({ success: true, data: conversations });
});

// Get detailed chat history with a specific member
messagesRouter.get("/chat/:otherUserId", async (c) => {
  const userId = c.get("userId");
  const otherUserId = c.req.param("otherUserId");

  const history = await messageRepository.getChatHistory(userId, otherUserId);
  
  // Mark these messages as read
  await messageRepository.markAsRead(userId, otherUserId);

  return c.json({ success: true, data: history });
});

// Send a message
messagesRouter.post("/", validateBody(sendMessageSchema), async (c) => {
  const senderId = c.get("userId");
  const body = c.get("validBody" as any);

  const message = await messageRepository.send({
    senderId,
    receiverId: body.receiverId,
    content: body.content,
    attachments: body.attachments ? JSON.stringify(body.attachments) : null,
    read: false,
  });

  return c.json({ success: true, message: "Message sent successfully", data: message }, 201);
});

export { messagesRouter };
