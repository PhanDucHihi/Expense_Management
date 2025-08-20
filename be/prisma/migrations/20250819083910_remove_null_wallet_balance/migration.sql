/*
  Warnings:

  - Made the column `balance` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "balance" SET NOT NULL;
