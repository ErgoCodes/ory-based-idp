import type { OAuthConfig } from "next-auth/providers/oauth"
import type { HydraProfile } from "@/types/oauth.types"

/**
 * Custom Hydra OAuth2 Provider for NextAuth.js
 *
 * This provider implements OAuth2 Authorization Code Flow with PKCE
 * for Ory Hydra OAuth2 server.
 */
export const HydraProvider: OAuthConfig<HydraProfile> = {
  id: "hydra",
  name: "Hydra OAuth2",
  type: "oauth",
  version: "2.0",

  authorization: {
    url: process.env.NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT!,
    params: {
      scope: process.env.NEXT_PUBLIC_OAUTH2_SCOPE || "openid email profile offline_access",
    },
  },

  token: {
    url: process.env.OAUTH2_TOKEN_ENDPOINT!,
    async request(context) {
      const { provider, params, checks } = context

      // Construct the correct redirect_uri
      const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/${provider.id}`

      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth] Token request:", {
          tokenUrl: process.env.OAUTH2_TOKEN_ENDPOINT,
          hasCode: !!params.code,
          hasCodeVerifier: !!checks.code_verifier,
          clientId: provider.clientId,
          redirectUri,
        })
      }

      const tokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code as string,
        redirect_uri: redirectUri,
        client_id: provider.clientId as string,
        code_verifier: checks.code_verifier as string,
      })

      const response = await fetch(process.env.OAUTH2_TOKEN_ENDPOINT!, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenParams.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (process.env.NODE_ENV === "development") {
          console.error("[NextAuth] Token exchange failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          })
        }
        throw new Error(`Token exchange failed: ${response.statusText}`)
      }

      const tokens = await response.json()

      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth] Token exchange successful:", {
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token,
          hasIdToken: !!tokens.id_token,
          expiresIn: tokens.expires_in,
        })
      }

      return { tokens }
    },
  },

  userinfo: {
    url: process.env.NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT!,
  },

  clientId: process.env.OAUTH2_CLIENT_ID!,
  clientSecret: "", // Empty string for public clients with PKCE

  checks: ["pkce", "state"],

  profile(profile: HydraProfile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: null,
      emailVerified: profile.email_verified,
    }
  },

  style: {
    logo: "/logo.svg",
    logoDark: "/logo-dark.svg",
    bg: "#fff",
    text: "#000",
    bgDark: "#000",
    textDark: "#fff",
  },
}
