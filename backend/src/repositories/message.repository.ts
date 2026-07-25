import { eq, and, or, desc, asc } from "drizzle-orm";
import { db } from "../db/connection";
import { MessageTable, UserTable } from "../schema/db.schema";

export type MessageInsert = typeof MessageTable.$inferInsert;
export type MessageSelect = typeof MessageTable.$inferSelect;

export class MessageRepository {
  async getChatHistory(userId1: string, userId2: string) {
    return await db
      .select({
        id: MessageTable.id,
        senderId: MessageTable.senderId,
        receiverId: MessageTable.receiverId,
        content: MessageTable.content,
        attachments: MessageTable.attachments,
        createdAt: MessageTable.createdAt,
        read: MessageTable.read,
      })
      .from(MessageTable)
      .where(
        or(
          and(eq(MessageTable.senderId, userId1), eq(MessageTable.receiverId, userId2)),
          and(eq(MessageTable.senderId, userId2), eq(MessageTable.receiverId, userId1))
        )
      )
      .orderBy(asc(MessageTable.createdAt));
  }

  async send(data: MessageInsert): Promise<MessageSelect> {
    const results = await db.insert(MessageTable).values(data).returning();
    return results[0];
  }

  async markAsRead(receiverId: string, senderId: string): Promise<void> {
    await db
      .update(MessageTable)
      .set({ read: true })
      .where(and(eq(MessageTable.receiverId, receiverId), eq(MessageTable.senderId, senderId), eq(MessageTable.read, false)));
  }

  async getConversations(userId: string) {
    const allMsgs = await db
      .select({
        id: MessageTable.id,
        senderId: MessageTable.senderId,
        receiverId: MessageTable.receiverId,
        content: MessageTable.content,
        createdAt: MessageTable.createdAt,
        read: MessageTable.read,
      })
      .from(MessageTable)
      .where(or(eq(MessageTable.senderId, userId), eq(MessageTable.receiverId, userId)))
      .orderBy(desc(MessageTable.createdAt));

    const seen = new Set<string>();
    const conversations = [];

    for (const msg of allMsgs) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (seen.has(otherUserId)) continue;
      seen.add(otherUserId);

      const [otherUser] = await db
        .select({ name: UserTable.name, avatarUrl: UserTable.avatarUrl })
        .from(UserTable)
        .where(eq(UserTable.id, otherUserId))
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
