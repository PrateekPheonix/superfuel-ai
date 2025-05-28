import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, migrateClient } from "./index";

async function migrateDb() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await migrateClient.end();
    process.exit(0);
  }
}

migrateDb();
