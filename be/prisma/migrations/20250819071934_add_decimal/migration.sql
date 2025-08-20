/*
  Warnings:

  - You are about to alter the column `amount_limit` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `amount` on the `RecurringTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `balance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `targetAmount` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `startAmount` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.

*/
-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "amount_limit" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "public"."RecurringTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "targetAmount" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "startAmount" SET DATA TYPE DECIMAL(15,2);
