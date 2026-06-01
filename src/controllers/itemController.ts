import { Request, Response, NextFunction } from "express";
import { findItemById, getAllItem, insertItem, removeItem, updateItem } from "../services/itemServices";
import { createError } from "../middlewares/errorHandler";
import {z, ZodError} from "zod"

interface PaginationQueryParams {
    page: number
    limit: number
}

let itemSchema = z.object({
    nama : z.string().min(3,"nama minimal 3 karakter"),
    kategori: z.string().min(3,"kategori minimal 3 karakter")
})

type ReqBody = z.infer<typeof itemSchema>

export async function getAll(req: Request<{}, {}, {}, PaginationQueryParams>, res: Response<ResBody>, next: NextFunction) {
    try {
        const data = await getAllItem(req.query.page, req.query.limit)
        res.json({
            success: true,
            message: `berhasil mengambil data dari page ${data.pagination.page} dengan limit ${data.pagination.limit} setiap halamannya`,
            data: data
        })
    } catch (error) {
        next(error)
    }
}
export async function getItem(req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) {
    try {
        const data = await findItemById(req.params.id)
        res.json({
            success: true,
            message: `berhasil mengambil item dengan id${req.params.id}`,
            data: data
        })
    } catch (error) {
        next(error)
    }
}
export async function postItem(req: Request<{}, {}, ReqBody>, res: Response<ResBody>, next: NextFunction) {
    try {
        let validate = await itemSchema.parseAsync(req.body)
        const data = await insertItem(validate.nama,validate.kategori)
        res.status(201).json({
            success: true,
            message: `berhasil mengambil item dengan nama ${req.body.nama} dan kategori ${req.body.kategori} `,
            data: data
        })
    } catch (error) {
        next(error)
    }
}
export async function putItem(req: Request<ReqParams, {}, ReqBody>, res: Response<ResBody>, next: NextFunction) {
    try {
        const data = await updateItem(req.params.id, req.body.nama, req.body.kategori)
        res.json({
            success: true,
            message: `berhasil mengupdate id = ${req.params.id} dengan nama ${req.body.nama} dan kategori ${req.body.kategori} `,
            data: data
        })
    } catch (error) {
        next(error)
    }
}
export async function deleteItem(req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) {
    try {
        const data = await removeItem(req.params.id)
        res.json({
            success: true,
            message: `berhasil menghapus item dengan id = ${req.params.id} `,
            data: data
        })
    } catch (error) {
        next(error)
    }
}