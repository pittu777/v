/*
  Warnings:

  - A unique constraint covering the columns `[vendorId,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- CreateIndex
CREATE INDEX "Product_vendorId_createdAt_idx" ON "Product"("vendorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_vendorId_sku_key" ON "Product"("vendorId", "sku");
