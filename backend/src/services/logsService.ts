import { createError } from "../middlewares/errorHandler";
import logModel from "../models/logsModel";

export default function logService() {
    return {
        allLog: async (page: number, limit: number) => {
            const data = await (await logModel()).getAllLogs(page, limit)
            return data
        },
        log: async (id: number) => {
            const data = await (await logModel()).getLogsById(id)
            if(!data){
                throw createError(404,"item tidak ditemukan")
            }
            return data[0]
        },
        itemLog: async (item_id: number) => {
            const data = await (await logModel()).getLogsByItemId(item_id)
            if(!data){
                throw createError(404,"item tidak ditemukan")
            }
            return data[0]
        }
    }
}