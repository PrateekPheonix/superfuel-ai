import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const migrateClient = postgres(process.env.DATABASE_URL, {
  max: 1,
});

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

export type CodeSnippet = typeof schema.codeSnippets.$inferSelect;
export type NewCodeSnippet = typeof schema.codeSnippets.$inferInsert;
