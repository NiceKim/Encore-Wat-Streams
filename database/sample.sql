-- ============================
-- USERS
-- ============================
INSERT INTO users (name, email, password, user_type)
VALUES 
('Alice Viewer', 'viewer1@example.com', 'hashed_pw1', 'viewer'),
('Theater Group A', 'theater1@example.com', 'hashed_pw2', 'theater'),
('Theater Group B', 'theater2@example.com', 'hashed_pw3', 'theater'),
('Bob Viewer', 'viewer2@example.com', 'hashed_pw4', 'viewer'),
('Carol Viewer', 'viewer3@example.com', 'hashed_pw5', 'viewer');

-- ============================
-- SHOWS
-- ============================
-- Assuming Theater Group A has user_id = 2 and Theater Group B has user_id = 3
INSERT INTO shows (admin_id, title, description, category, price, thumbnail)
VALUES 
(2, 'Phantom of the Opera', 'A classic musical performance.', 'Musical', 45.00, 'phantom.jpg'),
(2, 'Modern Drama Night', 'Contemporary drama performances.', 'Drama', 35.50, 'drama_night.jpg'),
(3, 'Comedy Bash', 'Stand-up comedy show featuring top comedians.', 'Comedy', 25.00, 'comedy_bash.jpg'),
(3, 'Children''s Puppet Show', 'Fun and educational puppet show for kids.', 'Family', 20.00, 'puppets.jpg');

-- ============================
-- PICTURES
-- ============================
-- Assume show_id 1 to 4
INSERT INTO pictures (show_id, image_url)
VALUES 
(1, 'images/phantom1.jpg'),
(1, 'images/phantom2.jpg'),
(2, 'images/drama1.jpg'),
(3, 'images/comedy1.jpg'),
(4, 'images/puppets1.jpg'),
(4, 'images/puppets2.jpg');

-- ============================
-- SCHEDULES
-- ============================
-- Replaces old "streams" section
INSERT INTO schedules (admin_id, show_id, date, venue_info, is_streaming)
VALUES 
(2, 1, '2025-07-01 19:30:00', 'Main Theater Online', 0),
(2, 2, '2025-07-05 20:00:00', 'Drama Channel', 0),
(3, 3, '2025-07-10 21:00:00', 'Comedy Live Room', 1),
(3, 4, '2025-07-15 18:00:00', 'Kids Stream Room', 0);

-- ============================
-- BOOKINGS
-- ============================
-- Assume viewer user_id 1, 4, 5
INSERT INTO bookings (user_id, show_id)
VALUES 
(1, 1),
(1, 2),
(4, 3),
(5, 4),
(5, 1);