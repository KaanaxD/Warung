export interface Product {
  id: number
  nama: string
  kategori: string
  img_address: string
  updated_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItem: number
  totalPages: number
}

export interface ProductListResponse {
  items: Product[]
  pagination: PaginationMeta
}

export interface ProductPayload {
  nama: string
  kategori: string
}

export interface AuditLog {
  id: number
  admin_name: string
  item_id: number
  action: string
  old_data: Product | null
  new_data: Product | null
  updated_at: string
}

export interface AuditLogListResponse {
  logs: AuditLog[]
  pagination: PaginationMeta
}
