import { Pool } from "pg";

export const pool = new Pool({
    user: "postgres",
    database: "storage",
    password: process.env.DB_PASS,
    port: 5432,
    host: "localhost"
});