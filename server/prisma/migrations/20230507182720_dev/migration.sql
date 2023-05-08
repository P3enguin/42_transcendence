/*
  Warnings:

  - Made the column `status` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT '';
