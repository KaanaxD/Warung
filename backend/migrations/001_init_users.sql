CREATE table ITEM{
    id SERIALL PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    img_address TEXT
};