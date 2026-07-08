import { useState, useEffect, useCallback } from "react"
import { getAllProducts, searchProducts, deleteProduct, type PaginationParams } from "@/services/productService"
import type { Product, PaginationMeta } from "@/types/product"

interface UseProductsReturn {
  products: Product[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  refetch: () => void
  remove: (id: number) => Promise<void>
}

/**
 * Hook data produk admin.
 * State lokal, bukan context — tiap halaman produk bisa punya daftar sendiri.
 * Kalau butuh global (misal navbar badge jumlah produk), baru pindah ke context.
 */
export function useProducts(params?: PaginationParams & { keyword?: string }): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchFn = params?.keyword ? searchProducts : getAllProducts
      const fetchParams = params?.keyword
        ? { keyword: params.keyword, page: params?.page, limit: params?.limit }
        : { page: params?.page, limit: params?.limit, kategori: params?.kategori }

      const res = await fetchFn(fetchParams as any)
      setProducts(res.data.data?.items ?? [])
      setMeta(res.data.data?.pagination ?? null)
    } catch {
      setError("Gagal memuat data produk")
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.limit, params?.kategori, params?.keyword])

  useEffect(() => {
    fetch()
  }, [fetch])

  const remove = useCallback(async (id: number) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { products, meta, loading, error, refetch: fetch, remove }
}
