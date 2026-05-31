import { pool } from "../config/pg";

export async function getAllQuery(page: number = 1, limit: number = 10): Promise<ItemPagination> {
    const offset = (page - 1) * limit
    const items = await pool.query<Item>(`SELECT * FROM item LIMIT $1 OFFSET $2`, [limit, offset])
    const total = await pool.query(`SELECT COUNT(*) FROM item`)
    const totalPages = Math.ceil(parseInt(total.rows[0].count) / limit)
    return {
        items: items.rows,
        pagination: {
            page: page,
            limit: limit,
            totalItem: parseInt(total.rows[0].count),
            totalPages: totalPages
        }
    }
}

export async function getItemQuery(id: number): Promise<Item[]> {
    const item = await pool.query(`SELECT * FROM item WHERE id = $1`, [id])
    return item.rows
}

export async function postItemQuery(nama: string, kategori: string): Promise<Item[]> {
    const item = await pool.query<Item>(`INSERT INTO item (nama,kategori) VALUES ($1,$2) RETURNING *`, [nama, kategori])
    return item.rows
}
export async function putItemQuery(id: number, nama: string | undefined = undefined, kategori: string | undefined = undefined): Promise<Item[]> {
    const item = await pool.query<Item>(
        `UPDATE item SET nama = COALESCE($1,nama), kategori = COALESCE($2,kategori), updated_at = NOW() WHERE id = $3 RETURNING *;`,
        [nama, kategori, id]
    )
    return item.rows
}

export async function deleteItemQuery(id: number): Promise<Item[]> {
    const item = await pool.query<Item>(`DELETE FROM item WHERE id = $1 RETURNING *`, [id])
    return item.rows
}