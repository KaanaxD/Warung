import { useEffect, useState } from "react"
import { cn } from "@/utils/cn"

type ToastType = "success" | "error" | "info"

interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
const listeners: Set<(msg: ToastMessage) => void> = new Set()

function show(message: string, type: ToastType = "info") {
  const msg: ToastMessage = { id: ++toastId, message, type }
  listeners.forEach((fn) => fn(msg))
}

export const toast = {
  success: (msg: string) => show(msg, "success"),
  error: (msg: string) => show(msg, "error"),
  info: (msg: string) => show(msg, "info"),
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-neutral-900 text-white",
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id))
      }, 3000)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-md px-4 py-2 text-sm shadow-lg animate-in slide-in-from-right",
            typeStyles[t.type],
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
