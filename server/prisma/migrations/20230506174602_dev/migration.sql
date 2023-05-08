/*
  Warnings:

  - A unique constraint covering the columns `[channelId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_channelId_key" ON "Room"("channelId");
