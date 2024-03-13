-- Adminer 4.8.1 PostgreSQL 15.3 (Debian 15.3-1.pgdg120+1) dump

DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "id" bigint NOT NULL,
    "name" text,
    "age" integer,
    "gender" integer,
    "city" text,
    "country" text,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "users" ("id", "name", "age", "gender", "city", "country") VALUES
(0,	'james',	21,	1,	'sitka',	'america'),
(1,	'ovlier',	22,	1,	'clifton',	'america'),
(2,	'thomas',	23,	1,	'florence',	'america'),
(3,	'david',	32,	1,	'walpi',	'america'),
(4,	'joseph',	23,	1,	'winslow',	'america'),
(5,	'william',	33,	1,	'helena',	'america'),
(6,	'michael',	53,	1,	'morrilton',	'america'),
(7,	'george',	23,	1,	'arcadia',	'america'),
(8,	'alexander',	25,	1,	'coronado',	'america'),
(9,	'john',	25,	1,	'eureka',	'america'),
(10,	'taylor',	23,	0,	'fairfield',	'america'),
(11,	'emily',	23,	0,	'fremont',	'america'),
(12,	'emma',	23,	0,	'fullerton',	'america'),
(13,	'particia',	24,	1,	'irvine',	'america'),
(14,	'elizebeth',	52,	1,	'lompoc',	'america');

-- 2023-08-02 15:50:37.815841+00
