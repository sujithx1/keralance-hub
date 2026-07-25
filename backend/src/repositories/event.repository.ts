import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { events, eventRegistrations } from "../schema/db.schema";

export type EventInsert = typeof events.$inferInsert;
export type EventSelect = typeof events.$inferSelect;

export class EventRepository {
  async list(type?: string): Promise<EventSelect[]> {
    const conditions = [];
    if (type && type !== "All") {
      conditions.push(eq(events.type, type));
    }
    
    return await db
      .select()
      .from(events)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(events.eventDate));
  }

  async getById(id: string): Promise<EventSelect | null> {
    const results = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: EventInsert): Promise<EventSelect> {
    const results = await db.insert(events).values(data).returning();
    return results[0];
  }

  async registerAttendee(eventId: string, name: string, email: string) {
    return await db.transaction(async (tx) => {
      // Create registration record
      const reg = await tx
        .insert(eventRegistrations)
        .values({
          eventId,
          name,
          email,
        })
        .returning();

      // Increment attendee count on event table
      await tx
        .update(events)
        .set({
          attendeesCount: sql`events.attendees_count + 1`,
        } as any)
        .where(eq(events.id, eventId));

      return reg[0];
    });
  }
}
export const eventRepository = new EventRepository();
