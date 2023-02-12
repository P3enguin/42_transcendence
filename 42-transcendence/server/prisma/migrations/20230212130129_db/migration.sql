-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "joinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "IsOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achivement" (
    "id" SERIAL NOT NULL,
    "statusId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "Achivement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranks" (
    "id" SERIAL NOT NULL,
    "statusId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Titles" (
    "id" SERIAL NOT NULL,
    "statusId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "Titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matchs" (
    "id" SERIAL NOT NULL,
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
    "stats" TEXT NOT NULL DEFAULT 'private',
    "IsChannel" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER NOT NULL,
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
CREATE TABLE "_MatchsToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Player_statusId_key" ON "Player"("statusId");

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
CREATE UNIQUE INDEX "_MatchsToPlayer_AB_unique" ON "_MatchsToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchsToPlayer_B_index" ON "_MatchsToPlayer"("B");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achivement" ADD CONSTRAINT "Achivement_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranks" ADD CONSTRAINT "Ranks_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titles" ADD CONSTRAINT "Titles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_block" ADD CONSTRAINT "_block_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_block" ADD CONSTRAINT "_block_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToRoom" ADD CONSTRAINT "_PlayerToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToRoom" ADD CONSTRAINT "_PlayerToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchsToPlayer" ADD CONSTRAINT "_MatchsToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Matchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchsToPlayer" ADD CONSTRAINT "_MatchsToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
