-- ============================================================
-- Recruiter Module – Database Setup
-- Run once in your career_connect database
-- ============================================================

-- 1. Recruiters table
CREATE TABLE IF NOT EXISTS `recruiters` (
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `name`         VARCHAR(100)  NOT NULL,
    `email`        VARCHAR(150)  NOT NULL UNIQUE,
    `password`     VARCHAR(255)  NOT NULL,
    `company_name` VARCHAR(150)  NOT NULL,
    `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Add recruiter_id to jobs (skip if already exists)
ALTER TABLE `jobs`
    ADD COLUMN IF NOT EXISTS `recruiter_id`      INT          NULL AFTER `id`,
    ADD COLUMN IF NOT EXISTS `job_type`          VARCHAR(50)  NOT NULL DEFAULT 'full-time' AFTER `description`,
    ADD COLUMN IF NOT EXISTS `experience_level`  VARCHAR(50)  NOT NULL DEFAULT 'mid'       AFTER `job_type`,
    ADD COLUMN IF NOT EXISTS `description`       TEXT         NULL;

-- 3. Add status column to job_applications (skip if already exists)
ALTER TABLE `job_applications`
    ADD COLUMN IF NOT EXISTS `status` VARCHAR(20) NOT NULL DEFAULT 'pending' AFTER `match_score`;

-- 4. Foreign key (optional – skip if your DB user lacks REFERENCES priv)
-- ALTER TABLE `jobs` ADD CONSTRAINT `fk_jobs_recruiter`
--     FOREIGN KEY (`recruiter_id`) REFERENCES `recruiters`(`id`) ON DELETE SET NULL;
