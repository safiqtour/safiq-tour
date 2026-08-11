-- CreateTable
CREATE TABLE "package_flights" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'DEPARTURE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_flight_segments" (
    "id" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "airlineId" TEXT,
    "flightNumber" TEXT NOT NULL DEFAULT '',
    "departureCity" TEXT NOT NULL DEFAULT '',
    "departureAirport" TEXT NOT NULL DEFAULT '',
    "arrivalCity" TEXT NOT NULL DEFAULT '',
    "arrivalAirport" TEXT NOT NULL DEFAULT '',
    "departureDateTime" TIMESTAMP(3),
    "arrivalDateTime" TIMESTAMP(3),
    "segmentOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_flight_segments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_flights_packageId_idx" ON "package_flights"("packageId");
CREATE INDEX "package_flight_segments_flightId_idx" ON "package_flight_segments"("flightId");
CREATE INDEX "package_flight_segments_airlineId_idx" ON "package_flight_segments"("airlineId");

-- AddForeignKey
ALTER TABLE "package_flights" ADD CONSTRAINT "package_flights_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "package_flight_segments" ADD CONSTRAINT "package_flight_segments_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "package_flights"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "package_flight_segments" ADD CONSTRAINT "package_flight_segments_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
