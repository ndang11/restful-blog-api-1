-- Teardown script to drop all tables
-- Use with caution: this will delete all data!

-- Drop tables in reverse order of creation (due to foreign keys)
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
