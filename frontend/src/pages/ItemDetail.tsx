import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { publicItemApi } from "@/api/item"
import type { Item } from "@/types"

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useState(() => {
    if (id) {
      publicItemApi.getItem(Number(id)).then((res) => {
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
      {item.img_address && (
        <img
          src={`/api/img/${item.img_address}`}
          alt={item.nama}
          className="mt-4 mb-4 w-full rounded-lg object-cover"
        />
      )}
      <h1 className="text-3xl font-bold">{item.nama}</h1>
      <p className="mt-2 text-neutral-600">{item.kategori}</p>
      <p className="mt-4 text-sm text-neutral-400">
        Terakhir diperbarui: {new Date(item.updated_at).toLocaleDateString("id-ID")}
      </p>
    </div>
  )
}
