-- Vision AI Database Schema
-- Import this file into phpMyAdmin to create the database structure

CREATE DATABASE IF NOT EXISTS vision_ai_db;
USE vision_ai_db;

-- Videos table - stores all video generation records
CREATE TABLE IF NOT EXISTS videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video_url TEXT,
    thumbnail_url TEXT NULL,
    prompt TEXT NOT NULL,
    duration VARCHAR(10) DEFAULT '4s',
    resolution VARCHAR(10) DEFAULT '720p',
    aspect_ratio VARCHAR(10) DEFAULT '16:9',
    sound BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    model VARCHAR(100) DEFAULT 'veo-3.1-generate-preview',
    cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
    status VARCHAR(20) DEFAULT 'processing',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_language (language),
    INDEX idx_model (model)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usage statistics table (optional - can be calculated from videos table)
CREATE TABLE IF NOT EXISTS usage_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_videos INT DEFAULT 0,
    total_cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial usage stats record
INSERT INTO usage_stats (total_videos, total_cost_usd) VALUES (0, 0.0000)
ON DUPLICATE KEY UPDATE total_videos = 0, total_cost_usd = 0.0000;

