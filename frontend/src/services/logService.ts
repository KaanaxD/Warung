import api from "./api"
import type { ResBody } from "@/types/api"
import type { AuditLog, AuditLogListResponse } from "@/types/product"

export interface LogPaginationParams {
  page?: number
  limit?: number
}

export function getAllLogs(params?: LogPaginationParams) {
  return api.get<ResBody<AuditLogListResponse>>("/admin/logs", { params })
}

export function getLogById(id: number) {
  return api.get<ResBody<AuditLog>>(`/admin/logs/${id}`)
}

export function getLogsByItemId(itemId: number) {
  return api.get<ResBody<AuditLogListResponse>>(`/admin/logs/item/${itemId}`)
}
