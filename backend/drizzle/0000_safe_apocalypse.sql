CREATE TABLE IF NOT EXISTS "ApplicationTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"proposal" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AuditLogTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(255) NOT NULL,
	"details" text NOT NULL,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EducationTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"institution" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EventRegistrationTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EventTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"event_date" timestamp NOT NULL,
	"time_slot" varchar(100) NOT NULL,
	"speaker" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"tag" varchar(50) NOT NULL,
	"attendees_count" integer DEFAULT 0 NOT NULL,
	"capacity_limit" integer DEFAULT 100 NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ExperienceTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"company" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FreelancerProfileTable" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"hourly_rate" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"location" varchar(255) NOT NULL,
	"availability" varchar(50) DEFAULT 'available' NOT NULL,
	"resume_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FreelancerSkillTable" (
	"freelancer_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	CONSTRAINT "FreelancerSkillTable_freelancer_id_skill_id_pk" PRIMARY KEY("freelancer_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"budget" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"category" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"created_by" uuid NOT NULL,
	"freelancer_id" uuid,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MessageTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"content" text NOT NULL,
	"attachments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NotificationTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OtpTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(20) NOT NULL,
	"code_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PaymentTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PaymentTable_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PortfolioTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"project_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RefreshTokenTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "RefreshTokenTable_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResourceTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_size" varchar(50) NOT NULL,
	"downloads_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ReviewTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SkillTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "SkillTable_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"password_hash" text,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"avatar_url" varchar(500),
	"phone" varchar(20),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "UserTable_email_unique" UNIQUE("email"),
	CONSTRAINT "UserTable_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApplicationTable" ADD CONSTRAINT "ApplicationTable_job_id_JobTable_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."JobTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApplicationTable" ADD CONSTRAINT "ApplicationTable_freelancer_id_UserTable_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AuditLogTable" ADD CONSTRAINT "AuditLogTable_user_id_UserTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."UserTable"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EducationTable" ADD CONSTRAINT "EducationTable_freelancer_id_FreelancerProfileTable_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."FreelancerProfileTable"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventRegistrationTable" ADD CONSTRAINT "EventRegistrationTable_event_id_EventTable_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."EventTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ExperienceTable" ADD CONSTRAINT "ExperienceTable_freelancer_id_FreelancerProfileTable_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."FreelancerProfileTable"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FreelancerProfileTable" ADD CONSTRAINT "FreelancerProfileTable_user_id_UserTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FreelancerSkillTable" ADD CONSTRAINT "FreelancerSkillTable_freelancer_id_FreelancerProfileTable_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."FreelancerProfileTable"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FreelancerSkillTable" ADD CONSTRAINT "FreelancerSkillTable_skill_id_SkillTable_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."SkillTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobTable" ADD CONSTRAINT "JobTable_created_by_UserTable_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."UserTable"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobTable" ADD CONSTRAINT "JobTable_freelancer_id_UserTable_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."UserTable"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageTable" ADD CONSTRAINT "MessageTable_sender_id_UserTable_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageTable" ADD CONSTRAINT "MessageTable_receiver_id_UserTable_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NotificationTable" ADD CONSTRAINT "NotificationTable_user_id_UserTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PaymentTable" ADD CONSTRAINT "PaymentTable_user_id_UserTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PortfolioTable" ADD CONSTRAINT "PortfolioTable_freelancer_id_FreelancerProfileTable_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."FreelancerProfileTable"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RefreshTokenTable" ADD CONSTRAINT "RefreshTokenTable_user_id_UserTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ReviewTable" ADD CONSTRAINT "ReviewTable_reviewer_id_UserTable_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ReviewTable" ADD CONSTRAINT "ReviewTable_freelancer_id_UserTable_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."UserTable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "UserTable" USING btree ("email");