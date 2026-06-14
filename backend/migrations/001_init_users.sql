CREATE TABLE item( 
    id SERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    img_address TEXT
);

CREATE TABLE item_log(
    id SERIAL PRIMARY KEY,
    admin_name TEXT,
    item_id INT,
    action VARCHAR(50),
    old_data JSONB,
    new_data JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

