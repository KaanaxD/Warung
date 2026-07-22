import path from "node:path";
import { createError } from "../middlewares/errorHandler";
import itemRepository from "../repository/item.repository";
import fs from "fs-extra"
import logRepository from "../repository/logs.repository";

export default async function itemService() {
    return {
        getAllItem: async (page: number = 1, limit: number = 10) => {
            const data = await itemRepository().getAllQuery(page, limit)
            return data
        },
        search: async (
            keyword: string | undefined = undefined,
            page: number = 1,
            limit: number = 10
        ) => {
            const data = await itemRepository().searchItemQuery(keyword, page, limit)
            return data
        },
        findItemById: async (id: number) => {
            const data = await itemRepository().getItemQuery(id)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        insertItem: async (admin: string, nama: string, kategori: string, img: string | null = null, price: number) => {
            const data = await itemRepository().postItemQuery(nama, kategori, img,price)
            if (!data) {
                throw createError(500, "gagal menambah item")
            }
            if (!data[0]) {
                throw createError(500, "gagal menambah item")
            }
            const id = data[0].id
            await logRepository().insertLogs(admin, id, "CREATE", null, data[0])
            return data[0]
        },

        updateItem: async (admin: string, id: number, nama: string|null = null, kategori: string|null = null, img: string|null = null,price:number|null = null) => {
            if (!nama && !kategori && !price && !img) {
                throw createError(400, "tidak ada data yang diubah")
            }
            let change = "UPDATE";
            if (nama) {
                change += " NAMA_ITEM"
            }
            if (kategori) {
                change += " KATEGORI"
            }
            if (img) {
                change += " IMG"
            } 
            if (price){
                change+= " PRICE"
            }
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemRepository().putItemQuery(id, nama, img, kategori,price)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            await logRepository().insertLogs(admin, id, change, oldData, data[0])
            return data[0]
        },

        removeItem: async (admin: string, id: number) => {
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemRepository().deleteItemQuery(id)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            await logRepository().insertLogs(admin, id, "DELETE", oldData, null)

            return data[0]
        },

        addImgAddress: async (admin: string, id: number, img: string) => {
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemRepository().itemUploadQuery(id, img)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            await logRepository().insertLogs(admin, id, "UPDATE IMG", oldData, data[0])
            return data[0]
        },
        removeOldImage: async (id: number) => {
            const exist = await itemRepository().getItemQuery(id)
            if (!exist[0]?.img_address) {
                return
            }
            const imgPath = path.join(__dirname, "..", "..", "uploads", exist[0].img_address)
            fs.removeSync(imgPath)
        },
    }
}
