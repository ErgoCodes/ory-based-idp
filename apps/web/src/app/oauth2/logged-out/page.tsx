"use client"

import { useEffect } from "react"

export default function LoggedOutPage() {
  useEffect(() => {
    // Auto-close window after a few seconds if opened in popup
    const timer = setTimeout(() => {
      if (window.opener) {
        window.close()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Logged Out Successfully</h1>

        <p className="mb-6 text-sm text-gray-600">
          You have been successfully logged out from all applications. Your session has been
          terminated and all tokens have been revoked.
        </p>

        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-xs text-blue-700">
            You can now safely close this window or navigate back to the application.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray-500">
            This window will close automatically in a few seconds if opened as a popup.
          </p>
        </div>
      </div>
    </div>
  )
}
