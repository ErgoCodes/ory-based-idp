import { NextRequest, NextResponse } from "next/server"

interface UserInfoResponse {
  sub: string
  email?: string
  name?: string
  email_verified?: boolean
  [key: string]: unknown
}

interface ErrorResponse {
  error: string
  error_description?: string
}

/**
 * GET /api/auth/userinfo
 * Fetch user information from Hydra's userinfo endpoint
 * This endpoint acts as a proxy to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "Missing or invalid Authorization header",
        },
        { status: 401 },
      )
    }

    const accessToken = authHeader.substring(7) // Remove "Bearer " prefix

    const userinfoEndpoint = process.env.NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT

    if (!userinfoEndpoint) {
      console.error("NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT not configured")
      return NextResponse.json(
        {
          error: "server_error",
          error_description: "Userinfo endpoint is not configured",
        },
        { status: 500 },
      )
    }

    console.log("Fetching user info from:", userinfoEndpoint)

    // Call Hydra's userinfo endpoint
    const response = await fetch(userinfoEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Userinfo request failed:", data)
      const errorData = data as ErrorResponse
      return NextResponse.json(
        {
          error: errorData.error || "userinfo_failed",
          error_description: errorData.error_description || "Failed to fetch user information",
        },
        { status: response.status },
      )
    }

    const userInfo = data as UserInfoResponse
    console.log("User info retrieved successfully:", {
      sub: userInfo.sub,
      hasEmail: !!userInfo.email,
      hasName: !!userInfo.name,
    })

    return NextResponse.json(userInfo)
  } catch (error) {
    console.error("Userinfo error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        error_description: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
