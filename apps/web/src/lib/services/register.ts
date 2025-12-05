interface RegistrationResult {
  success: boolean
  error?: string
  shouldRedirect?: boolean
  flowId?: string
}

/**
 * Register a new user (Client-side function)
 */
export async function registerUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<RegistrationResult> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  if (!API_URL) {
    return { success: false, error: "API URL not configured" }
  }

  try {
    // First, create a registration flow
    const flowResponse = await fetch(`${API_URL}/auth/registration/init`, {
      method: "GET",
    })

    if (!flowResponse.ok) {
      return { success: false, error: "Failed to initialize registration flow" }
    }

    const flowData = await flowResponse.json()
    const flowId = flowData.id

    // Then register with the flow ID
    const response = await fetch(`${API_URL}/auth/registration?flow=${flowId}`, {
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
      console.error("Registration failed:", errorData)
      return {
        success: false,
        error:
          errorData.message ||
          errorData.error ||
          JSON.stringify(errorData) ||
          "Registration failed",
      }
    }

    // Send verification email after successful registration
    const emailResult = await sendVerificationEmail(data.email, API_URL)
    console.log({ emailResult })

    if (!emailResult.success) {
      // Registration succeeded but email failed - still redirect but show warning
      return {
        success: true,
        shouldRedirect: true,
        error: emailResult.error || "Registration succeeded but verification email failed",
      }
    }

    // Redirect to verification page with flowId
    return {
      success: true,
      shouldRedirect: true,
      flowId: emailResult.flowId,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Failed to connect to server" }
  }
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string, apiUrl: string): Promise<RegistrationResult> {
  try {
    const response = await fetch(`${apiUrl}/auth/send-verif-email`, {
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

    const data = await response.json()
    console.log("Verification email response:", data)
    console.log("Extracted flowId:", data.value?.flowId)
    return {
      success: true,
      flowId: data.value?.flowId,
    }
  } catch (error) {
    console.error("Verification email error:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}
