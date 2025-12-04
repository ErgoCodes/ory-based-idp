"use server"

import { redirect } from "next/navigation"
import type { ConsentRequestInfo } from "@repo/api"

interface ErrorResponse {
  error: string
  error_description: string
  error_hint?: string
}

interface ConsentResult {
  success: boolean
  redirect_to?: string
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Fetch consent request details from Hydra
 */
export async function getConsentRequest(
  challenge: string,
): Promise<{ data?: ConsentRequestInfo; error?: string }> {
  if (!challenge) {
    return { error: "Missing consent challenge parameter" }
  }

  if (!API_URL) {
    return { error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/consent?consent_challenge=${challenge}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return { error: errorData.error_description || "Failed to fetch consent request" }
    }

    const data: ConsentRequestInfo = await response.json()

    // If Hydra says we can skip consent (user already consented before),
    // automatically accept it without showing the UI
    if (data.skip) {
      await autoAcceptConsent(challenge, data.requested_scope)
      // This will never return as autoAcceptConsent redirects
    }

    return { data }
  } catch (error) {
    console.error("Error fetching consent request:", error)
    return { error: "Failed to connect to authentication server" }
  }
}

/**
 * Accept consent request
 */
export async function acceptConsent(
  challenge: string,
  remember: boolean,
  scopes: string[],
): Promise<ConsentResult> {
  if (!challenge || !API_URL) {
    return { success: false, error: "Invalid configuration" }
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/consent?consent_challenge=${challenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant: true,
        remember,
        grant_scope: scopes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData: ErrorResponse = data
      return {
        success: false,
        error: errorData.error_description || "Consent request failed",
      }
    }

    if (data.redirect_to) {
      redirect(data.redirect_to)
    }

    return { success: false, error: "Invalid response from server" }
  } catch (error) {
    console.error("Error accepting consent:", error)
    return { success: false, error: "Failed to connect to authentication server" }
  }
}

/**
 * Reject consent request
 */
export async function rejectConsent(challenge: string): Promise<ConsentResult> {
  if (!challenge || !API_URL) {
    return { success: false, error: "Invalid configuration" }
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/consent?consent_challenge=${challenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant: false,
        remember: false,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData: ErrorResponse = data
      return {
        success: false,
        error: errorData.error_description || "Consent request failed",
      }
    }

    if (data.redirect_to) {
      redirect(data.redirect_to)
    }

    return { success: false, error: "Invalid response from server" }
  } catch (error) {
    console.error("Error rejecting consent:", error)
    return { success: false, error: "Failed to connect to authentication server" }
  }
}

/**
 * Auto-accept consent when Hydra indicates it can be skipped
 * This happens when the user has previously granted consent with "remember" checked
 */
async function autoAcceptConsent(challenge: string, requestedScopes: string[]): Promise<never> {
  if (!API_URL) {
    redirect("/oauth2/consent?consent_challenge=" + challenge)
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/consent?consent_challenge=${challenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant: true,
        grant_scope: requestedScopes,
        remember: false, // Don't need to remember again, it's already remembered
      }),
    })

    const data = await response.json()

    if (response.ok && data.redirect_to) {
      redirect(data.redirect_to)
    }
  } catch (error) {
    console.error("Error auto-accepting consent:", error)
  }

  // Fallback: reload the page to show the consent UI
  redirect("/oauth2/consent?consent_challenge=" + challenge)
}

/**
 * Handle logout request
 */
export async function handleLogout(challenge: string): Promise<never> {
  if (!API_URL) {
    redirect("/oauth2/logged-out")
  }

  if (!challenge) {
    redirect("/oauth2/logged-out")
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/logout?logout_challenge=${challenge}`, {
      method: "POST",
    })

    if (!response.ok) {
      redirect("/oauth2/logged-out")
    }

    const data = await response.json()

    if (data.success && data.value.redirect_to) {
      redirect(data.value.redirect_to)
    }
  } catch (error) {
    console.error("Error handling logout:", error)
  }

  // Fallback: redirect to logged-out page
  redirect("/oauth2/logged-out")
}
