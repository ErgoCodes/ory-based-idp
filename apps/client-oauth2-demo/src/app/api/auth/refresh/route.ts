import { NextRequest, NextResponse } from "next/server"

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

interface TokenErrorResponse {
  error: string
  error_description?: string
}

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * This endpoint acts as a proxy to Hydra's token endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "Missing required parameter: refresh_token",
        },
        { status: 400 },
      )
    }

    const tokenEndpoint = process.env.OAUTH2_TOKEN_ENDPOINT
    const clientId = process.env.OAUTH2_CLIENT_ID

    if (!tokenEndpoint || !clientId) {
      console.error("Missing OAuth2 configuration:", {
        hasTokenEndpoint: !!tokenEndpoint,
        hasClientId: !!clientId,
      })
      return NextResponse.json(
        {
          error: "server_error",
          error_description: "OAuth2 configuration is incomplete",
        },
        { status: 500 },
      )
    }

    // Refresh tokens with Hydra
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id: clientId,
    })

    console.log("Refreshing access token:", {
      tokenEndpoint,
      clientId,
      hasRefreshToken: !!refresh_token,
    })

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Token refresh failed:", data)
      const errorData = data as TokenErrorResponse
      return NextResponse.json(
        {
          error: errorData.error || "token_refresh_failed",
          error_description: errorData.error_description || "Failed to refresh access token",
        },
        { status: response.status },
      )
    }

    const tokenData = data as TokenResponse
    console.log("Token refresh successful:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      hasIdToken: !!tokenData.id_token,
    })

    return NextResponse.json(tokenData)
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        error_description: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
