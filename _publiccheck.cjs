require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const db = new PrismaClient({ adapter });
(async () => {
  const rows = await db.package.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
    take: 100,
  });
  const withCard = rows.filter((r) => r.publicContent && r.publicContent.card);
  console.log('Total PUBLISHED packages =', rows.length);
  console.log('With publicContent.card =', withCard.length);
  if (withCard.length) {
    console.log('First card title =', withCard[0].publicContent.card.title);
    console.log('First slug =', withCard[0].slug);
  }
  process.exit(0);
})().catch((e) => { console.log('PRISMA ERROR:', e.message); process.exit(1); });
