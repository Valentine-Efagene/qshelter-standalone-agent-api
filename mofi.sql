-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 17, 2024 at 12:21 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mofi`
--

-- --------------------------------------------------------

--
-- Table structure for table `developer-director-documents`
--

CREATE TABLE `developer-director-documents` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') NOT NULL DEFAULT 'PENDING',
  `decline_reason` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` int(11) NOT NULL COMMENT 'In bytes',
  `developer_director_id` int(11) NOT NULL,
  `reviewed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `developer-documents`
--

CREATE TABLE `developer-documents` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') NOT NULL DEFAULT 'PENDING',
  `decline_reason` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` int(11) NOT NULL COMMENT 'In bytes',
  `developer_id` int(11) NOT NULL,
  `reviewed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `developers`
--

CREATE TABLE `developers` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `is_government_agency` tinyint(4) DEFAULT NULL,
  `is_subsidiary` tinyint(4) DEFAULT NULL,
  `has_audited_accounts` tinyint(4) DEFAULT NULL,
  `has_track_record_in_property_development` tinyint(4) DEFAULT NULL,
  `job_role` varchar(255) DEFAULT NULL,
  `years_of_operation` int(11) DEFAULT NULL,
  `mode_of_registration` enum('LIMITED_LIABILITY_COMPANY','BUSINESS_NAME') DEFAULT NULL,
  `rc_number` varchar(255) DEFAULT NULL,
  `registered_address` varchar(255) DEFAULT NULL,
  `operating_address` varchar(255) DEFAULT NULL,
  `tin` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `developerPocsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `developer_directors`
--

CREATE TABLE `developer_directors` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `home_address` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `bvn` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `developer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `developer_pocs`
--

CREATE TABLE `developer_pocs` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `business_address` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `preferred_contact_method` enum('PHONE_NUMBER','EMAIL') NOT NULL,
  `developer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group-entities`
--

CREATE TABLE `group-entities` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rc_number` varchar(255) DEFAULT NULL,
  `developer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `project_property_id` int(11) NOT NULL,
  `status` enum('approved','declined','pending') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposed-development-documents`
--

CREATE TABLE `proposed-development-documents` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `status` enum('APPROVED','PENDING','DECLINED') NOT NULL DEFAULT 'PENDING',
  `decline_reason` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` int(11) NOT NULL COMMENT 'In bytes',
  `proposed_development_id` int(11) NOT NULL,
  `reviewed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposed-properties`
--

CREATE TABLE `proposed-properties` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `n_units` int(11) DEFAULT NULL,
  `n_beds` int(11) DEFAULT NULL,
  `target_price` double(20,2) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `proposed_development_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposed_developments`
--

CREATE TABLE `proposed_developments` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `type` enum('COMPLETED','OFF_PLAN') DEFAULT NULL,
  `category` enum('A','B','C') DEFAULT NULL,
  `proposed_location` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `location_is_marketable` tinyint(4) DEFAULT NULL,
  `is_completed` tinyint(4) NOT NULL DEFAULT 0,
  `has_audited_accounts` tinyint(4) DEFAULT NULL,
  `status` enum('APPROVED','DECLINED','PENDING') NOT NULL DEFAULT 'PENDING',
  `gdv` double(20,2) DEFAULT NULL COMMENT 'Gross Development Value',
  `developer_id` int(11) DEFAULT NULL,
  `land_has_coc` tinyint(4) DEFAULT NULL COMMENT 'Does the Land have a statutory Certificate of Occupancy (C of O)?',
  `decline_reason` varchar(255) DEFAULT NULL COMMENT 'Reason for declining',
  `developer_has_another_title_at_location` tinyint(4) DEFAULT NULL,
  `total_development_cost` double(20,2) DEFAULT NULL COMMENT 'Total Cost',
  `developer_can_provide_equity` tinyint(4) DEFAULT NULL,
  `equity_is_available_now` tinyint(4) DEFAULT NULL,
  `target_offtakers` text DEFAULT NULL,
  `target_offtakers_profiled` tinyint(4) DEFAULT NULL,
  `target_offtakers_profile_info` text DEFAULT NULL,
  `n_units_presold_or_commited` int(11) DEFAULT NULL,
  `presell_commitment_evidence` enum('DEPOSIT','BINDING_PRESALE_AGREEMENT','COOPERATIVE_MEMBERSHIP','OTHERS') DEFAULT NULL,
  `design_and_cost_available` tinyint(4) DEFAULT NULL,
  `drawings_are_by_registered_consultants` tinyint(4) DEFAULT NULL,
  `name_on_c_of_o` varchar(255) DEFAULT NULL,
  `registry_info` text DEFAULT NULL,
  `on_boarding_stages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[{"name":"PRELIMINARY_EVALUATION","completed":false,"completedAt":null},{"name":"PROJECT_INFO_DOCUMENTS","completed":false,"completedAt":null},{"name":"TECHNICAL_DOCUMENTATION","completed":false,"completedAt":null},{"name":"SALES_STRATEGY","completed":false,"completedAt":null},{"name":"PROJECT_VIABILITY","completed":false,"completedAt":null}]' CHECK (json_valid(`on_boarding_stages`)),
  `reviewed_by` int(11) DEFAULT NULL,
  `affected_documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`affected_documents`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(4) NOT NULL DEFAULT 0,
  `bvn` varchar(255) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` timestamp NULL DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `is_first_time_login` tinyint(4) NOT NULL DEFAULT 0,
  `bvn_verified` tinyint(4) NOT NULL DEFAULT 0,
  `identity_document` text DEFAULT NULL,
  `identity_document_verified` tinyint(4) NOT NULL DEFAULT 0,
  `employment_status` varchar(255) DEFAULT NULL,
  `monthly_net_salary` double(20,2) DEFAULT NULL,
  `is_nhf_active` tinyint(4) NOT NULL DEFAULT 0,
  `pfa` varchar(255) DEFAULT NULL,
  `rsa` varchar(255) DEFAULT NULL,
  `roles` text NOT NULL,
  `business_sector` varchar(255) DEFAULT NULL,
  `years_of_work` int(11) DEFAULT NULL,
  `suspended` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `developer-director-documents`
--
ALTER TABLE `developer-director-documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_cb8df9b2888e56d1e57327bcfac` (`developer_director_id`),
  ADD KEY `FK_66f35e4db89eb28b41414d279b0` (`reviewed_by`);

--
-- Indexes for table `developer-documents`
--
ALTER TABLE `developer-documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_35630cf8b1949e43139e0b87aaa` (`developer_id`),
  ADD KEY `FK_6346595652f87980bf975deb309` (`reviewed_by`);

--
-- Indexes for table `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_0a5acd93616131ebb033e566c1` (`user_id`),
  ADD KEY `FK_4dcaca79e4edf49c7ece5af73a3` (`developerPocsId`);

--
-- Indexes for table `developer_directors`
--
ALTER TABLE `developer_directors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1aa65f889ccdcaf459d50ebfae4` (`developer_id`);

--
-- Indexes for table `developer_pocs`
--
ALTER TABLE `developer_pocs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_75b098a35cb0880409f16ce23cc` (`developer_id`);

--
-- Indexes for table `group-entities`
--
ALTER TABLE `group-entities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a586efd7acde9ac082c27ef6be2` (`developer_id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_f656ab8677cff4119727c1b1b6` (`project_property_id`);

--
-- Indexes for table `proposed-development-documents`
--
ALTER TABLE `proposed-development-documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_971060699becf92c8878049a97a` (`proposed_development_id`),
  ADD KEY `FK_9ea7492528a3c966ed505e19c00` (`reviewed_by`);

--
-- Indexes for table `proposed-properties`
--
ALTER TABLE `proposed-properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9722a17c0e3550e6e36815fb156` (`proposed_development_id`);

--
-- Indexes for table `proposed_developments`
--
ALTER TABLE `proposed_developments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4385a60e48af04bb9ff3fe88e2a` (`reviewed_by`),
  ADD KEY `FK_6e9a6529daf5be880e650ab5752` (`developer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `developer-director-documents`
--
ALTER TABLE `developer-director-documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `developer-documents`
--
ALTER TABLE `developer-documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `developers`
--
ALTER TABLE `developers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `developer_directors`
--
ALTER TABLE `developer_directors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `developer_pocs`
--
ALTER TABLE `developer_pocs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `group-entities`
--
ALTER TABLE `group-entities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proposed-development-documents`
--
ALTER TABLE `proposed-development-documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proposed-properties`
--
ALTER TABLE `proposed-properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proposed_developments`
--
ALTER TABLE `proposed_developments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `developer-director-documents`
--
ALTER TABLE `developer-director-documents`
  ADD CONSTRAINT `FK_66f35e4db89eb28b41414d279b0` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_cb8df9b2888e56d1e57327bcfac` FOREIGN KEY (`developer_director_id`) REFERENCES `developer_directors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `developer-documents`
--
ALTER TABLE `developer-documents`
  ADD CONSTRAINT `FK_35630cf8b1949e43139e0b87aaa` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_6346595652f87980bf975deb309` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `developers`
--
ALTER TABLE `developers`
  ADD CONSTRAINT `FK_0a5acd93616131ebb033e566c16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_4dcaca79e4edf49c7ece5af73a3` FOREIGN KEY (`developerPocsId`) REFERENCES `developer_pocs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `developer_directors`
--
ALTER TABLE `developer_directors`
  ADD CONSTRAINT `FK_1aa65f889ccdcaf459d50ebfae4` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `developer_pocs`
--
ALTER TABLE `developer_pocs`
  ADD CONSTRAINT `FK_75b098a35cb0880409f16ce23cc` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `group-entities`
--
ALTER TABLE `group-entities`
  ADD CONSTRAINT `FK_a586efd7acde9ac082c27ef6be2` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `FK_f656ab8677cff4119727c1b1b66` FOREIGN KEY (`project_property_id`) REFERENCES `proposed-properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `proposed-development-documents`
--
ALTER TABLE `proposed-development-documents`
  ADD CONSTRAINT `FK_971060699becf92c8878049a97a` FOREIGN KEY (`proposed_development_id`) REFERENCES `proposed_developments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_9ea7492528a3c966ed505e19c00` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `proposed-properties`
--
ALTER TABLE `proposed-properties`
  ADD CONSTRAINT `FK_9722a17c0e3550e6e36815fb156` FOREIGN KEY (`proposed_development_id`) REFERENCES `proposed_developments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `proposed_developments`
--
ALTER TABLE `proposed_developments`
  ADD CONSTRAINT `FK_4385a60e48af04bb9ff3fe88e2a` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_6e9a6529daf5be880e650ab5752` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
