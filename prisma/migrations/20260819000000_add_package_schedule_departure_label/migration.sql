-- Add a canonical, human-facing departure label so a schedule can be filled as
-- a full date (YYYY-MM-DD), a month + year (YYYY-MM), or a year only (YYYY).
-- The public card formats the label according to its granularity; partial labels
-- carry no concrete DateTime (departureDate stays NULL) so no fake day is stored.
ALTER TABLE "package_schedules" ADD COLUMN "departureLabel" TEXT;

-- Backfill the label for existing rows from their concrete departure date so
-- every legacy schedule keeps rendering exactly as before (no data loss).
UPDATE "package_schedules"
SET "departureLabel" = to_char("departureDate", 'YYYY-MM-DD')
WHERE "departureLabel" IS NULL AND "departureDate" IS NOT NULL;

-- Partial (month/year) departure labels have no concrete date; allow NULL so the
-- column can represent "no full date yet" instead of a fabricated day.
ALTER TABLE "package_schedules" ALTER COLUMN "departureDate" DROP NOT NULL;