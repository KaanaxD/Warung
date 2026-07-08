import { useParams, useNavigate } from "react-router-dom"
import { PageLayout } from "@/components/layout/PageLayout"
import { ProductForm } from "@/components/products/ProductForm"

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  return (
    <PageLayout title={isEdit ? "Edit Produk" : "Tambah Produk"}>
      <div className="mx-auto max-w-lg">
        <ProductForm
          id={id ? Number(id) : undefined}
          onSuccess={() => navigate("/admin")}
        />
      </div>
    </PageLayout>
  )
}
