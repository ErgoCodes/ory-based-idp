import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"
import { authOptions } from "@/lib/auth/auth-config"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface FetchOptions extends RequestInit {
  token?: string
}

/**
 * Client-side authenticated fetch
 */
export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options

  let accessToken = token
  if (!accessToken) {
    const session = await getSession()
    accessToken = session?.accessToken
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (fetchOptions.headers) {
    const existingHeaders = new Headers(fetchOptions.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`

  return fetch(url, {
    ...fetchOptions,
    headers,
  })
}

/**
 * Server-side authenticated fetch (for Server Components)
 */
export async function fetchWithAuthServer(endpoint: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions)
  const accessToken = session?.accessToken

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Merge existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  // Add Authorization header if token exists
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`

  return fetch(url, {
    ...options,
    headers,
  })
}
