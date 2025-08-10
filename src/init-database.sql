CREATE TABLE
    IF NOT EXISTS actions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255), -- maps from 'name'
        slug VARCHAR(255), -- maps from 'slug'
        url VARCHAR(255) UNIQUE, -- can map from 'sourceCode.repoUrl'
        image TEXT, -- can store 'iconSvg' or a URL
        description TEXT,
        tags JSONB, -- array from 'tags'
        pid INT,
        is_taken BOOLEAN DEFAULT FALSE,
        is_dead BOOLEAN DEFAULT FALSE,
        -- New fields from API
        is_verified_owner BOOLEAN,
        version VARCHAR(50),
        star VARCHAR(20), -- keep as string since API sends '20.1K'
        contributor VARCHAR(20),
        source_code JSONB, -- store full sourceCode object
        color VARCHAR(20),
        type VARCHAR(50),
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );