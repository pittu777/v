-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_clerkId_key" ON "Vendor"("clerkId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
