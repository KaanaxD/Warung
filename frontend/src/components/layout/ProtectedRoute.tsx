import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"

/**
 * Wrapper rute yang cuma bisa diakses kalau sudah login.
 * Kalau belum auth → redirect ke /login.
 * isInitialized mencegah flash redirect sebelum localStorage terbaca.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthContext()

  if (!isInitialized) {
    return null // atau spinner loading
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
