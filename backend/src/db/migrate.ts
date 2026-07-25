import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./connection";
import { logger } from "../lib/logger";

export async function runMigrations() {
  logger.info("⏳ Running Drizzle migrations...");
  
  await migrate(db, { migrationsFolder: "./drizzle" });
  
  logger.info("✅ Migrations completed successfully!");
  
  // Close postgres connection pool
  await client.end();
}

runMigrations().catch((err) => {
  logger.error(err, "❌ Migration runner encountered an error");
  process.exit(1);
});
