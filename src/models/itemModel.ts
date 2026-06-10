import { pool } from "../config/pg";

export default function itemModel() {
    return {
        getAllQuery: async (page: number = 1, limit: number = 10): Promise<ItemPagination> => {
            const offset = (page - 1) * limit
            const items = await pool.query<Item>(`SELECT *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item LIMIT $1 OFFSET $2`, [limit, offset])
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

        },
        getItemQuery: async (id: number): Promise<Item[]> => {
            const item = await pool.query(`SELECT *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item WHERE id = $1`, [id])
            return item.rows
        },
        postItemQuery: async (nama: string, kategori: string): Promise<Item[]> => {
            const item = await pool.query<Item>(`INSERT INTO item (nama,kategori) VALUES ($1,$2) RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`, [nama, kategori])
            return item.rows
        },
        putItemQuery: async (
            id: number,
            nama: string | undefined = undefined,
            kategori: string | undefined = undefined
        ): Promise<Item[]> => {
            const item = await pool.query<Item>(
                `UPDATE item SET nama = COALESCE($1,nama), kategori = COALESCE($2,kategori), updated_at = NOW() WHERE id = $3 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at;`,
                [nama, kategori, id]
            )
            return item.rows
        },
        deleteItemQuery: async (id: number): Promise<Item[]> => {
            const item = await pool.query<Item>(`DELETE FROM item WHERE id = $1 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`, [id])
            return item.rows
        },
        itemUpload: async (id:number,img:string):Promise<Item[]> =>{
            const item = await pool.query<Item>('UPDATE item SET img_address=$1 WHERE id=$2 RETURNING *',[img,id])
            return item.rows
        }
    }
}