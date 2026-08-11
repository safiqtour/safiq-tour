-- AlterTable
ALTER TABLE "packages" ADD COLUMN "airlineId" TEXT;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "packages_airlineId_idx" ON "packages"("airlineId");
