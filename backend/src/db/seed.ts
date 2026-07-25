import { db, client } from "./connection";
import {
  UserTable,
  FreelancerProfileTable,
  SkillTable,
  FreelancerSkillTable,
  PortfolioTable,
  ExperienceTable,
  EducationTable,
  JobTable,
  ReviewTable,
  EventTable,
  ResourceTable,
} from "../schema/db.schema";
import { logger } from "../lib/logger";

async function seed() {
  logger.info("🌱 Seeding database...");

  // 1. Clean existing records
  await db.delete(FreelancerSkillTable);
  await db.delete(PortfolioTable);
  await db.delete(ExperienceTable);
  await db.delete(EducationTable);
  await db.delete(ReviewTable);
  await db.delete(JobTable);
  await db.delete(FreelancerProfileTable);
  await db.delete(SkillTable);
  await db.delete(ResourceTable);
  await db.delete(EventTable);
  await db.delete(UserTable);

  logger.info("🗑️ Cleared previous data.");

  const passwordHash = await Bun.password.hash("password123", { algorithm: "argon2id" });
  const adminHash = await Bun.password.hash("Sujith@123", { algorithm: "argon2id" });

  // 2. Create Users
  const [admin] = await db
    .insert(UserTable)
    .values({
      name: "sujith",
      email: "sujith.c.dev@gmail.com",
      passwordHash: adminHash,
      role: "admin",
      phone: "7994591023",
      emailVerified: true,
    })
    .returning();

  const [client1] = await db
    .insert(UserTable)
    .values({
      name: "Gautham Krishna",
      email: "gautham@neokeralalabs.com",
      passwordHash,
      role: "user",
      phone: "7994591024",
      emailVerified: true,
    })
    .returning();

  const [client2] = await db
    .insert(UserTable)
    .values({
      name: "Ananya Pillai",
      email: "ananya@malabarcoffee.com",
      passwordHash,
      role: "user",
      phone: "7994591025",
      emailVerified: true,
    })
    .returning();

  const [fUser1] = await db
    .insert(UserTable)
    .values({
      name: "Arjun K. Varma",
      email: "arjun@keralance.dev",
      passwordHash,
      role: "freelancer",
      phone: "9876543210",
      emailVerified: true,
    })
    .returning();

  const [fUser2] = await db
    .insert(UserTable)
    .values({
      name: "Meera Nair",
      email: "meera@keralance.dev",
      passwordHash,
      role: "freelancer",
      phone: "9876543211",
      emailVerified: true,
    })
    .returning();

  const [fUser3] = await db
    .insert(UserTable)
    .values({
      name: "Rahul Siddharth",
      email: "rahul@keralance.dev",
      passwordHash,
      role: "freelancer",
      phone: "9876543212",
      emailVerified: true,
    })
    .returning();

  logger.info("👥 Users created.");

  // 3. Create Freelancer Profiles
  await db.insert(FreelancerProfileTable).values([
    {
      userId: fUser1.id,
      title: "Senior Full Stack Dev",
      bio: "Ex-startup lead engineer specializing in Next.js apps, Postgres design, and clean architecture.",
      hourlyRate: "1500.00",
      location: "Kochi",
      availability: "available",
    },
    {
      userId: fUser2.id,
      title: "Product Designer",
      bio: "Crafting modern, accessible UI designs and Figma components.",
      hourlyRate: "1800.00",
      location: "Trivandrum",
      availability: "available",
    },
    {
      userId: fUser3.id,
      title: "AI & Data Engineer",
      bio: "Building custom vector database searches, RAG, and LLM integrations.",
      hourlyRate: "2500.00",
      location: "Calicut",
      availability: "busy",
    },
  ]);

  logger.info("💼 Freelancer profiles created.");

  // 4. Create Skills
  const skillNames = ["Next.js", "React Native", "PostgreSQL", "Go", "Figma", "Webflow", "Python", "FastAPI"];
  const insertedSkills: { id: string; name: string }[] = [];
  for (const name of skillNames) {
    const [s] = await db.insert(SkillTable).values({ name }).returning();
    insertedSkills.push(s);
  }

  const getSkillId = (name: string) => insertedSkills.find((s) => s.name === name)!.id;

  await db.insert(FreelancerSkillTable).values([
    { freelancerId: fUser1.id, skillId: getSkillId("Next.js") },
    { freelancerId: fUser1.id, skillId: getSkillId("React Native") },
    { freelancerId: fUser1.id, skillId: getSkillId("PostgreSQL") },
    { freelancerId: fUser1.id, skillId: getSkillId("Go") },
    { freelancerId: fUser2.id, skillId: getSkillId("Figma") },
    { freelancerId: fUser2.id, skillId: getSkillId("Webflow") },
    { freelancerId: fUser3.id, skillId: getSkillId("Python") },
    { freelancerId: fUser3.id, skillId: getSkillId("FastAPI") },
  ]);

  logger.info("🛠️ Skills mapped.");

  // 5. Add experiences & portfolios
  await db.insert(ExperienceTable).values([
    {
      freelancerId: fUser1.id,
      company: "TechMalabar",
      position: "Lead Engineer",
      startDate: new Date("2022-01-01"),
      description: "Led development of various SaaS architectures.",
    },
  ]);

  await db.insert(PortfolioTable).values([
    {
      freelancerId: fUser1.id,
      title: "keralance HUB Portal",
      description: "Built the community forum and jobs board.",
      projectUrl: "https://keralancehub.com",
    },
  ]);

  // 6. Create Jobs
  await db.insert(JobTable).values([
    {
      title: "React & Supabase Platform Developer",
      description: "We are seeking a senior frontend engineer to build out our collaboration portal. Uses React & Supabase.",
      budget: "90000.00",
      category: "Developers",
      status: "open",
      createdBy: client1.id,
    },
    {
      title: "Brand Identity & Web UI Design",
      description: "Looking for an experienced designer to revamp the online presence of Malabar Coffee Co. Figma & Webflow.",
      budget: "50000.00",
      category: "Designers",
      status: "open",
      createdBy: client2.id,
    },
  ]);

  logger.info("📋 Jobs seeded.");

  // 7. Add Reviews
  await db.insert(ReviewTable).values([
    {
      reviewerId: client1.id,
      freelancerId: fUser1.id,
      rating: 5,
      comment: "Arjun delivered the MVP of our SaaS platform ahead of schedule. Excellent code quality!",
    },
    {
      reviewerId: client2.id,
      freelancerId: fUser2.id,
      rating: 5,
      comment: "Meera is an absolute design wizard. The Webflow landing page has increased conversions!",
    },
  ]);

  // 8. Add Events
  await db.insert(EventTable).values([
    {
      type: "workshop",
      title: "Freelancing 101: Landing International Clients",
      eventDate: new Date("2026-08-02"),
      timeSlot: "3:00 PM - 5:00 PM",
      speaker: "Jose Kurian (Top Rated Developer)",
      location: "Online (Zoom)",
      tag: "online",
      attendeesCount: 142,
      capacityLimit: 200,
      description: "Learn practical secrets of setting up a global profile, bidding strategically, and client retainers.",
    },
    {
      type: "meetup",
      title: "Kochi Creators & Builders Mixer",
      eventDate: new Date("2026-08-15"),
      timeSlot: "4:00 PM onwards",
      speaker: "Kochi Startup Zone, Kakkanad",
      location: "Kakkanad, Kochi",
      tag: "in-person",
      attendeesCount: 85,
      capacityLimit: 120,
      description: "Connect face-to-face with developers, designers, and startup founders based in Kochi.",
    },
  ]);

  // 9. Add Resources
  await db.insert(ResourceTable).values([
    {
      title: "Freelance Service Agreement (Indian Contract Act Compliant)",
      category: "Legal & Contracts",
      fileType: "Template (PDF / Docx)",
      description: "A watertight contract template drafted specifically for Indian freelancers.",
      fileUrl: "https://keralancehub.com/resources/agreement.pdf",
      fileSize: "140 KB",
      downloadsCount: 1240,
    },
    {
      title: "GST and Income Tax Guide for Kerala Freelancers",
      category: "Guides & Ebooks",
      fileType: "PDF E-Book",
      description: "Understand Section 44ADA, presumptions, and tax codes.",
      fileUrl: "https://keralancehub.com/resources/tax-guide.pdf",
      fileSize: "1.2 MB",
      downloadsCount: 890,
    },
  ]);

  logger.info("🎉 Seeding completed successfully!");
  await client.end();
}

seed().catch((err) => {
  logger.error(err, "❌ Database seeding failed");
  process.exit(1);
});
