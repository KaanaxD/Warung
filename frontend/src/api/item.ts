import { api } from "./client"
import type { Item, ItemPagination, ResBody } from "../types"

export const itemApi = {
  getAll(params?: { page?: number; limit?: number; kategori?: string }) {
    return api.get<ResBody & { data: ItemPagination }>("/admin/item", { params })
  },

  getItem(id: number) {
    return api.get<ResBody & { data: Item }>(`/admin/item/${id}`)
  },

  search(keyword: string, params?: { page?: number; limit?: number }) {
    return api.get<ResBody & { data: ItemPagination }>("/admin/item/search", {
      params: { keyword, ...params },
    })
  },

  create(data: FormData) {
    return api.post<ResBody>("/admin/item", data)
  },

  update(id: number, data: FormData) {
    return api.put<ResBody>(`/admin/item/${id}`, data)
  },

  delete(id: number) {
    return api.delete<ResBody>(`/admin/item/${id}`)
  },

  uploadImage(id: number, data: FormData) {
    return api.patch<ResBody>(`/admin/item/${id}/upload`, data)
  },
}

export const publicItemApi = {
  getAll(params?: { page?: number; limit?: number; kategori?: string }) {
    return api.get<ResBody & { data: ItemPagination }>("/view/item", { params })
  },

  getItem(id: number) {
    return api.get<ResBody & { data: Item }>(`/view/item/${id}`)
  },

  search(keyword: string, params?: { page?: number; limit?: number }) {
    return api.get<ResBody & { data: ItemPagination }>("/view/item/search", {
      params: { keyword, ...params },
    })
  },
}
