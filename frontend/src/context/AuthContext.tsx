import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react"
import { login as loginService } from "@/services/authService"

interface AuthState {
  isAuthenticated: boolean
  isInitialized: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

/**
 * AuthContext:
 * - Token disimpan di localStorage (persist walau refresh) DAN di state (reaktif).
 * - isInitialized mencegah flash redirect sebelum token dicek.
 *
 * Trade-off localStorage vs memory:
 *   localStorage → state tetap ada setelah refresh, tapi rawan XSS.
 *   memory-only → lebih aman tapi hilang tiap refresh, user harus login lagi.
 *   Kompromi: simpan di localStorage, tapi taruh token di state + hapus kalau 401.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  )
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginService(username, password)
    const newToken = res.data.token!
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, isInitialized, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be inside <AuthProvider>")
  return ctx
}
