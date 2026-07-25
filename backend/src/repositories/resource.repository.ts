import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { ResourceTable } from "../schema/db.schema";

export type ResourceInsert = typeof ResourceTable.$inferInsert;
export type ResourceSelect = typeof ResourceTable.$inferSelect;

export class ResourceRepository {
  async list(category?: string): Promise<ResourceSelect[]> {
    const conditions = [];
    if (category && category !== "All") {
      conditions.push(eq(ResourceTable.category, category));
    }

    return await db
      .select()
      .from(ResourceTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(ResourceTable.createdAt));
  }

  async create(data: ResourceInsert): Promise<ResourceSelect> {
    const results = await db.insert(ResourceTable).values(data).returning();
    return results[0];
  }

  async incrementDownloads(id: string): Promise<void> {
    await db
      .update(ResourceTable)
      .set({
        downloadsCount: sql`ResourceTable.downloads_count + 1`,
      } as any)
      .where(eq(ResourceTable.id, id));
  }
}
export const resourceRepository = new ResourceRepository();
