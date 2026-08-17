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
    // Apply the migration SQL idempotently
    await c.$executeRawUnsafe(`
      ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "packageCategoryId" TEXT;
      ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "packageTypeId" TEXT;
    `);

    // Foreign keys (guard with WHERE NOT EXISTS via a temp check)
    const fk1 = await c.$queryRaw`
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'packages_packageCategoryId_fkey'`;
    if (!fk1[0]?.["1"] && !fk1[0]?.["1"]) {
      await c.$executeRawUnsafe(`
        ALTER TABLE "packages" ADD CONSTRAINT "packages_packageCategoryId_fkey"
        FOREIGN KEY ("packageCategoryId") REFERENCES "package_categories" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE;`);
    }

    const fk2 = await c.$queryRaw`
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'packages_packageTypeId_fkey'`;
    if (!fk2[0]?.["1"] && !fk2[0]?.["1"]) {
      await c.$executeRawUnsafe(`
        ALTER TABLE "packages" ADD CONSTRAINT "packages_packageTypeId_fkey"
        FOREIGN KEY ("packageTypeId") REFERENCES "package_types" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE;`);
    }

    console.log("=== APPLIED OK ===");

    // Verify
    const cols = await c.$queryRaw`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'packages'
        AND column_name IN ('category','packageCategoryId','packageTypeId')
      ORDER BY column_name`;
    console.log("=== packages columns (after) ===");
    console.log(JSON.stringify(cols, null, 2));

    const fks = await c.$queryRaw`
      SELECT tc.constraint_name, kcu.column_name, rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
      WHERE tc.table_name = 'packages'
        AND kcu.column_name IN ('packageCategoryId','packageTypeId')
        AND tc.constraint_type = 'FOREIGN KEY'`;
    console.log("=== packages FK constraints (after) ===");
    console.log(JSON.stringify(fks, null, 2));

    console.log("=== _prisma_migrations latest ====");
    const hist = await c.$queryRaw`SELECT * FROM _prisma_migrations ORDER BY id DESC LIMIT 10`;
    console.log(JSON.stringify(hist, null, 2));
  } catch (e) {
    console.error("ERR =", e.message);
  } finally {
    await c.$disconnect();
  }
}

run();
