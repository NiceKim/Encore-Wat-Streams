-- Create database
DROP DATABASE IF EXISTS encore_wat_streams_database;
CREATE DATABASE IF NOT EXISTS encore_wat_streams_database;
USE encore_wat_streams_database;

-- ========================
-- Shows Table
-- Stores information about theater showsstreams
-- ========================
CREATE TABLE IF NOT EXISTS shows (
    show_id INT PRIMARY KEY AUTO_INCREMENT,              -- Unique ID for each show
    admin_id INT NOT NULL,								 -- Admin ID for the show
    title VARCHAR(100) NOT NULL,                         -- Title of the show
    description LONGTEXT,                                -- Detailed description of the show
    category MEDIUMTEXT,                                 -- Category or genre of the show (e.g., Drama, Comedy)
    price DECIMAL(10,2),                                 -- Ticket price for the show
    thumbnail VARCHAR(255)                               -- URL or path to the show's thumbnail image
);

-- ========================
-- Users Table
-- Stores registered user information
-- ========================
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,              -- Unique ID for each user, auto-increments
    name VARCHAR(45) NOT NULL,                           -- User's full name
    email VARCHAR(45) NOT NULL UNIQUE,                   -- User's email address (must be unique)
    password VARCHAR(255) NOT NULL,                      -- Hashed user password (longer length to support hashes)
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,-- Timestamp when the user registered (defaults to now)
    user_type VARCHAR(45) NOT NULL                       -- Role/type of user (e.g., viewer, theater)
);


-- ========================
-- Schedules Table
-- Combines schedule and stream session info (replaces 'schedules' table)
-- ========================
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,               -- Unique ID for each stream
    admin_id INT NOT NULL,								      -- Admin ID for the show
    show_id INT NOT NULL,                                     -- References the related show
    date DATETIME NOT NULL,                                   -- Scheduled date and time for the stream
    location TEXT,                                          -- Location or platform info
    is_streaming TINYINT,                                     -- Whether the stream is currently live
    FOREIGN KEY (show_id) REFERENCES shows(show_id)           -- Link to the shows table
        ON DELETE CASCADE

    -- OPTIONAL --
    -- start_time TIMESTAMP NULL,                           -- Optional: Actual stream start time
    --     end_time TIMESTAMP NULL,                             -- Optional: Actual stream end time
    --     is_streaming BOOLEAN DEFAULT FALSE                   -- Optional: Whether the stream is currently live
);


-- ========================
-- Bookings Table
-- Stores user bookings for shows
-- ========================
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,           -- Unique booking ID, auto-increments for each new record
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,     -- The date and time when the booking was made (defaults to now)
    user_id INT NOT NULL,                                -- References the user who made the booking
    schedule_id INT NOT NULL,                                -- References the show that was booked
    FOREIGN KEY (user_id) REFERENCES users(user_id)      -- Establishes a foreign key relationship to users table
        ON DELETE CASCADE,                               -- If the user is deleted, delete their bookings too
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)      -- Establishes a foreign key relationship to shows table
        ON DELETE CASCADE                                -- If the show is deleted, delete related bookings
);

-- ========================
-- Pictures Table
-- Stores images associated with each show (one-to-many)
-- ========================
CREATE TABLE IF NOT EXISTS pictures (
    picture_id INT PRIMARY KEY AUTO_INCREMENT,           -- Unique ID for each picture
    show_id INT NOT NULL,                                -- References the related show
    image_url VARCHAR(255) NOT NULL,                     -- URL or file path to the picture
    FOREIGN KEY (show_id) REFERENCES shows(show_id)      -- Establishes foreign key relationship to shows
        ON DELETE CASCADE                                -- Deletes pictures if the related show is deleted

    -- OPTIONAL: Add these fields if you want to store image data
    -- caption VARCHAR(255)                              -- Caption or description of the image
);

