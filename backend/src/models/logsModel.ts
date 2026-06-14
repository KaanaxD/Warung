import { pool } from "../config/pg"

export default function logModel() {
    return {
        getAllLogs: async (page: number = 1, limit: number = 10): Promise<ItemLogPagination> => {
            const offset = (page - 1) * limit
            const data = await pool.query<ItemLog>(`SELECT * FROM item_log ORDER BY updated_at DESC LIMIT $1 OFFSET $2`, [limit, offset])
            const total = await pool.query(`SELECT COUNT(*) FROM item_log`)
            const totalPages = Math.ceil(parseInt(total.rows[0].count) / limit)
            return {
                logs: data.rows,
                pagination: {
                    page: page,
                    limit: limit,
                    totalItem: parseInt(total.rows[0].count),
                    totalPages: totalPages
                }
            }
        },

        getLogsById: async (id: number): Promise<ItemLog[] | null> => {
            const data = await pool.query<ItemLog>(`SELECT * FROM item_log WHERE id=$1`, [id])
            if (data.rows.length == 0) return null
            return data.rows
        },

        getLogsByItemId: async (id: number): Promise<ItemLog[] | null> => {
            const data = await pool.query<ItemLog>(`SELECT * FROM item_log WHERE item_id=$1`, [id])
            if (data.rows.length == 0) return null
            return data.rows
        },

        insertLogs: async (admin: string, item: number, action: string, old_data: Item | null = null, new_data: Item | null = null): Promise<ItemLog[]> => {
            const data = await pool.query<ItemLog>(
                `INSERT INTO 
                item_log (admin_name,item_id,action,old_data,new_data,updated_at)
                VALUES ($1,$2,$3,$4,$5,NOW())
                RETURNING *,TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`,
                [admin, item, action, old_data, new_data]
            )
            return data.rows
        }
    }
}