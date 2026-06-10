import { Request, Response, NextFunction } from "express";
import itemService from "../services/itemServices";
import { z } from "zod"

interface PaginationQueryParams {
    page: number
    limit: number
}

let itemSchema = z.object({
    nama: z.string().min(3, "nama minimal 3 karakter"),
    kategori: z.string().min(3, "kategori minimal 3 karakter")
})

type ReqBody = z.infer<typeof itemSchema>

export default function itemController() {
    return {
        getAll: async (req: Request<{}, {}, {}, PaginationQueryParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await itemService()).getAllItem(req.query.page, req.query.limit)
                res.json({
                    success: true,
                    message: `berhasil mengambil data dari page ${data.pagination.page} dengan limit ${data.pagination.limit} setiap halamannya`,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        getItem: async (req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await itemService()).findItemById(req.params.id)
                res.json({
                    success: true,
                    message: `berhasil mengambil item dengan id${req.params.id}`,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        postItem: async (req: Request<{}, {}, ReqBody>, res: Response<ResBody>, next: NextFunction) => {
            try {
                let validate = await itemSchema.parseAsync(req.body)
                const data = await (await itemService()).insertItem(validate.nama, validate.kategori,req.file?.filename)
                res.status(201).json({
                    success: true,
                    message: `berhasil mengambil item dengan nama ${validate.nama} dan kategori ${validate.kategori} `,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        putItem: async (req: Request, res: Response<ResBody>, next: NextFunction) => {
            try {
                let validate = await itemSchema.parseAsync(req.body)
                const data = await (await itemService()).updateItem(Number(req.params.id), validate.nama, validate.kategori)
                res.json({
                    success: true,
                    message: `berhasil mengupdate id = ${req.params.id} dengan nama ${validate.nama} dan kategori ${validate.kategori} `,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        deleteItem: async (req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await itemService()).removeItem(req.params.id)
                res.json({
                    success: true,
                    message: `berhasil menghapus item dengan id = ${req.params.id} `,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        uploadItemImg: async (req: Request,res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await itemService()).addImgAddress(Number(req.params.id),req.file?.filename as string)
                res.json({
                    success: true,
                    message: `berhasil mengupload gambar item id = ${req.params.id} dengan nama file ${req.file?.filename}`,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        }   
    }
}