"use server"

import { redirect } from "next/navigation"

interface RegistrationResult {
  success: boolean
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<RegistrationResult> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/auth/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || "Registration failed",
      }
    }

    // Send verification email after successful registration
    const emailResult = await sendVerificationEmail(data.email)

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Registration succeeded but verification email failed",
      }
    }

    // Redirect to verification notice page
    redirect("/verification/notice")
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Failed to connect to server" }
  }
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string): Promise<RegistrationResult> {
  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    const response = await fetch(`${API_URL}/auth/send-verif-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || "Verification email failed",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Verification email error:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}
