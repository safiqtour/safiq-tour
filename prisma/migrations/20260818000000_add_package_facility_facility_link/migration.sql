-- AlterTable
ALTER TABLE "package_facilities" ADD COLUMN "facilityId" TEXT;

-- CreateIndex
CREATE INDEX "package_facilities_packageId_idx" ON "package_facilities"("packageId");

-- CreateIndex
CREATE INDEX "package_facilities_facilityId_idx" ON "package_facilities"("facilityId");

-- AddForeignKey
ALTER TABLE "package_facilities" ADD CONSTRAINT "package_facilities_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;