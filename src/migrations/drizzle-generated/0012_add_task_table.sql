CREATE TABLE `task` (
	`id` char(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`department` varchar(100),
	`notes` text,
	`status` varchar(50) NOT NULL,
	`assignToUserId` char(36),
	`createdAtUTC` datetime(3) NOT NULL,
	`createdBy` char(36) NOT NULL,
	`updatedAtUTC` datetime(3) NOT NULL,
	`updatedBy` char(36) NOT NULL,
	CONSTRAINT `task_id` PRIMARY KEY(`id`)
);
