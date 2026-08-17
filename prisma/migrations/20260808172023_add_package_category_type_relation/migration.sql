-- AlterTable
ALTER TABLE "packages" ADD COLUMN "packageCategoryId" TEXT;
ALTER TABLE "packages" ADD COLUMN "packageTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_packageCategoryId_fkey" FOREIGN KEY ("packageCategoryId") REFERENCES "package_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "packages" ADD CONSTRAINT "packages_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "package_types" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex (optional indexes that Prisma emits for the FK columns)
CREATE INDEX "packages_packageCategoryId_idx" ON "packages"("packageCategoryId");
CREATE INDEX "packages_packageTypeId_idx" ON "packages"("packageTypeId");
