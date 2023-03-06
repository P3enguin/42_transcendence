/*
  Warnings:

  - Added the required column `firstname` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `players` table without a default value. This is not possible if the table is not empty.
  - Made the column `avatar` on table `players` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT '#';
