export interface Item {
  id: number
  nama: string
  kategori: string
  updated_at: string
  img_address: string
}

export interface Pagination {
  page: number
  limit: number
  totalItem: number
  totalPages: number
}

export interface ItemPagination {
  items: Item[]
  pagination: Pagination
}

export interface LoginBody {
  username: string
  password: string
}

export interface ResBody {
  success: boolean
  message: string
  token?: string
  data?: unknown
}

export interface ItemLog {
  id: number
  admin_name: string
  item_id: number
  action: string
  old_data: Item | null
  new_data: Item | null
  updated_at: string
}

export interface ItemLogPagination {
  logs: ItemLog[]
  pagination: Pagination
}
