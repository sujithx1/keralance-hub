import { eq, and, or, like, desc, count, sql } from "drizzle-orm";
import { db } from "../db/connection";
import {
  UserTable,
  FreelancerProfileTable,
  SkillTable,
  FreelancerSkillTable,
  PortfolioTable,
  ExperienceTable,
  EducationTable,
  ReviewTable,
} from "../schema/db.schema";

export type FreelancerInsert = typeof FreelancerProfileTable.$inferInsert;
export type FreelancerSelect = typeof FreelancerProfileTable.$inferSelect;

export class FreelancerRepository {
  async getProfile(userId: string) {
    const profile = await db
      .select()
      .from(FreelancerProfileTable)
      .where(eq(FreelancerProfileTable.userId, userId))
      .limit(1);

    if (!profile[0]) return null;

    // Fetch associated relations
    const [user] = await db.select().from(UserTable).where(eq(UserTable.id, userId)).limit(1);
    
    // Fetch experiences
    const exps = await db
      .select()
      .from(ExperienceTable)
      .where(eq(ExperienceTable.freelancerId, userId))
      .orderBy(desc(ExperienceTable.startDate));

    // Fetch educations
    const eds = await db
      .select()
      .from(EducationTable)
      .where(eq(EducationTable.freelancerId, userId))
      .orderBy(desc(EducationTable.startDate));

    // Fetch portfolio items
    const ports = await db
      .select()
      .from(PortfolioTable)
      .where(eq(PortfolioTable.freelancerId, userId))
      .orderBy(desc(PortfolioTable.createdAt));

    // Fetch skills
    const skillList = await db
      .select({ id: SkillTable.id, name: SkillTable.name })
      .from(FreelancerSkillTable)
      .innerJoin(SkillTable, eq(FreelancerSkillTable.skillId, SkillTable.id))
      .where(eq(FreelancerSkillTable.freelancerId, userId));

    // Fetch reviews
    const revs = await db
      .select({
        id: ReviewTable.id,
        rating: ReviewTable.rating,
        comment: ReviewTable.comment,
        createdAt: ReviewTable.createdAt,
        reviewerName: UserTable.name,
      })
      .from(ReviewTable)
      .innerJoin(UserTable, eq(ReviewTable.reviewerId, UserTable.id))
      .where(eq(ReviewTable.freelancerId, userId))
      .orderBy(desc(ReviewTable.createdAt));

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
      .from(FreelancerProfileTable)
      .where(eq(FreelancerProfileTable.userId, userId))
      .limit(1);

    if (existing[0]) {
      const results = await db
        .update(FreelancerProfileTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(FreelancerProfileTable.userId, userId))
        .returning();
      return results[0];
    } else {
      const results = await db
        .insert(FreelancerProfileTable)
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

    const conditions = [eq(UserTable.status, "active"), isNull(UserTable.deletedAt)];

    if (filters.category && filters.category !== "All") {
      conditions.push(eq(FreelancerProfileTable.title, filters.category));
    }

    if (filters.location && filters.location !== "All") {
      conditions.push(eq(FreelancerProfileTable.location, filters.location));
    }

    if (filters.onlyAvailable) {
      conditions.push(eq(FreelancerProfileTable.availability, "available"));
    }

    if (filters.searchQuery) {
      conditions.push(
        or(
          like(UserTable.name, `%${filters.searchQuery}%`),
          like(FreelancerProfileTable.title, `%${filters.searchQuery}%`),
          like(FreelancerProfileTable.bio, `%${filters.searchQuery}%`),
          like(SkillTable.name, `%${filters.searchQuery}%`)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get count of distinct freelancer IDs
    const countQuery = await db
      .select({ count: count() })
      .from(FreelancerProfileTable)
      .innerJoin(UserTable, eq(FreelancerProfileTable.userId, UserTable.id))
      .leftJoin(FreelancerSkillTable, eq(FreelancerProfileTable.userId, FreelancerSkillTable.freelancerId))
      .leftJoin(SkillTable, eq(FreelancerSkillTable.skillId, SkillTable.id))
      .where(whereClause);

    // Fetch paginated freelancer profiles
    const rawProfiles = await db
      .select({
        userId: FreelancerProfileTable.userId,
        title: FreelancerProfileTable.title,
        bio: FreelancerProfileTable.bio,
        hourlyRate: FreelancerProfileTable.hourlyRate,
        location: FreelancerProfileTable.location,
        availability: FreelancerProfileTable.availability,
        name: UserTable.name,
        avatarUrl: UserTable.avatarUrl,
      })
      .from(FreelancerProfileTable)
      .innerJoin(UserTable, eq(FreelancerProfileTable.userId, UserTable.id))
      .leftJoin(FreelancerSkillTable, eq(FreelancerProfileTable.userId, FreelancerSkillTable.freelancerId))
      .leftJoin(SkillTable, eq(FreelancerSkillTable.skillId, SkillTable.id))
      .where(whereClause)
      .groupBy(
        FreelancerProfileTable.userId,
        FreelancerProfileTable.title,
        FreelancerProfileTable.bio,
        FreelancerProfileTable.hourlyRate,
        FreelancerProfileTable.location,
        FreelancerProfileTable.availability,
        UserTable.name,
        UserTable.avatarUrl
      )
      .limit(limit)
      .offset(offset);

    // Populate skills and reviews count for each freelancer
    const data = await Promise.all(
      rawProfiles.map(async (p) => {
        const freelancerSkillsList = await db
          .select({ name: SkillTable.name })
          .from(FreelancerSkillTable)
          .innerJoin(SkillTable, eq(FreelancerSkillTable.skillId, SkillTable.id))
          .where(eq(FreelancerSkillTable.freelancerId, p.userId));

        const ratingResult = await db
          .select({
            avgRating: sql<number>`COALESCE(AVG(${ReviewTable.rating}), 0.0)`,
            reviewsCount: count(ReviewTable.id),
          })
          .from(ReviewTable)
          .where(eq(ReviewTable.freelancerId, p.userId));

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

      let skill = await db.select().from(SkillTable).where(eq(SkillTable.name, cleanName)).limit(1);
      let skillId = skill[0]?.id;

      if (!skillId) {
        const newSkill = await db.insert(SkillTable).values({ name: cleanName }).returning();
        skillId = newSkill[0].id;
      }

      const link = await db
        .select()
        .from(FreelancerSkillTable)
        .where(
          and(
            eq(FreelancerSkillTable.freelancerId, freelancerId),
            eq(FreelancerSkillTable.skillId, skillId)
          )
        )
        .limit(1);

      if (!link[0]) {
        await db.insert(FreelancerSkillTable).values({ freelancerId, skillId });
      }
    }
  }

  async clearSkills(freelancerId: string): Promise<void> {
    await db.delete(FreelancerSkillTable).where(eq(FreelancerSkillTable.freelancerId, freelancerId));
  }

  // Manage Portfolio Items
  async addPortfolio(freelancerId: string, item: typeof PortfolioTable.$inferInsert) {
    return await db.insert(PortfolioTable).values({ ...item, freelancerId }).returning();
  }

  async deletePortfolio(id: string, freelancerId: string) {
    return await db
      .delete(PortfolioTable)
      .where(and(eq(PortfolioTable.id, id), eq(PortfolioTable.freelancerId, freelancerId)));
  }

  // Manage Experiences
  async addExperience(freelancerId: string, item: typeof ExperienceTable.$inferInsert) {
    return await db.insert(ExperienceTable).values({ ...item, freelancerId }).returning();
  }

  async deleteExperience(id: string, freelancerId: string) {
    return await db
      .delete(ExperienceTable)
      .where(and(eq(ExperienceTable.id, id), eq(ExperienceTable.freelancerId, freelancerId)));
  }

  // Manage Educations
  async addEducation(freelancerId: string, item: typeof EducationTable.$inferInsert) {
    return await db.insert(EducationTable).values({ ...item, freelancerId }).returning();
  }

  async deleteEducation(id: string, freelancerId: string) {
    return await db
      .delete(EducationTable)
      .where(and(eq(EducationTable.id, id), eq(EducationTable.freelancerId, freelancerId)));
  }
}
export const freelancerRepository = new FreelancerRepository();
