-- MySQL dump 10.13  Distrib 8.0.12, for osx10.13 (x86_64)
--
-- Host: q7cxv1zwcdlw7699.chr7pe7iynqr.eu-west-1.rds.amazonaws.com    Database: th8xjvrh582fek4b
-- ------------------------------------------------------
-- Server version	5.7.23-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `post` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `content_post` text COLLATE utf8mb4_bin NOT NULL,
  `info_post` text COLLATE utf8mb4_bin NOT NULL,
  `photo_post` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `date_post` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude_post` double NOT NULL,
  `longitude_post` double NOT NULL,
  PRIMARY KEY (`id_post`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (34,21,'testr','test','https://s3-eu-west-1.amazonaws.com/discoverstorage/test.jpg','2019-05-12 15:49:20',37.4219983,-122.084),(35,21,'test','tesft','https://s3-eu-west-1.amazonaws.com/discoverstorage/IMG_20190512_173111.jpg','2019-05-12 16:31:43',37.4219983,-122.084),(36,21,'Session drift ♥️','Apporter des pneus','https://s3-eu-west-1.amazonaws.com/discoverstorage/IMG_20190510_224414.jpg','2019-05-12 16:48:38',47.6901392,-0.0749373);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;
