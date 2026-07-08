import { cn } from "@/utils/cn"

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
}

const defaultImage = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" fill="#f5f5f4"/>
    <path d="M80 85a20 20 0 1 0 40 0 20 20 0 0 0-40 0Zm-5 35a25 25 0 0 1 50 0v5H75v-5Z" fill="#a8a29e" fill-opacity="0.5"/>
    <circle cx="140" cy="70" r="25" fill="#a8a29e" fill-opacity="0.5"/>
  </svg>`,
)}`

export function ProductImage({ src, alt, className }: ProductImageProps) {
  return (
    <img
      src={src || defaultImage}
      alt={alt}
      className={cn("object-cover", className)}
      onError={(e) => {
        if ((e.target as HTMLImageElement).src !== defaultImage) {
          (e.target as HTMLImageElement).src = defaultImage
        }
      }}
    />
  )
}
