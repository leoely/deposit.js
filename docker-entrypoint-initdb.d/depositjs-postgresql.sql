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
(14,	'elizebeth',	52,	1,	'lompoc',	'america'),
(15,	'bethany',	59,	0,	'honolulu',	'america'),
(16,	'samantha',	29,	0,	'anahemim',	'america'),
(17,	'patricia',	58,	0,	'pittsburgh',	'america'),
(18,	'jacob',	38,	1,	'baltimore',	'america'),
(19,	'kyle',	43,	1,	'milwaukee',	'america'),
(20,	'liam',	49,	1,	'albuquerque',	'america'),
(21,	'noah',	29,	1,	'tucson',	'america'),
(22,	'damian',	49,	1,	'fresno',	'america'),
(23,	'reece',	34,	1,	'sacramento',	'america'),
(24,	'kyle',	83,	1,	'atlanta',	'america'),
(25,	'noah',	37,	1,	'mesa',	'america'),
(26,	'tracy',	59,	0,	'ealeigh',	'america'),
(27,	'amelia',	12,	0,	'omaha',	'america'),
(28,	'lsla',	49,	0,	'long beach',	'america'),
(29,	'poppy',	58,	0,	'oakland',	'america'),
(30,	'susan',	39,	0,	'minneapolis',	'america'),
(31,	'abigail',	29,	0,	'tulsa',	'america'),
(32,	'elizabeth',	58,	0,	'bakeersfield',	'america'),
(33,	'lsabella',	39,	0,	'new orleans',	'america'),
(34,	'mia',	19,	0,	'henderson',	'america'),
(35,	'barbara',	48,	0,	'anaheim',	'america'),
(36,	'lsla',	49,	0,	'saint paul',	'america'),
(37,	'wendy',	34,	0,	'greensboro',	'america'),
(38,	'charlie',	58,	1,	'portland',	'america'),
(39,	'connor',	28,	1,	'detroit',	'america'),
(40,	'callum',	43,	1,	'memphis',	'america');

-- 2025-07-13 07:11:37.03079+00
