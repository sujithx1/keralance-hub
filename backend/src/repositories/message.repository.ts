import { eq, and, or, desc, asc } from "drizzle-orm";
import { db } from "../db/connection";
import { messages, users } from "../schema/db.schema";

export type MessageInsert = typeof messages.$inferInsert;
export type MessageSelect = typeof messages.$inferSelect;

export class MessageRepository {
  async getChatHistory(userId1: string, userId2: string) {
    return await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        attachments: messages.attachments,
        createdAt: messages.createdAt,
        read: messages.read,
      })
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async send(data: MessageInsert): Promise<MessageSelect> {
    const results = await db.insert(messages).values(data).returning();
    return results[0];
  }

  async markAsRead(receiverId: string, senderId: string): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.receiverId, receiverId), eq(messages.senderId, senderId), eq(messages.read, false)));
  }

  async getConversations(userId: string) {
    // In a real system, you'd use a raw SQL query or subquery to aggregate last message per user.
    // Drizzle can execute standard helper joins.
    const allMsgs = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        createdAt: messages.createdAt,
        read: messages.read,
      })
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    // Aggregate manually in-memory for simpler, robust retrieval
    const seen = new Set<string>();
    const conversations = [];

    for (const msg of allMsgs) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (seen.has(otherUserId)) continue;
      seen.add(otherUserId);

      const [otherUser] = await db
        .select({ name: users.name, avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, otherUserId))
        .limit(1);

      conversations.push({
        otherUserId,
        name: otherUser?.name || "Member",
        avatarUrl: otherUser?.avatarUrl,
        lastMessage: msg.content,
        time: msg.createdAt,
        unread: !msg.read && msg.receiverId === userId,
      });
    }

    return conversations;
  }
}
export const messageRepository = new MessageRepository();
