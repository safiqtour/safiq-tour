-- CreateTable
CREATE TABLE "customers" (
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

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_documents" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PASSPORT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mediaId" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "uploadedById" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");
CREATE INDEX "customers_name_idx" ON "customers"("name");
CREATE INDEX "customers_passportNumber_idx" ON "customers"("passportNumber");
CREATE INDEX "customers_email_idx" ON "customers"("email");
CREATE INDEX "customers_status_idx" ON "customers"("status");
CREATE INDEX "customers_deletedAt_idx" ON "customers"("deletedAt");
CREATE INDEX "customer_documents_customerId_idx" ON "customer_documents"("customerId");
CREATE INDEX "customer_documents_type_idx" ON "customer_documents"("type");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
