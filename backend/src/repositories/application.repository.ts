import { eq, and } from "drizzle-orm";
import { db } from "../db/connection";
import { applications, jobs, users } from "../schema/db.schema";

export type ApplicationInsert = typeof applications.$inferInsert;
export type ApplicationSelect = typeof applications.$inferSelect;

export class ApplicationRepository {
  async findById(id: string): Promise<ApplicationSelect | null> {
    const results = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: ApplicationInsert): Promise<ApplicationSelect> {
    const results = await db.insert(applications).values(data).returning();
    return results[0];
  }

  async updateStatus(id: string, status: "pending" | "accepted" | "rejected", userId: string, isAdmin: boolean): Promise<ApplicationSelect | null> {
    // If not admin, check if user is the creator of the job
    let canUpdate = isAdmin;
    if (!isAdmin) {
      const [app] = await db
        .select({ jobCreator: jobs.createdBy })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .where(eq(applications.id, id))
        .limit(1);
      
      if (app && app.jobCreator === userId) {
        canUpdate = true;
      }
    }

    if (!canUpdate) return null;

    const results = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return results[0] || null;
  }

  async listByJob(jobId: string) {
    return await db
      .select({
        id: applications.id,
        proposal: applications.proposal,
        amount: applications.amount,
        status: applications.status,
        createdAt: applications.createdAt,
        freelancerId: applications.freelancerId,
        freelancerName: users.name,
        freelancerAvatar: users.avatarUrl,
      })
      .from(applications)
      .innerJoin(users, eq(applications.freelancerId, users.id))
      .where(eq(applications.jobId, jobId));
  }

  async listByFreelancer(freelancerId: string) {
    return await db
      .select({
        id: applications.id,
        proposal: applications.proposal,
        amount: applications.amount,
        status: applications.status,
        createdAt: applications.createdAt,
        jobId: applications.jobId,
        jobTitle: jobs.title,
        jobBudget: jobs.budget,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(applications.freelancerId, freelancerId));
  }
}
export const applicationRepository = new ApplicationRepository();
