-- AlterTable
ALTER TABLE "players" ADD COLUMN     "wallpaper" TEXT NOT NULL DEFAULT 'wallpaper.png',
ALTER COLUMN "avatar" SET DEFAULT 'default.png';
