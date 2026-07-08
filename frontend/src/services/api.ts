import axios from "axios"
import type { AxiosError } from "axios"
import type { ResBody } from "@/types/api"

/**
 * Axios instance dengan base URL Vite proxy (/api → backend).
 * Token JWT di-attach otomatis via interceptor.
 * 
 * Kenapa localStorage? Karena:
 * 1. Modal/logout state bisa di-reset walau refresh
 * 2. Context di-mount ulang tiap refresh, jadi token harus tersimpan persist
 * 3. XSS protection tetap tanggung jawab sanitasi input—token di memory/lokal sama risikonya
 */
const api = axios.create({
  baseURL: "/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ResBody>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
