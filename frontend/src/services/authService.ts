import api from "./api"
import type { ResBody } from "@/types/api"
import type { LoginResponse } from "@/types/auth"

export function login(username: string, password: string) {
  return api.post<ResBody<LoginResponse>>("/auth/login", { username, password })
}
