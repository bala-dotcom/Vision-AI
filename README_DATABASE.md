# Database Integration Guide

## Overview

The Vision AI application now uses MySQL database to store all video generation history and usage statistics. This replaces the previous localStorage-based storage.

## Database Schema

### Tables

#### `videos`
Stores all video generation records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PRIMARY KEY AUTO_INCREMENT | Unique video ID |
| `video_url` | TEXT | URL to the generated video |
| `thumbnail_url` | TEXT NULL | URL to video thumbnail |
| `prompt` | TEXT NOT NULL | User's prompt text |
| `duration` | VARCHAR(10) | Video duration (e.g., '4s', '8s') |
| `resolution` | VARCHAR(10) | Video resolution (e.g., '720p', '1080p', '4k') |
| `aspect_ratio` | VARCHAR(10) | Aspect ratio (e.g., '16:9', '9:16') |
| `sound` | BOOLEAN | Whether audio is enabled |
| `language` | VARCHAR(10) | Language code (e.g., 'en', 'ta', 'hi') |
| `model` | VARCHAR(100) | AI model used (e.g., 'veo-3.1-generate-preview') |
| `cost_usd` | DECIMAL(10, 4) | Cost in USD |
| `status` | VARCHAR(20) | Status: 'processing', 'completed', 'error' |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

#### `usage_stats`
Stores aggregated usage statistics (optional, can be calculated from videos table).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PRIMARY KEY AUTO_INCREMENT | Unique stat ID |
| `total_videos` | INT | Total number of videos |
| `total_cost_usd` | DECIMAL(10, 4) | Total cost in USD |
| `last_updated` | DATETIME | Last update timestamp |

## API Endpoints

### Videos

- `GET /api/videos` - Get all videos (with optional `?date=all|today|yesterday|YYYY-MM-DD` filter)
- `POST /api/videos` - Create new video record
- `PUT /api/videos/:id` - Update video record

### Usage Statistics

- `GET /api/usage/stats` - Get usage statistics (with optional `?date=...` filter)
- `GET /api/usage/session-cost` - Get total session cost

## Migration from localStorage

The application automatically falls back to localStorage if the database is unavailable. To migrate existing localStorage data:

1. Export localStorage data (if needed)
2. Ensure database is set up and connected
3. The application will use the database for all new records
4. Old localStorage data will remain as fallback

## Database Setup

See `DEPLOYMENT.md` for detailed database setup instructions.

## Testing Database Connection

The backend automatically tests the database connection on startup. Check the console logs for:

- ✅ Database connection successful
- ✅ Database tables initialized

If you see errors, verify:
- MySQL is running
- Database credentials are correct
- Database exists
- User has proper permissions

