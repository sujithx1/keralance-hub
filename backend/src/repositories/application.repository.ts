import { eq, and } from "drizzle-orm";
import { db } from "../db/connection";
import { ApplicationTable, JobTable, UserTable } from "../schema/db.schema";

export type ApplicationInsert = typeof ApplicationTable.$inferInsert;
export type ApplicationSelect = typeof ApplicationTable.$inferSelect;

export class ApplicationRepository {
  async findById(id: string): Promise<ApplicationSelect | null> {
    const results = await db.select().from(ApplicationTable).where(eq(ApplicationTable.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: ApplicationInsert): Promise<ApplicationSelect> {
    const results = await db.insert(ApplicationTable).values(data).returning();
    return results[0];
  }

  async updateStatus(id: string, status: "pending" | "accepted" | "rejected", userId: string, isAdmin: boolean): Promise<ApplicationSelect | null> {
    let canUpdate = isAdmin;
    if (!isAdmin) {
      const [app] = await db
        .select({ jobCreator: JobTable.createdBy })
        .from(ApplicationTable)
        .innerJoin(JobTable, eq(ApplicationTable.jobId, JobTable.id))
        .where(eq(ApplicationTable.id, id))
        .limit(1);
      
      if (app && app.jobCreator === userId) {
        canUpdate = true;
      }
    }

    if (!canUpdate) return null;

    const results = await db
      .update(ApplicationTable)
      .set({ status })
      .where(eq(ApplicationTable.id, id))
      .returning();
    return results[0] || null;
  }

  async listByJob(jobId: string) {
    return await db
      .select({
        id: ApplicationTable.id,
        proposal: ApplicationTable.proposal,
        amount: ApplicationTable.amount,
        status: ApplicationTable.status,
        createdAt: ApplicationTable.createdAt,
        freelancerId: ApplicationTable.freelancerId,
        freelancerName: UserTable.name,
        freelancerAvatar: UserTable.avatarUrl,
      })
      .from(ApplicationTable)
      .innerJoin(UserTable, eq(ApplicationTable.freelancerId, UserTable.id))
      .where(eq(ApplicationTable.jobId, jobId));
  }

  async listByFreelancer(freelancerId: string) {
    return await db
      .select({
        id: ApplicationTable.id,
        proposal: ApplicationTable.proposal,
        amount: ApplicationTable.amount,
        status: ApplicationTable.status,
        createdAt: ApplicationTable.createdAt,
        jobId: ApplicationTable.jobId,
        jobTitle: JobTable.title,
        jobBudget: JobTable.budget,
      })
      .from(ApplicationTable)
      .innerJoin(JobTable, eq(ApplicationTable.jobId, JobTable.id))
      .where(eq(ApplicationTable.freelancerId, freelancerId));
  }
}
export const applicationRepository = new ApplicationRepository();
