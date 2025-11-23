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
 * POST /api/auth/token
 * Exchange authorization code for tokens
 * This endpoint acts as a proxy to Hydra's token endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, code_verifier } = body

    if (!code || !code_verifier) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "Missing required parameters: code and code_verifier",
        },
        { status: 400 },
      )
    }

    const tokenEndpoint = process.env.OAUTH2_TOKEN_ENDPOINT
    const clientId = process.env.OAUTH2_CLIENT_ID
    const redirectUri = process.env.OAUTH2_REDIRECT_URI

    if (!tokenEndpoint || !clientId || !redirectUri) {
      console.error("Missing OAuth2 configuration:", {
        hasTokenEndpoint: !!tokenEndpoint,
        hasClientId: !!clientId,
        hasRedirectUri: !!redirectUri,
      })
      return NextResponse.json(
        {
          error: "server_error",
          error_description: "OAuth2 configuration is incomplete",
        },
        { status: 500 },
      )
    }

    // Exchange code for tokens with Hydra
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: code_verifier,
    })

    console.log("Exchanging code for tokens:", {
      tokenEndpoint,
      clientId,
      redirectUri,
      hasCode: !!code,
      hasCodeVerifier: !!code_verifier,
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
      console.error("Token exchange failed:", data)
      const errorData = data as TokenErrorResponse
      return NextResponse.json(
        {
          error: errorData.error || "token_exchange_failed",
          error_description: errorData.error_description || "Failed to exchange code for tokens",
        },
        { status: response.status },
      )
    }

    const tokenData = data as TokenResponse
    console.log("Token exchange successful:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      hasIdToken: !!tokenData.id_token,
    })

    return NextResponse.json(tokenData)
  } catch (error) {
    console.error("Token exchange error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        error_description: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
