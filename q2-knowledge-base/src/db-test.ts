import "dotenv/config";
import { Client } from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from .env");
  }

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        current_timestamp AS time
    `);

    console.log("✅ Connected to Neon successfully!");
    console.log(result.rows[0]);

    const vectorResult = await client.query(`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `);

    if (vectorResult.rows.length > 0) {
      console.log("✅ pgvector is enabled!");
      console.log(`Version: ${vectorResult.rows[0].extversion}`);
    } else {
      console.log("❌ pgvector is NOT enabled.");
    }
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();