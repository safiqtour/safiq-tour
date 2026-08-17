import { db } from "@/lib/prisma/db"

async function main() {
  const data = await db.package.findMany({
    where: {
      slug: "paket-rawdah-vip"
    },
    select: {
      title: true,
      slug: true,
      status: true,
      publicContent: true,
    }
  })

  console.log(JSON.stringify(data, null, 2))
}

main()
  .catch((err) => {
    console.error(err)
  })
  .finally(async () => {
    await db.$disconnect()
  })