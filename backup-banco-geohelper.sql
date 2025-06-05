-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydatabase
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_name` varchar(100) NOT NULL,
  `domain` varchar(10) DEFAULT NULL,
  `continent` varchar(50) DEFAULT NULL,
  `license_plate_color` text,
  `highway_color` text,
  `pedestrian_sign` text,
  `follow_cars` varchar(10) DEFAULT NULL,
  `unique_features` text,
  `driving_side` varchar(20) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (5,'Uruguay','.uy','South America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','carro preto do Google sem antena','não',NULL),(6,'Brasil','.br','South America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','Carro do google azul','não',NULL),(7,'Uruguay','.uy','South America','Branca','Branca lateral e meio branco e amarelo','5 Linhas','Não','Carro preto do google e sem antena','não',NULL),(8,'Argentina','.ar','South America','Branca','Branca lateral e meio branco e amarelo','5 Linhas','Não','carro preto do Google, placa com bola preta no meio','não',NULL),(9,'Chile','.cl','South America','Branca','Branca lateral e meio branco','5 Linhas','Não','Google branco do google sem antena','não',NULL),(10,'Chile','.cl','South America','Amarela','Margens amarelas e meio amarelo','5 Linhas','Não','Google branco do google sem antena','não',NULL),(11,'Peru','.pe','South America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','carro Google preto e um branco','não',NULL),(12,'Bolivia','.bo','South America','Azul','Margens brancas e meio amarelo','5 Linhas','Não','carro branco do Google sem antena','não',NULL),(13,'Bolivia','.bo','South America','Azul','Branca lateral e meio branco','5 Linhas','Não','carro branco do Google sem antena','não',NULL),(14,'Ecuador','.ec','South America','Branca','Margens brancas e meio amarelo','5 Linhas','','carro branco, com uma antena curta e grossa','não',NULL),(15,'Colombia','.co','South America','Amarela','','','','Carro carro preto, branco ou cinza e antena curta e grossa','não',NULL),(16,'Panama','.pa','North America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','Carro do google grande picape branca','não',NULL),(17,'Costa Rica','.cr','North America','Azul','Margens brancas e meio amarelo','5 Linhas','Não','Low Cam','não',NULL),(18,'Curaçao','.cw','North America','Grande e branca','Branca lateral e meio branco','5 Linhas','Não','carro preto com rack de teto','não',NULL),(19,'Martinique','.mq','North America','','','','','','não',NULL),(20,'United States Virgin Islands','.vi','North America','Azul','Margens brancas e meio amarelo','5 Linhas','Não','carro grande vermelho ou branco','não',NULL),(21,'Puerto Rico','.pr','North America','','Branca central e lateral amarela','5 Linhas','Não','amplo desfoque e câmera é mais baixa e o desfoque frontal arredondado','não',NULL),(22,'Dominican Republic','.do','North America','Amarela','Margens amarelas e meio branco','5 Linhas','Não','Carro do google com duas barras de metal, pelas grossas listras pretas','não',NULL),(23,'Guatemala','.gt','North America','Azul','Margens brancas e meio amarelo','5 Linhas','Não','carro cinza do google com rack de teto e espelhos laterais visíveis','não',NULL),(24,'Mexico','.mx','North America','Grande e branca','Margens brancas e meio amarelo','5 Linhas','Não','contadores circulares de eletricidade','não',NULL),(25,'United States of America','.us','North America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','Speed limit e Placas triangulares amarelas','não',NULL),(26,'Canada','.ca','North America','Branca','Margens brancas e meio amarelo','5 Linhas','Não','placa de velocidade é Maximum ','não',NULL),(27,'Iceland','.is','Europe','Azul','Branca lateral e meio branco','4 Linhas','Não','carro branco  com uma antena longa','não',NULL);
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` tinyint(1) DEFAULT '0',
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jofuturo','$2a$10$qV0sMQs5rQGVQ21vkX9OY.56vZqc6MyK0fZ6HRdN.u8XQ4e9PHBpa','jonathaan','2025-05-27 03:00:00',1,NULL,NULL,'jofuturo123@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 21:22:12
