import "dotenv/config";
import { PrismaClient } from "../node_modules/@prisma/client/index.js";
import { PrismaPg } from "../node_modules/@prisma/adapter-pg/dist/index.js";

const c = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
});

async function run() {
    try {
    const migrations = await c.$queryRaw`SELECT 1 as dummy`;
    console.log("=== DB connection OK ===");

    const cols = await c.$queryRaw`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'packages'
        AND column_name IN ('category', 'packageCategoryId', 'packageTypeId')
      ORDER BY column_name`;
    console.log("=== packages columns ===");
    console.log(JSON.stringify(cols, null, 2));

    const fks = await c.$queryRaw`
      SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        rc.update_rule,
        rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
      JOIN information_schema.constraint_table_usage ccu2
        ON rc.unique_constraint_name = ccu2.constraint_name
      WHERE tc.table_name = 'packages'
        AND kcu.column_name IN ('packageCategoryId', 'packageTypeId')
        AND tc.constraint_type = 'FOREIGN KEY'`;
    console.log("=== packages FK constraints ===");
    console.log(JSON.stringify(fks, null, 2));
  } catch (e) {
    console.error("ERR =", e.message);
  } finally {
    await c.$disconnect();
  }
}

run();

