/** Base response wrapper dari semua endpoint backend */
export interface ResBody<T = unknown> {
  success: boolean
  message: string
  data?: T
  token?: string
}
