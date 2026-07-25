import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { notifications } from "../schema/db.schema";

export type NotificationInsert = typeof notifications.$inferInsert;
export type NotificationSelect = typeof notifications.$inferSelect;

export class NotificationRepository {
  async listByUser(userId: string) {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async create(data: NotificationInsert): Promise<NotificationSelect> {
    const results = await db.insert(notifications).values(data).returning();
    return results[0];
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const results = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return results.length > 0;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  }
}
export const notificationRepository = new NotificationRepository();
