import { createError } from "../middlewares/errorHandler";
import itemModel from "../models/itemModel";

export default async function itemService() {
    return {
        getAllItem: async (page: number = 1, limit: number = 10) => {
            const data = await itemModel().getAllQuery(page, limit)
            return data
        },

        findItemById: async (id: number) => {
            const data = await itemModel().getItemQuery(id)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        insertItem: async (nama: string, kategori: string,img:string|null = null) => {
            const data = await itemModel().postItemQuery(nama, kategori,img)
            return data[0]
        },

        updateItem: async (id: number, nama?: string, kategori?: string) => {
            if (!nama && !kategori) {
                throw createError(400, "tidak ada data yang diubah")
            }
            const data = await itemModel().putItemQuery(id, nama, kategori)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        removeItem: async (id: number) => {
            const data = await itemModel().deleteItemQuery(id)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        addImgAddress: async (id: number, img: string) => {
            const data = await itemModel().itemUpload(id, img)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },
    }
}
