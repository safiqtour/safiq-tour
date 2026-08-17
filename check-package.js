const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

async function main() {
  const data = await db.package.findMany({
    where: {
      slug: "paket-rawdah-vip"
    },
    select: {
      title: true,
      slug: true,
      status: true
    }
  })

  console.log(data)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())