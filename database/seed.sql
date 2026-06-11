-- Seed data for the blog API
-- Uses ON CONFLICT to safely skip if data already exists

-- Insert sample users
INSERT INTO users (username, email, password) VALUES 
('john_doe', 'john@example.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeGjZ0mPlKd2uNjVaJFQiAwAJO2c0y3oq'), -- password: hashed_password1
('jane_smith', 'jane@example.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeGjZ0mPlKd2uNjVaJFQiAwAJO2c0y3oq'), -- password: hashed_password1
('alice_wonder', 'alice@example.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeGjZ0mPlKd2uNjVaJFQiAwAJO2c0y3oq') -- password: hashed_password1
ON CONFLICT (email) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (title, content, author_id) VALUES 
('First Post', 'This is the content of the first post.', 1),
('Second Post', 'This is the content of the second post.', 2),
('Third Post', 'This is the content of the third post.', 1),
('Fourth Post', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 3)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (content, author_id, post_id) VALUES 
('Great post!', 2, 1),
('Thanks for sharing!', 3, 1),
('I disagree with this point.', 1, 2),
('This is very informative.', 2, 3),
('Can you elaborate on this?', 1, 3)
ON CONFLICT DO NOTHING;

-- Insert sample refresh tokens (optional)
INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES 
('sample_refresh_token_1', 1, NOW() + INTERVAL '30 days'),
('sample_refresh_token_2', 2, NOW() + INTERVAL '30 days')
ON CONFLICT (token) DO NOTHING;