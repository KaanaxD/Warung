import { Link } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"

export function Navbar() {
  const { isAuthenticated, logout } = useAuthContext()

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold">
          Warung
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="text-sm text-neutral-600 hover:text-neutral-900">
                Admin
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
