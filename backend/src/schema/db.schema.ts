import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// 1. Users Table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(), // Nullable for phone OTP login
    passwordHash: text("password_hash"), // Nullable for passwordless login
    role: varchar("role", { length: 50 }).notNull().default("user"), // 'admin', 'user', 'freelancer'
    avatarUrl: varchar("avatar_url", { length: 500 }),
    phone: varchar("phone", { length: 20 }).unique(), // Unique phone number
    status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'banned'
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"), // Soft delete
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

// 1.1 OTP Verification Table
export const otps = pgTable("otps", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: varchar("phone", { length: 20 }).notNull(),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Refresh Tokens Table
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isRevoked: boolean("is_revoked").notNull().default(false),
});

// 3. Freelancer Profile Table
export const freelancerProfiles = pgTable("freelancer_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull().default("0.00"),
  location: varchar("location", { length: 255 }).notNull(),
  availability: varchar("availability", { length: 50 }).notNull().default("available"), // 'available', 'busy', 'unavailable'
  resumeUrl: varchar("resume_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 4. Skills Table
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

// 5. Freelancer Skills Table (Many-to-Many Bridge)
export const freelancerSkills = pgTable(
  "freelancer_skills",
  {
    freelancerId: uuid("freelancer_id")
      .notNull()
      .references(() => freelancerProfiles.userId, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.freelancerId, table.skillId] }),
  })
);

// 6. Portfolio Table
export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => freelancerProfiles.userId, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectUrl: varchar("project_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 7. Experience Table
export const experiences = pgTable("experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => freelancerProfiles.userId, { onDelete: "cascade" }),
  company: varchar("company", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description"),
});

// 8. Education Table
export const educations = pgTable("educations", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => freelancerProfiles.userId, { onDelete: "cascade" }),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

// 9. Jobs Table
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }).notNull().default("0.00"),
  category: varchar("category", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"), // 'open', 'in_progress', 'completed', 'cancelled'
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  freelancerId: uuid("freelancer_id").references(() => users.id, { onDelete: "set null" }),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"), // Soft delete
});

// 10. Applications Table
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  proposal: text("proposal").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 11. Messages Table
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON string array of URLs
  createdAt: timestamp("created_at").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});

// 12. Reviews Table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 13. Notifications Table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'info', 'job_alert', 'message', 'payment'
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 14. Payments Table
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("INR"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'completed', 'failed'
  transactionId: varchar("transaction_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 15. Events Table
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(), // 'workshop', 'meetup', 'hackathon', 'ama'
  title: varchar("title", { length: 255 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  timeSlot: varchar("time_slot", { length: 100 }).notNull(),
  speaker: varchar("speaker", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 50 }).notNull(), // 'online', 'in-person', 'hybrid'
  attendeesCount: integer("attendees_count").notNull().default(0),
  capacityLimit: integer("capacity_limit").notNull().default(100),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 16. Event Registrations Table
export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

// 17. Resources Table
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileSize: varchar("file_size", { length: 50 }).notNull(),
  downloadsCount: integer("downloads_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 18. Audit Logs Table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relationships Setup for Drizzle Query API
export const usersRelations = relations(users, ({ one, many }) => ({
  freelancerProfile: one(freelancerProfiles, {
    fields: [users.id],
    references: [freelancerProfiles.userId],
  }),
  refreshTokens: many(refreshTokens),
  jobsCreated: many(jobs, { relationName: "creatorRelation" }),
  jobsAssigned: many(jobs, { relationName: "freelancerRelation" }),
  applications: many(applications),
  reviewsWritten: many(reviews, { relationName: "reviewerRelation" }),
  reviewsReceived: many(reviews, { relationName: "freelancerReviewsRelation" }),
  payments: many(payments),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const freelancerProfilesRelations = relations(freelancerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [freelancerProfiles.userId],
    references: [users.id],
  }),
  skills: many(freelancerSkills),
  portfolios: many(portfolios),
  experiences: many(experiences),
  educations: many(educations),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  freelancers: many(freelancerSkills),
}));

export const freelancerSkillsRelations = relations(freelancerSkills, ({ one }) => ({
  freelancer: one(freelancerProfiles, {
    fields: [freelancerSkills.freelancerId],
    references: [freelancerProfiles.userId],
  }),
  skill: one(skills, {
    fields: [freelancerSkills.skillId],
    references: [skills.id],
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  freelancer: one(freelancerProfiles, {
    fields: [portfolios.freelancerId],
    references: [freelancerProfiles.userId],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  freelancer: one(freelancerProfiles, {
    fields: [experiences.freelancerId],
    references: [freelancerProfiles.userId],
  }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  freelancer: one(freelancerProfiles, {
    fields: [educations.freelancerId],
    references: [freelancerProfiles.userId],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  creator: one(users, {
    fields: [jobs.createdBy],
    references: [users.id],
    relationName: "creatorRelation",
  }),
  freelancer: one(users, {
    fields: [jobs.freelancerId],
    references: [users.id],
    relationName: "freelancerRelation",
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  freelancer: one(users, {
    fields: [applications.freelancerId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewerRelation",
  }),
  freelancer: one(users, {
    fields: [reviews.freelancerId],
    references: [users.id],
    relationName: "freelancerReviewsRelation",
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
