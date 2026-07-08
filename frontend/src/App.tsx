import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { ToastContainer } from "@/components/ui/Toast"
import { Navbar } from "@/components/layout/Navbar"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"
import LoginPage from "@/pages/LoginPage"
import ProductListPage from "@/pages/ProductListPage"
import ItemDetail from "@/pages/ItemDetail"
import AdminDashboard from "@/pages/AdminDashboard"
import ProductFormPage from "@/pages/ProductFormPage"
import AuditLogPage from "@/pages/AuditLogPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<ProductListPage />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin — protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/item/baru" element={<ProductFormPage />} />
              <Route path="/admin/item/:id" element={<ProductFormPage />} />
              <Route path="/admin/logs" element={<AuditLogPage />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  )
}
