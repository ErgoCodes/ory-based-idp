# OAuth2 Demo Client

> Example application demonstrating OAuth2 integration with the Identity Provider

## Overview

This is a demonstration application that shows how to integrate with the Ory-Based Identity Provider using the OAuth2 Authorization Code Flow. It serves as a reference implementation for developers who want to add OAuth2 authentication to their applications.

## Features

- **OAuth2 Authentication**: Complete Authorization Code Flow implementation
- **NextAuth.js Integration**: Seamless authentication with NextAuth.js
- **Token Management**: Automatic token refresh with refresh tokens
- **Protected Routes**: Example of route protection
- **User Profile**: Display authenticated user information
- **Session Management**: Secure session handling

## Technology Stack

- **Framework**: Next.js 15
- **Authentication**: NextAuth.js with custom OAuth2 provider
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Identity Provider running (backend API + Ory services)
- OAuth2 client created in the admin dashboard

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create an OAuth2 client:
   - Login to admin dashboard at `http://localhost:3001`
   - Navigate to "OAuth2 Clients"
   - Click "Create New Client"
   - Fill in:
     - **Client Name**: "Demo Application"
     - **Redirect URIs**: `http://localhost:8363/api/auth/callback/hydra`
     - **Grant Types**: `authorization_code`, `refresh_token`
     - **Scopes**: `openid email profile offline_access`
   - Save and copy the **Client ID** and **Client Secret**

3. Configure environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8363
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# OAuth2 Client Configuration (Public)
NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT=http://localhost:4444/oauth2/auth
NEXT_PUBLIC_OAUTH2_SCOPE=openid email profile offline_access
NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT=http://localhost:4444/userinfo

# OAuth2 Server Configuration (Private)
OAUTH2_CLIENT_ID=your-client-id-from-step-2
OAUTH2_TOKEN_ENDPOINT=http://localhost:4444/oauth2/token
```

4. Start the application:

```bash
pnpm run dev
```

5. Open [http://localhost:8363](http://localhost:8363)

## How It Works

### OAuth2 Authorization Code Flow

```
┌─────────────┐                                  ┌──────────────────┐
│   Browser   │                                  │  Demo Client     │
│             │                                  │  (This App)      │
└──────┬──────┘                                  └────────┬─────────┘
       │                                                  │
       │ 1. Click "Sign in with OAuth2"                  │
       ├─────────────────────────────────────────────────>
       │                                                  │
       │ 2. Redirect to authorization endpoint           │
       <─────────────────────────────────────────────────┤
       │                                                  │
       │                                  ┌───────────────────────┐
       │ 3. Login & Consent               │  Identity Provider    │
       ├─────────────────────────────────>│  (Ory Hydra/Kratos)  │
       │                                  └───────────┬───────────┘
       │ 4. Authorization code                        │
       <──────────────────────────────────────────────┤
       │                                              │
       │ 5. Exchange code for tokens                  │
       ├──────────────────────────────────────────────>
       │                                              │
       │ 6. Access token + Refresh token              │
       <──────────────────────────────────────────────┤
       │                                              │
       │ 7. Redirect to callback                      │
       ├─────────────────────────────────────────────>
       │                                              │
       │ 8. User info + session created               │
       <─────────────────────────────────────────────┤
       │                                              │
```

### Key Components

#### 1. Hydra Provider (`src/lib/auth/hydra-provider.ts`)

Custom OAuth2 provider for NextAuth.js:

```typescript
export const HydraProvider: OAuthConfig<HydraProfile> = {
  id: "hydra",
  name: "Hydra",
  type: "oauth",
  authorization: {
    url: process.env.NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT!,
    params: {
      scope: process.env.NEXT_PUBLIC_OAUTH2_SCOPE!,
    },
  },
  token: process.env.OAUTH2_TOKEN_ENDPOINT!,
  userinfo: process.env.NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT!,
  // ... profile mapping
}
```

#### 2. Auth Configuration (`src/lib/auth/auth-config.ts`)

NextAuth.js configuration with token refresh:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [HydraProvider],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store tokens and handle refresh
    },
    async session({ session, token }) {
      // Populate session with user data
    },
  },
  // ...
}
```

#### 3. Protected Routes

Example of protecting routes:

```typescript
// In page component
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <div>Protected content</div>
}
```

## Pages

### Home (`/`)

- Landing page
- "Sign in with OAuth2" button
- Public access

### Login (`/login`)

- Custom login page
- Initiates OAuth2 flow
- Redirects to Identity Provider

### Profile (`/profile`)

- Protected route
- Displays user information:
  - Name
  - Email
  - Email verification status
- Logout button

### Protected (`/protected`)

- Example protected route
- Requires authentication
- Demonstrates route protection

## Token Management

### Access Tokens

- Short-lived (typically 1 hour)
- Used for API requests
- Automatically included in session

### Refresh Tokens

- Long-lived (typically 30 days)
- Used to obtain new access tokens
- Automatically refreshed when access token expires

### Automatic Refresh

The application automatically refreshes tokens:

```typescript
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: clientId,
      }),
    })

    const refreshedTokens = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
```

## Environment Variables

| Variable                                    | Description          | Example                                 |
| ------------------------------------------- | -------------------- | --------------------------------------- |
| `NEXTAUTH_URL`                              | Application URL      | `http://localhost:8363`                 |
| `NEXTAUTH_SECRET`                           | NextAuth secret key  | Generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT` | OAuth2 auth endpoint | `http://localhost:4444/oauth2/auth`     |
| `NEXT_PUBLIC_OAUTH2_SCOPE`                  | Requested scopes     | `openid email profile offline_access`   |
| `NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT`      | Userinfo endpoint    | `http://localhost:4444/userinfo`        |
| `OAUTH2_CLIENT_ID`                          | OAuth2 client ID     | From admin dashboard                    |
| `OAUTH2_TOKEN_ENDPOINT`                     | Token endpoint       | `http://localhost:4444/oauth2/token`    |

⚠️ **Important**: `NEXTAUTH_SECRET` must remain constant. Changing it will invalidate all existing sessions.

## Customization

### Adding Custom Claims

To access custom claims from the ID token:

1. Update the profile type:

```typescript
interface HydraProfile {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  custom_claim?: string // Add your claim
}
```

2. Map in the provider:

```typescript
profile(profile: HydraProfile) {
  return {
    id: profile.sub,
    email: profile.email,
    name: profile.name,
    customClaim: profile.custom_claim,  // Map your claim
  }
}
```

### Styling

The application uses Tailwind CSS. Customize in `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#your-color",
      },
    },
  },
}
```

## Troubleshooting

### "Invalid redirect_uri" error

- Verify redirect URI in `.env.local` matches the one configured in admin dashboard
- Check for trailing slashes (should match exactly)

### "Invalid client" error

- Verify `OAUTH2_CLIENT_ID` is correct
- Ensure the client exists in the admin dashboard
- Check client hasn't been deleted

### Session expires immediately

- Verify `NEXTAUTH_SECRET` is set and hasn't changed
- Check token expiration times
- Review browser console for errors

### Token refresh fails

- Ensure `offline_access` scope is included
- Verify refresh token is being stored
- Check token endpoint URL is correct

### "JWT decryption failed" error

- `NEXTAUTH_SECRET` has changed - all sessions invalidated
- Generate new secret and restart application
- Users will need to login again

## Building for Production

```bash
# Build
pnpm run build

# Start production server
pnpm run start
```

### Production Checklist

- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Update OAuth2 client redirect URIs in admin dashboard
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Test complete OAuth2 flow
- [ ] Test token refresh
- [ ] Test logout

## Integration Guide

To integrate OAuth2 authentication in your own application:

1. **Install NextAuth.js**:

```bash
pnpm add next-auth
```

2. **Copy the Hydra provider** from `src/lib/auth/hydra-provider.ts`

3. **Configure NextAuth.js** with the provider

4. **Create OAuth2 client** in admin dashboard

5. **Set environment variables**

6. **Protect routes** using `getServerSession`

7. **Test the flow** end-to-end

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth2 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [Ory Hydra Documentation](https://www.ory.sh/docs/hydra)

## Contributing

See main project README for contribution guidelines.

## License

MIT License - see LICENSE file in project root.
