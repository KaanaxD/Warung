import { NextFunction,Request,Response } from "express"
import itemService from "../services/item.service"

interface PaginationQueryParams {
    page: number
    limit: number
}

export default function viewController() {
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
        }
    }
}