-- CreateTable
CREATE TABLE "airline_aliases" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airline_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "airline_aliases_alias_idx" ON "airline_aliases"("alias");

-- CreateUniqueIndex (@@unique([airlineId, alias]))
CREATE UNIQUE INDEX "airline_aliases_airlineId_alias_key" ON "airline_aliases"("airlineId", "alias");

-- AddForeignKey
ALTER TABLE "airline_aliases" ADD CONSTRAINT "airline_aliases_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
