import { Request, Response, NextFunction } from "express";
import { getAllItem } from "../services/itemServices";

interface PaginationQueryParams {
    page: number
    limit: number
}

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
export function getItem(req: Request<ReqParams>, res: Response, next: NextFunction) {
    try {
        
    } catch (error) {
        next(error)
    }
}
export function postItem(req: Request, res: Response, next: NextFunction) {

}
export function putItem(req: Request, res: Response, next: NextFunction) {

}
export function deleteItem(req: Request, res: Response, next: NextFunction) {

}