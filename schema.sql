DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- The blog post content (markdown or HTML)
  excerpt TEXT,
  cover_image_url TEXT, -- The R2 storage object URL for the cover image
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS uploaded_cvs;
CREATE TABLE uploaded_cvs (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  file_url TEXT, -- The R2 storage object URL for the uploaded PDF
  extracted_data_json TEXT, -- JSON representation of parsed CV
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user', -- 'admin' for CMS access
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
