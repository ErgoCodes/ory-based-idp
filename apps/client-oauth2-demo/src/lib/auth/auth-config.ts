import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { HydraProvider } from "./hydra-provider"
import type { HydraProfile, TokenResponse } from "@/types/oauth.types"

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const tokenEndpoint = process.env.OAUTH2_TOKEN_ENDPOINT!
    const clientId = process.env.OAUTH2_CLIENT_ID!

    if (!token.refreshToken || typeof token.refreshToken !== "string") {
      throw new Error("No refresh token available")
    }

    const refreshToken = token.refreshToken

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    })

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error_description || "Token refresh failed")
    }

    const refreshedTokens: TokenResponse = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? refreshToken,
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error refreshing access token:", error)
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

/**
 * NextAuth.js configuration
 *
 * Configures authentication with Hydra OAuth2 provider,
 * automatic token refresh, and session management.
 */
export const authOptions: NextAuthOptions = {
  providers: [HydraProvider],

  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      // Log for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth JWT Callback]", {
          trigger,
          hasAccount: !!account,
          hasProfile: !!profile,
          tokenKeys: Object.keys(token),
        })
      }

      // Initial sign in
      if (account && profile) {
        const hydraProfile = profile as HydraProfile

        if (process.env.NODE_ENV === "development") {
          console.log("[NextAuth] Account received:", {
            provider: account.provider,
            type: account.type,
            hasAccessToken: !!account.access_token,
            hasRefreshToken: !!account.refresh_token,
            expiresAt: account.expires_at,
          })
        }

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          idToken: account.id_token,
          user: {
            id: hydraProfile.sub,
            name: hydraProfile.name,
            email: hydraProfile.email,
            emailVerified: hydraProfile.email_verified,
          },
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken
      }

      if (token.error) {
        session.error = token.error
      }

      return session
    },
  },

  events: {
    async signIn({ user, account }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth] Sign in event:", {
          userId: user.id,
          provider: account?.provider,
          hasAccessToken: !!account?.access_token,
        })
      }
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Redirect to login page on error
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
}
