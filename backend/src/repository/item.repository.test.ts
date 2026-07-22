import { describe, beforeEach, it, vi, Mock, expect } from "vitest"
import { pool } from "../config/pg"
import itemRepository from "./item.repository"

vi.mock("../config/pg", () => ({
    pool: { query: vi.fn() }
}))

describe("getAllQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const items: Item[] = [
            {
                id: 1,
                nama: "budi",
                kategori: "manusia",
                price: 5000,
                updated_at: "2026-06-13 21:14:15.992557",
                img_address: "1231.webp"
            }, {
                id: 2,
                nama: "asep",
                kategori: "manusia",
                price: 10000,
                updated_at: "2026-06-13 21:14:15.992557",
                img_address: "12314.webp"
            }
        ];
        (pool.query as Mock)
            .mockResolvedValueOnce({
                rows: items
            })
            .mockResolvedValueOnce({
                rows: [{ count: "2" }]
            })

        const result = await itemRepository().getAllQuery()
        expect(pool.query).toHaveBeenNthCalledWith(1, `SELECT *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item LIMIT $1 OFFSET $2`, [10, 0])
        expect(pool.query).toHaveBeenNthCalledWith(2, `SELECT COUNT(*) FROM item`)
        expect(result.items).toEqual(items)
        expect(result.pagination).toEqual({
            page: 1,
            limit: 10,
            totalItem: 2,
            totalPages: 1
        })
    })
})

describe("getItemQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const item: Item[] = [{
            id: 0,
            nama: "asep",
            kategori: "manusia",
            price: 5000,
            updated_at: "2026-06-13 21:14:15.992557",
            img_address: "129338.webp"
        }]
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().getItemQuery(0)
        expect(pool.query).toHaveBeenCalledWith(`SELECT *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item WHERE id = $1`, [0])
        expect(result).toEqual(item)
    })
    it("not found", async () => {
        const item: Item[] = []
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().getItemQuery(100)
        expect(pool.query).toHaveBeenCalledWith(`SELECT *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item WHERE id = $1`, [100])
        expect(result).toEqual(item)
    })
})
describe("postItemQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const item: Item[] = [{
            id: 0,
            nama: "asep",
            kategori: "manusia",
            price: 5000,
            updated_at: "2026-06-13 21:14:15.992557",
            img_address: "129338.webp"
        }]
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().postItemQuery("ase", "s", "feaef.webp", 5000)
        expect(pool.query).toHaveBeenCalledWith(`INSERT INTO item (nama,kategori,img_address,price) VALUES ($1,$2,$3,$4) RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`, ["ase", "s", "feaef.webp", 5000])
        expect(result).toEqual(item)

    })
})
describe("putItemQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const item: Item[] = [{
            id: 0,
            nama: "asep",
            kategori: "manusia",
            price: 5000,
            updated_at: "2026-06-13 21:14:15.992557",
            img_address: "129338.webp"
        }]
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().putItemQuery(1, "asep", "129338.webp", "manusia", 5000)
        expect(pool.query).toHaveBeenCalledWith(`UPDATE item SET nama = COALESCE($1,nama), kategori = COALESCE($2,kategori), img_address = COALESCE($3,img_address), updated_at = NOW(), price = COALESCE($4,price) WHERE id = $5 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at;`,
            ["asep", "manusia", "129338.webp", 5000, 1])

        expect(result).toEqual(item)
    })
    it("not found", async () => {
        const item: Item[] = []
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().putItemQuery(1012, "asep", "129338.webp", "manusia", 5000)
        expect(pool.query).toHaveBeenCalledWith(`UPDATE item SET nama = COALESCE($1,nama), kategori = COALESCE($2,kategori), img_address = COALESCE($3,img_address), updated_at = NOW(), price = COALESCE($4,price) WHERE id = $5 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at;`,
            ["asep", "manusia", "129338.webp", 5000, 1012])
        expect(result).toEqual(item)
    })
})
describe("deleteItemQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const item: Item[] = [{
            id: 0,
            nama: "asep",
            kategori: "manusia",
            price: 5000,
            updated_at: "2026-06-13 21:14:15.992557",
            img_address: "129338.webp"
        }]
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().deleteItemQuery(0)
        expect(pool.query).toHaveBeenCalledWith(`DELETE FROM item WHERE id = $1 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`, [0])
        expect(result).toEqual(item)
    })
    it("not found", async () => {
        const item: Item[] = []
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().deleteItemQuery(1012)
        expect(pool.query).toHaveBeenCalledWith(`DELETE FROM item WHERE id = $1 RETURNING *, TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at`, [1012])
        expect(result).toEqual(item)
    })
})
describe("itemUploadQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const item: Item[] = [{
            id: 0,
            nama: "asep",
            kategori: "manusia",
            price: 5000,
            updated_at: "2026-06-13 21:14:15.992557",
            img_address: "129338.webp"
        }]
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().itemUploadQuery(0, "129338.webp")
        expect(pool.query).toHaveBeenCalledWith('UPDATE item SET img_address=$1 WHERE id=$2 RETURNING *', ["129338.webp", 0])
        expect(result).toEqual(item)
    })
    it("not found", async () => {
        const item: Item[] = []
            ; (pool.query as Mock).mockResolvedValue({ rows: item })
        const result = await itemRepository().itemUploadQuery(1012, "129338.webp")
        expect(pool.query).toHaveBeenCalledWith('UPDATE item SET img_address=$1 WHERE id=$2 RETURNING *', ["129338.webp", 1012])
        expect(result).toEqual(item)
    })

})
describe("searchItemQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("success", async () => {
        const items: Item[] = [
            {
                id: 1,
                nama: "roefr",
                kategori: "",
                price: 5000,
                updated_at: "",
                img_address: ""
            }
        ]
            ; (pool.query as Mock).mockResolvedValueOnce({ rows: items })
                .mockResolvedValueOnce({ rows: [{ count: "1" }] })
        const result = await itemRepository().searchItemQuery("s")
        expect(pool.query).toHaveBeenNthCalledWith(1,`SELECT *,TO_CHAR(updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at FROM item WHERE nama ILIKE $1 OR kategori ILIKE $1 LIMIT $2 OFFSET $3`, [`%s%`, 10, 0])
        expect(pool.query).toHaveBeenNthCalledWith(2,`SELECT COUNT(*) FROM item WHERE nama ILIKE $1 OR kategori ILIKE $1`, [`%s%`])
        expect(result.items).toEqual(items)
        expect(result.pagination).toEqual({
            page: 1,
            limit: 10,
            totalItem: 1,
            totalPages: 1
        })

    })
})
