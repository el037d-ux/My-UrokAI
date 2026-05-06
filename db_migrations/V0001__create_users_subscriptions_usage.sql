
CREATE TABLE t_p75689129_landing_chatbot_desi.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p75689129_landing_chatbot_desi.subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p75689129_landing_chatbot_desi.users(id),
  plan TEXT NOT NULL CHECK (plan IN ('free', '7days', '30days')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE t_p75689129_landing_chatbot_desi.usage_counts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p75689129_landing_chatbot_desi.users(id) UNIQUE,
  lessons_used INTEGER DEFAULT 0,
  games_used INTEGER DEFAULT 0,
  analyses_used INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p75689129_landing_chatbot_desi.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p75689129_landing_chatbot_desi.users(id),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);
