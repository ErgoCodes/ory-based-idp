"use server"

import { redirect } from "next/navigation"

interface VerificationResult {
  success: boolean
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Verify email with code
 */
export async function verifyEmail(flowId: string, code: string): Promise<VerificationResult> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  if (!flowId) {
    return { success: false, error: "Flow ID is required" }
  }

  try {
    const response = await fetch(`${API_URL}/auth/complete-email-verification`, {
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
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || "Verification failed",
      }
    }

    // Redirect to home page on success
    redirect("/")
  } catch (error) {
    console.error("Verification error:", error)
    return { success: false, error: "Failed to verify email" }
  }
}
