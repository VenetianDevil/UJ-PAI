-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: auctionhouse
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bid`
--

DROP TABLE IF EXISTS `bid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid` (
  `id_bid` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_offer` int NOT NULL,
  `value` float NOT NULL,
  `date` date NOT NULL,
  `retracted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id_bid`),
  UNIQUE KEY `id_UNIQUE` (`id_bid`),
  KEY `id_user_idx` (`id_user`),
  KEY `id_offer_idx` (`id_offer`),
  CONSTRAINT `id_offer` FOREIGN KEY (`id_offer`) REFERENCES `offer` (`id_offer`),
  CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid`
--

LOCK TABLES `bid` WRITE;
/*!40000 ALTER TABLE `bid` DISABLE KEYS */;
INSERT INTO `bid` VALUES (1,3,1,444,'2022-03-11',1),(2,3,1,6756,'2022-03-11',1),(4,3,1,666,'2022-03-11',1),(5,3,1,45345,'2022-03-11',1),(6,6,1,544,'2022-03-12',NULL),(7,6,1,669,'2022-03-12',NULL),(8,6,1,59111,'2022-03-12',NULL),(9,6,3,955,'2022-03-12',NULL),(10,6,5,9977,'2022-03-12',NULL),(11,3,2,56446,'2022-03-13',NULL),(12,3,2,570001,'2022-03-13',NULL);
/*!40000 ALTER TABLE `bid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer`
--

DROP TABLE IF EXISTS `offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer` (
  `id_offer` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` longtext,
  `active` tinyint NOT NULL,
  `starting_price` float NOT NULL,
  `winning_bid_id` int DEFAULT NULL,
  `img_url` mediumtext,
  PRIMARY KEY (`id_offer`),
  UNIQUE KEY `id_UNIQUE` (`id_offer`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer`
--

LOCK TABLES `offer` WRITE;
/*!40000 ALTER TABLE `offer` DISABLE KEYS */;
INSERT INTO `offer` VALUES (1,'Monalisa','obraz olejny namalowany na topolowej desce przez Leonarda da Vinci, artystę włoskiego renesansu. Jego nazwa pochodzi od słowa mona, które w dialekcie toskańskim jest skrótem od tytułu ma donna („moja pani”) oraz imienia domniemanego tematu portretu, zaś we wł. i hiszp. znany jest jako La Gioconda, a we fr. La Joconde, od nazwy rodu kupca zamawiającego to dzieło.',1,5000,8,'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'),(2,'Dama z gronostajem','obraz autorstwa Leonarda da Vinci namalowany około 1489 roku, wykonany w technice olejnej, z użyciem tempery, na desce orzechowej o wymiarach 54,7 na 40,3 cm. Przedstawia Cecylię Gallerani, kochankę księcia Ludwika Sforzy.',1,12000,12,'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Lady_with_an_Ermine_-_Leonardo_da_Vinci_-_Google_Art_Project.jpg/800px-Lady_with_an_Ermine_-_Leonardo_da_Vinci_-_Google_Art_Project.jpg'),(3,'Słoneczniki','seria obrazów namalowanych przez Vincenta van Gogha, zawierających motyw słoneczników. Powstało ogółem 11 obrazów: 4 podczas pobytu w Paryżu i 7 w Arles.',1,8000,9,'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/800px-Vincent_Willem_van_Gogh_128.jpg'),(4,'Gwiaździsta noc','Obraz olejny Vincenta van Gogha namalowany w czerwcu 1889 roku podczas pobytu artysty w miejscowości Saint-Rémy na dobrowolnej terapii psychiatrycznej.',1,9500,NULL,'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'),(5,'Dziewczyna z perłą','obraz autorstwa holenderskiego malarza Johannesa Vermeera, uznawany za jeden z najwybitniejszych przykładów XVII-wiecznego malarstwa. Znajduje się obecnie w muzeum Mauritshuis w Hadze; bywa często nazywany Mona Lisą północy lub Holenderską Mona Lisą.',0,7800,10,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Johannes_Vermeer_%281632-1675%29_-_The_Girl_With_The_Pearl_Earring_%281665%29.jpg/800px-Johannes_Vermeer_%281632-1675%29_-_The_Girl_With_The_Pearl_Earring_%281665%29.jpg'),(6,'Ogród rozkoszy ziemskich','Tryptyk niderlandzkiego malarza Hieronima Boscha, wykonany w technice olejnej na desce, namalowany ok. 1500[1], obecnie znajdujący się w muzeum Prado w Madrycie.',1,11000,NULL,'https://www.obrazydeco.pl/1632-large_default/ogrod-rozkoszy-ziemskich-tryptyk-reprodukcja-obrazu.jpg');
/*!40000 ALTER TABLE `offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `is_admin` tinyint DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `iduser_UNIQUE` (`id_user`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'Karolina','admin'),(3,NULL,'test','Test1'),(6,NULL,'Adam','ada');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'auctionhouse'
--

--
-- Dumping routines for database 'auctionhouse'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-14 12:17:20
