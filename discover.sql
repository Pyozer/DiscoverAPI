-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 11, 2018 at 10:13 AM
-- Server version: 10.1.23-MariaDB-9+deb9u1
-- PHP Version: 7.0.19-1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `discover`
--

-- --------------------------------------------------------

--
-- Table structure for table `friend`
--

CREATE TABLE `friend` (
  `id_friend` int(11) NOT NULL,
  `id_user_origin` int(11) NOT NULL,
  `id_user_dest` int(11) NOT NULL,
  `date_friend` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `friend`
--

INSERT INTO `friend` (`id_friend`, `id_user_origin`, `id_user_dest`, `date_friend`) VALUES
(13, 3, 1, '2017-11-17 09:49:34'),
(21, 2, 2, '2017-11-21 14:43:10'),
(22, 4, 3, '2017-12-05 13:04:14'),
(33, 2, 1, '2017-12-28 18:02:32'),
(60, 1, 3, '2017-12-31 03:01:12'),
(62, 1, 11, '2018-01-03 03:07:03'),
(63, 15, 1, '2018-01-09 00:33:12'),
(64, 15, 2, '2018-01-09 00:33:16'),
(65, 15, 3, '2018-01-09 00:33:21'),
(67, 15, 4, '2018-01-09 00:33:26'),
(68, 15, 11, '2018-01-09 00:33:28'),
(69, 15, 12, '2018-01-09 00:33:30'),
(70, 15, 13, '2018-01-09 00:33:32'),
(71, 18, 1, '2018-01-09 08:29:16');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `content_post` text COLLATE utf8mb4_bin NOT NULL,
  `photo_post` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `date_post` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude_post` double NOT NULL,
  `longitude_post` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id_post`, `id_user`, `content_post`, `photo_post`, `date_post`, `latitude_post`, `longitude_post`) VALUES
(12, 3, 'Petit feu ', '1514478402207_IMG_20171228_172437.jpg', '2017-12-28 18:26:59', 48.6470509, -1.9926974),
(21, 1, 'Petit test des familles ????', '1514775256391_IMG_20170828_143254.jpg', '2018-01-01 03:54:48', 47.6901392, -0.0749474),
(23, 1, 'Test emojis 🇪🇹🇫🇲🇬🇩🇪🇬🇪🇹🇪🇬😉😍☺️😄😂😄😙🍑🍓🍏🍓', '1514849704835_IMG_20170725_133009.jpg', '2018-01-02 00:35:31', 47.6901392, -0.0749474),
(24, 11, 'Baie de saint jean de monts', '1514928182055_estacadelatranchesurmer__039774100_1710_20052015.jpg', '2018-01-02 22:23:04', 46.79346400000001, -2.0617863),
(25, 4, 'ça c\'est la campagne de chez moi :)', '1515260178052_IMG_20171014_145012.jpg', '2018-01-06 18:36:31', 48.1559779, -0.4030636);

-- --------------------------------------------------------

--
-- Table structure for table `post_comment`
--

CREATE TABLE `post_comment` (
  `id_comment` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `text_comment` text COLLATE utf8mb4_bin NOT NULL,
  `date_comment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `post_comment`
--

INSERT INTO `post_comment` (`id_comment`, `id_post`, `id_user`, `text_comment`, `date_comment`) VALUES
(2, 12, 1, 'Quel beau feu !', '2017-12-28 23:07:01'),
(4, 12, 13, 'deviendra grand ????', '2017-12-31 15:39:23'),
(5, 12, 12, 'je sens mon mobile chauffer !', '2017-12-31 15:39:28'),
(16, 21, 1, 'Super club de tir à l\'arc.', '2018-01-04 01:32:20'),
(26, 25, 1, 'C\'est jolie 😜', '2018-01-06 18:01:23'),
(27, 21, 15, 'Qu\'est ce qui est jaune et qui attends ?', '2018-01-08 22:35:21'),
(28, 25, 11, 'c\'est beau !', '2018-01-10 19:40:26'),
(31, 25, 11, 'pédé je suis con', '2018-01-11 09:35:19'),
(32, 25, 11, 'pédé con', '2018-01-11 09:37:09');

-- --------------------------------------------------------

--
-- Table structure for table `post_like`
--

CREATE TABLE `post_like` (
  `id_like` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date_like` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_like`
--

INSERT INTO `post_like` (`id_like`, `id_post`, `id_user`, `date_like`) VALUES
(8, 12, 1, '2017-12-28 18:30:31'),
(16, 12, 13, '2017-12-31 17:38:34'),
(17, 12, 12, '2017-12-31 17:38:36'),
(38, 24, 1, '2018-01-04 02:07:58'),
(40, 21, 1, '2018-01-04 02:40:46'),
(42, 21, 15, '2018-01-09 00:44:55'),
(47, 12, 15, '2018-01-09 00:45:05'),
(55, 23, 15, '2018-01-09 00:46:48');

-- --------------------------------------------------------

--
-- Table structure for table `reset_password`
--

CREATE TABLE `reset_password` (
  `id_reset` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `token_reset` varchar(255) NOT NULL,
  `date_reset` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reset_password`
--

INSERT INTO `reset_password` (`id_reset`, `id_user`, `token_reset`, `date_reset`) VALUES
(1, 2, '565e41', '2018-01-03 18:37:07'),
(2, 1, '0aba6c', '2018-01-04 03:03:14'),
(3, 1, '0e3aba', '2018-01-04 03:03:20'),
(4, 1, '6fa451', '2018-01-04 03:06:03'),
(5, 1, 'c6dccf', '2018-01-04 03:08:30'),
(6, 1, '5d325f', '2018-01-04 03:12:42'),
(7, 1, '021add', '2018-01-04 03:17:19'),
(8, 1, '391b86', '2018-01-04 03:18:51'),
(9, 1, '621925', '2018-01-04 03:20:00'),
(12, 16, '401170', '2018-01-09 01:32:54'),
(13, 16, '40945c', '2018-01-09 01:32:55'),
(14, 11, 'a7548c', '2018-01-10 17:48:07'),
(16, 11, 'a78d53', '2018-01-11 11:56:11');

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `id_tag` int(11) NOT NULL,
  `nom_tag` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id_tag`, `nom_tag`) VALUES
(22, 'Adrénaline'),
(20, 'Amis'),
(1, 'Bar'),
(15, 'Boutique'),
(7, 'Brasserie'),
(13, 'Cascade'),
(16, 'Chose à faire'),
(14, 'Forêt'),
(17, 'Hôtel'),
(11, 'Lieu culte'),
(5, 'Lieu historique'),
(3, 'Monument'),
(24, 'Nature'),
(9, 'Paysage'),
(4, 'Plage'),
(6, 'Randonnée'),
(2, 'Restaurant'),
(12, 'Rivière'),
(19, 'Soirée'),
(21, 'Sport'),
(10, 'Statue'),
(8, 'Théâtre'),
(23, 'Vitesse');

-- --------------------------------------------------------

--
-- Table structure for table `tag_post`
--

CREATE TABLE `tag_post` (
  `id_tagpost` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tag_post`
--

INSERT INTO `tag_post` (`id_tagpost`, `id_post`, `id_tag`) VALUES
(28, 12, 8),
(41, 21, 7),
(42, 21, 5),
(43, 21, 6),
(44, 21, 2),
(46, 23, 5),
(47, 23, 4),
(48, 24, 4),
(49, 25, 6);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email_user` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `password_user` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `first_name_user` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `last_name_user` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `phone_user` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `photo_user` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  `date_register_user` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_user` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token_user` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `email_user`, `password_user`, `first_name_user`, `last_name_user`, `phone_user`, `photo_user`, `date_register_user`, `last_login_user`, `token_user`) VALUES
(1, 'jeancharles.msse@gmail.com', '$2a$10$yVAOmmoh1Gqmh3mdwU1JSOot4EGxqmnG.VpE8zF5jH1lqvKnPABSO', 'Jean-Charles', 'Moussé', NULL, '1515521208208_FB_IMG_1475619641127.jpg', '2017-10-15 12:53:23', '2018-01-10 13:28:19', '5bbc2c10-f5f9-11e7-a571-b702659de7c6'),
(2, 'pocard.maxime@gmail.com', '$2y$10$T3Lndj5bFbaeeXC9mh..BummCH75ZfJA4QhWsPUwYqBnTSPo.GT26', 'Maxime', 'Pocard', NULL, NULL, '2017-10-16 13:56:41', '2018-01-03 18:42:16', '0ebee0f0-f0a5-11e7-8005-ebda2b823462'),
(3, 'quentin.louet@gmail.com', '$2a$10$ERPFtrztDjoJmPwxWmeUzuhWHhNFVNSCSmaiAf9QD/RnY241uPtd6', 'Quentin', 'LENERVEUX', NULL, '1514557572698_IMG_20171020_204233.jpg', '2017-10-16 14:32:13', '2018-01-08 18:02:02', '4424adb0-f48d-11e7-abfa-3d1dd1c135f0'),
(4, 'leo.a.mottay@gmail.com', '$2a$10$8GWjHaemMse9FhzMwFuI/.xPjqZOL.5kPIeXrBTSrhISF/MvIXDZy', 'Léo', 'Mottay', NULL, NULL, '2017-10-16 15:33:31', '2017-12-05 12:23:30', '56c6d800-d9a6-11e7-930e-338e99ddfcfe'),
(11, 'killian.leti@gmail.com', '$2a$10$qPtnlhdJ0Y/OJwV1NHfB4Oo.bhxBVWI2mtx44L2OinWsW8AGGvkCG', 'Killian', 'Lts', NULL, NULL, '2017-11-08 10:05:38', '2018-01-11 11:58:07', 'ecaa59b0-f6b5-11e7-a571-b702659de7c6'),
(12, 'gilbert.louet@gmail.com', '$2a$10$Ube406Ywlx6KAwXDHieZMOjLgWsVjM/X13IaxPwF79Ya0P3G7t4JK', 'Gilbert', 'Pacha', NULL, NULL, '2017-12-31 17:33:25', '2017-12-31 17:33:25', 'f1423d90-ee3f-11e7-a64a-e7945129209a'),
(13, 'am.louet@free.fr', '$2a$10$U0dMKAyGAyiDkzdgEiaFg.OJhwN0zB3w/N4fSZ3i28sFQfNx9m/hK', 'Anne', 'Louet', NULL, NULL, '2017-12-31 17:34:58', '2017-12-31 17:34:58', '2886a5c0-ee40-11e7-a64a-e7945129209a'),
(15, 'aymeric1vaux@gmail.com', '$2a$10$KLQvDWhqzYNgG5LzzAlU6e5.HXS0IXoM/r5Dh6jJZKRsONt9bSFse', 'Aymeric', 'Vaux', NULL, NULL, '2018-01-09 00:32:37', '2018-01-09 00:32:37', 'd435dfb0-f4c3-11e7-a571-b702659de7c6'),
(16, 'test', '$2a$10$P0Ae4pFbaL8A/.4qvJ6EtuLFaJASblZkCkCeKqxCICroMbyFqZNU2', 'Test', 'Test', NULL, NULL, '2018-01-09 00:54:29', '2018-01-09 00:54:29', 'e26b1520-f4c6-11e7-a571-b702659de7c6'),
(17, 'damienlegagnoux@live.fr', '$2a$10$NsxeBCmINIHmNfN./TGouuaCzpyEi5OqE/.afqtZte8ZCIR3uvkw6', 'Damien', 'Legagnoux', NULL, NULL, '2018-01-09 02:39:35', '2018-01-09 02:39:35', '90c54bf0-f4d5-11e7-a571-b702659de7c6'),
(18, 'clementsclements29@gmail.com', '$2a$10$YIEa9JkQVdddXXcr5SVUXOHYm4jgBts5XRr4e0cAq18kFCnrBkM62', 'Clément', 'FORGEARD', NULL, NULL, '2018-01-09 08:28:18', '2018-01-09 16:19:56', '2abfc1f0-f548-11e7-a571-b702659de7c6'),
(20, 'maxougaming458@gmail.com', '$2a$10$a.LF3/lxCE9eUGIRYG9JTeYH9UTJXC.4FFQ6Fcoigrcabph4JSlQG', 'Olivier', 'Tuning', NULL, NULL, '2018-01-11 11:56:36', '2018-01-11 12:07:02', '2b84a1d0-f6b7-11e7-a571-b702659de7c6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`id_friend`),
  ADD KEY `id_1_friend` (`id_user_origin`),
  ADD KEY `id_2_friend` (`id_user_dest`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `post_comment`
--
ALTER TABLE `post_comment`
  ADD PRIMARY KEY (`id_comment`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `post_like`
--
ALTER TABLE `post_like`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `reset_password`
--
ALTER TABLE `reset_password`
  ADD PRIMARY KEY (`id_reset`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id_tag`),
  ADD UNIQUE KEY `nom_tag` (`nom_tag`);

--
-- Indexes for table `tag_post`
--
ALTER TABLE `tag_post`
  ADD PRIMARY KEY (`id_tagpost`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email_user` (`email_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friend`
--
ALTER TABLE `friend`
  MODIFY `id_friend` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;
--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `post_comment`
--
ALTER TABLE `post_comment`
  MODIFY `id_comment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `post_like`
--
ALTER TABLE `post_like`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
--
-- AUTO_INCREMENT for table `reset_password`
--
ALTER TABLE `reset_password`
  MODIFY `id_reset` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `tag_post`
--
ALTER TABLE `tag_post`
  MODIFY `id_tagpost` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `friend`
--
ALTER TABLE `friend`
  ADD CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`id_user_origin`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friend_ibfk_2` FOREIGN KEY (`id_user_dest`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_comment`
--
ALTER TABLE `post_comment`
  ADD CONSTRAINT `post_comment_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_comment_ibfk_2` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_like`
--
ALTER TABLE `post_like`
  ADD CONSTRAINT `post_like_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_like_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reset_password`
--
ALTER TABLE `reset_password`
  ADD CONSTRAINT `reset_password_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tag_post`
--
ALTER TABLE `tag_post`
  ADD CONSTRAINT `tag_post_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tag_post_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
