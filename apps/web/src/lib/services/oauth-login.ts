"use server"

import { redirect } from "next/navigation"
import type { LoginRequestInfo } from "@repo/api"

interface ErrorResponse {
  error: string
  error_description: string
  error_hint?: string
}

interface LoginResult {
  success: boolean
  redirect_to?: string
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Fetch login request details from Hydra
 */
export async function getLoginRequest(
  challenge: string,
): Promise<{ data?: LoginRequestInfo; error?: string }> {
  if (!challenge) {
    return { error: "Missing login challenge parameter" }
  }

  if (!API_URL) {
    return { error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/login?login_challenge=${challenge}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return { error: errorData.error_description || "Failed to fetch login request" }
    }

    const data: LoginRequestInfo = await response.json()

    // If Hydra says we can skip login (user already authenticated),
    // automatically accept it without showing the UI
    if (data.skip) {
      await autoAcceptLogin(challenge, data.subject)
      // This will never return as autoAcceptLogin redirects
    }

    return { data }
  } catch (error) {
    console.error("Error fetching login request:", error)
    return { error: "Failed to connect to authentication server" }
  }
}

/**
 * Submit login credentials
 */
export async function submitLogin(
  challenge: string,
  formData: {
    email: string
    password: string
    remember: boolean
  },
): Promise<LoginResult> {
  if (!challenge || !API_URL) {
    return { success: false, error: "Invalid configuration" }
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/login?login_challenge=${challenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData: ErrorResponse = data
      return {
        success: false,
        error: errorData.error_description || errorData.error || "Login failed",
      }
    }

    if (data.redirect_to) {
      return { success: true, redirect_to: data.redirect_to }
    }

    return { success: false, error: "Invalid response from server" }
  } catch (error) {
    console.error("Error submitting login:", error)
    return { success: false, error: "Failed to connect to authentication server" }
  }
}

/**
 * Auto-accept login when Hydra indicates it can be skipped
 * This happens when the user has previously logged in with "remember me" checked
 */
async function autoAcceptLogin(challenge: string, subject: string): Promise<never> {
  if (!API_URL) {
    redirect(`/oauth2/login?login_challenge=${challenge}`)
  }

  try {
    const response = await fetch(`${API_URL}/oauth2/login?login_challenge=${challenge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skip: true,
        subject: subject,
      }),
    })

    const data = await response.json()

    if (response.ok && data.redirect_to) {
      redirect(data.redirect_to)
    }
  } catch (error) {
    console.error("Error auto-accepting login:", error)
  }

  // Fallback: reload the page to show the login UI
  redirect(`/oauth2/login?login_challenge=${challenge}`)
}
