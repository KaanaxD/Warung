import { useState } from "react"
import { Link } from "react-router-dom"
import { itemApi } from "@/api/item"
import type { Item } from "@/types"

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    itemApi.getAll().then((res) => {
      setItems(res.data.data?.items ?? [])
      setLoading(false)
    })
  })

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus item ini?")) return
    await itemApi.delete(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (loading) return <div className="p-8">Memuat...</div>

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/logs"
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-100"
          >
            Logs
          </Link>
          <Link
            to="/admin/item/baru"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Tambah Item
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.kategori}</td>
                <td className="px-4 py-3">
                  {item.img_address ? (
                    <img
                      src={`/api/img/${item.img_address}`}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="space-x-2 px-4 py-3">
                  <Link
                    to={`/admin/item/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
