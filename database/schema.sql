-- Create database
CREATE DATABASE IF NOT EXISTS cambodian_theater;
USE cambodian_theater;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('viewer', 'theater') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    show_id INT PRIMARY KEY AUTO_INCREMENT,
    theater_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theater_id) REFERENCES users(user_id)
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    show_id INT,
    date_time DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    price DECIMAL(10,2),
    status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT,
    user_id INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT,
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('pending', 'live', 'ended') DEFAULT 'pending',
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
); 