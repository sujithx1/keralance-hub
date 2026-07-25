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
import { relations } from "drizzle-orm";

// 1. User Table
export const UserTable = pgTable(
  "UserTable",
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
export const OtpTable = pgTable("OtpTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: varchar("phone", { length: 20 }).notNull(),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Refresh Tokens Table
export const RefreshTokenTable = pgTable("RefreshTokenTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isRevoked: boolean("is_revoked").notNull().default(false),
});

// 3. Freelancer Profile Table
export const FreelancerProfileTable = pgTable("FreelancerProfileTable", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => UserTable.id, { onDelete: "cascade" }),
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
export const SkillTable = pgTable("SkillTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

// 5. Freelancer Skills Table (Many-to-Many Bridge)
export const FreelancerSkillTable = pgTable(
  "FreelancerSkillTable",
  {
    freelancerId: uuid("freelancer_id")
      .notNull()
      .references(() => FreelancerProfileTable.userId, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => SkillTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.freelancerId, table.skillId] }),
  })
);

// 6. Portfolio Table
export const PortfolioTable = pgTable("PortfolioTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => FreelancerProfileTable.userId, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectUrl: varchar("project_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 7. Experience Table
export const ExperienceTable = pgTable("ExperienceTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => FreelancerProfileTable.userId, { onDelete: "cascade" }),
  company: varchar("company", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description"),
});

// 8. Education Table
export const EducationTable = pgTable("EducationTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => FreelancerProfileTable.userId, { onDelete: "cascade" }),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

// 9. Jobs Table
export const JobTable = pgTable("JobTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }).notNull().default("0.00"),
  category: varchar("category", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"), // 'open', 'in_progress', 'completed', 'cancelled'
  createdBy: uuid("created_by")
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  freelancerId: uuid("freelancer_id").references(() => UserTable.id, { onDelete: "set null" }),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"), // Soft delete
});

// 10. Applications Table
export const ApplicationTable = pgTable("ApplicationTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => JobTable.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  proposal: text("proposal").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 11. Messages Table
export const MessageTable = pgTable("MessageTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON string array of URLs
  createdAt: timestamp("created_at").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});

// 12. Reviews Table
export const ReviewTable = pgTable("ReviewTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 13. Notifications Table
export const NotificationTable = pgTable("NotificationTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'info', 'job_alert', 'message', 'payment'
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 14. Payments Table
export const PaymentTable = pgTable("PaymentTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("INR"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'completed', 'failed'
  transactionId: varchar("transaction_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 15. Events Table
export const EventTable = pgTable("EventTable", {
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
export const EventRegistrationTable = pgTable("EventRegistrationTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => EventTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

// 17. Resources Table
export const ResourceTable = pgTable("ResourceTable", {
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
export const AuditLogTable = pgTable("AuditLogTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => UserTable.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relationships Setup for Drizzle Query API
export const usersRelations = relations(UserTable, ({ one, many }) => ({
  freelancerProfile: one(FreelancerProfileTable, {
    fields: [UserTable.id],
    references: [FreelancerProfileTable.userId],
  }),
  refreshTokens: many(RefreshTokenTable),
  jobsCreated: many(JobTable, { relationName: "creatorRelation" }),
  jobsAssigned: many(JobTable, { relationName: "freelancerRelation" }),
  applications: many(ApplicationTable),
  reviewsWritten: many(ReviewTable, { relationName: "reviewerRelation" }),
  reviewsReceived: many(ReviewTable, { relationName: "freelancerReviewsRelation" }),
  payments: many(PaymentTable),
  notifications: many(NotificationTable),
  auditLogs: many(AuditLogTable),
}));

export const refreshTokensRelations = relations(RefreshTokenTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [RefreshTokenTable.userId],
    references: [UserTable.id],
  }),
}));

export const freelancerProfilesRelations = relations(FreelancerProfileTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [FreelancerProfileTable.userId],
    references: [UserTable.id],
  }),
  skills: many(FreelancerSkillTable),
  portfolios: many(PortfolioTable),
  experiences: many(ExperienceTable),
  educations: many(EducationTable),
}));

export const skillsRelations = relations(SkillTable, ({ many }) => ({
  freelancers: many(FreelancerSkillTable),
}));

export const freelancerSkillsRelations = relations(FreelancerSkillTable, ({ one }) => ({
  freelancer: one(FreelancerProfileTable, {
    fields: [FreelancerSkillTable.freelancerId],
    references: [FreelancerProfileTable.userId],
  }),
  skill: one(SkillTable, {
    fields: [FreelancerSkillTable.skillId],
    references: [SkillTable.id],
  }),
}));

export const portfoliosRelations = relations(PortfolioTable, ({ one }) => ({
  freelancer: one(FreelancerProfileTable, {
    fields: [PortfolioTable.freelancerId],
    references: [FreelancerProfileTable.userId],
  }),
}));

export const experiencesRelations = relations(ExperienceTable, ({ one }) => ({
  freelancer: one(FreelancerProfileTable, {
    fields: [ExperienceTable.freelancerId],
    references: [FreelancerProfileTable.userId],
  }),
}));

export const educationsRelations = relations(EducationTable, ({ one }) => ({
  freelancer: one(FreelancerProfileTable, {
    fields: [EducationTable.freelancerId],
    references: [FreelancerProfileTable.userId],
  }),
}));

export const jobsRelations = relations(JobTable, ({ one, many }) => ({
  creator: one(UserTable, {
    fields: [JobTable.createdBy],
    references: [UserTable.id],
    relationName: "creatorRelation",
  }),
  freelancer: one(UserTable, {
    fields: [JobTable.freelancerId],
    references: [UserTable.id],
    relationName: "freelancerRelation",
  }),
  applications: many(ApplicationTable),
}));

export const applicationsRelations = relations(ApplicationTable, ({ one }) => ({
  job: one(JobTable, {
    fields: [ApplicationTable.jobId],
    references: [JobTable.id],
  }),
  freelancer: one(UserTable, {
    fields: [ApplicationTable.freelancerId],
    references: [UserTable.id],
  }),
}));

export const messagesRelations = relations(MessageTable, ({ one }) => ({
  sender: one(UserTable, {
    fields: [MessageTable.senderId],
    references: [UserTable.id],
  }),
  receiver: one(UserTable, {
    fields: [MessageTable.receiverId],
    references: [UserTable.id],
  }),
}));

export const reviewsRelations = relations(ReviewTable, ({ one }) => ({
  reviewer: one(UserTable, {
    fields: [ReviewTable.reviewerId],
    references: [UserTable.id],
    relationName: "reviewerRelation",
  }),
  freelancer: one(UserTable, {
    fields: [ReviewTable.freelancerId],
    references: [UserTable.id],
    relationName: "freelancerReviewsRelation",
  }),
}));

export const notificationsRelations = relations(NotificationTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [NotificationTable.userId],
    references: [UserTable.id],
  }),
}));

export const paymentsRelations = relations(PaymentTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PaymentTable.userId],
    references: [UserTable.id],
  }),
}));

export const eventsRelations = relations(EventTable, ({ many }) => ({
  registrations: many(EventRegistrationTable),
}));

export const eventRegistrationsRelations = relations(EventRegistrationTable, ({ one }) => ({
  event: one(EventTable, {
    fields: [EventRegistrationTable.eventId],
    references: [EventTable.id],
  }),
}));

export const auditLogsRelations = relations(AuditLogTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AuditLogTable.userId],
    references: [UserTable.id],
  }),
}));
