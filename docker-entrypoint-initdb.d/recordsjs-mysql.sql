-- Adminer 4.8.1 MySQL 8.0.32 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  id bigint NOT NULL,
  name text,
  age int DEFAULT NULL,
  gender int DEFAULT NULL,
  city text,
  country text,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `age`, `gender`, `city`, `country`) VALUES
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

-- 2023-07-27 04:03:09
