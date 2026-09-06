-- ============================================================================
-- 20260825000000_add_rls_policies
-- Safiq Tour — RLS + public read policies
--
-- RLS is part of the Prisma migration pipeline.
--
-- IMPORTANT:
-- - No BEGIN/COMMIT. Prisma Migration Engine manages the transaction.
-- - DROP POLICY IF EXISTS makes this safe for the existing database where
--   policies were previously installed manually.
-- - Fresh databases are also supported.
-- - Application uses the postgres role and bypasses RLS.
-- - Supabase PostgREST anon traffic is restricted by these policies.
-- ============================================================================


-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE "public"."users"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."roles"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."permissions"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."role_permissions"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."activity_logs"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customers"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer_documents"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookings"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jamaah"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jamaah_documents"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."media"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."media_folders"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."media_usage"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."business_settings"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."settings"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."promotions"          ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."packages"            ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airlines"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."currencies"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."facilities"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."hotels"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_categories"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_types"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."transportations"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."visas"                ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."package_schedules"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_hotels"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_facilities"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_flights"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_galleries"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_itineraries"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."package_flight_segments" ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 2. MASTER DATA PUBLIC READ POLICIES
-- ============================================================================

DROP POLICY IF EXISTS airlines_public_read ON public.airlines;

CREATE POLICY airlines_public_read
ON public.airlines
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS currencies_public_read ON public.currencies;

CREATE POLICY currencies_public_read
ON public.currencies
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS facilities_public_read ON public.facilities;

CREATE POLICY facilities_public_read
ON public.facilities
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS hotels_public_read ON public.hotels;

CREATE POLICY hotels_public_read
ON public.hotels
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS package_categories_public_read ON public.package_categories;

CREATE POLICY package_categories_public_read
ON public.package_categories
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS package_types_public_read ON public.package_types;

CREATE POLICY package_types_public_read
ON public.package_types
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS tags_public_read ON public.tags;

CREATE POLICY tags_public_read
ON public.tags
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS transportations_public_read ON public.transportations;

CREATE POLICY transportations_public_read
ON public.transportations
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


DROP POLICY IF EXISTS visas_public_read ON public.visas;

CREATE POLICY visas_public_read
ON public.visas
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'ACTIVE'
    AND "deletedAt" IS NULL
);


-- ============================================================================
-- 3. PACKAGES PUBLIC READ
-- ============================================================================

DROP POLICY IF EXISTS packages_public_read ON public.packages;

CREATE POLICY packages_public_read
ON public.packages
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    status = 'PUBLISHED'
);


-- ============================================================================
-- 4. PACKAGE CHILD TABLE PUBLIC READ POLICIES
-- ============================================================================

DROP POLICY IF EXISTS package_schedules_public_read ON public.package_schedules;

CREATE POLICY package_schedules_public_read
ON public.package_schedules
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_schedules."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_hotels_public_read ON public.package_hotels;

CREATE POLICY package_hotels_public_read
ON public.package_hotels
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_hotels."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_facilities_public_read ON public.package_facilities;

CREATE POLICY package_facilities_public_read
ON public.package_facilities
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_facilities."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_flights_public_read ON public.package_flights;

CREATE POLICY package_flights_public_read
ON public.package_flights
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_flights."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_galleries_public_read ON public.package_galleries;

CREATE POLICY package_galleries_public_read
ON public.package_galleries
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_galleries."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_itineraries_public_read ON public.package_itineraries;

CREATE POLICY package_itineraries_public_read
ON public.package_itineraries
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.packages AS p
        WHERE p.id = package_itineraries."packageId"
          AND p.status = 'PUBLISHED'
    )
);


DROP POLICY IF EXISTS package_flight_segments_public_read
ON public.package_flight_segments;

CREATE POLICY package_flight_segments_public_read
ON public.package_flight_segments
AS PERMISSIVE
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1
        FROM public.package_flights AS pf
        JOIN public.packages AS p
          ON p.id = pf."packageId"
        WHERE pf.id = package_flight_segments."flightId"
          AND p.status = 'PUBLISHED'
    )
);


-- ============================================================================
-- END
-- ============================================================================