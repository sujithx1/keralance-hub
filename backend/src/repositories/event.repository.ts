import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { EventTable, EventRegistrationTable } from "../schema/db.schema";

export type EventInsert = typeof EventTable.$inferInsert;
export type EventSelect = typeof EventTable.$inferSelect;

export class EventRepository {
  async list(type?: string): Promise<EventSelect[]> {
    const conditions = [];
    if (type && type !== "All") {
      conditions.push(eq(EventTable.type, type));
    }
    
    return await db
      .select()
      .from(EventTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(EventTable.eventDate));
  }

  async getById(id: string): Promise<EventSelect | null> {
    const results = await db.select().from(EventTable).where(eq(EventTable.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: EventInsert): Promise<EventSelect> {
    const results = await db.insert(EventTable).values(data).returning();
    return results[0];
  }

  async registerAttendee(eventId: string, name: string, email: string) {
    return await db.transaction(async (tx) => {
      const reg = await tx
        .insert(EventRegistrationTable)
        .values({
          eventId,
          name,
          email,
        })
        .returning();

      await tx
        .update(EventTable)
        .set({
          attendeesCount: sql`EventTable.attendees_count + 1`,
        } as any)
        .where(eq(EventTable.id, eventId));

      return reg[0];
    });
  }
}
export const eventRepository = new EventRepository();
