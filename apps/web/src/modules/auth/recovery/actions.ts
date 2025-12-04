"use server"

import { redirect } from "next/navigation"

interface RecoveryResult {
  success: boolean
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Start recovery flow
 */
export async function startRecovery(email: string): Promise<RecoveryResult> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/auth/recovery/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[RecoveryAction] Error response:", errorText)
      return {
        success: false,
        error: "Failed to start recovery process",
      }
    }

    const result = await response.json()

    // Expecting result to contain { flowId: string }
    const flowId = result?.value?.flowId || result?.flowId

    if (!flowId) {
      console.error("[RecoveryAction] Missing flowId in response")
      return {
        success: false,
        error: "Invalid server response",
      }
    }

    // Redirect to /recovery with flowId as query param
    redirect(`/recovery?flowId=${flowId}`)
  } catch (error) {
    // If it's a redirect error, rethrow it so Next.js handles it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }

    console.error("[RecoveryAction] Exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Complete recovery flow
 */
export async function completeRecoveryFlow(
  flowId: string,
  password: string,
): Promise<RecoveryResult> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/auth/settings/flow/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include", // Note: Server Actions don't automatically forward cookies like client fetch.
      // If the API needs cookies, we might need to grab them from `cookies()` and pass them in headers.
      // However, for recovery completion, usually the flowId is enough or the cookie is set on the response.
      // Let's assume for now we just need to send the body.
      // If the backend relies on a session cookie that was set during the flow start, we need to forward it.
      // But typically recovery flow is "unauthenticated" until completion.
      body: JSON.stringify({
        flowId,
        password,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[RecoveryAction] Error response:", errorText)
      return {
        success: false,
        error: "Failed to complete recovery process",
      }
    }

    const result = await response.json()

    if (result.success) {
      return { success: true }
    }

    return { success: false, error: "Recovery completion failed" }
  } catch (error) {
    console.error("[RecoveryAction] Exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Verify recovery code and initialize settings flow
 */
export async function verifyRecoveryCode(
  flowId: string,
  code: string,
): Promise<{ success: boolean; error?: string; settingsFlowId?: string }> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    // 1. Complete recovery flow with code
    const response = await fetch(`${API_URL}/auth/recovery/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flowId,
        code,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[RecoveryAction] Verify code failed:", errorText)
      return {
        success: false,
        error: "Invalid or expired recovery code.",
      }
    }

    const recoveryResult = await response.json()
    console.log("[RecoveryAction] Recovery complete:", recoveryResult)

    const setCookieHeader = response.headers.get("set-cookie")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (setCookieHeader) {
      headers["Cookie"] = setCookieHeader
    }

    const settingsResponse = await fetch(`${API_URL}/auth/settings/flow/create`, {
      method: "POST",
      headers,
    })

    if (!settingsResponse.ok) {
      const errorText = await settingsResponse.text()
      console.error("[RecoveryAction] Settings flow creation failed:", errorText)
      return {
        success: false,
        error: "Failed to initialize password reset.",
      }
    }

    const settingsJson = await settingsResponse.json()
    console.log("[RecoveryAction] Settings flow created:", settingsJson)

    return {
      success: true,
      settingsFlowId: settingsJson.flowId,
    }
  } catch (error) {
    console.error("[RecoveryAction] Exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
