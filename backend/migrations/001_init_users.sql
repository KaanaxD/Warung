-- Active: 1778991421142@@127.0.0.1@5432@warung
CREATE TABLE item( 
    id SERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT,
    price NUMERIC NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    img_address TEXT,
    UNIQUE(nama,kategori,price)
);

CREATE TABLE item_log(
    id SERIAL PRIMARY KEY,
    admin_name TEXT,
    item_id INT  ,
    action VARCHAR(50),
    old_data JSONB,
    new_data JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE item_log;
DROP TABLE item;