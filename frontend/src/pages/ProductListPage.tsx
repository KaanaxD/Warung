import { useState, useEffect } from "react"
import { getPublicProducts, searchPublicProducts } from "@/services/publicService"
import { ProductCard } from "@/components/products/ProductCard"
import { Pagination } from "@/components/ui/Pagination"
import { ErrorState } from "@/components/ui/ErrorState"
import { usePagination } from "@/hooks/usePagination"
import { useDebounce } from "@/hooks/useDebounce"
import type { Product } from "@/types/product"

export default function ProductListPage() {
  const [keyword, setKeyword] = useState("")
  const debouncedKeyword = useDebounce(keyword, 400)
  const pagination = usePagination(12)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    async function fetch() {
      try {
        const params = { page: pagination.page, limit: pagination.limit }
        const res = debouncedKeyword
          ? await searchPublicProducts(debouncedKeyword, params)
          : await getPublicProducts(params)
        setProducts(res.data.data?.items ?? [])
        pagination.setMeta(res.data.data?.pagination ?? null)
      } catch {
        setError("Gagal memuat menu")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [debouncedKeyword, pagination.page])

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Menu Warung</h1>
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            pagination.resetPage()
          }}
          placeholder="Cari menu..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => {}} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse rounded-lg bg-neutral-100" />
                ))
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            isFirstPage={pagination.isFirstPage}
            isLastPage={pagination.isLastPage}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onGoTo={pagination.goToPage}
          />
        </>
      )}
    </div>
  )
}
