-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "joinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- AddForeignKey
ALTER TABLE "Achivement" ADD CONSTRAINT "Achivement_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranks" ADD CONSTRAINT "Ranks_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titles" ADD CONSTRAINT "Titles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_winner_fkey" FOREIGN KEY ("winner") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_loser_fkey" FOREIGN KEY ("loser") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Room"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
