import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Menu from "@/pages/Menu"
import ItemDetail from "@/pages/ItemDetail"
import Dashboard from "@/pages/admin/Dashboard"
import ItemForm from "@/pages/admin/ItemForm"
import Logs from "@/pages/admin/Logs"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/item/baru" element={<ItemForm />} />
        <Route path="/admin/item/:id" element={<ItemForm />} />
        <Route path="/admin/logs" element={<Logs />} />
      </Routes>
    </BrowserRouter>
  )
}
