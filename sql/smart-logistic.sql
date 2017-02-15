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

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(32) DEFAULT '' COMMENT '<empty>=user|portal|driver|surveyor',
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `provider` varchar(128) DEFAULT '',
  `provider_id` varchar(128) DEFAULT NULL,
  `provider_profile` varchar(128) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `display_name` varchar(64) DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `birthdate` varchar(32) DEFAULT NULL,
  `sex` tinyint(4) DEFAULT 0 COMMENT '0:none, 1:female, 2:male',
  `city` varchar(64) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `intro` text,
  `website` varchar(1024) DEFAULT NULL,
  `nc` int(11) DEFAULT 0 COMMENT 'Notice count',
  `confirm_auth` varchar(256) DEFAULT NULL,
  `capacity` int(11) DEFAULT 50 NOT NULL COMMENT 'portal capacity, minimum is 50 packages',
  `status` tinyint(4) DEFAULT 0 COMMENT '0:pending, 1:active, 2:blocked, 99:canceled',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `provider` (`provider`,`provider_id`),
  KEY `status` (`status`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `receiver`;
CREATE TABLE IF NOT EXISTS `receiver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT 'Sender ID',
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `state` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sid` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `package`;
CREATE TABLE IF NOT EXISTS `package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT 'Sender ID',
  `rid` int(11) NOT NULL COMMENT 'Receiver ID',
  `code` VARCHAR(255) NULL COMMENT 'Security code for receiver authentication',
  `priority` tinyint(4) DEFAULT 0,
  `type` tinyint(4) DEFAULT 0 COMMENT 'Type of good',
  `title` VARCHAR(255) NOT NULL,
  `description` text,
  `price` int(11) DEFAULT 0 COMMENT 'VND',
  `size` tinyint(4) DEFAULT 1 COMMENT 'TODO: detail sizes are defined in another table',
  `weight` int(11) DEFAULT 0 COMMENT 'grams',
  `status` tinyint(4) DEFAULT 0 COMMENT 'TODO: design state machine',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sid` (`sid`),
  KEY `rid` (`rid`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `message` text NOT NULL,
  `page` varchar(1024) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `fid` int(11) DEFAULT NULL COMMENT 'from user id',
  `tid` int(11) DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT '0:friend, 1:follow, 2:message, 3:like, 4:comment',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0:unread, 1:read, 2:friend approved, 3:friend rejected',
  `note` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_type` (`uid`,`type`),
  KEY `updated` (`updated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_fid` (`uid`,`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `body` text NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid_fid` (`uid`,`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

<<<<<<< HEAD
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

CREATE TABLE IF NOT EXISTS `sending_package` (
  `se_id` BIGINT NOT NULL AUTO_INCREMENT,
  `se_code` DOUBLE(16,2) NULL,
  `se_date` DATETIME NULL,
  `se_typeofpayment` INT NULL COMMENT '1 = paypal, 2 = cash, 3 = credit card',
  `se_status` INT NULL COMMENT '0 = new package, 1 = waiting for return, ...',
  `se_it_id` BIGINT NOT NULL COMMENT 'ID of package',
  `se_re_id` INT(11) NOT NULL COMMENT 'ID of representative, who is belonged to portal',
  `se_de_id` INT(11) NULL COMMENT 'ID of deliver man',
  PRIMARY KEY (`se_id`),
  KEY `se_it_id` (`se_it_id`),
  KEY `se_re_id` (`se_re_id`),
  KEY `se_de_id` (`se_de_id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8;

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
=======
>>>>>>> 762b854e1b98d3a8e255879ecd076df1d9b3c93e

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
