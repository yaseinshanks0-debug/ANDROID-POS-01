import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

const sqlHost = process.env.SQL_HOST || process.env.PGHOST;
const sqlDbName = process.env.SQL_DB_NAME || process.env.PGDATABASE;
const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER || process.env.PGUSER;
const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || process.env.PGPASSWORD;
const port = process.env.SQL_PORT ? Number(process.env.SQL_PORT) : (process.env.PGPORT ? Number(process.env.PGPORT) : 5432);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && (!sqlHost || !sqlDbName || !user || !password)) {
  throw new Error("Database configuration missing: set SQL_HOST/SQL_DB_NAME/SQL_ADMIN_USER/SQL_ADMIN_PASSWORD or DATABASE_URL.");
}

console.log(`Using database connection: ${databaseUrl ? 'DATABASE_URL' : `user: ${user}@${sqlHost}:${port}/${sqlDbName}`}`);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: databaseUrl
    ? {
        url: databaseUrl,
        ssl: false,
      }
    : {
        host: sqlHost!,
        port: port,
        user: user!,
        password: password!,
        database: sqlDbName!,
        ssl: false,
      },
  verbose: true,
});
