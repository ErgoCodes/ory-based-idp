import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      emailVerified?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    idToken?: string
    error?: string
    user?: {
      id: string
      name?: string | null
      email?: string | null
      emailVerified?: boolean
    }
  }
}
