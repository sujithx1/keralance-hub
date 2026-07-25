import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env";
import * as schema from "../schema/db.schema";

// Disable connection pooling for migrations or single-threaded tasks if needed, 
// but postgres-js handles pooling out-of-the-box.
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
export { client };
export type DB = typeof db;
