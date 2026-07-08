import api from "./api"
import type { ResBody } from "@/types/api"
import type { Product, ProductListResponse } from "@/types/product"

export interface PaginationParams {
  page?: number
  limit?: number
  kategori?: string
}

export function getAllProducts(params?: PaginationParams) {
  return api.get<ResBody<ProductListResponse>>("/admin/item", { params })
}

export function getProductById(id: number) {
  return api.get<ResBody<Product>>(`/admin/item/${id}`)
}

export function searchProducts(keyword: string, params?: PaginationParams) {
  return api.get<ResBody<ProductListResponse>>("/admin/item/search", {
    params: { keyword, ...params },
  })
}

export function createProduct(formData: FormData) {
  return api.post<ResBody>("/admin/item", formData)
}

export function updateProduct(id: number, formData: FormData) {
  return api.put<ResBody>(`/admin/item/${id}`, formData)
}

export function deleteProduct(id: number) {
  return api.delete<ResBody>(`/admin/item/${id}`)
}

export function uploadProductImage(id: number, formData: FormData) {
  return api.patch<ResBody>(`/admin/item/${id}/upload`, formData)
}
