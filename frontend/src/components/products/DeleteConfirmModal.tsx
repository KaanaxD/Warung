import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { deleteProduct } from "@/services/productService"
import { toast } from "@/components/ui/Toast"

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  productId: number
  productName: string
  onDeleted: () => void
}

export function DeleteConfirmModal({
  open,
  onClose,
  productId,
  productName,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteProduct(productId)
      toast.success(`"${productName}" berhasil dihapus`)
      onDeleted()
      onClose()
    } catch {
      toast.error("Gagal menghapus produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Hapus Produk">
      <p className="mb-6 text-sm text-neutral-600">
        Yakin ingin menghapus <strong>{productName}</strong>? Tindakan ini tidak bisa dibatalkan.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="destructive" onClick={handleDelete} loading={loading}>
          Hapus
        </Button>
      </div>
    </Modal>
  )
}
