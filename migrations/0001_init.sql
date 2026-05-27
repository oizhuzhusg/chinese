CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  secret_hash TEXT,
  email TEXT,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'tester')),
  age INTEGER,
  start_level TEXT NOT NULL DEFAULT 'P4_HCL_BASELINE',
  current_level TEXT NOT NULL DEFAULT 'P4_HCL_BASELINE',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  level_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'ai',
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS reading_sessions (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,
  unknown_rate REAL,
  comprehension_score REAL,
  previous_level TEXT,
  recommended_level TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE IF NOT EXISTS unknown_marks (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  term TEXT NOT NULL,
  start_index INTEGER NOT NULL,
  end_index INTEGER NOT NULL,
  context TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES reading_sessions(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE IF NOT EXISTS vocab_items (
  profile_id TEXT NOT NULL,
  term TEXT NOT NULL,
  pinyin TEXT,
  explanation_zh TEXT,
  explanation_en TEXT,
  example_sentence TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
  hit_count INTEGER NOT NULL DEFAULT 1,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_id, term),
  FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS comprehension_attempts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES reading_sessions(id)
);

CREATE TABLE IF NOT EXISTS level_snapshots (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  unknown_rate REAL NOT NULL,
  comprehension_score REAL NOT NULL,
  marked_terms INTEGER NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (session_id) REFERENCES reading_sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_profile_created ON articles(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_profile_started ON reading_sessions(profile_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_vocab_profile_status ON vocab_items(profile_id, status, updated_at DESC);
