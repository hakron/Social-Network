
-- DROP TABLE comments;
DROP TABLE friends;
-- DROP TABLE users;
CREATE TABLE friends(
  id SERIAL PRIMARY KEY,
  recipient_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   first_name VARCHAR(300) NOT NULL,
--   last_name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) UNIQUE,
--   hashpassword TEXT,
--   img_url VARCHAR(255),
--   info VARCHAR(255),
--   status VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE comments(
--   id SERIAL PRIMARY KEY,
--   commented_id INTEGER NOT NULL,
--   user_id INTEGER NOT NULL REFERENCES users(id),
--   comments TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
