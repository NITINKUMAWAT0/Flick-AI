import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DRIZZLE_DB_URL) {
  throw new Error("Environment variable DRIZZLE_DB_URL is not defined");
}
const sql = neon(process.env.DRIZZLE_DB_URL);
const db = drizzle(sql);


