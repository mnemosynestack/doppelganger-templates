-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Nullable if we support OAuth later
    email_verified TIMESTAMP WITH TIME ZONE,
    verification_token TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification Tokens (for email verification)
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Presets Table
CREATE TABLE IF NOT EXISTS presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    author_name TEXT NOT NULL, -- Cache username or allowing custom author name
    type TEXT NOT NULL CHECK (type IN ('AGENT', 'SCRAPE')),
    icon TEXT NOT NULL DEFAULT 'extension', -- Material Icon name
    downloads INTEGER DEFAULT 0,
    time_estimate TEXT, -- e.g. "12s"
    time_estimate TEXT, -- e.g. "12s"
    category TEXT,
    configuration JSONB,
    target_url TEXT,
    expected_output TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Preset Downloads
CREATE TABLE IF NOT EXISTS preset_downloads (
    preset_id UUID REFERENCES presets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (preset_id, user_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_presets_type ON presets(type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
