import { NextFunction, Request, Response } from "express";
import logService from "../services/logsService";

interface PaginationQueryParams {
    page: number
    limit: number
}

export default function logController() {
    return {
        getAllLog: async (req: Request<{}, {}, {}, PaginationQueryParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const { page, limit } = req.query
                const data = await (await logService()).allLog(page, limit)
                res.json({
                    success: true,
                    message: `berhasil mengambil data log page ${page} dengan limit ${limit} `,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        },
        getLogById: async (req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await logService()).log(req.params.id)
                res.json({
                    success: true,
                    message: `berhasil mengabil log dengan id ${req.params.id}`,
                    data: data
                })

            } catch (error) {
                next(error)
            }
        },
        getLogByItemId: async (req: Request<ReqParams>, res: Response<ResBody>, next: NextFunction) => {
            try {
                const data = await (await logService()).log(req.params.item_id)
                res.json({
                    success: true,
                    message: `berhasil mengabil log item dengan id item ${req.params.item_id}`,
                    data: data
                })
            } catch (error) {
                next(error)
            }
        }
    }

}