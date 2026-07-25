import { Hono } from "hono";
import { eventRepository } from "../repositories/event.repository";
import { z } from "zod";
import { validateBody } from "../middleware/validation.middleware";
import { requireAuth, requireRoles } from "../middleware/auth.middleware";

const eventsRouter = new Hono();

// Publicly browse events
eventsRouter.get("/", async (c) => {
  const type = c.req.query("type");
  const list = await eventRepository.list(type);
  return c.json({ success: true, data: list });
});

eventsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const event = await eventRepository.getById(id);
  if (!event) {
    return c.json({ success: false, error: "Event not found" }, 404);
  }
  return c.json({ success: true, data: event });
});

// Protected registration route (for anyone)
const registerEventSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

eventsRouter.post("/:id/register", validateBody(registerEventSchema), async (c) => {
  const eventId = c.req.param("id");
  const body = c.get("validBody" as any);

  const event = await eventRepository.getById(eventId);
  if (!event) {
    return c.json({ success: false, error: "Event not found" }, 404);
  }

  if (event.attendeesCount >= event.capacityLimit) {
    return c.json({ success: false, error: "Event capacity reached" }, 400);
  }

  const registration = await eventRepository.registerAttendee(eventId, body.name, body.email);
  return c.json({
    success: true,
    message: "Registered for event successfully",
    data: registration,
  });
});

// Admin only: create events
const createEventSchema = z.object({
  type: z.enum(["workshop", "meetup", "hackathon", "ama"]),
  title: z.string().min(5),
  eventDate: z.string(),
  timeSlot: z.string(),
  speaker: z.string(),
  location: z.string(),
  tag: z.enum(["online", "in-person", "hybrid"]),
  capacityLimit: z.coerce.number().positive(),
  description: z.string().min(10),
});

eventsRouter.post("/", requireAuth(), requireRoles(["admin"]), validateBody(createEventSchema), async (c) => {
  const body = c.get("validBody" as any);
  
  const event = await eventRepository.create({
    ...body,
    eventDate: new Date(body.eventDate),
    attendeesCount: 0,
  });

  return c.json({ success: true, message: "Event created successfully", data: event }, 201);
});

export { eventsRouter };
