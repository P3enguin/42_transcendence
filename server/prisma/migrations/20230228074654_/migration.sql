-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "joinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achivement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "requirement" TEXT,
    "description" TEXT NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "Achivement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achivement_status" (
    "statusId" INTEGER NOT NULL,
    "achivId" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT true,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achivement_status_pkey" PRIMARY KEY ("statusId","achivId")
);

-- CreateTable
CREATE TABLE "Ranks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Titles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "occupied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matchs" (
    "id" SERIAL NOT NULL,
    "winner" INTEGER NOT NULL,
    "loser" INTEGER NOT NULL,
    "scoor" TEXT NOT NULL,
    "playerAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matchs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "channelId" SERIAL NOT NULL,
    "name" TEXT,
    "Topic" TEXT,
    "Key" TEXT,
    "memberLimit" INTEGER NOT NULL DEFAULT 2,
    "stats" TEXT,
    "IsChannel" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER,
    "avatar" TEXT NOT NULL DEFAULT '#',

    CONSTRAINT "Room_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "Chat" (
    "MsgId" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("MsgId")
);

-- CreateTable
CREATE TABLE "Ban" (
    "channelId" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_block" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayerToRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StatusToTitles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RanksToStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "players_email_key" ON "players"("email");

-- CreateIndex
CREATE UNIQUE INDEX "players_nickname_key" ON "players"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "players_statusId_key" ON "players"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "Achivement_name_key" ON "Achivement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Titles_name_key" ON "Titles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_block_AB_unique" ON "_block"("A", "B");

-- CreateIndex
CREATE INDEX "_block_B_index" ON "_block"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToRoom_AB_unique" ON "_PlayerToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToRoom_B_index" ON "_PlayerToRoom"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StatusToTitles_AB_unique" ON "_StatusToTitles"("A", "B");

-- CreateIndex
CREATE INDEX "_StatusToTitles_B_index" ON "_StatusToTitles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RanksToStatus_AB_unique" ON "_RanksToStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_RanksToStatus_B_index" ON "_RanksToStatus"("B");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achivement_status" ADD CONSTRAINT "Achivement_status_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achivement_status" ADD CONSTRAINT "Achivement_status_achivId_fkey" FOREIGN KEY ("achivId") REFERENCES "Achivement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_winner_fkey" FOREIGN KEY ("winner") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_loser_fkey" FOREIGN KEY ("loser") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_block" ADD CONSTRAINT "_block_A_fkey" FOREIGN KEY ("A") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_block" ADD CONSTRAINT "_block_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToRoom" ADD CONSTRAINT "_PlayerToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToRoom" ADD CONSTRAINT "_PlayerToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToTitles" ADD CONSTRAINT "_StatusToTitles_A_fkey" FOREIGN KEY ("A") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToTitles" ADD CONSTRAINT "_StatusToTitles_B_fkey" FOREIGN KEY ("B") REFERENCES "Titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RanksToStatus" ADD CONSTRAINT "_RanksToStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "Ranks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RanksToStatus" ADD CONSTRAINT "_RanksToStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
