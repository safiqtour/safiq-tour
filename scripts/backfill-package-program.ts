import { db } from "@/lib/prisma/db";

interface PackageMapping {
  title: string;
  categoryName: string;
  typeName: string;
}

const PACKAGE_MAPPINGS: PackageMapping[] = [
  { title: "Firdaus Executive 12 Hari", categoryName: "Firdaus", typeName: "Executive" },
  { title: "Paket Rawdah VIP 9 hari", categoryName: "Rawdah", typeName: "VIP" },
  { title: "Ramadhan Akhir Ramadhan 15 Hari", categoryName: "Ramadhan", typeName: "Akhir Ramadhan" },
  { title: "Ramadhan Awal Ramadhan 12 Hari", categoryName: "Ramadhan", typeName: "Awal Ramadhan" },
  { title: "Ramadhan Full Ramadhan 30 Hari", categoryName: "Ramadhan", typeName: "Full Ramadhan" },
  { title: "Rawdah Deluxe 9 Hari", categoryName: "Rawdah", typeName: "Deluxe" },
  { title: "Test Zamzam Express", categoryName: "Zam Zam", typeName: "Express" },
  { title: "Thaibah Deluxe 9 Hari", categoryName: "Thaibah", typeName: "Deluxe" },
  { title: "Thaibah Executive 12 Hari", categoryName: "Thaibah", typeName: "Executive" },
  { title: "Zamzam Express 9 Hari", categoryName: "Zam Zam", typeName: "Express" },
  { title: "Zamzam Reguler 12 Hari", categoryName: "Zam Zam", typeName: "Umroh Reguler" },
];

async function main() {
  console.log("=== Backfill Package Category & Program ===\n");

  // Load master data
  const [categories, types] = await Promise.all([
    db.packageCategory.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      select: { id: true, name: true, slug: true },
    }),
    db.packageType.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      select: { id: true, name: true, slug: true, shortName: true },
    }),
  ]);

  const categoryMap = new Map(
    categories.map((c) => [c.name.toLowerCase(), c.id])
  );
  const typeMap = new Map(types.map((t) => [t.name.toLowerCase(), t.id]));

  // Find packages that still need backfill
  const packages = await db.package.findMany({
    where: {
      packageCategoryId: null,
      packageTypeId: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  console.log(`Total packages dengan packageCategoryId NULL dan packageTypeId NULL: ${packages.length}\n`);

  const matchedTitles = new Set(PACKAGE_MAPPINGS.map((m) => m.title));
  const foundPackages = packages.filter((p) => matchedTitles.has(p.title));
  const notFoundPackages = packages.filter((p) => !matchedTitles.has(p.title));

  console.log(`Package yang sesuai mapping: ${foundPackages.length}`);
  console.log(`Package tidak ditemukan dalam mapping: ${notFoundPackages.length}\n`);

  if (notFoundPackages.length > 0) {
    console.log("Daftar package tidak ditemukan dalam mapping:");
    notFoundPackages.forEach((p) => {
      console.log(`  - [${p.slug}] ${p.title}`);
    });
    console.log("");
  }

  let updatedCount = 0;
  const updateErrors: string[] = [];

  for (const mapping of PACKAGE_MAPPINGS) {
    const pkg = packages.find((p) => p.title === mapping.title);
    if (!pkg) continue;

    const categoryId = categoryMap.get(mapping.categoryName.toLowerCase());
    const typeId = typeMap.get(mapping.typeName.toLowerCase());

    if (!categoryId) {
      updateErrors.push(`Package "${mapping.title}": category "${mapping.categoryName}" tidak ditemukan di master data.`);
      continue;
    }

    if (!typeId) {
      updateErrors.push(`Package "${mapping.title}": program "${mapping.typeName}" tidak ditemukan di master data.`);
      continue;
    }

    try {
      await db.package.update({
        where: { id: pkg.id },
        data: {
          packageCategoryId: categoryId,
          packageTypeId: typeId,
        },
      });
      updatedCount++;
      console.log(`✓ Updated: ${pkg.title}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      updateErrors.push(`Package "${mapping.title}": update gagal - ${message}`);
    }
  }

  console.log(`\n=== Ringkasan ===`);
  console.log(`Ditemukan: ${packages.length}`);
  console.log(`Berhasil update: ${updatedCount}`);
  console.log(`Gagal/tidak ditemukan: ${packages.length - updatedCount}`);

  if (updateErrors.length > 0) {
    console.log("\n=== Error/Tidak Ditemukan ===");
    updateErrors.forEach((e) => console.log(`  - ${e}`));
  }

  await db.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
