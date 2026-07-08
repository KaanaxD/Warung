import { useState } from "react"
import { Link } from "react-router-dom"
import { publicItemApi } from "@/api/item"

export default function Menu() {
  const [keyword, setKeyword] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    publicItemApi.getAll().then((res) => {
      setItems(res.data.data?.items ?? [])
      setLoading(false)
    })
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    publicItemApi.search(keyword).then((res) => setItems(res.data.data?.items ?? []))
  }

  if (loading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Warung</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari menu..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          Cari
        </button>
      </form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item: any) => (
          <Link
            key={item.id}
            to={`/item/${item.id}`}
            className="rounded-lg border p-4 hover:shadow-lg transition-shadow"
          >
            {item.img_address && (
              <img
                src={`/api/img/${item.img_address}`}
                alt={item.nama}
                className="mb-2 h-40 w-full rounded object-cover"
              />
            )}
            <h2 className="font-semibold">{item.nama}</h2>
            <p className="text-sm text-neutral-600">{item.kategori}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
