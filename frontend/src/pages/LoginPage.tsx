import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/Toast"

export default function LoginPage() {
  const { isAuthenticated, login } = useAuthContext()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      toast.success("Login berhasil")
      navigate("/admin")
    } catch {
      toast.error("Username atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border bg-white p-6 shadow-sm"
      >
        <h1 className="text-center text-2xl font-bold">Login Admin</h1>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Masuk
        </Button>
      </form>
    </div>
  )
}
