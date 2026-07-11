-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users,
    email TEXT UNIQUE NOT NULL,
    city_name TEXT,
    streak_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ARTICLES
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    tags TEXT[] DEFAULT '{}', -- e.g., ['politics', 'nsc', 'breaking']
    is_breaking BOOLEAN DEFAULT FALSE,
    content_hash TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER PREFERENCES (Weights)
CREATE TABLE user_preferences (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    weight REAL DEFAULT 1.0, -- -1.0 (mute) to 5.0 (favorite)
    PRIMARY KEY (user_id, tag_name)
);

-- INTERACTIONS
CREATE TABLE user_interactions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    is_saved BOOLEAN DEFAULT FALSE,
    interacted_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);
