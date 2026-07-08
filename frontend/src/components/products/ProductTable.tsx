import { Link } from "react-router-dom"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { ProductImage } from "./ProductImage"
import type { Product } from "@/types/product"

interface ProductTableProps {
  products: Product[]
  loading: boolean
  onDelete: (id: number) => void
}

export function ProductTable({ products, loading, onDelete }: ProductTableProps) {
  return (
    <Table
      columns={[
        { key: "nama", header: "Nama" },
        { key: "kategori", header: "Kategori" },
        {
          key: "img",
          header: "Gambar",
          render: (item: Product) => (
            <ProductImage
              src={item.img_address ? `/api/img/${item.img_address}` : null}
              alt={item.nama}
              className="h-10 w-10 rounded"
            />
          ),
        },
        {
          key: "actions",
          header: "Aksi",
          render: (item: Product) => (
            <div className="flex gap-2">
              <Link
                to={`/admin/item/${item.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                Hapus
              </Button>
            </div>
          ),
        },
      ]}
      data={products}
      keyExtractor={(item) => item.id}
      loading={loading}
      emptyMessage="Belum ada produk"
    />
  )
}
