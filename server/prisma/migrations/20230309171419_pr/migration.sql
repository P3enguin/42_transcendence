/*
  Warnings:

  - Added the required column `coins` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "coins" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "InvalidToken" (
    "token" TEXT NOT NULL,
    "ExpireDate" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InvalidToken_token_key" ON "InvalidToken"("token");
