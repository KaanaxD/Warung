/**
 * Service untuk endpoint publik (/api/view/item).
 * Dipisah dari admin productService karena beda prefix dan tidak butuh JWT.
 */
import api from "./api"
import type { ResBody } from "@/types/api"
import type { Product, ProductListResponse } from "@/types/product"
import type { PaginationParams } from "./productService"

export function getPublicProducts(params?: PaginationParams) {
  return api.get<ResBody<ProductListResponse>>("/view/item", { params })
}

export function getPublicProductById(id: number) {
  return api.get<ResBody<Product>>(`/view/item/${id}`)
}

export function searchPublicProducts(keyword: string, params?: PaginationParams) {
  return api.get<ResBody<ProductListResponse>>("/view/item/search", {
    params: { keyword, ...params },
  })
}
