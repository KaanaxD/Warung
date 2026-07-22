import { describe, beforeEach, it, vi, Mock, expect } from "vitest"
import fs from "fs-extra"
import itemService from "./item.service"

vi.mock("../repository/item.repository", () => ({
    default: vi.fn()
}))

vi.mock("../repository/logs.repository", () => ({
    default: vi.fn()
}))

vi.mock("fs-extra", () => ({
    default: { removeSync: vi.fn() }
}))

import itemRepository from "../repository/item.repository"
import logRepository from "../repository/logs.repository"

const mockGetAllQuery = vi.fn()
const mockGetItemQuery = vi.fn()
const mockPostItemQuery = vi.fn()
const mockPutItemQuery = vi.fn()
const mockDeleteItemQuery = vi.fn()
const mockItemUploadQuery = vi.fn()
const mockSearchItemQuery = vi.fn()

const mockInsertLogs = vi.fn()

function mockRepo() {
    ;(itemRepository as Mock).mockReturnValue({
        getAllQuery: mockGetAllQuery,
        getItemQuery: mockGetItemQuery,
        postItemQuery: mockPostItemQuery,
        putItemQuery: mockPutItemQuery,
        deleteItemQuery: mockDeleteItemQuery,
        itemUploadQuery: mockItemUploadQuery,
        searchItemQuery: mockSearchItemQuery,
    })
    ;(logRepository as Mock).mockReturnValue({
        insertLogs: mockInsertLogs,
    })
}

describe("itemService", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRepo()
    })

    describe("getAllItem", () => {
        it("returns paginated items", async () => {
            const expected = { items: [], pagination: { page: 1, limit: 10, totalItem: 0, totalPages: 0 } }
            mockGetAllQuery.mockResolvedValue(expected)

            const result = await (await itemService()).getAllItem(1, 10)

            expect(mockGetAllQuery).toHaveBeenCalledWith(1, 10)
            expect(result).toEqual(expected)
        })

        it("uses defaults when no args", async () => {
            mockGetAllQuery.mockResolvedValue({ items: [], pagination: { page: 1, limit: 10, totalItem: 0, totalPages: 0 } })

            await (await itemService()).getAllItem()

            expect(mockGetAllQuery).toHaveBeenCalledWith(1, 10)
        })
    })

    describe("search", () => {
        it("searches with keyword", async () => {
            const expected = { items: [], pagination: { page: 1, limit: 10, totalItem: 0, totalPages: 0 } }
            mockSearchItemQuery.mockResolvedValue(expected)

            const result = await (await itemService()).search("test", 1, 10)

            expect(mockSearchItemQuery).toHaveBeenCalledWith("test", 1, 10)
            expect(result).toEqual(expected)
        })
    })

    describe("findItemById", () => {
        it("returns item when found", async () => {
            const item = { id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "2026-01-01", img_address: "img.webp" }
            mockGetItemQuery.mockResolvedValue([item])

            const result = await (await itemService()).findItemById(1)

            expect(mockGetItemQuery).toHaveBeenCalledWith(1)
            expect(result).toEqual(item)
        })

        it("throws 404 when not found", async () => {
            mockGetItemQuery.mockResolvedValue([])

            await expect((await itemService()).findItemById(999)).rejects.toMatchObject({
                status: 404,
                message: "item tidak ditemukan"
            })
        })
    })

    describe("insertItem", () => {
        it("inserts and creates audit log", async () => {
            const newItem = { id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "img.webp" }
            mockPostItemQuery.mockResolvedValue([newItem])
            mockInsertLogs.mockResolvedValue([])

            const result = await (await itemService()).insertItem("admin", "test", "cat", "img.webp", 5000)

            expect(mockPostItemQuery).toHaveBeenCalledWith("test", "cat", "img.webp", 5000)
            expect(mockInsertLogs).toHaveBeenCalledWith("admin", 1, "CREATE", null, newItem)
            expect(result).toEqual(newItem)
        })

        it("inserts with null image", async () => {
            const newItem = { id: 2, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: null }
            mockPostItemQuery.mockResolvedValue([newItem])
            mockInsertLogs.mockResolvedValue([])

            const result = await (await itemService()).insertItem("admin", "test", "cat", null, 5000)

            expect(mockPostItemQuery).toHaveBeenCalledWith("test", "cat", null, 5000)
            expect(result).toEqual(newItem)
        })

        it("throws 500 when insert returns empty array", async () => {
            mockPostItemQuery.mockResolvedValue([])

            await expect((await itemService()).insertItem("admin", "test", "cat", null, 5000)).rejects.toMatchObject({
                status: 500,
                message: "gagal menambah item"
            })
        })
    })

    describe("updateItem", () => {
        it("updates nama and kategori and creates audit log", async () => {
            const oldItem = { id: 1, nama: "old", kategori: "cat", price: 5000, updated_at: "", img_address: "old.webp" }
            const updatedItem = { id: 1, nama: "new", kategori: "dog", price: 5000, updated_at: "", img_address: "old.webp" }
            mockGetItemQuery.mockResolvedValue([oldItem])
            mockPutItemQuery.mockResolvedValue([updatedItem])
            mockInsertLogs.mockResolvedValue([])

            const result = await (await itemService()).updateItem("admin", 1, "new", "dog", undefined, 5000)

            expect(mockGetItemQuery).toHaveBeenCalledWith(1)
            expect(mockPutItemQuery).toHaveBeenCalledWith(1, "new", null, "dog", 5000)
            expect(mockInsertLogs).toHaveBeenCalledWith("admin", 1, "UPDATE NAMA_ITEM KATEGORI PRICE", oldItem, updatedItem)
            expect(result).toEqual(updatedItem)
        })

        it("updates with image", async () => {
            const oldItem = { id: 1, nama: "old", kategori: "cat", price: 5000, updated_at: "", img_address: "old.webp" }
            const updatedItem = { id: 1, nama: "new", kategori: "cat", price: 5000, updated_at: "", img_address: "new.webp" }
            mockGetItemQuery.mockResolvedValue([oldItem])
            mockPutItemQuery.mockResolvedValue([updatedItem])
            mockInsertLogs.mockResolvedValue([])

            await (await itemService()).updateItem("admin", 1, "new", "cat", "new.webp", 5000)

            expect(mockInsertLogs).toHaveBeenCalledWith("admin", 1, "UPDATE NAMA_ITEM KATEGORI IMG PRICE", oldItem, updatedItem)
        })

        it("throws 400 when no data fields provided", async () => {
            await expect((await itemService()).updateItem("admin", 1)).rejects.toMatchObject({
                status: 400,
                message: "tidak ada data yang diubah"
            })
        })

        it("throws 404 when item not found on put", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "old", kategori: "cat", price: 5000, updated_at: "", img_address: "" }])
            mockPutItemQuery.mockResolvedValue([])

            await expect((await itemService()).updateItem("admin", 999, "new", "cat", undefined, 5000)).rejects.toMatchObject({
                status: 404,
                message: "item tidak ditemukan"
            })
        })
    })

    describe("removeItem", () => {
        it("deletes and creates audit log", async () => {
            const item = { id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "img.webp" }
            mockGetItemQuery.mockResolvedValue([item])
            mockDeleteItemQuery.mockResolvedValue([item])
            mockInsertLogs.mockResolvedValue([])

            const result = await (await itemService()).removeItem("admin", 1)

            expect(mockGetItemQuery).toHaveBeenCalledWith(1)
            expect(mockDeleteItemQuery).toHaveBeenCalledWith(1)
            expect(mockInsertLogs).toHaveBeenCalledWith("admin", 1, "DELETE", item, null)
            expect(result).toEqual(item)
        })

        it("throws 404 when delete returns empty", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "" }])
            mockDeleteItemQuery.mockResolvedValue([])

            await expect((await itemService()).removeItem("admin", 999)).rejects.toMatchObject({
                status: 404,
                message: "item tidak ditemukan"
            })
        })
    })

    describe("addImgAddress", () => {
        it("updates image and creates audit log", async () => {
            const oldItem = { id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "old.webp" }
            const newItem = { id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "new.webp" }
            mockGetItemQuery.mockResolvedValue([oldItem])
            mockItemUploadQuery.mockResolvedValue([newItem])
            mockInsertLogs.mockResolvedValue([])

            const result = await (await itemService()).addImgAddress("admin", 1, "new.webp")

            expect(mockGetItemQuery).toHaveBeenCalledWith(1)
            expect(mockItemUploadQuery).toHaveBeenCalledWith(1, "new.webp")
            expect(mockInsertLogs).toHaveBeenCalledWith("admin", 1, "UPDATE IMG", oldItem, newItem)
            expect(result).toEqual(newItem)
        })

        it("throws 404 when item not found", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "" }])
            mockItemUploadQuery.mockResolvedValue([])

            await expect((await itemService()).addImgAddress("admin", 999, "img.webp")).rejects.toMatchObject({
                status: 404,
                message: "item tidak ditemukan"
            })
        })
    })

    describe("removeOldImage", () => {
        it("removes file when img_address exists", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "img.webp" }])

            await (await itemService()).removeOldImage(1)

            expect(mockGetItemQuery).toHaveBeenCalledWith(1)
            expect(fs.removeSync).toHaveBeenCalledOnce()
        })

        it("does nothing when img_address is empty", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: "" }])

            await (await itemService()).removeOldImage(1)

            expect(fs.removeSync).not.toHaveBeenCalled()
        })

        it("does nothing when item has no img_address", async () => {
            mockGetItemQuery.mockResolvedValue([{ id: 1, nama: "test", kategori: "cat", price: 5000, updated_at: "", img_address: null as unknown as string }])

            await (await itemService()).removeOldImage(1)

            expect(fs.removeSync).not.toHaveBeenCalled()
        })

        it("does nothing when item not found", async () => {
            mockGetItemQuery.mockResolvedValue([])

            await (await itemService()).removeOldImage(999)

            expect(fs.removeSync).not.toHaveBeenCalled()
        })
    })
})
