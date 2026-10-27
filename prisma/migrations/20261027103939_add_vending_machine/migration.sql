-- CreateTable
CREATE TABLE "VendingMachine" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "machineCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendingMachine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendingMachine_vendorId_createdAt_idx" ON "VendingMachine"("vendorId", "createdAt");

-- CreateIndex
CREATE INDEX "VendingMachine_vendorId_status_idx" ON "VendingMachine"("vendorId", "status");

-- AddForeignKey
ALTER TABLE "VendingMachine" ADD CONSTRAINT "VendingMachine_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
