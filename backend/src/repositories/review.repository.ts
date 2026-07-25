import { eq, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { reviews, users } from "../schema/db.schema";

export type ReviewInsert = typeof reviews.$inferInsert;
export type ReviewSelect = typeof reviews.$inferSelect;

export class ReviewRepository {
  async create(data: ReviewInsert): Promise<ReviewSelect> {
    const results = await db.insert(reviews).values(data).returning();
    return results[0];
  }

  async getById(id: string) {
    const results = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.id, id))
      .limit(1);
    return results[0] || null;
  }

  async listForFreelancer(freelancerId: string) {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.freelancerId, freelancerId))
      .orderBy(desc(reviews.createdAt));
  }
}
export const reviewRepository = new ReviewRepository();
