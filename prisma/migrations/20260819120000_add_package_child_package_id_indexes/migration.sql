-- Add missing packageId indexes on package child tables so deleteMany by
-- packageId uses an index instead of a full table scan.
CREATE INDEX "package_hotels_packageId_idx" ON "package_hotels"("packageId");

CREATE INDEX "package_schedules_packageId_idx" ON "package_schedules"("packageId");

CREATE INDEX "package_itineraries_packageId_idx" ON "package_itineraries"("packageId");

CREATE INDEX "package_galleries_packageId_idx" ON "package_galleries"("packageId");