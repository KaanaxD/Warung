import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/utils/cn"

const links = [
  { to: "/admin", label: "Produk" },
  { to: "/admin/logs", label: "Log Aktivitas" },
]

export function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-6xl gap-6 p-4 md:p-6">
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
