import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { NotificationTable } from "../schema/db.schema";

export type NotificationInsert = typeof NotificationTable.$inferInsert;
export type NotificationSelect = typeof NotificationTable.$inferSelect;

export class NotificationRepository {
  async listByUser(userId: string) {
    return await db
      .select()
      .from(NotificationTable)
      .where(eq(NotificationTable.userId, userId))
      .orderBy(desc(NotificationTable.createdAt));
  }

  async create(data: NotificationInsert): Promise<NotificationSelect> {
    const results = await db.insert(NotificationTable).values(data).returning();
    return results[0];
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const results = await db
      .update(NotificationTable)
      .set({ read: true })
      .where(and(eq(NotificationTable.id, id), eq(NotificationTable.userId, userId)))
      .returning();
    return results.length > 0;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(NotificationTable)
      .set({ read: true })
      .where(and(eq(NotificationTable.userId, userId), eq(NotificationTable.read, false)));
  }
}
export const notificationRepository = new NotificationRepository();
