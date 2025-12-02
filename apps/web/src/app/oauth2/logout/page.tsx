"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function LogoutContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const challenge = searchParams.get("logout_challenge")

  useEffect(() => {
    if (!challenge) {
      setError("Missing logout challenge")
      setLoading(false)
      return
    }

    // Auto-accept logout immediately (no confirmation needed)
    handleLogout()
  }, [challenge])

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${apiUrl}/oauth2/logout?logout_challenge=${challenge}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to process logout")
      }

      const data = await response.json()

      if (data.success && data.value.redirect_to) {
        // Hydra will redirect (either to client's URI or to logged-out page)
        window.location.href = data.value.redirect_to
      } else {
        setError("No redirect URL received")
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-gray-600">Logging out...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-900">Logout Error</h2>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return null
}

export default function LogoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LogoutContent />
    </Suspense>
  )
}
