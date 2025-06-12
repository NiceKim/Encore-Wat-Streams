-- ============================
-- USERS
-- ============================
INSERT INTO users (name, email, password, user_type)
VALUES 
('Alice Viewer', 'viewer1@example.com', '$2a$10$XIwSL5UFGLzG7mYGwz46R.26JIwmrQY1fgp88EI.78/.tqlGcSPWa', 'USER'),
('Theater Group A', 'theater1@example.com', '$2a$10$XIwSL5UFGLzG7mYGwz46R.26JIwmrQY1fgp88EI.78/.tqlGcSPWa', 'ADMIN'),
('Theater Group B', 'theater2@example.com', '$2a$10$XIwSL5UFGLzG7mYGwz46R.26JIwmrQY1fgp88EI.78/.tqlGcSPWa', 'ADMIN'),
('Bob Viewer', 'viewer2@example.com', '$2a$10$XIwSL5UFGLzG7mYGwz46R.26JIwmrQY1fgp88EI.78/.tqlGcSPWa', 'USER'),
('Carol Viewer', 'viewer3@example.com', '$2a$10$XIwSL5UFGLzG7mYGwz46R.26JIwmrQY1fgp88EI.78/.tqlGcSPWa', 'USER');

-- ============================
-- SHOWS
-- ============================
-- Assuming Theater Group A has user_id = 2 and Theater Group B has user_id = 3
INSERT INTO shows (admin_id, title, description, category, price, thumbnail)
VALUES 
(2, 'Phantom of the Opera', 'A classic musical performance.', 'Musical', 45.00, 'p1.jpg'),
(2, 'Modern Drama Night', 'Contemporary drama performances.', 'Drama', 35.50, 'p2.jpg'),
(3, 'Comedy Bash', 'Stand-up comedy show featuring top comedians.', 'Comedy', 25.00, 'p3.jpg'),
(3, 'Children''s Puppet Show', 'Fun and educational puppet show for kids.', 'Family', 20.00, 'p4.jpg');
(3, 'Magic Balloon Fiesta', 'Colorful balloon tricks and magic for all ages.', 'Family', 18.00, 'p5.jpg');

-- ============================
-- PICTURES
-- ============================
-- Assume show_id 1 to 4
INSERT INTO pictures (show_id, image_url)
VALUES 
(1, 'p1.jpg'),
(1, 'Reamker.avif'),
(1, 'Kantreum.avif'),
(1, 'Lakhon bassac.jpg'),
(2, 'p2.jpg'),
(2, 'Robam Tep Apsara.jpg'),
(3, 'p3.jpg'),
(3, 'Sbek Touch.avif'),
(4, 'p4.jpg'),
(4, 'p5.jpg'),
(4, 'Robam Tep Apsara.jpg'),
(4, 'The Apsara Dance.avif');

-- ============================
-- SCHEDULES
-- ============================
-- Replaces old "streams" section
INSERT INTO schedules (admin_id, show_id, date, location, is_streaming)
VALUES 
(2, 1, '2025-06-01 19:30:00', 'Main Theater Online', 0),
(2, 1, '2025-06-08 20:00:00', 'Main Theater Online', 0),
(2, 1, '2025-06-15 19:00:00', 'Main Theater Online', 0),
(2, 1, '2025-06-22 20:30:00', 'Main Theater Online', 0),
(2, 2, '2025-06-05 20:00:00', 'Drama Channel', 0),
(2, 2, '2025-06-13 20:00:00', 'Drama Channel', 1),
(2, 2, '2025-06-19 20:00:00', 'Drama Channel', 0),
(2, 2, '2025-06-26 20:00:00', 'Drama Channel', 0),
(3, 3, '2025-06-03 21:00:00', 'Comedy Live Room', 0),
(3, 3, '2025-06-10 21:00:00', 'Comedy Live Room', 0),
(3, 3, '2025-06-17 21:00:00', 'Comedy Live Room', 0),
(3, 3, '2025-06-24 21:00:00', 'Comedy Live Room', 0),
(3, 4, '2025-06-02 18:00:00', 'Kids Stream Room', 0),
(3, 4, '2025-06-03 18:00:00', 'Kids Stream Room', 1),
(3, 4, '2025-06-16 18:00:00', 'Kids Stream Room', 0),
(3, 4, '2025-06-23 18:00:00', 'Kids Stream Room', 0);

-- ============================
-- BOOKINGS
-- ============================
-- Assume viewer user_id 1, 4, 5
INSERT INTO bookings (user_id, schedule_id)
VALUES 
(1, 1),
(1, 2),
(4, 3),
(5, 4),
(5, 1);