require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const db = new PrismaClient({ adapter });
(async () => {
  const r = await db.package.findMany({ take: 3 });
  console.log('PRISMA package.findMany OK rows =', r.length);
  const cols = await db.$queryRawUnsafe(
    "SELECT column_name FROM information_schema.columns WHERE table_name='packages' AND column_name='publicContent'"
  );
  console.log('publicContent column present =', cols.length > 0);
  process.exit(0);
})().catch((e) => { console.log('PRISMA ERROR:', e.message); process.exit(1); });
