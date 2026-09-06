-- ============================================================================
-- phase-16l8-packages-rls.sql
-- Enable RLS + public-read policy on `packages` so child table policies
-- (schedules, hotels, facilities, flights, itineraries, galleries,
--  flight_segments) have a consistent parent.
--
-- The application (Prisma / postgres role) bypasses RLS and is unaffected.
-- Only Supabase Data API (PostgREST) anon traffic is affected.
-- ============================================================================

BEGIN;

-- Enable RLS (deny-by-default for non-bypassing roles).
ALTER TABLE "public"."packages" ENABLE ROW LEVEL SECURITY;

-- Public read: only PUBLISHED packages are visible to anon.
CREATE POLICY packages_public_read
ON public.packages
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'PUBLISHED'
);

COMMIT;
