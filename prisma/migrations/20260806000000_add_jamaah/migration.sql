-- Sprint 3D: add Jamaah entity (registered under a Booking) + JamaahDocuments

-- CreateTable
CREATE TABLE "jamaah" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    -- Personal
    "fullName" TEXT NOT NULL,
    "passportName" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT 'MALE',
    "birthPlace" TEXT NOT NULL DEFAULT '',
    "birthDate" TIMESTAMP(3),
    "nik" TEXT NOT NULL DEFAULT '',
    -- Passport
    "passportNumber" TEXT,
    "passportIssueDate" TIMESTAMP(3),
    "passportExpiry" TIMESTAMP(3),
    -- Address
    "province" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "village" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    -- Contact
    "phone" TEXT,
    "whatsapp" TEXT,
    "photoMediaId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "jamaah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamaah_documents" (
    "id" TEXT NOT NULL,
    "jamaahId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PASSPORT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mediaId" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jamaah_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jamaah_bookingId_idx" ON "jamaah"("bookingId");
CREATE INDEX "jamaah_fullName_idx" ON "jamaah"("fullName");
CREATE INDEX "jamaah_passportNumber_idx" ON "jamaah"("passportNumber");
CREATE INDEX "jamaah_status_idx" ON "jamaah"("status");
CREATE INDEX "jamaah_deletedAt_idx" ON "jamaah"("deletedAt");

CREATE INDEX "jamaah_documents_jamaahId_idx" ON "jamaah_documents"("jamaahId");
CREATE INDEX "jamaah_documents_type_idx" ON "jamaah_documents"("type");

-- AddForeignKey
ALTER TABLE "jamaah" ADD CONSTRAINT "jamaah_bookingId_fkey"
    FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "jamaah" ADD CONSTRAINT "jamaah_photoMediaId_fkey"
    FOREIGN KEY ("photoMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_jamaahId_fkey"
    FOREIGN KEY ("jamaahId") REFERENCES "jamaah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_mediaId_fkey"
    FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_uploadedById_fkey"
    FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
