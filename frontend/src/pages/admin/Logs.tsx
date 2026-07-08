import { useState } from "react"
import { Link } from "react-router-dom"
import { logApi } from "@/api/log"
import type { ItemLog } from "@/types"

export default function Logs() {
  const [logs, setLogs] = useState<ItemLog[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    logApi.getAll().then((res) => {
      setLogs(res.data.data?.logs ?? [])
      setLoading(false)
    })
  })

  if (loading) return <div className="p-8">Memuat...</div>

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Log Aktivitas</h1>
        <Link
          to="/admin"
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-100"
        >
          Dashboard
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Item ID</th>
              <th className="px-4 py-3">Aksi</th>
              <th className="px-4 py-3">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-4 py-3">{log.admin_name}</td>
                <td className="px-4 py-3">{log.item_id}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">
                  {new Date(log.updated_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
