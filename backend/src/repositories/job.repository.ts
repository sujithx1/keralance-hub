import { eq, and, isNull, or, like, desc, count, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { jobs, users } from "../schema/db.schema";

export type JobInsert = typeof jobs.$inferInsert;
export type JobSelect = typeof jobs.$inferSelect;

export class JobRepository {
  async findById(id: string) {
    const results = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        budget: jobs.budget,
        category: jobs.category,
        status: jobs.status,
        createdBy: jobs.createdBy,
        freelancerId: jobs.freelancerId,
        deadline: jobs.deadline,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
        clientAvatarUrl: users.avatarUrl,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.createdBy, users.id))
      .where(and(eq(jobs.id, id), isNull(jobs.deletedAt)))
      .limit(1);
    return results[0] || null;
  }

  async create(data: JobInsert): Promise<JobSelect> {
    const results = await db.insert(jobs).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<JobInsert>, userId: string, isAdmin: boolean): Promise<JobSelect | null> {
    const conditions = [eq(jobs.id, id), isNull(jobs.deletedAt)];
    if (!isAdmin) {
      conditions.push(eq(jobs.createdBy, userId));
    }

    const results = await db
      .update(jobs)
      .set({ ...data, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return results[0] || null;
  }

  async softDelete(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const conditions = [eq(jobs.id, id), isNull(jobs.deletedAt)];
    if (!isAdmin) {
      conditions.push(eq(jobs.createdBy, userId));
    }

    const results = await db
      .update(jobs)
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

    const conditions = [isNull(jobs.deletedAt)];

    if (filters.searchQuery) {
      conditions.push(
        or(
          like(jobs.title, `%${filters.searchQuery}%`),
          like(jobs.description, `%${filters.searchQuery}%`),
          like(jobs.category, `%${filters.searchQuery}%`)
        )!
      );
    }

    // In a real DB, location might map to user's location or a location field on jobs.
    // For simplicity, we filter by category/title or we join with the creator's location
    if (filters.location && filters.location !== "All") {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${users} 
          WHERE ${users.id} = ${jobs.createdBy} 
          AND ${users.phone} LIKE ${`%${filters.location}%`} 
          OR ${jobs.description} LIKE ${`%${filters.location}%`}
        )`
      );
    }

    if (filters.remoteOnly) {
      conditions.push(like(jobs.description, "%Remote%"));
    }

    const whereClause = and(...conditions);

    const countQuery = await db
      .select({ count: count() })
      .from(jobs)
      .where(whereClause);

    const rawJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        budget: jobs.budget,
        category: jobs.category,
        status: jobs.status,
        deadline: jobs.deadline,
        createdAt: jobs.createdAt,
        createdBy: jobs.createdBy,
        clientName: users.name,
        clientAvatarUrl: users.avatarUrl,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.createdBy, users.id))
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset);

    // Format output matching UI structures
    const data = rawJobs.map((j) => {
      // Parse skills from description or provide default tags
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
