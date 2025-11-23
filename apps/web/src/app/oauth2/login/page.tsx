"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import type { LoginRequestInfo } from "@repo/api"

interface ErrorResponse {
  error: string
  error_description: string
  error_hint?: string
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const loginChallenge = searchParams.get("login_challenge")

  const [loginRequest, setLoginRequest] = useState<LoginRequestInfo | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!loginChallenge) {
      setError("Missing login challenge parameter")
      setLoading(false)
      return
    }

    if (!apiUrl) {
      setError("API URL not configured")
      setLoading(false)
      return
    }

    // Fetch login request details
    const fetchLoginRequest = async () => {
      try {
        const response = await fetch(`${apiUrl}/oauth2/login?login_challenge=${loginChallenge}`)

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json()
          setError(errorData.error_description || "Failed to fetch login request")
          setLoading(false)
          return
        }

        const data: LoginRequestInfo = await response.json()

        // If Hydra says we can skip login (user already authenticated),
        // automatically accept it without showing the UI
        if (data.skip) {
          console.log("Login can be skipped, auto-accepting with subject:", data.subject)
          await autoAcceptLogin(loginChallenge, data.subject, apiUrl)
          return
        }

        setLoginRequest(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch login request:", err)
        setError("Failed to connect to authentication server")
        setLoading(false)
      }
    }

    fetchLoginRequest()
  }, [loginChallenge, apiUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (!loginChallenge || !apiUrl) {
      setError("Invalid configuration")
      setSubmitting(false)
      return
    }

    try {
      const requestBody = {
        email,
        password,
        remember,
      }
      console.log("Submitting login with:", {
        email,
        remember,
        loginChallenge,
        hasPassword: !!password,
        passwordLength: password?.length || 0,
      })
      console.log("Request body:", requestBody)

      const response = await fetch(`${apiUrl}/oauth2/login?login_challenge=${loginChallenge}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      console.log("Response status:", response.status)

      const data = await response.json()

      if (!response.ok) {
        const errorData: ErrorResponse = data
        console.error("Login error response:", data)
        setError(errorData.error_description || errorData.error || JSON.stringify(data))
        setSubmitting(false)
        return
      }

      // Redirect to the URL provided by Hydra
      if (data.redirect_to) {
        globalThis.location.href = data.redirect_to
      } else {
        setError("Invalid response from server")
        setSubmitting(false)
      }
    } catch (err) {
      console.error("Failed to submit login:", err)
      setError("Failed to connect to authentication server")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !loginRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 bg-destructive/10 border border-destructive rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Authentication Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-card border rounded-lg shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          {loginRequest && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">
                <span className="font-medium">{loginRequest.client.client_name}</span> is requesting
                access to your account
              </p>
              {loginRequest.requested_scope.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Requested permissions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {loginRequest.requested_scope.map((scope) => (
                      <li key={scope} className="text-xs">
                        {scope}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={submitting}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
              Remember me
            </label>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}

/**
 * Auto-accept login when Hydra indicates it can be skipped
 * This happens when the user has previously logged in with "remember me" checked
 */
async function autoAcceptLogin(loginChallenge: string, subject: string, apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/oauth2/login?login_challenge=${loginChallenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // We need to send the subject that Hydra provided
        // But the backend expects email/password, so we need to modify the backend
        // For now, we'll call a different endpoint or handle this differently
        skip: true,
        subject: subject,
      }),
    })

    const data = await response.json()

    if (response.ok && data.redirect_to) {
      // Redirect to consent or back to the OAuth2 client
      globalThis.location.href = data.redirect_to
    } else {
      console.error("Failed to auto-accept login:", data)
      // If auto-accept fails, reload the page to show the login form
      globalThis.location.reload()
    }
  } catch (error) {
    console.error("Error auto-accepting login:", error)
    // If auto-accept fails, reload the page to show the login form
    globalThis.location.reload()
  }
}
