import { useState } from "react"
import { Link } from "react-router-dom"
import { PageLayout } from "@/components/layout/PageLayout"
import { ProductTable } from "@/components/products/ProductTable"
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal"
import { Pagination } from "@/components/ui/Pagination"
import { Input } from "@/components/ui/Input"
import { ErrorState } from "@/components/ui/ErrorState"
import { Button } from "@/components/ui/Button"
import { useProducts } from "@/hooks/useProducts"
import { usePagination } from "@/hooks/usePagination"
import { useDebounce } from "@/hooks/useDebounce"

export default function AdminDashboard() {
  const [keyword, setKeyword] = useState("")
  const debouncedKeyword = useDebounce(keyword, 300)
  const pagination = usePagination(10)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const { products, meta, loading, error, refetch } = useProducts({
    page: pagination.page,
    limit: pagination.limit,
    keyword: debouncedKeyword || undefined,
  })

  return (
    <PageLayout
      title="Produk"
      action={
        <Link to="/admin/item/baru">
          <Button size="sm">+ Tambah Produk</Button>
        </Link>
      }
    >
      <div className="mb-4">
        <Input
          placeholder="Cari produk..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            pagination.resetPage()
          }}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <ProductTable
            products={products}
            loading={loading}
            onDelete={(id) => {
              const product = products.find((p) => p.id === id)
              if (product) setDeleteTarget({ id, name: product.nama })
            }}
          />
          <Pagination
            page={pagination.page}
            totalPages={meta?.totalPages ?? 1}
            isFirstPage={pagination.page <= 1}
            isLastPage={pagination.page >= (meta?.totalPages ?? 1)}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onGoTo={pagination.goToPage}
          />
        </>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          productId={deleteTarget.id}
          productName={deleteTarget.name}
          onDeleted={refetch}
        />
      )}
    </PageLayout>
  )
}
