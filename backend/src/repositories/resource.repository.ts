import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { resources } from "../schema/db.schema";

export type ResourceInsert = typeof resources.$inferInsert;
export type ResourceSelect = typeof resources.$inferSelect;

export class ResourceRepository {
  async list(category?: string): Promise<ResourceSelect[]> {
    const conditions = [];
    if (category && category !== "All") {
      conditions.push(eq(resources.category, category));
    }

    return await db
      .select()
      .from(resources)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(resources.createdAt));
  }

  async create(data: ResourceInsert): Promise<ResourceSelect> {
    const results = await db.insert(resources).values(data).returning();
    return results[0];
  }

  async incrementDownloads(id: string): Promise<void> {
    await db
      .update(resources)
      .set({
        downloadsCount: sql`resources.downloads_count + 1`,
      } as any)
      .where(eq(resources.id, id));
  }
}
export const resourceRepository = new ResourceRepository();
