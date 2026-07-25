import { eq, and, or, like, desc, count, sql, inArray, isNull } from "drizzle-orm";
import { db } from "../db/connection";
import {
  users,
  freelancerProfiles,
  skills,
  freelancerSkills,
  portfolios,
  experiences,
  educations,
  reviews,
} from "../schema/db.schema";

export type FreelancerInsert = typeof freelancerProfiles.$inferInsert;
export type FreelancerSelect = typeof freelancerProfiles.$inferSelect;

export class FreelancerRepository {
  async getProfile(userId: string) {
    const profile = await db
      .select()
      .from(freelancerProfiles)
      .where(eq(freelancerProfiles.userId, userId))
      .limit(1);

    if (!profile[0]) return null;

    // Fetch associated relations
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    // Fetch experiences
    const exps = await db
      .select()
      .from(experiences)
      .where(eq(experiences.freelancerId, userId))
      .orderBy(desc(experiences.startDate));

    // Fetch educations
    const eds = await db
      .select()
      .from(educations)
      .where(eq(educations.freelancerId, userId))
      .orderBy(desc(educations.startDate));

    // Fetch portfolio items
    const ports = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.freelancerId, userId))
      .orderBy(desc(portfolios.createdAt));

    // Fetch skills
    const skillList = await db
      .select({ id: skills.id, name: skills.name })
      .from(freelancerSkills)
      .innerJoin(skills, eq(freelancerSkills.skillId, skills.id))
      .where(eq(freelancerSkills.freelancerId, userId));

    // Fetch reviews
    const revs = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.freelancerId, userId))
      .orderBy(desc(reviews.createdAt));

    return {
      ...profile[0],
      user: {
        name: user?.name,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        phone: user?.phone,
        status: user?.status,
      },
      experiences: exps,
      educations: eds,
      portfolios: ports,
      skills: skillList.map((s) => s.name),
      reviews: revs,
    };
  }

  async upsertProfile(userId: string, data: Partial<FreelancerInsert>): Promise<FreelancerSelect> {
    const existing = await db
      .select()
      .from(freelancerProfiles)
      .where(eq(freelancerProfiles.userId, userId))
      .limit(1);

    if (existing[0]) {
      const results = await db
        .update(freelancerProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(freelancerProfiles.userId, userId))
        .returning();
      return results[0];
    } else {
      const results = await db
        .insert(freelancerProfiles)
        .values({
          userId,
          title: data.title || "Freelancer",
          bio: data.bio || "",
          hourlyRate: data.hourlyRate || "0.00",
          location: data.location || "Remote",
          availability: data.availability || "available",
          resumeUrl: data.resumeUrl,
        })
        .returning();
      return results[0];
    }
  }

  async search(filters: {
    category?: string;
    location?: string;
    searchQuery?: string;
    onlyAvailable?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    // Setup base query using Drizzle relations or manual joins
    let profileIdsQuery = db
      .selectDistinct({ userId: freelancerProfiles.userId })
      .from(freelancerProfiles)
      .innerJoin(users, eq(freelancerProfiles.userId, users.id))
      .leftJoin(freelancerSkills, eq(freelancerProfiles.userId, freelancerSkills.freelancerId))
      .leftJoin(skills, eq(freelancerSkills.skillId, skills.id));

    const conditions = [eq(users.status, "active"), isNull(users.deletedAt)];

    if (filters.category && filters.category !== "All") {
      conditions.push(eq(freelancerProfiles.title, filters.category)); // or title matches role pattern
    }

    if (filters.location && filters.location !== "All") {
      conditions.push(eq(freelancerProfiles.location, filters.location));
    }

    if (filters.onlyAvailable) {
      conditions.push(eq(freelancerProfiles.availability, "available"));
    }

    if (filters.searchQuery) {
      conditions.push(
        or(
          like(users.name, `%${filters.searchQuery}%`),
          like(freelancerProfiles.title, `%${filters.searchQuery}%`),
          like(freelancerProfiles.bio, `%${filters.searchQuery}%`),
          like(skills.name, `%${filters.searchQuery}%`)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get count of distinct freelancer IDs
    const countQuery = await db
      .select({ count: count() })
      .from(freelancerProfiles)
      .innerJoin(users, eq(freelancerProfiles.userId, users.id))
      .leftJoin(freelancerSkills, eq(freelancerProfiles.userId, freelancerSkills.freelancerId))
      .leftJoin(skills, eq(freelancerSkills.skillId, skills.id))
      .where(whereClause);

    // Fetch paginated freelancer profiles
    const rawProfiles = await db
      .select({
        userId: freelancerProfiles.userId,
        title: freelancerProfiles.title,
        bio: freelancerProfiles.bio,
        hourlyRate: freelancerProfiles.hourlyRate,
        location: freelancerProfiles.location,
        availability: freelancerProfiles.availability,
        name: users.name,
        avatarUrl: users.avatarUrl,
      })
      .from(freelancerProfiles)
      .innerJoin(users, eq(freelancerProfiles.userId, users.id))
      .leftJoin(freelancerSkills, eq(freelancerProfiles.userId, freelancerSkills.freelancerId))
      .leftJoin(skills, eq(freelancerSkills.skillId, skills.id))
      .where(whereClause)
      .groupBy(
        freelancerProfiles.userId,
        freelancerProfiles.title,
        freelancerProfiles.bio,
        freelancerProfiles.hourlyRate,
        freelancerProfiles.location,
        freelancerProfiles.availability,
        users.name,
        users.avatarUrl
      )
      .limit(limit)
      .offset(offset);

    // Populate skills and reviews count for each freelancer
    const data = await Promise.all(
      rawProfiles.map(async (p) => {
        const freelancerSkillsList = await db
          .select({ name: skills.name })
          .from(freelancerSkills)
          .innerJoin(skills, eq(freelancerSkills.skillId, skills.id))
          .where(eq(freelancerSkills.freelancerId, p.userId));

        const ratingResult = await db
          .select({
            avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0.0)`,
            reviewsCount: count(reviews.id),
          })
          .from(reviews)
          .where(eq(reviews.freelancerId, p.userId));

        return {
          id: p.userId,
          name: p.name,
          role: p.title,
          avatar: p.name ? p.name.split(" ").map(w => w[0]).join("").toUpperCase() : "",
          avatarUrl: p.avatarUrl,
          rating: ratingResult[0] ? Number(ratingResult[0].avgRating) : 0,
          reviews: ratingResult[0] ? Number(ratingResult[0].reviewsCount) : 0,
          skills: freelancerSkillsList.map((s) => s.name),
          available: p.availability === "available",
          location: p.location,
          hourlyRate: `₹${Number(p.hourlyRate).toLocaleString()}/hr`,
          bio: p.bio,
        };
      })
    );

    return {
      data,
      total: countQuery[0] ? Number(countQuery[0].count) : 0,
    };
  }

  // Manage Skills
  async addSkills(freelancerId: string, skillNames: string[]): Promise<void> {
    for (const name of skillNames) {
      const cleanName = name.trim().toLowerCase();
      if (!cleanName) continue;

      // Find or create skill
      let skill = await db.select().from(skills).where(eq(skills.name, cleanName)).limit(1);
      let skillId = skill[0]?.id;

      if (!skillId) {
        const newSkill = await db.insert(skills).values({ name: cleanName }).returning();
        skillId = newSkill[0].id;
      }

      // Check bridge table relation
      const link = await db
        .select()
        .from(freelancerSkills)
        .where(
          and(
            eq(freelancerSkills.freelancerId, freelancerId),
            eq(freelancerSkills.skillId, skillId)
          )
        )
        .limit(1);

      if (!link[0]) {
        await db.insert(freelancerSkills).values({ freelancerId, skillId });
      }
    }
  }

  async clearSkills(freelancerId: string): Promise<void> {
    await db.delete(freelancerSkills).where(eq(freelancerSkills.freelancerId, freelancerId));
  }

  // Manage Portfolio Items
  async addPortfolio(freelancerId: string, item: typeof portfolios.$inferInsert) {
    return await db.insert(portfolios).values({ ...item, freelancerId }).returning();
  }

  async deletePortfolio(id: string, freelancerId: string) {
    return await db
      .delete(portfolios)
      .where(and(eq(portfolios.id, id), eq(portfolios.freelancerId, freelancerId)));
  }

  // Manage Experiences
  async addExperience(freelancerId: string, item: typeof experiences.$inferInsert) {
    return await db.insert(experiences).values({ ...item, freelancerId }).returning();
  }

  async deleteExperience(id: string, freelancerId: string) {
    return await db
      .delete(experiences)
      .where(and(eq(experiences.id, id), eq(experiences.freelancerId, freelancerId)));
  }

  // Manage Educations
  async addEducation(freelancerId: string, item: typeof educations.$inferInsert) {
    return await db.insert(educations).values({ ...item, freelancerId }).returning();
  }

  async deleteEducation(id: string, freelancerId: string) {
    return await db
      .delete(educations)
      .where(and(eq(educations.id, id), eq(educations.freelancerId, freelancerId)));
  }
}
export const freelancerRepository = new FreelancerRepository();
