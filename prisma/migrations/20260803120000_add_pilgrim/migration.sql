-- CreateTable
CREATE TABLE "pilgrims" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickName" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "phone" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'MALE',
    "birthPlace" TEXT NOT NULL DEFAULT '',
    "birthDate" TIMESTAMP(3),
    "address" TEXT NOT NULL DEFAULT '',
    "nationality" TEXT NOT NULL DEFAULT '',
    "nik" TEXT NOT NULL DEFAULT '',
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "photoMediaId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pilgrims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pilgrim_documents" (
    "id" TEXT NOT NULL,
    "pilgrimId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PASSPORT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mediaId" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "uploadedById" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pilgrim_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pilgrims_code_key" ON "pilgrims"("code");
CREATE INDEX "pilgrims_name_idx" ON "pilgrims"("name");
CREATE INDEX "pilgrims_passportNumber_idx" ON "pilgrims"("passportNumber");
CREATE INDEX "pilgrims_email_idx" ON "pilgrims"("email");
CREATE INDEX "pilgrims_status_idx" ON "pilgrims"("status");
CREATE INDEX "pilgrims_deletedAt_idx" ON "pilgrims"("deletedAt");
CREATE INDEX "pilgrim_documents_pilgrimId_idx" ON "pilgrim_documents"("pilgrimId");
CREATE INDEX "pilgrim_documents_type_idx" ON "pilgrim_documents"("type");

-- AddForeignKey
ALTER TABLE "pilgrims" ADD CONSTRAINT "pilgrims_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_pilgrimId_fkey" FOREIGN KEY ("pilgrimId") REFERENCES "pilgrims"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
