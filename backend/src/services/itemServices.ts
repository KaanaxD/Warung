import path from "node:path";
import { createError } from "../middlewares/errorHandler";
import itemModel from "../models/itemModel";
import fs from "fs-extra"
import logModel from "../models/logsModel";

export default async function itemService() {
    return {
        getAllItem: async (page: number = 1, limit: number = 10) => {
            const data = await itemModel().getAllQuery(page, limit)
            return data
        },
        search: async (
            keyword: string | undefined = undefined,
            page: number = 1,
            limit: number = 10
        ) => {
            const data = await itemModel().searchItemQuery(keyword, page, limit)
            if (data.items.length == 0) {
                return {
                    success: true,
                    message: "tidak ada data yang cocok"
                }
            }
            return data
        },
        findItemById: async (id: number) => {
            const data = await itemModel().getItemQuery(id)
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        insertItem: async (admin: string, nama: string, kategori: string, img: string | null = null) => {
            const data = await itemModel().postItemQuery(nama, kategori, img)
            if (!data) {
                throw createError(500, "gagal menambah item")
            }
            if (!data[0]) {
                throw createError(500, "gagal menambah item")
            }
            const id = data[0].id
            await logModel().insertLogs(admin, id, "CREATE", null, data[0])
            return data[0]
        },

        updateItem: async (admin: string, id: number, nama?: string, kategori?: string, img?: string) => {
            if (!nama && !kategori) {
                throw createError(400, "tidak ada data yang diubah")
            }
            let change="UPDATE";
            if(nama){
                change+=" NAMA_ITEM"
            }
            if(kategori){
                change+=" KATEGORI"
            }
            if(img){
                change+=" IMG"
            }
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemModel().putItemQuery(id, nama, img, kategori)
            await logModel().insertLogs(admin, id, change , oldData, data[0])
            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        removeItem: async (admin: string, id: number) => {
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemModel().deleteItemQuery(id)
            await logModel().insertLogs(admin, id, "DELETE", oldData, null)

            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },

        addImgAddress: async (admin:string,id: number, img: string) => {
            const oldData = await (await itemService()).findItemById(id)
            const data = await itemModel().itemUploadQuery(id, img)
            await logModel().insertLogs(admin, id, "UPDATE IMG", oldData, data[0])

            if (data.length === 0) {
                throw createError(404, "item tidak ditemukan")
            }
            return data[0]
        },
        removeOldImage: async (id: number) => {
            const exist = await itemModel().getItemQuery(id)
            if (!exist[0]?.img_address) {
                return
            }
            const imgPath = path.join(__dirname, "..", "..", "uploads", exist[0].img_address)
            fs.removeSync(imgPath)
        },
    }
}
