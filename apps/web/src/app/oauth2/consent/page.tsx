"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import type { ConsentRequestInfo } from "@repo/api"

interface ErrorResponse {
  error: string
  error_description: string
  error_hint?: string
}

function ConsentPageContent() {
  const searchParams = useSearchParams()
  const consentChallenge = searchParams.get("consent_challenge")

  const [consentRequest, setConsentRequest] = useState<ConsentRequestInfo | null>(null)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!consentChallenge) {
      setError("Missing consent challenge parameter")
      setLoading(false)
      return
    }

    if (!apiUrl) {
      setError("API URL not configured")
      setLoading(false)
      return
    }

    // Fetch consent request details
    const fetchConsentRequest = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/oauth2/consent?consent_challenge=${consentChallenge}`,
        )

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json()
          setError(errorData.error_description || "Failed to fetch consent request")
          setLoading(false)
          return
        }

        const data: ConsentRequestInfo = await response.json()

        // If Hydra says we can skip consent (user already consented before),
        // automatically accept it without showing the UI
        if (data.skip) {
          await autoAcceptConsent(consentChallenge, apiUrl)
          return
        }

        setConsentRequest(data)
        setLoading(false)
      } catch {
        setError("Failed to connect to authentication server")
        setLoading(false)
      }
    }

    fetchConsentRequest()
  }, [consentChallenge, apiUrl])

  const handleDecision = async (grant: boolean) => {
    setError(null)
    setSubmitting(true)

    if (!consentChallenge || !apiUrl) {
      setError("Invalid configuration")
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch(
        `${apiUrl}/oauth2/consent?consent_challenge=${consentChallenge}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant,
            remember,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        const errorData: ErrorResponse = data
        setError(errorData.error_description || "Consent request failed")
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
    } catch {
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

  if (error && !consentRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 bg-destructive/10 border border-destructive rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Authorization Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-card border rounded-lg shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Grant Access</h1>
          {consentRequest && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">
                <span className="font-medium">{consentRequest.client.client_name}</span> is
                requesting access to your account
              </p>
              <p className="text-xs mt-2">
                User: <span className="font-medium">{consentRequest.subject}</span>
              </p>
            </div>
          )}
        </div>

        {consentRequest && consentRequest.requested_scope.length > 0 && (
          <div className="mb-6 p-4 bg-muted rounded-md">
            <p className="font-medium text-sm mb-2">This application will be able to:</p>
            <ul className="space-y-2">
              {consentRequest.requested_scope.map((scope) => (
                <li key={scope} className="flex items-start text-sm">
                  <svg
                    className="w-5 h-5 mr-2 text-primary shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="mb-4">
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
              Remember my decision
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDecision(false)}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? "Processing..." : "Deny"}
          </Button>
          <Button
            type="button"
            onClick={() => handleDecision(true)}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? "Processing..." : "Grant Access"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By granting access, you allow this application to access your information according to the
          permissions listed above.
        </p>
      </div>
    </div>
  )
}

/**
 * Auto-accept consent when Hydra indicates it can be skipped
 * This happens when the user has previously granted consent with "remember" checked
 */
async function autoAcceptConsent(consentChallenge: string, apiUrl: string) {
  try {
    // First, fetch the consent request to get the requested scopes
    const getResponse = await fetch(
      `${apiUrl}/oauth2/consent?consent_challenge=${consentChallenge}`,
    )

    if (!getResponse.ok) {
      globalThis.location.reload()
      return
    }

    const consentData: ConsentRequestInfo = await getResponse.json()

    // Now accept with the requested scopes
    const response = await fetch(`${apiUrl}/oauth2/consent?consent_challenge=${consentChallenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant: true,
        grant_scope: consentData.requested_scope, // Include the requested scopes
        remember: false, // Don't need to remember again, it's already remembered
      }),
    })

    const data = await response.json()

    if (response.ok && data.redirect_to) {
      globalThis.location.href = data.redirect_to
    } else {
      globalThis.location.reload()
    }
  } catch {
    globalThis.location.reload()
  }
}

export default function ConsentPage() {
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
      <ConsentPageContent />
    </Suspense>
  )
}
