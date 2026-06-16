import { describe, beforeEach, it, vi, Mock, expect } from "vitest"
import { pool } from "../config/pg"
import logRepository from "./logs.repository"

vi.mock("../config/pg", () => ({
    pool: { query: vi.fn() }
}))

describe("getAllLogs", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const logs: ItemLog[] = [
            {
                id: 1,
                admin_name: "admin1",
                item_id: 1,
                action: "CREATE",
                old_data: null,
                new_data: { id: 1, nama: "item1", kategori: "cat1", updated_at: "2026-06-13 21:14:15.992557", img_address: "img1.webp" },
                updated_at: "2026-06-13 21:14:15.992557"
            }
        ];
        (pool.query as Mock)
            .mockResolvedValueOnce({ rows: logs })
            .mockResolvedValueOnce({ rows: [{ count: "1" }] })

        const result = await logRepository().getAllLogs()
        expect(pool.query).toHaveBeenNthCalledWith(1, `SELECT * FROM item_log ORDER BY updated_at DESC LIMIT $1 OFFSET $2`, [10, 0])
        expect(pool.query).toHaveBeenNthCalledWith(2, `SELECT COUNT(*) FROM item_log`)
        expect(result.logs).toEqual(logs)
        expect(result.pagination).toEqual({
            page: 1,
            limit: 10,
            totalItem: 1,
            totalPages: 1
        })
    })
})

describe("getLogsById", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const logs: ItemLog[] = [{
            id: 1,
            admin_name: "admin1",
            item_id: 1,
            action: "CREATE",
            old_data: null,
            new_data: null,
            updated_at: "2026-06-13 21:14:15.992557"
        }]
        ;(pool.query as Mock).mockResolvedValue({ rows: logs })
        const result = await logRepository().getLogsById(1)
        expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM item_log WHERE id=$1`, [1])
        expect(result).toEqual(logs)
    })
    it("not found", async () => {
        ;(pool.query as Mock).mockResolvedValue({ rows: [] })
        const result = await logRepository().getLogsById(100)
        expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM item_log WHERE id=$1`, [100])
        expect(result).toBeNull()
    })
})

describe("getLogsByItemId", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const logs: ItemLog[] = [{
            id: 1,
            admin_name: "admin1",
            item_id: 1,
            action: "CREATE",
            old_data: null,
            new_data: null,
            updated_at: "2026-06-13 21:14:15.992557"
        }]
        ;(pool.query as Mock).mockResolvedValue({ rows: logs })
        const result = await logRepository().getLogsByItemId(1)
        expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM item_log WHERE item_id=$1`, [1])
        expect(result).toEqual(logs)
    })
    it("not found", async () => {
        ;(pool.query as Mock).mockResolvedValue({ rows: [] })
        const result = await logRepository().getLogsByItemId(100)
        expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM item_log WHERE item_id=$1`, [100])
        expect(result).toBeNull()
    })
})

describe("insertLogs", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const logs: ItemLog[] = [{
            id: 1,
            admin_name: "admin1",
            item_id: 1,
            action: "CREATE",
            old_data: null,
            new_data: { id: 1, nama: "item1", kategori: "cat1", updated_at: "2026-06-13 21:14:15.992557", img_address: "img1.webp" },
            updated_at: "13-06-2026 21:14:15"
        }]
        ;(pool.query as Mock).mockResolvedValue({ rows: logs })
        const old_data = null
        const new_data = { id: 1, nama: "item1", kategori: "cat1", updated_at: "2026-06-13 21:14:15.992557", img_address: "img1.webp" }
        const result = await logRepository().insertLogs("admin1", 1, "CREATE", old_data, new_data)
        expect(pool.query).toHaveBeenCalledWith(
            `INSERT INTO \n                item_log (admin_name,item_id,action,old_data,new_data,updated_at)\n                VALUES ($1,$2,$3,$4,$5,NOW())\n                RETURNING *,TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`,
            ["admin1", 1, "CREATE", old_data, new_data]
        )
        expect(result).toEqual(logs)
    })
})
