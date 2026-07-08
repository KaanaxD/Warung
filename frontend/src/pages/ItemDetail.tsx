import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPublicProductById } from "@/services/publicService"
import { ProductImage } from "@/components/products/ProductImage"
import type { Product } from "@/types/product"

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useState(() => {
    if (id) {
      getPublicProductById(Number(id)).then((res) => {
        setItem(res.data.data ?? null)
        setLoading(false)
      })
    }
  })

  if (loading) return <div className="p-8 text-center">Memuat...</div>
  if (!item) return <div className="p-8 text-center">Item tidak ditemukan</div>

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Link to="/" className="text-sm text-neutral-600 hover:underline">
        &larr; Kembali
      </Link>
      <ProductImage
        src={item.img_address ? `/api/img/${item.img_address}` : null}
        alt={item.nama}
        className="mt-4 mb-4 h-80 w-full rounded-lg"
      />
      <h1 className="text-3xl font-bold">{item.nama}</h1>
      <p className="mt-2 text-neutral-600">{item.kategori}</p>
      <p className="mt-4 text-sm text-neutral-400">
        Terakhir diperbarui: {new Date(item.updated_at).toLocaleDateString("id-ID")}
      </p>
    </div>
  )
}
