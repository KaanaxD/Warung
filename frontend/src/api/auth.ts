import { api } from "./client"
import type { ResBody } from "../types"

export const authApi = {
  login(username: string, password: string) {
    return api.post<ResBody & { token: string }>("/auth/login", { username, password })
  },
}
