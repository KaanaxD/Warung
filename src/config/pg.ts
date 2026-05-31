import { Pool } from "pg";

export const pool = new Pool({
    user: "postgres",
    database: "warung",
    password: process.env.DB_PASS,
    port: 5432,
    host: "localhost"
});