CREATE TABLE "public.Player" (
	"login" TEXT NOT NULL,
	"nickname" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL UNIQUE,
	"avatar" TEXT,
	CONSTRAINT "Player_pk" PRIMARY KEY ("login")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Stats" (
	"nickname" TEXT NOT NULL,
	"wins" TEXT,
	"losses" TEXT,
	"Archiv" TEXT,
	"level" int,
	"title" TEXT,
	"rank" int,
	"IsOnline" bool,
	CONSTRAINT "Stats_pk" PRIMARY KEY ("nickname")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Archievements" (
	"Archiv" bigint NOT NULL,
	"name" TEXT NOT NULL,
	"level" int NOT NULL,
	"description" TEXT NOT NULL,
	"effects" TEXT NOT NULL,
	CONSTRAINT "Archievements_pk" PRIMARY KEY ("Archiv")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Match history" (
	"MatchID" serial NOT NULL,
	"player1" TEXT NOT NULL,
	"player2" TEXT NOT NULL,
	"Winner" TEXT NOT NULL,
	"Scoor" TEXT NOT NULL,
	"date" DATE NOT NULL,
	CONSTRAINT "Match history_pk" PRIMARY KEY ("MatchID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.friends" (
	"ID" serial NOT NULL,
	"Player1" TEXT NOT NULL UNIQUE,
	"Player2" TEXT NOT NULL UNIQUE,
	"date" DATE NOT NULL,
	CONSTRAINT "friends_pk" PRIMARY KEY ("ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Ranks" (
	"RankID" serial NOT NULL,
	"name" TEXT NOT NULL,
	"points" int NOT NULL,
	"avatar" pg_lsn NOT NULL,
	CONSTRAINT "Ranks_pk" PRIMARY KEY ("RankID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Titles" (
	"titleID" serial NOT NULL,
	"name" TEXT NOT NULL,
	"point" int NOT NULL,
	"description" int NOT NULL,
	"effects" TEXT NOT NULL,
	CONSTRAINT "Titles_pk" PRIMARY KEY ("titleID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Channel" (
	"ChannelId" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"Topic" TEXT,
	"Key" TEXT,
	"Memberlimits" int,
	"Stats" TEXT NOT NULL DEFAULT 'public',
	"Admin" TEXT NOT NULL,
	CONSTRAINT "Channel_pk" PRIMARY KEY ("ChannelId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Block" (
	"ID" serial NOT NULL,
	"blocked" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"reason" TEXT NOT NULL,
	"nickname" TEXT NOT NULL,
	CONSTRAINT "Block_pk" PRIMARY KEY ("ID")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Chat" (
	"MsgId" serial NOT NULL,
	"Player1" TEXT NOT NULL,
	"Player2" TEXT NOT NULL,
	"msg" TEXT NOT NULL,
	CONSTRAINT "Chat_pk" PRIMARY KEY ("MsgId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Banned" (
	"ChannelId" int NOT NULL,
	"PlayerName" TEXT NOT NULL,
	"reason" TEXT,
	CONSTRAINT "Banned_pk" PRIMARY KEY ("ChannelId","PlayerName")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "Stats" ADD CONSTRAINT "Stats_fk0" FOREIGN KEY ("nickname") REFERENCES "Player"("nickname");
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_fk1" FOREIGN KEY ("Archiv") REFERENCES "Archievements"("Archiv");
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_fk2" FOREIGN KEY ("title") REFERENCES "Titles"("titleID");
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_fk3" FOREIGN KEY ("rank") REFERENCES "Ranks"("RankID");


ALTER TABLE "Match history" ADD CONSTRAINT "Match history_fk0" FOREIGN KEY ("player1") REFERENCES "Player"("nickname");
ALTER TABLE "Match history" ADD CONSTRAINT "Match history_fk1" FOREIGN KEY ("player2") REFERENCES "Player"("nickname");

ALTER TABLE "friends" ADD CONSTRAINT "friends_fk0" FOREIGN KEY ("Player1") REFERENCES "Player"("nickname");
ALTER TABLE "friends" ADD CONSTRAINT "friends_fk1" FOREIGN KEY ("Player2") REFERENCES "Player"("nickname");



ALTER TABLE "Channel" ADD CONSTRAINT "Channel_fk0" FOREIGN KEY ("Admin") REFERENCES "Player"("nickname");

ALTER TABLE "Block" ADD CONSTRAINT "Block_fk0" FOREIGN KEY ("blocked") REFERENCES "Player"("nickname");
ALTER TABLE "Block" ADD CONSTRAINT "Block_fk1" FOREIGN KEY ("nickname") REFERENCES "Player"("nickname");

ALTER TABLE "Chat" ADD CONSTRAINT "Chat_fk0" FOREIGN KEY ("Player1") REFERENCES "Player"("nickname");
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_fk1" FOREIGN KEY ("Player2") REFERENCES "Player"("nickname");

ALTER TABLE "Banned" ADD CONSTRAINT "Banned_fk0" FOREIGN KEY ("ChannelId") REFERENCES "Channel"("ChannelId");
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_fk1" FOREIGN KEY ("PlayerName") REFERENCES "Player"("nickname");












