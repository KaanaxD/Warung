import { api } from "./client"
import type { ResBody, ItemLogPagination, ItemLog } from "../types"

export const logApi = {
  getAll(params?: { page?: number; limit?: number }) {
    return api.get<ResBody & { data: ItemLogPagination }>("/admin/logs", { params })
  },

  getById(id: number) {
    return api.get<ResBody & { data: ItemLog }>(`/admin/logs/${id}`)
  },

  getByItemId(itemId: number) {
    return api.get<ResBody & { data: ItemLogPagination }>(`/admin/logs/item/${itemId}`)
  },
}
