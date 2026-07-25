import { eq, and, isNull, like, or, desc, count } from "drizzle-orm";
import { db } from "../db/connection";
import { UserTable } from "../schema/db.schema";

export type UserInsert = typeof UserTable.$inferInsert;
export type UserSelect = typeof UserTable.$inferSelect;

export class UserRepository {
  async findById(id: string): Promise<UserSelect | null> {
    const results = await db
      .select()
      .from(UserTable)
      .where(and(eq(UserTable.id, id), isNull(UserTable.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async findByEmail(email: string): Promise<UserSelect | null> {
    const results = await db
      .select()
      .from(UserTable)
      .where(and(eq(UserTable.email, email.toLowerCase()), isNull(UserTable.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async create(data: UserInsert): Promise<UserSelect> {
    const results = await db
      .insert(UserTable)
      .values({
        ...data,
        email: data.email ? data.email.toLowerCase() : null,
      })
      .returning();
    return results[0];
  }

  async update(id: string, data: Partial<UserInsert>): Promise<UserSelect | null> {
    const results = await db
      .update(UserTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(UserTable.id, id), isNull(UserTable.deletedAt)))
      .returning();
    return results[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const results = await db
      .update(UserTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(UserTable.id, id))
      .returning();
    return results.length > 0;
  }

  async list(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: UserSelect[]; total: number }> {
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const baseConditions = [isNull(UserTable.deletedAt)];
    if (search) {
      baseConditions.push(
        or(
          like(UserTable.name, `%${search}%`),
          like(UserTable.email, `%${search}%`),
          like(UserTable.phone, `%${search}%`)
        )!
      );
    }
    
    const whereClause = and(...baseConditions);

    const [totalResult] = await db
      .select({ count: count() })
      .from(UserTable)
      .where(whereClause);

    const data = await db
      .select()
      .from(UserTable)
      .where(whereClause)
      .orderBy(desc(UserTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: totalResult ? Number(totalResult.count) : 0,
    };
  }

  async setStatus(id: string, status: "active" | "banned"): Promise<UserSelect | null> {
    const results = await db
      .update(UserTable)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(UserTable.id, id), isNull(UserTable.deletedAt)))
      .returning();
    return results[0] || null;
  }
}
export const userRepository = new UserRepository();
