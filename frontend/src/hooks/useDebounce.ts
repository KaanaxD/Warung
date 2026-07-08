import { useState, useEffect } from "react"

/**
 * Debounce nilai — berguna untuk search input supaya gak ngefetch tiap ketik.
 * Nilai return baru berubah setelah `delay` ms tanpa perubahan.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
