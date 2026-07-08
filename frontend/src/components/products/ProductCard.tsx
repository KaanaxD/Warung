import { ProductImage } from "./ProductImage"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <ProductImage
        src={product.img_address ? `/api/img/${product.img_address}` : null}
        alt={product.nama}
        className="mb-3 h-40 w-full rounded"
      />
      <h3 className="font-semibold">{product.nama}</h3>
      <p className="text-sm text-neutral-500">{product.kategori}</p>
    </div>
  )
}
