import { eq, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { ReviewTable, UserTable } from "../schema/db.schema";

export type ReviewInsert = typeof ReviewTable.$inferInsert;
export type ReviewSelect = typeof ReviewTable.$inferSelect;

export class ReviewRepository {
  async create(data: ReviewInsert): Promise<ReviewSelect> {
    const results = await db.insert(ReviewTable).values(data).returning();
    return results[0];
  }

  async getById(id: string) {
    const results = await db
      .select({
        id: ReviewTable.id,
        rating: ReviewTable.rating,
        comment: ReviewTable.comment,
        createdAt: ReviewTable.createdAt,
        reviewerName: UserTable.name,
      })
      .from(ReviewTable)
      .innerJoin(UserTable, eq(ReviewTable.reviewerId, UserTable.id))
      .where(eq(ReviewTable.id, id))
      .limit(1);
    return results[0] || null;
  }

  async listForFreelancer(freelancerId: string) {
    return await db
      .select({
        id: ReviewTable.id,
        rating: ReviewTable.rating,
        comment: ReviewTable.comment,
        createdAt: ReviewTable.createdAt,
        reviewerName: UserTable.name,
      })
      .from(ReviewTable)
      .innerJoin(UserTable, eq(ReviewTable.reviewerId, UserTable.id))
      .where(eq(ReviewTable.freelancerId, freelancerId))
      .orderBy(desc(ReviewTable.createdAt));
  }
}
export const reviewRepository = new ReviewRepository();
