SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `smart-logistic`
--

CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(255) NOT NULL DEFAULT '',
  `data` text,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `provider` varchar(128) DEFAULT '',
  `provider_id` varchar(128) DEFAULT NULL,
  `provider_profile` varchar(128) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `display_name` varchar(64) DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `cover` varchar(512) DEFAULT NULL,
  `birthdate` varchar(32) DEFAULT NULL,
  `sex` tinyint(4) DEFAULT 0 COMMENT '0:none,1:female,2:male',
  `city` varchar(64) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `intro` text,
  `site` varchar(1024) DEFAULT NULL,
  `rc` int(11) DEFAULT '0' COMMENT 'Review count',
  `lc` int(11) DEFAULT '0' COMMENT 'Like count',
  `nc` int(11) DEFAULT '0' COMMENT 'Notice count',
  `role` varchar(32) DEFAULT '',
  `confirm_auth` varchar(256) DEFAULT NULL,
  `subscription_date` DATETIME DEFAULT NULL,
  `capacity` int DEFAULT 50 NOT NULL COMMENT 'Capacity of this portal, minimum is 50 packages',
  `active` tinyint(4) DEFAULT 0 COMMENT '0 = to be activated, 1 = active, 2 = blocked',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `index_email` (`email`),
  KEY `index_provider` (`provider`,`provider_id`),
  KEY `rc` (`rc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `representative` (
  `re_id` int(11) NOT NULL AUTO_INCREMENT,
  `re_firstname` VARCHAR(64) NULL,
  `re_lastname` VARCHAR(64) NULL,
  `re_address` VARCHAR(255) NULL,
  `re_phone` VARCHAR(45) NULL,
  `re_email` VARCHAR(128) NULL,
  `re_code` VARCHAR(255) NULL,
  `re_username` VARCHAR(50) NULL,
  `re_password` VARCHAR(50) NULL,
  `re_blocked_txt` TEXT NULL,
  `re_active` INT NULL COMMENT '0 = to be activated\n1 = active\n2 = blocked',
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`re_id`),
  KEY `uid` (`uid`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `message` text NOT NULL,
  `page` varchar(1024) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `fid` int(11) DEFAULT NULL COMMENT 'from user id',
  `tid` int(11) DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT '0:friend, 1:follow, 2:message, 3:like, 4:comment',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:unread, 1:read, 2:friend approved, 3:friend rejected',
  `note` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_type` (`uid`,`type`),
  KEY `updated` (`updated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_fid` (`uid`,`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `body` text NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_fid` (`uid`,`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `package` (
  `pa_id` BIGINT NOT NULL AUTO_INCREMENT,
  `pa_code` VARCHAR(255) NULL COMMENT 'Security code for receiver\'s authentication',
  `pa_priority` INT NULL,
  `pa_title` VARCHAR(255) NULL,
  `pa_description` VARCHAR(255) NULL,
  `pa_length` DOUBLE(5, 2) DEFAULT 0,
  `pa_high` DOUBLE(5, 2) DEFAULT 0,
  `pa_width` DOUBLE(5, 2) DEFAULT 0,
  `pa_weight` DOUBLE(16, 2) DEFAULT 0,
  `pa_price` DOUBLE(16,2) NULL,
  `pa_type` INT DEFAULT 0 COMMENT 'Type of good',
  `pa_cl_id` INT(11) NOT NULL COMMENT 'Client ID, who is sender',
  `pa_date_purchase` DATETIME NULL,
  `pa_delivered_shelter` DATETIME NULL,
  `pa_delivered_client` DATETIME NULL,
  `pa_status` INT NULL COMMENT '0 = Created\n1 = Active\n2 = Deactivated\n3 = Bought\n',
  PRIMARY KEY (`pa_id`),
  KEY `pa_cl_id` (`pa_cl_id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `provider` varchar(128) DEFAULT '',
  `provider_id` varchar(128) DEFAULT NULL,
  `provider_profile` varchar(128) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `display_name` varchar(64) DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `cover` varchar(512) DEFAULT NULL,
  `birthdate` varchar(32) DEFAULT NULL,
  `sex` tinyint(4) DEFAULT 0 COMMENT '0:none,1:female,2:male',
  `city` varchar(64) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `intro` text,
  `site` varchar(1024) DEFAULT NULL,
  `role` varchar(32) DEFAULT '',
  `confirm_auth` varchar(256) DEFAULT NULL,
  `active` tinyint(4) DEFAULT 0 COMMENT '0 = to be activated, 1 = active, 2 = blocked',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `index_email` (`email`),
  KEY `index_provider` (`provider`,`provider_id`)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
