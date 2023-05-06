-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_fromPlayerId_fkey" FOREIGN KEY ("fromPlayerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
