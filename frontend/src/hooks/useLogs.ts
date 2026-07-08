import { useState, useEffect, useCallback } from "react"
import { getAllLogs, type LogPaginationParams } from "@/services/logService"
import type { AuditLog, PaginationMeta } from "@/types/product"

export function useLogs(params?: LogPaginationParams) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllLogs({ page: params?.page, limit: params?.limit })
      setLogs(res.data.data?.logs ?? [])
      setMeta(res.data.data?.pagination ?? null)
    } catch {
      setError("Gagal memuat log")
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.limit])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { logs, meta, loading, error, refetch: fetch }
}
