CREATE TABLE
    IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        internal_link VARCHAR(255) UNIQUE NOT NULL,
        external_link VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(255),
        description TEXT,
        tags JSONB,
        pricing VARCHAR(100),
        popularity VARCHAR(50),
        pid INT,
        is_taken BOOLEAN DEFAULT FALSE,
        is_dead BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );