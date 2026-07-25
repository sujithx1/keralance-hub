import { eq, and, isNull, like, or, desc, count } from "drizzle-orm";
import { db } from "../db/connection";
import { users } from "../schema/db.schema";

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export class UserRepository {
  async findById(id: string): Promise<UserSelect | null> {
    const results = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async findByEmail(email: string): Promise<UserSelect | null> {
    const results = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async create(data: UserInsert): Promise<UserSelect> {
    const results = await db
      .insert(users)
      .values({
        ...data,
        email: data.email.toLowerCase(),
      })
      .returning();
    return results[0];
  }

  async update(id: string, data: Partial<UserInsert>): Promise<UserSelect | null> {
    const results = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return results[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const results = await db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id))
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
    const baseConditions = [isNull(users.deletedAt)];
    if (search) {
      baseConditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.phone, `%${search}%`)
        )!
      );
    }
    
    const whereClause = and(...baseConditions);

    const [totalResult] = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);

    const data = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: totalResult ? Number(totalResult.count) : 0,
    };
  }

  async setStatus(id: string, status: "active" | "banned"): Promise<UserSelect | null> {
    const results = await db
      .update(users)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return results[0] || null;
  }
}
export const userRepository = new UserRepository();
