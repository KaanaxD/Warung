import { createError } from "../middlewares/errorHandler";
import logRepository from "../repository/logs.repository";

export default function logService() {
    return {
        allLog: async (page: number, limit: number) => {
            const data = await (await logRepository()).getAllLogs(page, limit)
            return data
        },
        log: async (id: number) => {
            const data = await (await logRepository()).getLogsById(id)
            if(!data){
                throw createError(404,"log tidak ditemukan")
            }
            return data[0]
        },
        itemLog: async (item_id: number) => {
            const data = await (await logRepository()).getLogsByItemId(item_id)
            if(!data){
                throw createError(404,"log tidak ditemukan")
            }
            return data[0]
        }
    }
}