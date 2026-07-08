import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { itemApi } from "@/api/item"
import { Button } from "@/components/ui/button"

export default function ItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [nama, setNama] = useState("")
  const [kategori, setKategori] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useState(() => {
    if (id) {
      itemApi.getItem(Number(id)).then((res) => {
        const item = res.data.data
        if (item) {
          setNama(item.nama)
          setKategori(item.kategori)
        }
      })
    }
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("kategori", kategori)
    if (image) formData.append("image", image)

    try {
      if (isEdit) {
        await itemApi.update(Number(id), formData)
      } else {
        await itemApi.create(formData)
      }
      navigate("/admin")
    } catch {
      alert("Gagal menyimpan item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Item" : "Tambah Item"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Kategori</label>
          <input
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
