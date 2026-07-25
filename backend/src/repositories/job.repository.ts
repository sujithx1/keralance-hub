import { eq, and, isNull, or, like, desc, count, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { JobTable, UserTable } from "../schema/db.schema";

export type JobInsert = typeof JobTable.$inferInsert;
export type JobSelect = typeof JobTable.$inferSelect;

export class JobRepository {
  async findById(id: string) {
    const results = await db
      .select({
        id: JobTable.id,
        title: JobTable.title,
        description: JobTable.description,
        budget: JobTable.budget,
        category: JobTable.category,
        status: JobTable.status,
        createdBy: JobTable.createdBy,
        freelancerId: JobTable.freelancerId,
        deadline: JobTable.deadline,
        createdAt: JobTable.createdAt,
        updatedAt: JobTable.updatedAt,
        clientName: UserTable.name,
        clientEmail: UserTable.email,
        clientAvatarUrl: UserTable.avatarUrl,
      })
      .from(JobTable)
      .innerJoin(UserTable, eq(JobTable.createdBy, UserTable.id))
      .where(and(eq(JobTable.id, id), isNull(JobTable.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async create(data: JobInsert): Promise<JobSelect> {
    const results = await db.insert(JobTable).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<JobInsert>, userId: string, isAdmin: boolean): Promise<JobSelect | null> {
    const conditions = [eq(JobTable.id, id), isNull(JobTable.deletedAt)];
    if (!isAdmin) {
      conditions.push(eq(JobTable.createdBy, userId));
    }

    const results = await db
      .update(JobTable)
      .set({ ...data, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return results[0] || null;
  }

  async softDelete(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const conditions = [eq(JobTable.id, id), isNull(JobTable.deletedAt)];
    if (!isAdmin) {
      conditions.push(eq(JobTable.createdBy, userId));
    }

    const results = await db
      .update(JobTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return results.length > 0;
  }

  async search(filters: {
    searchQuery?: string;
    location?: string;
    remoteOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [isNull(JobTable.deletedAt)];

    if (filters.searchQuery) {
      conditions.push(
        or(
          like(JobTable.title, `%${filters.searchQuery}%`),
          like(JobTable.description, `%${filters.searchQuery}%`),
          like(JobTable.category, `%${filters.searchQuery}%`)
        )!
      );
    }

    if (filters.location && filters.location !== "All") {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${UserTable} 
          WHERE ${UserTable.id} = ${JobTable.createdBy} 
          AND ${UserTable.phone} LIKE ${`%${filters.location}%`} 
          OR ${JobTable.description} LIKE ${`%${filters.location}%`}
        )`
      );
    }

    if (filters.remoteOnly) {
      conditions.push(like(JobTable.description, "%Remote%"));
    }

    const whereClause = and(...conditions);

    const countQuery = await db
      .select({ count: count() })
      .from(JobTable)
      .where(whereClause);

    const rawJobs = await db
      .select({
        id: JobTable.id,
        title: JobTable.title,
        description: JobTable.description,
        budget: JobTable.budget,
        category: JobTable.category,
        status: JobTable.status,
        deadline: JobTable.deadline,
        createdAt: JobTable.createdAt,
        createdBy: JobTable.createdBy,
        clientName: UserTable.name,
        clientAvatarUrl: UserTable.avatarUrl,
      })
      .from(JobTable)
      .innerJoin(UserTable, eq(JobTable.createdBy, UserTable.id))
      .where(whereClause)
      .orderBy(desc(JobTable.createdAt))
      .limit(limit)
      .offset(offset);

    const data = rawJobs.map((j) => {
      const skills = j.description
        .split(" ")
        .filter((w) => w.length > 3 && /^[A-Za-z]+$/.test(w))
        .slice(0, 4);

      return {
        id: j.id,
        title: j.title,
        company: j.clientName,
        budget: Number(j.budget),
        budgetString: `₹${Number(j.budget).toLocaleString()}`,
        type: "Contract",
        location: filters.location && filters.location !== "All" ? filters.location : "Remote",
        remote: j.description.toLowerCase().includes("remote"),
        skills: skills.length > 0 ? skills : ["React", "TypeScript", "Hono"],
        time: "Just now",
        description: j.description,
        createdBy: j.createdBy,
      };
    });

    return {
      data,
      total: countQuery[0] ? Number(countQuery[0].count) : 0,
    };
  }
}
export const jobRepository = new JobRepository();
