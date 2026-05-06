-- MySQL dump 10.13  Distrib 9.5.0, for macos15.4 (arm64)
--
-- Host: renewedhope.cfpryhmlribs.us-east-1.rds.amazonaws.com    Database: hope
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `account_managers`
--

DROP TABLE IF EXISTS `account_managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_managers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `crm_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_pocs`
--

DROP TABLE IF EXISTS `agent_pocs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_pocs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `preferred_contact_method` enum('PHONE_NUMBER','EMAIL') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PHONE_NUMBER',
  `agent_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_7e5f891fc6c70562be83027080` (`agent_id`),
  CONSTRAINT `FK_7e5f891fc6c70562be83027080c` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `referral_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `commission_percentage` int DEFAULT NULL,
  `agent_type` enum('INDIVIDUAL','ORGANISATION') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'INDIVIDUAL',
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rc_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country_of_residence` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `comment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_57ee94c84a8e570e362af59dce` (`user_id`),
  KEY `FK_f2469d311bc65f1b105e6f92869` (`reviewed_by`),
  CONSTRAINT `FK_57ee94c84a8e570e362af59dcea` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_f2469d311bc65f1b105e6f92869` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application_milestones`
--

DROP TABLE IF EXISTS `application_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `application_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `application_milestones_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application_offers`
--

DROP TABLE IF EXISTS `application_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('pending','accepted','declined') NOT NULL,
  `price` decimal(65,0) DEFAULT NULL,
  `charge_percent` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `unique_id` text,
  `property_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4502 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `plan` enum('nhf','rto','contribution','buyoutrightly','help_to_own','mreif') NOT NULL,
  `status` varchar(255) DEFAULT 'on_going',
  `initial_payment` decimal(65,2) NOT NULL DEFAULT '0.00',
  `initial_payment_made` tinyint(1) DEFAULT '0',
  `initial_payment_currency` enum('USD','NGN') DEFAULT 'NGN',
  `offer_accepted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `apartment_ids` longtext NOT NULL,
  `total_price` decimal(65,2) NOT NULL,
  `duration` int DEFAULT NULL,
  `is_finished_property` tinyint(1) NOT NULL DEFAULT '0',
  `property_finished_type` enum('finished','partly_finished') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admMofxQsh`@`%`*/ /*!50003 TRIGGER `update_request_status_after_application_status` AFTER UPDATE ON `applications` FOR EACH ROW BEGIN
    IF NEW.plan = 'buyoutrightly' THEN
      UPDATE requests SET status = NEW.status WHERE reference_id = NEW.id AND type = 'outrightly_bought';
    ELSE
      UPDATE requests SET status = NEW.status WHERE reference_id = NEW.id AND type = NEW.plan;
    END IF;
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `bank_statements`
--

DROP TABLE IF EXISTS `bank_statements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_statements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mortgage_applicant_id` bigint unsigned NOT NULL,
  `document_id` int DEFAULT NULL,
  `statement_ticket_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `statement_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bank_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `service_response` text,
  `statement_pdf_url` varchar(255) DEFAULT NULL,
  `statement_json_blob` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bvn` varchar(255) DEFAULT NULL,
  `statement_request_id` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_phone_number` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `budpay_virtual_accounts`
--

DROP TABLE IF EXISTS `budpay_virtual_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budpay_virtual_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_type` enum('qshelter','fg','kano','lagos') NOT NULL,
  `email` varchar(255) NOT NULL,
  `customer_code` varchar(255) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2599 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `building_apartments`
--

DROP TABLE IF EXISTS `building_apartments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `building_apartments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_id` int DEFAULT NULL,
  `floor` int NOT NULL DEFAULT '0',
  `bedroom_count` int NOT NULL,
  `bathroom_count` int NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(65,2) NOT NULL,
  `sold` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  `pending_price` decimal(65,2) DEFAULT NULL,
  `is_falsly_locked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`),
  CONSTRAINT `building_apartments_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `property_buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11437 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calculator_results`
--

DROP TABLE IF EXISTS `calculator_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calculator_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `property_cost` decimal(65,2) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `net_salary` decimal(65,2) DEFAULT NULL,
  `interest_per_annum` float DEFAULT NULL,
  `equity_percent` float DEFAULT NULL,
  `amortization` int DEFAULT NULL,
  `rsa_balance` decimal(65,2) DEFAULT NULL,
  `equity_from_rsa_percent` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=911 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cancelled_mortgages`
--

DROP TABLE IF EXISTS `cancelled_mortgages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancelled_mortgages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mortgage` text NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commission-withdrawals`
--

DROP TABLE IF EXISTS `commission-withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commission-withdrawals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `agent_id` int DEFAULT NULL,
  `amount` double(20,2) DEFAULT NULL COMMENT 'Commission Withdrawable at Request',
  `status` enum('PAID','PENDING','DECLINED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `comment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `audit_log` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  KEY `FK_5beb739e4e30233b14444c2b9ff` (`agent_id`),
  CONSTRAINT `FK_5beb739e4e30233b14444c2b9ff` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commission-withdrawals_chk_1` CHECK (json_valid(`audit_log`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `referral_id` int DEFAULT NULL,
  `amount` double(20,2) DEFAULT NULL COMMENT 'Commission received',
  `status` enum('PAID','PENDING','DECLINED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `comment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_70c5ec92c1f4eabf79dc214c859` (`referral_id`),
  CONSTRAINT `FK_70c5ec92c1f4eabf79dc214c859` FOREIGN KEY (`referral_id`) REFERENCES `referrals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contributions`
--

DROP TABLE IF EXISTS `contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monthly_payment` decimal(65,2) DEFAULT NULL,
  `total_paid` decimal(65,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(65,2) NOT NULL,
  `duration` int DEFAULT NULL,
  `latest_start_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `application_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `contributions_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13479 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cooperatives`
--

DROP TABLE IF EXISTS `cooperatives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cooperatives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `registration_number` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `last_modified_by` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `developer-director-documents`
--

DROP TABLE IF EXISTS `developer-director-documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developer-director-documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `developer_director_id` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  `decline_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cb8df9b2888e56d1e57327bcfac` (`developer_director_id`),
  KEY `FK_66f35e4db89eb28b41414d279b0` (`reviewed_by`),
  CONSTRAINT `FK_66f35e4db89eb28b41414d279b0` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_cb8df9b2888e56d1e57327bcfac` FOREIGN KEY (`developer_director_id`) REFERENCES `developer_directors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `developer-documents`
--

DROP TABLE IF EXISTS `developer-documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developer-documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `developer_id` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  `decline_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_35630cf8b1949e43139e0b87aaa` (`developer_id`),
  KEY `FK_6346595652f87980bf975deb309` (`reviewed_by`),
  CONSTRAINT `FK_35630cf8b1949e43139e0b87aaa` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_6346595652f87980bf975deb309` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `developer_directors`
--

DROP TABLE IF EXISTS `developer_directors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developer_directors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `home_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `bvn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `developer_id` int NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1aa65f889ccdcaf459d50ebfae4` (`developer_id`),
  CONSTRAINT `FK_1aa65f889ccdcaf459d50ebfae4` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `developer_pocs`
--

DROP TABLE IF EXISTS `developer_pocs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developer_pocs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `business_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `preferred_contact_method` enum('PHONE_NUMBER','EMAIL') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `developerId` int DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_2d0df58a594d420eef13a93460` (`developerId`),
  CONSTRAINT `FK_2d0df58a594d420eef13a93460d` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `developers`
--

DROP TABLE IF EXISTS `developers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `user_id` int DEFAULT NULL,
  `business_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_government_agency` tinyint DEFAULT NULL,
  `is_subsidiary` tinyint DEFAULT NULL,
  `has_audited_accounts` tinyint DEFAULT NULL,
  `has_track_record_in_property_development` tinyint DEFAULT NULL,
  `job_role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_operation` int DEFAULT NULL,
  `mode_of_registration` enum('LIMITED_LIABILITY_COMPANY','BUSINESS_NAME') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rc_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registered_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `operating_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `bank` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_0a5acd93616131ebb033e566c1` (`user_id`),
  CONSTRAINT `FK_0a5acd93616131ebb033e566c16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `failed_login_attempts`
--

DROP TABLE IF EXISTS `failed_login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_login` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106578 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group-entities`
--

DROP TABLE IF EXISTS `group-entities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group-entities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rc_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `developer_id` int DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a586efd7acde9ac082c27ef6be2` (`developer_id`),
  CONSTRAINT `FK_a586efd7acde9ac082c27ef6be2` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inspections`
--

DROP TABLE IF EXISTS `inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `application_id` int NOT NULL,
  `inspection_time` varchar(255) NOT NULL,
  `inspection_date` datetime NOT NULL,
  `inspection_type` enum('physical','virtual','call') NOT NULL,
  `inspection_status` enum('pending','completed','canceled') NOT NULL DEFAULT 'pending',
  `inspection_app` enum('Google Meet','Zoom','Whatsapp') DEFAULT NULL,
  `inspection_link` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `comments` text,
  `industry` text,
  `name` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1047 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keystone_accounts`
--

DROP TABLE IF EXISTS `keystone_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keystone_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_name` text NOT NULL,
  `account_number` text NOT NULL,
  `total_inflow` decimal(60,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_continental_civil` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keystone_configs`
--

DROP TABLE IF EXISTS `keystone_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keystone_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` enum('access_token') NOT NULL,
  `config_value` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_continental_civil` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keystone_transactions`
--

DROP TABLE IF EXISTS `keystone_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keystone_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `ref` text NOT NULL,
  `amount` decimal(60,2) NOT NULL,
  `metadata` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `keystone_transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `keystone_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `licensing_documents`
--

DROP TABLE IF EXISTS `licensing_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licensing_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `decline_reason` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `size` int DEFAULT NULL COMMENT 'In bytes',
  `licensing_info_id` int DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_47a7adacea933d5132f7607c103` (`reviewed_by`),
  KEY `FK_853e20baef5a25ea83413a472c8` (`licensing_info_id`),
  CONSTRAINT `FK_47a7adacea933d5132f7607c103` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_853e20baef5a25ea83413a472c8` FOREIGN KEY (`licensing_info_id`) REFERENCES `licensing_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `licensing_info`
--

DROP TABLE IF EXISTS `licensing_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licensing_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `agent_id` int DEFAULT NULL,
  `regulatory_body` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_10fcb06b6152a2c215356358182` (`agent_id`),
  CONSTRAINT `FK_10fcb06b6152a2c215356358182` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mortgage_applicants`
--

DROP TABLE IF EXISTS `mortgage_applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortgage_applicants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `current_employer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `credit_score_id` int DEFAULT NULL,
  `former_employer` varchar(255) DEFAULT NULL,
  `pfa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `rsa_balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `monthly_net_salary` double DEFAULT NULL,
  `employment_status` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `years_in_business` int DEFAULT NULL,
  `monthly_net_income` double DEFAULT NULL,
  `have_pension` int DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT '0',
  `tin` varchar(100) DEFAULT NULL,
  `tax_clearance` varchar(100) DEFAULT NULL,
  `preferred_lender` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mortgage_applications`
--

DROP TABLE IF EXISTS `mortgage_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortgage_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` bigint unsigned NOT NULL,
  `building_apartment_id` bigint unsigned NOT NULL,
  `document_id` int DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `closing_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `application_data` text NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_joint_mortgage` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `have_pension` int DEFAULT NULL,
  `accepted_offer` int DEFAULT NULL,
  `offer_letter_url` varchar(255) DEFAULT NULL,
  `admin_id` bigint unsigned DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `mortgage_applicant_id` bigint unsigned DEFAULT NULL,
  `application_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mortgage_documents`
--

DROP TABLE IF EXISTS `mortgage_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortgage_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `url` varchar(255) DEFAULT NULL,
  `admin_comment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `admin_comment_by` varchar(255) DEFAULT NULL,
  `documentable_id` int NOT NULL,
  `documentable_type` varchar(255) NOT NULL,
  `reupload_counter` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `mortgage_application_id` (`reference_id`)
) ENGINE=InnoDB AUTO_INCREMENT=825 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mortgage_status_logs`
--

DROP TABLE IF EXISTS `mortgage_status_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortgage_status_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mortgage_application_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `new_mortgage_applicants`
--

DROP TABLE IF EXISTS `new_mortgage_applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `new_mortgage_applicants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `is_principal_applicant` tinyint(1) NOT NULL DEFAULT '1',
  `mortgage_application_id` int NOT NULL,
  `monthly_net_salary` decimal(65,2) DEFAULT NULL,
  `current_employer` text,
  `dob` varchar(255) DEFAULT NULL,
  `pfa` text,
  `preferred_mortgage_bank` text,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bvn` varchar(255) DEFAULT NULL,
  `statement_ticket_id` varchar(255) DEFAULT NULL,
  `statement_request_id` varchar(255) DEFAULT NULL,
  `statement_password` varchar(255) DEFAULT NULL,
  `tin` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mortgage_application_id` (`mortgage_application_id`),
  CONSTRAINT `new_mortgage_applicants_ibfk_1` FOREIGN KEY (`mortgage_application_id`) REFERENCES `new_mortgage_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2494 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `new_mortgage_applications`
--

DROP TABLE IF EXISTS `new_mortgage_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `new_mortgage_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `building_id` int NOT NULL,
  `unit_id` int NOT NULL,
  `application_id` int NOT NULL,
  `is_joint` tinyint(1) NOT NULL DEFAULT '0',
  `type` enum('rto','nhf','contribution','help_to_own') NOT NULL,
  `status` enum('cancelled','provisional_offer_accepted','application_approval','equity_paid','document_sent_to_bank','offer_from_bank','offer_letter_acceptance','disbursement','closed') NOT NULL,
  `user_next_action` text NOT NULL,
  `admin_next_action` text NOT NULL,
  `current_status_turnaround_time` text,
  `current_status_reason` text,
  `property_cost` decimal(65,2) NOT NULL,
  `interest_per_annum` int NOT NULL,
  `rsa_balance` decimal(65,2) NOT NULL DEFAULT '0.00',
  `monthly_payment` decimal(65,2) NOT NULL,
  `equity_percent` int NOT NULL,
  `equity_amount` decimal(65,2) NOT NULL,
  `equity_without_rsa` decimal(65,2) NOT NULL,
  `loan_percent` int NOT NULL,
  `loan_amount` decimal(65,2) NOT NULL,
  `equity_from_rsa_percent` int NOT NULL DEFAULT '0',
  `equity_from_rsa_amount` decimal(65,2) NOT NULL DEFAULT '0.00',
  `duration_in_months` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2403 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admMofxQsh`@`%`*/ /*!50003 TRIGGER `update_application_status_after_mortgage_status` AFTER UPDATE ON `new_mortgage_applications` FOR EACH ROW BEGIN
	UPDATE applications SET status=NEW.status WHERE id=NEW.application_id;
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `new_mortgage_documents`
--

DROP TABLE IF EXISTS `new_mortgage_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `new_mortgage_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text NOT NULL,
  `status` enum('pending','declined','approved') NOT NULL DEFAULT 'pending',
  `url` text NOT NULL,
  `owner_type` enum('application','applicant') NOT NULL,
  `owner_id` int NOT NULL,
  `status_reason` text,
  `last_updated_by` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `new_mortgage_status_logs`
--

DROP TABLE IF EXISTS `new_mortgage_status_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `new_mortgage_status_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mortgage_application_id` int NOT NULL,
  `status` enum('cancelled','provisional_offer_accepted','application_approval','equity_paid','document_sent_to_bank','offer_from_bank','offer_letter_acceptance','disbursement','closed') NOT NULL,
  `activity_status` enum('done','pending','declined') NOT NULL DEFAULT 'pending',
  `reason` text,
  `changed_by` enum('system','buyer','admin') NOT NULL DEFAULT 'system',
  `title` enum('','Provisional offer letter','Mortgage Application Approval','Equity Paid','Documents sent to bank','Offer From Bank','Offer Letter Acceptance','Loan Disbursement','Mortgage Closed') NOT NULL,
  `message` enum('','Your application has been approved by admin','You have successfully paid equity for your mortgage application','Document sent to bank for review','An offer has been received from the mortgage bank','Congrats!, Your loan has been disbursed','The mortgage has been completed.') NOT NULL,
  `user_next_action` text NOT NULL,
  `admin_next_action` text NOT NULL,
  `current_status_turnaround_time` text,
  `done_display` enum('','Accepted','Approved','Paid','Sent','Received','Disbursed','Closed') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `status_updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mortgage_application_id` (`mortgage_application_id`),
  CONSTRAINT `new_mortgage_status_logs_ibfk_1` FOREIGN KEY (`mortgage_application_id`) REFERENCES `new_mortgage_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offer_letter_bulk_upload_jobs`
--

DROP TABLE IF EXISTS `offer_letter_bulk_upload_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_letter_bulk_upload_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `user_id` int NOT NULL,
  `record_count` int NOT NULL,
  `total_records_processed` int NOT NULL DEFAULT '0',
  `total_success` int NOT NULL DEFAULT '0',
  `total_failure` int NOT NULL DEFAULT '0',
  `storage_path` text NOT NULL,
  `status` enum('In Progress','Completed') NOT NULL DEFAULT 'In Progress',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `corp_id` int NOT NULL,
  `account_manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `offer_letter_bulk_upload_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offer_reasons`
--

DROP TABLE IF EXISTS `offer_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_reasons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reason` text,
  `offer_status_at_this_point` enum('pending','accepted','declined') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `offer_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`),
  CONSTRAINT `offer_reasons_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `application_offers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6710 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `payment_type` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `applicant_id` int DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `user_id` bigint unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  KEY `buyer_id` (`applicant_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('verify_bvn','verify_email','verify_phone','reset_password') NOT NULL,
  `destination` enum('email','sms') NOT NULL,
  `token` text NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=250731 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prod_transactions`
--

DROP TABLE IF EXISTS `prod_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref` varchar(255) NOT NULL,
  `amount` decimal(65,2) NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('debit','credit') NOT NULL,
  `status` enum('completed','pending','failed','errored','reversed') NOT NULL,
  `currency` enum('USD','NGN') NOT NULL,
  `provider` enum('budpay','paystack','keystone') DEFAULT NULL,
  `metadata` longtext,
  `wallet_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `mode_of_entry` enum('automatic','manual') NOT NULL DEFAULT 'automatic',
  `evidence_of_payment` text,
  `approved_by` int DEFAULT NULL,
  `entered_by` int DEFAULT NULL,
  `verification_code` text,
  PRIMARY KEY (`id`),
  KEY `wallet_id` (`wallet_id`),
  CONSTRAINT `prod_transactions_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `prod_wallets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prod_wallets`
--

DROP TABLE IF EXISTS `prod_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `currency` enum('USD','NGN') NOT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `balance` decimal(65,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '0',
  `wallet_owner` enum('qshelter','fg','kano','lagos') DEFAULT 'qshelter',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11071 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `poster_id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `units` int NOT NULL,
  `multiple_buildings` tinyint(1) DEFAULT '0',
  `buildings_count` int NOT NULL,
  `model_3d_image` longtext,
  `floor_plan_image` longtext,
  `aerial_image` longtext,
  `property_documents` longtext NOT NULL,
  `title` text NOT NULL,
  `address` text NOT NULL,
  `state` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `price` decimal(65,2) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `project_id` int NOT NULL,
  `finished_status` enum('custom_built','finished','partly_finished') NOT NULL,
  `display_image` longtext NOT NULL,
  `youtube_url` text,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `administrative_fee` int NOT NULL DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  `project_property_id` int NOT NULL,
  `pending_price` decimal(65,2) DEFAULT NULL,
  `about` text,
  `ready_for_purchase` tinyint(1) NOT NULL DEFAULT '1',
  `finished_price` decimal(65,2) DEFAULT NULL,
  `pending_finished_price` decimal(65,2) DEFAULT NULL,
  `owner_type` enum('qshelter','fg','kano') DEFAULT 'qshelter',
  `payment_methods` text,
  `partly_finished_price` decimal(65,2) DEFAULT NULL,
  `pending_partly_finished_price` decimal(65,2) DEFAULT NULL,
  `finished_statuses` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `property_buildings`
--

DROP TABLE IF EXISTS `property_buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int DEFAULT NULL,
  `apartment_count` int NOT NULL,
  `bedroom_count` int NOT NULL,
  `bathroom_count` int NOT NULL,
  `floor_count` int NOT NULL,
  `random_floor_position` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `amenities` longtext,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_buildings_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3584 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `property_milestones`
--

DROP TABLE IF EXISTS `property_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` text NOT NULL,
  `media` longtext NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `property_id` int DEFAULT NULL,
  `youtube_url` text,
  `deleted_at` datetime DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `status_reason` text,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_milestones_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proposed-development-documents`
--

DROP TABLE IF EXISTS `proposed-development-documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposed-development-documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `proposed_development_id` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  `decline_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_971060699becf92c8878049a97a` (`proposed_development_id`),
  KEY `FK_9ea7492528a3c966ed505e19c00` (`reviewed_by`),
  CONSTRAINT `FK_971060699becf92c8878049a97a` FOREIGN KEY (`proposed_development_id`) REFERENCES `proposed_developments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_9ea7492528a3c966ed505e19c00` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=446 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proposed-properties`
--

DROP TABLE IF EXISTS `proposed-properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposed-properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `n_units` int DEFAULT NULL,
  `n_beds` int DEFAULT NULL,
  `target_price` double(20,2) DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `proposed_development_id` int DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9722a17c0e3550e6e36815fb156` (`proposed_development_id`),
  CONSTRAINT `FK_9722a17c0e3550e6e36815fb156` FOREIGN KEY (`proposed_development_id`) REFERENCES `proposed_developments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proposed_developments`
--

DROP TABLE IF EXISTS `proposed_developments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposed_developments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `proposed_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `location_is_marketable` tinyint DEFAULT NULL,
  `has_audited_accounts` tinyint DEFAULT NULL,
  `status` enum('APPROVED','DECLINED','PENDING') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `gdv` double(20,2) DEFAULT NULL COMMENT 'Cross Development Value',
  `developer_id` int DEFAULT NULL,
  `land_has_coc` tinyint DEFAULT NULL COMMENT 'Does the Land have a statutory Certificate of Occupancy (C of O)?',
  `decline_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Reason for declining',
  `developer_has_another_title_at_location` tinyint DEFAULT NULL,
  `total_development_cost` double(20,2) DEFAULT NULL COMMENT 'Total Cost',
  `developer_can_provide_equity` tinyint DEFAULT NULL,
  `equity_is_available_now` tinyint DEFAULT NULL,
  `target_offtakers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `target_offtakers_profiled` tinyint DEFAULT NULL,
  `target_offtakers_profile_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `n_units_presold_or_commited` int DEFAULT NULL,
  `presell_commitment_evidence` enum('DEPOSIT','BINDING_PRESALE_AGREEMENT','COOPERATIVE_MEMBERSHIP','OTHERS') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `design_and_cost_available` tinyint DEFAULT NULL,
  `drawings_are_by_registered_consultants` tinyint DEFAULT NULL,
  `name_on_c_of_o` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registry_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `on_boarding_stages` varchar(2184) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '[{"name":"PRELIMINARY_EVALUATION","completed":false,"completedAt":null},{"name":"PROJECT_INFO_DOCUMENTS","completed":false,"completedAt":null},{"name":"TECHNICAL_DOCUMENTATION","completed":false,"completedAt":null},{"name":"SALES_STRATEGY","completed":false,"completedAt":null},{"name":"PROJECT_VIABILITY","completed":false,"completedAt":null}]',
  `reviewed_by` int DEFAULT NULL,
  `affected_documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` datetime(6) DEFAULT NULL,
  `type` enum('COMPLETED','OFF_PLAN') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4385a60e48af04bb9ff3fe88e2a` (`reviewed_by`),
  KEY `FK_6e9a6529daf5be880e650ab5752` (`developer_id`),
  CONSTRAINT `FK_4385a60e48af04bb9ff3fe88e2a` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_6e9a6529daf5be880e650ab5752` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`),
  CONSTRAINT `proposed_developments_chk_1` CHECK (json_valid(`on_boarding_stages`)),
  CONSTRAINT `proposed_developments_chk_2` CHECK (json_valid(`affected_documents`))
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `referree_id` int NOT NULL,
  `referrer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0d055b5ac31c4578d0a3a75c37` (`referree_id`,`referrer_id`),
  KEY `FK_18af9fcaffac6d6d3b28130e149` (`referrer_id`),
  CONSTRAINT `FK_18af9fcaffac6d6d3b28130e149` FOREIGN KEY (`referrer_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_c0864af6d00b0d3deb477db74b5` FOREIGN KEY (`referree_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `type` enum('developer_application','nhf','rto','contribution','outrightly_bought','price_change','support','services','indication_of_interest','application_form','property_price_change','application_cancellation','property_milestone','construction','renovation','inspection','call','lagos_landing_page','kano_landing_page','ogun_landing_page','abuja_landing_page') NOT NULL,
  `status` varchar(255) NOT NULL,
  `reference_id` varchar(255) NOT NULL,
  `requester_id` varchar(255) NOT NULL,
  `full_desc` longtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `data` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=141806 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rsa_applications`
--

DROP TABLE IF EXISTS `rsa_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsa_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mortgage_application_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rsa_documents`
--

DROP TABLE IF EXISTS `rsa_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsa_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rsa_application_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','declined') DEFAULT 'pending',
  `url` varchar(255) DEFAULT NULL,
  `admin_comment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `admin_comment_at` timestamp NULL DEFAULT NULL,
  `reupload_counter` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `mortgage_application_id` (`rsa_application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saved_mortgage_applications`
--

DROP TABLE IF EXISTS `saved_mortgage_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_mortgage_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `data` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `property_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saved_properties`
--

DROP TABLE IF EXISTS `saved_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref` varchar(255) NOT NULL,
  `amount` decimal(65,2) NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('debit','credit') NOT NULL,
  `status` enum('completed','pending','failed','errored') NOT NULL,
  `currency` enum('USD','NGN') NOT NULL,
  `provider` enum('budpay','paystack') DEFAULT NULL,
  `metadata` longtext,
  `wallet_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wallet_id` (`wallet_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text,
  `avatar` longtext,
  `country` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_first_time_login` tinyint(1) DEFAULT '1',
  `employment_status` enum('employed','self_employed') DEFAULT NULL,
  `monthly_net_salary` varchar(255) DEFAULT NULL,
  `roles` text,
  `phone` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `bvn_verified` tinyint(1) DEFAULT '0',
  `bvn` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `identity_document` varchar(255) DEFAULT NULL,
  `identity_document_verified` tinyint(1) DEFAULT '0',
  `is_nhf_active` tinyint(1) DEFAULT '0',
  `pfa` varchar(255) DEFAULT NULL,
  `rsa` varchar(255) DEFAULT NULL,
  `business_sector` text,
  `years_of_work` int DEFAULT NULL,
  `suspended` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `extra_name` varchar(255) DEFAULT NULL,
  `other_phone_number` varchar(255) DEFAULT NULL,
  `name_of_employer` text,
  `referrer` text,
  `corp_id` int DEFAULT NULL,
  `added_by` int DEFAULT NULL,
  `payment_method` enum('nhf','rto','help_to_own','contribution','buyoutrightly','installment_12','installment_15','installment_18') DEFAULT NULL,
  `address` text,
  `suspension_status_reason` text,
  `account_manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_manager_id` (`account_manager_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`account_manager_id`) REFERENCES `account_managers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134859 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `currency` enum('USD','NGN') NOT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `balance` decimal(65,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `webhook_logs`
--

DROP TABLE IF EXISTS `webhook_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhook_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` enum('budpay','paystack','keystone') NOT NULL,
  `data` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `currency` enum('USD','NGN') NOT NULL,
  `amount` decimal(65,2) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ref` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4878 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'hope'
--
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.44.
--
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.44.
--
/*!50003 DROP PROCEDURE IF EXISTS `get_full_application_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admMofxQsh`@`%` PROCEDURE `get_full_application_data`(IN identity INT)
BEGIN
	
	DECLARE application JSON;
    DECLARE application_offers JSON;
    DECLARE offer_reasons JSON;
    DECLARE application_milestones JSON;
    DECLARE contributions JSON;

	SET application = (SELECT JSON_OBJECT(
		'id', id, 
		'plan', plan, 
		'user_id', user_id,
        'updated_at', updated_at,
        'created_at', created_at,
        'property_id', property_id,
        'status', status,
        'initial_payment', initial_payment,
        'initial_payment_made', initial_payment_made,
        'offer_accepted', offer_accepted,
        'initial_payment_currency', initial_payment_currency,
        'apartment_ids', apartment_ids,
        'total_price', total_price 
	) FROM applications WHERE id = identity);

    
	

    
	SET application_milestones = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id',id,
        'desc', `desc`, 
        'application_id', application_id, 
        'updated_at', updated_at,
        'created_at', created_at
	)) FROM application_milestones where application_id = (JSON_UNQUOTE(JSON_EXTRACT(application, '$.id'))));
	SET contributions = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id',id,
        'monthly_payment', monthly_payment,
        'total_paid', total_paid,
        'balance', balance,
        'duration', duration,
        'latest_start_date', latest_start_date,
        'created_at', created_at,
        'updated_at', updated_at,
        'application_id', application_id
	)) FROM contributions where application_id = (JSON_UNQUOTE(JSON_EXTRACT(application, '$.id'))));
	SET application_offers = (SELECT JSON_OBJECT(
		'id',id,
        'status', status,
        'price', price,
        'charge_percent', charge_percent,
        'property_id', property_id, 
        'updated_at', updated_at,
        'created_at', created_at,
        'unique_id', unique_id
	) FROM application_offers where user_id = (JSON_UNQUOTE(JSON_EXTRACT(application, '$.user_id'))) and property_id = (JSON_UNQUOTE(JSON_EXTRACT(application, '$.property_id'))));
	SET offer_reasons = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id',id,
        'reason', reason,
        'offer_status_at_this_point', offer_status_at_this_point,
        'offer_id', offer_id, 
        'updated_at', updated_at,
        'created_at', created_at
	)) FROM offer_reasons where offer_id = (JSON_UNQUOTE(JSON_EXTRACT(application_offers, '$.id'))));
    

    
    SELECT application, contributions, application_offers, offer_reasons, application_milestones;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.44.
--
/*!50003 DROP PROCEDURE IF EXISTS `get_full_developer_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admMofxQsh`@`%` PROCEDURE `get_full_developer_data`(IN identity INT)
BEGIN
	DECLARE developer JSON;
	DECLARE developer_pocs JSON;
	DECLARE developer_directors JSON;
	DECLARE developer_documents JSON;
	DECLARE group_entities JSON;
	DECLARE developer_director_documents JSON;
	DECLARE proposed_developments JSON;
	DECLARE proposed_development_documents JSON;

	DECLARE directorCount INT;
	DECLARE loopIndex INT DEFAULT 0;
	DECLARE directorIds TEXT DEFAULT "";
	DECLARE director JSON;

	DECLARE developmentCount INT;
	DECLARE developmentLoopIndex INT DEFAULT 0;
	DECLARE developmentIds TEXT DEFAULT "";
	DECLARE development JSON;

	SET developer = (SELECT JSON_OBJECT(
		'id', id,
		'logo', logo,
		'business_name', business_name,
		'is_government_agency', is_government_agency,
		'is_subsidiary', is_subsidiary,
		'has_audited_accounts', has_audited_accounts,
		'has_track_record_in_property_development', has_track_record_in_property_development,
		'job_role', job_role,
		'years_of_operation', years_of_operation,
		'mode_of_registration', mode_of_registration,
		'rc_number', rc_number,
		'registered_address', registered_address,
		'operating_address', operating_address,
		'tin', tin,
		'account_number', account_number,
		'account_name', account_name,
		'operating_address_same_as_registered', operating_address_same_as_registered,
		'user_id', user_id,
		'created_at', created_at,
		'updated_at', updated_at
	) FROM developers WHERE id = identity);

	SET developer_pocs = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id', id,
		'name', name,
		'position', `position`,
		'business_address', business_address,
		'state', state,
		'country', country,
		'phone_number', phone_number,
		'email', email,
		'preferred_contact_method', preferred_contact_method,
		'developerId', developerId
	)) FROM developer_pocs WHERE developerId = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));

	SET developer_directors = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id', id,
		'first_name', first_name,
		'last_name', last_name,
		'home_address', home_address,
		'date_of_birth', date_of_birth,
		'bvn', bvn,
		'phone_number', phone_number,
		'email', email,
		'developer_id', developer_id
	)) FROM developer_directors WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));

	SET directorCount = (SELECT COUNT("id") FROM developer_directors WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));
	
	WHILE loopIndex < directorCount DO
		SET director = JSON_UNQUOTE(JSON_EXTRACT(developer_directors, CONCAT('$[', loopIndex, ']')));
        
		IF loopIndex != directorCount - 1 THEN
			SET directorIds = CONCAT(directorIds, JSON_UNQUOTE(JSON_EXTRACT(director, '$.id')), ',');
		ELSE
			SET directorIds = CONCAT(directorIds, JSON_UNQUOTE(JSON_EXTRACT(director, '$.id')));
		END IF;
        SET loopIndex = loopIndex + 1;
    END WHILE;

	SET developer_documents = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id', id,
		'created_at', created_at,
		'updated_at', updated_at,
		'reviewed_at', reviewed_at,
		'status', status,
		'url', url,
		'description', description,
		'name', name,
		'reviewed_by', reviewed_by,
		'developer_id', developer_id,
		'size', `size`
	)) FROM `developer-documents` WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));

	SET group_entities = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id', id,
		'created_at', created_at,
		'updated_at', updated_at,
		'name', name,
		'rc_number', rc_number,
		'developer_id', developer_id 
	)) FROM `group-entities` WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));

	SET proposed_developments = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		  "id", id,
		  "created_at", created_at,
		  "updated_at", updated_at,
		  "reviewed_at", reviewed_at ,
		  "proposed_location", proposed_location,
		  "location_is_marketable", location_is_marketable,
		  "has_audited_accounts", has_audited_accounts,
		  "status", status,
		  "gdv", gdv,
		  "land_has_coc", land_has_coc,
		  "decline_reason", decline_reason,
		  "developer_has_another_title_at_location", developer_has_another_title_at_location,
		  "total_development_cost", total_development_cost,
		  "developer_can_provide_equity", developer_can_provide_equity,
		  "equity_is_available_now", equity_is_available_now,
		  "target_offtakers", target_offtakers,
		  "target_offtakers_profiled", target_offtakers_profiled,
		  "target_offtakers_profile_info", target_offtakers_profile_info,
		  "n_units_presold_or_commited", n_units_presold_or_commited,
		  "presell_commitment_evidence", presell_commitment_evidence,
		  "design_and_cost_available", design_and_cost_available,
		  "drawings_are_by_registered_consultants", drawings_are_by_registered_consultants,
		  "name_on_c_of_o", name_on_c_of_o,
		  "registry_info", registry_info,
		  "on_boarding_stages", on_boarding_stages,
		  "reviewed_by", reviewed_by ,
		  "developer_id", developer_id
	)) FROM proposed_developments WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));

	SET developmentCount = (SELECT COUNT("id") FROM proposed_developments WHERE developer_id = (JSON_UNQUOTE(JSON_EXTRACT(developer, '$.id'))));
	
	WHILE developmentLoopIndex < developmentCount DO
		SET development = JSON_UNQUOTE(JSON_EXTRACT(proposed_developments, CONCAT('$[', developmentLoopIndex, ']')));
        
		IF developmentLoopIndex != developmentCount - 1 THEN
			SET developmentIds = CONCAT(developmentIds, JSON_UNQUOTE(JSON_EXTRACT(development, '$.id')), ',');
		ELSE
			SET developmentIds = CONCAT(developmentIds, JSON_UNQUOTE(JSON_EXTRACT(development, '$.id')));
		END IF;
        SET developmentLoopIndex = developmentLoopIndex + 1;
    END WHILE;


	SET developer_director_documents = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'id', id,
		'created_at', created_at,
		'updated_at', updated_at,
		'reviewed_at', reviewed_at,
		'status', status,
		'url', url,
		'description', description,
		'name', name,
		'reviewed_by', reviewed_by,
		'size', `size`,
		'developer_director_id', developer_director_id
	)) FROM `developer-director-documents` WHERE developer_director_id IN (directorIds));

	SET proposed_development_documents = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
		"id", id,
		"created_at", created_at,
		"updated_at", updated_at,
		"reviewed_at", reviewed_at,
		"status", status,
		"url", url,
		"description", description,
		"name", name,
		"reviewed_by", reviewed_by,
		'size', `size`,
		"proposed_development_id", proposed_development_id
	)) FROM `proposed-development-documents` WHERE proposed_development_id IN (developmentIds));

	SELECT developer, developer_pocs, developer_directors, developer_documents, group_entities, proposed_developments, proposed_development_documents, developer_director_documents;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.44.
--
/*!50003 DROP PROCEDURE IF EXISTS `get_full_mortgage_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admMofxQsh`@`%` PROCEDURE `get_full_mortgage_data`(IN identity INT)
BEGIN
	DECLARE mortgage_application JSON;
   	DECLARE mortgage_applicant_documents JSON;
   	DECLARE mortgage_application_documents JSON;
   	DECLARE mortgage_applicant JSON;
   	DECLARE mortgage_status_logs JSON;
   	DECLARE bank_statements JSON;
   	DECLARE orders JSON;
   
   SET mortgage_application = (SELECT JSON_OBJECT('id', id,
	  'user_id', user_id,
	  'property_id', property_id,
	  'building_id', building_id,
	  'unit_id', unit_id,
	  'application_id', application_id,
	  'is_joint', is_joint,
	  'type', type,
	  'status', status,
	  'user_next_action', user_next_action,
	  'admin_next_action', admin_next_action,
	  'current_status_turnaround_time', current_status_turnaround_time,
	  'current_status_reason', current_status_reason,
	  'property_cost', property_cost,
	  'interest_per_annum', interest_per_annum,
	  'rsa_balance', rsa_balance,
	  'monthly_payment', monthly_payment,
	  'equity_percent', equity_percent,
	  'equity_amount', equity_amount,
	  'equity_without_rsa', equity_without_rsa,
	  'loan_percent', loan_percent,
	  'loan_amount', loan_amount,
	  'equity_from_rsa_percent', equity_from_rsa_percent,
	  'equity_from_rsa_amount', equity_from_rsa_amount,
	  'duration_in_months', duration_in_months,
	  'created_at', created_at,
	  'updated_at', updated_at,
	  'deleted_at', deleted_at
   ) FROM new_mortgage_applications WHERE application_id = identity AND deleted_at IS NULL);
  
  SET mortgage_status_logs = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
	  'id', id,
	  'mortgage_application_id', mortgage_application_id,
	  'status', status,
	  'activity_status', activity_status,
	  'reason', reason,
	  'changed_by', changed_by,
	  'title', title,
	  'message', message,
	  'user_next_action', user_next_action,
	  'admin_next_action', admin_next_action,
	  'current_status_turnaround_time', current_status_turnaround_time,
	  'done_display', done_display,
	  'created_at', created_at,
	  'updated_at', updated_at,
	  'deleted_at', deleted_at,
	  'status_updated_by', status_updated_by
  )) FROM new_mortgage_status_logs WHERE mortgage_application_id = (JSON_UNQUOTE(JSON_EXTRACT(mortgage_application, '$.id'))) ORDER BY id DESC );
 
 SET mortgage_applicant = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
	  'id', id,
	  'user_id', user_id,
	  'is_principal_applicant', is_principal_applicant,
	  'mortgage_application_id', mortgage_application_id,
	  'monthly_net_salary', monthly_net_salary,
	  'current_employer', current_employer,
	  'dob', dob,
	  'pfa', pfa,
	  'preferred_mortgage_bank', preferred_mortgage_bank,
	  'account_number', account_number,
	  'account_name', account_name,
	  'bank_name', bank_name,
	  'bvn', bvn,
	  'statement_ticket_id', statement_ticket_id,
	  'statement_password', statement_password,
	  'tin', tin,
	  'created_at', created_at,
	  'updated_at', updated_at,
	  'deleted_at', deleted_at,
	  'statement_request_id', statement_request_id
 )) FROM new_mortgage_applicants WHERE mortgage_application_id = (JSON_UNQUOTE(JSON_EXTRACT(mortgage_application, '$.id'))));

SET mortgage_application_documents = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
	  'id', id,
	  'type', type,
	  'status', status,
	  'url', url,
	  'owner_type', owner_type,
	  'owner_id', owner_id,
	  'status_reason', status_reason,
	  'last_updated_by', last_updated_by,
	  'created_at', created_at,
	  'updated_at', updated_at,
	  'deleted_at', deleted_at
)) FROM new_mortgage_documents WHERE owner_type = 'application' && owner_id = (JSON_UNQUOTE(JSON_EXTRACT(mortgage_application, '$.id'))));

	
   SELECT mortgage_application, mortgage_application_documents, mortgage_status_logs, mortgage_applicant;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.44.
--
/*!50003 DROP PROCEDURE IF EXISTS `get_full_rsa_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admMofxQsh`@`%` PROCEDURE `get_full_rsa_data`(IN identity INT)
BEGIN
	DECLARE rsa_application JSON;
   	DECLARE rsa_documents JSON;
   	
   SET rsa_application = (SELECT JSON_OBJECT(
   	'id', id,
   	'mortgage_application_id', mortgage_application_id,
   	'user_id', user_id,
   	'created_at', created_at,
   	'updated_at', updated_at
   ) FROM rsa_applications WHERE id = identity LIMIT 1);
  
  SET rsa_documents = (SELECT JSON_ARRAYAGG(JSON_OBJECT(
	  'id', id,
	  'rsa_application_id', rsa_application_id,
	  'name', name,
	  'type', `type`,
	  'status', status,
	  'url', url,
	  'admin_comment', admin_comment,
	  'created_at', created_at,
	  'updated_at', updated_at,
	  'deleted_at', deleted_at,
	  'approved_by', approved_by,
	  'admin_comment_at', admin_comment_at,
	  'reupload_counter', reupload_counter
  )) FROM rsa_documents WHERE rsa_application_id = (JSON_UNQUOTE(JSON_EXTRACT(rsa_application, '$.id'))) && deleted_at IS NULL);
   
 SELECT rsa_application, rsa_documents;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-06  9:50:25
