import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ProductImage } from "./ProductImage"
import { getProductById, createProduct, updateProduct, uploadProductImage } from "@/services/productService"
import { toast } from "@/components/ui/Toast"

interface ProductFormProps {
  id?: number
  onSuccess: () => void
}

export function ProductForm({ id, onSuccess }: ProductFormProps) {
  const [nama, setNama] = useState("")
  const [kategori, setKategori] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!id)
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(id)

  useEffect(() => {
    if (!id) return
    getProductById(id)
      .then((res) => {
        const product = res.data.data
        if (product) {
          setNama(product.nama)
          setKategori(product.kategori)
          if (product.img_address) {
            setPreview(`/api/img/${product.img_address}`)
          }
        }
      })
      .catch(() => toast.error("Gagal memuat data produk"))
      .finally(() => setFetching(false))
  }, [id])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("nama", nama)
      formData.append("kategori", kategori)

      if (isEdit && id) {
        await updateProduct(id, formData)
        if (image) {
          const imgData = new FormData()
          imgData.append("image", image)
          await uploadProductImage(id, imgData)
        }
      } else {
        if (image) formData.append("image", image)
        await createProduct(formData)
      }

      toast.success(isEdit ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan")
      onSuccess()
    } catch {
      toast.error("Gagal menyimpan produk")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="py-8 text-center text-neutral-500">Memuat data...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Masukkan nama produk"
        required
      />
      <Input
        label="Kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        placeholder="Masukkan kategori"
        required
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700">Gambar</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm"
        />
        <ProductImage
          src={preview}
          alt="Preview"
          className="mt-2 h-32 w-32 rounded border"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {isEdit ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  )
}
