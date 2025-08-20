/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startAmount" DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_name_userId_key" ON "public"."Wallet"("name", "userId");
