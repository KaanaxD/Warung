import { useState } from "react"
import type { PaginationMeta } from "@/types/product"

/**
 * State pagination — page, limit, dan helper untuk ngontrol disabled tombol.
 * Dipisah dari hook produk biar bisa dipakai ulang (logs, produk, dll).
 */
export function usePagination(initialLimit: number = 10) {
  const [page, setPage] = useState(1)
  const [limit] = useState(initialLimit)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)

  const totalPages = meta?.totalPages ?? 1
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  function nextPage() {
    if (!isLastPage) setPage((p) => p + 1)
  }

  function prevPage() {
    if (!isFirstPage) setPage((p) => p - 1)
  }

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  function resetPage() {
    setPage(1)
  }

  return {
    page,
    limit,
    meta,
    setMeta,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
    isFirstPage,
    isLastPage,
    totalPages,
  }
}
