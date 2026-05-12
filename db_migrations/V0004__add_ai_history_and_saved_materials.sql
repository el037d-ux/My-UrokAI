
CREATE TABLE IF NOT EXISTS t_p75689129_landing_chatbot_desi.ai_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p75689129_landing_chatbot_desi.users(id),
    type TEXT NOT NULL DEFAULT 'lesson',
    title TEXT NOT NULL,
    prompt TEXT,
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_history_user_id ON t_p75689129_landing_chatbot_desi.ai_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_history_created_at ON t_p75689129_landing_chatbot_desi.ai_history(created_at DESC);

CREATE TABLE IF NOT EXISTS t_p75689129_landing_chatbot_desi.saved_materials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p75689129_landing_chatbot_desi.users(id),
    history_id INTEGER REFERENCES t_p75689129_landing_chatbot_desi.ai_history(id),
    type TEXT NOT NULL DEFAULT 'lesson',
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_materials_user_id ON t_p75689129_landing_chatbot_desi.saved_materials(user_id);
