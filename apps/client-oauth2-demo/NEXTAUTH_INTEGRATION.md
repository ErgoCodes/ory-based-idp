# NextAuth.js Integration with Hydra OAuth2

## Overview

This OAuth2 client demo now uses **NextAuth.js** (Auth.js) for authentication management. NextAuth provides a robust, production-ready solution for OAuth2 authentication with built-in support for:

- ✅ Automatic token refresh
- ✅ PKCE (Proof Key for Code Exchange)
- ✅ Session management
- ✅ TypeScript support
- ✅ Server-side and client-side authentication

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ NextAuth.js Client (apps/client-oauth2-demo)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Frontend    │────────▶│  NextAuth    │                  │
│  │  (React)     │         │  API Routes  │                  │
│  │              │         │              │                  │
│  │ useSession() │         │ [...nextauth]│                  │
│  │ signIn()     │         │ /route.ts    │                  │
│  │ signOut()    │         │              │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                          │
└───────────────────────────────────┼──────────────────────────┘
                                    │
                                    │ OAuth2 Flow
                                    │
                    ┌───────────────▼───────────────┐
                    │  Hydra OAuth2 Server          │
                    │  + Login/Consent Provider     │
                    │  (Your Backend)               │
                    └───────────────────────────────┘
```

## Key Files

### 1. NextAuth Configuration

**File:** `src/app/api/auth/[...nextauth]/route.ts`

Custom Hydra OAuth2 provider configuration:

- Authorization endpoint
- Token endpoint
- Userinfo endpoint
- PKCE support
- Automatic token refresh

### 2. Type Definitions

**File:** `src/types/next-auth.d.ts`

TypeScript definitions for:

- Session object (includes accessToken)
- User object
- JWT token

### 3. Session Provider

**File:** `src/components/providers.tsx`

Wraps the app with NextAuth SessionProvider for client-side session access.

### 4. Layout

**File:** `src/app/layout.tsx`

Root layout includes the Providers wrapper.

## Features Implemented

### 1. OAuth2 Authorization Code Flow with PKCE

NextAuth automatically handles:

- PKCE code verifier generation
- Code challenge creation (S256)
- State parameter for CSRF protection
- Authorization code exchange

### 2. Automatic Token Refresh

When the access token expires:

1. NextAuth detects expiration
2. Calls refresh token endpoint
3. Updates session with new tokens
4. Retries failed requests automatically

**Implementation:** See `refreshAccessToken()` function in `[...nextauth]/route.ts`

### 3. Session Management

**Client-side:**

```typescript
import { useSession, signIn, signOut } from "next-auth/react"

function MyComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") return <button onClick={() => signIn("hydra")}>Login</button>

  return (
    <div>
      <p>Welcome {session.user.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}
```

**Server-side:**

```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Use session.accessToken to make API calls
  return Response.json({ user: session.user })
}
```

### 4. Protected Routes

**Example:** `src/app/profile/page.tsx`

```typescript
const { data: session, status } = useSession()

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/")
  }
}, [status, router])
```

## Configuration

### Environment Variables

**Client-side (exposed to browser):**

```bash
NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT=http://localhost:4444/oauth2/auth
NEXT_PUBLIC_OAUTH2_SCOPE=openid email profile offline_access
NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT=http://localhost:4444/userinfo
```

**Server-side (not exposed):**

```bash
OAUTH2_CLIENT_ID=your-client-id
OAUTH2_TOKEN_ENDPOINT=http://localhost:4444/oauth2/token
NEXTAUTH_URL=http://localhost:8363
NEXTAUTH_SECRET=your-secret-key-here
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Migration from Custom Implementation

### Before (Custom Implementation)

```typescript
// Manual PKCE
const codeVerifier = generateCodeVerifier()
const codeChallenge = await generateCodeChallenge(codeVerifier)

// Manual token exchange
const response = await fetch("/api/auth/token", {
  method: "POST",
  body: JSON.stringify({ code, code_verifier }),
})

// Manual token refresh
const refreshResponse = await fetch("/api/auth/refresh", {
  method: "POST",
  body: JSON.stringify({ refresh_token }),
})

// Manual session storage
sessionStorage.setItem("access_token", token)
```

### After (NextAuth)

```typescript
// Everything handled automatically
import { signIn, useSession } from "next-auth/react"

// Login
signIn("hydra")

// Access session
const { data: session } = useSession()

// Logout
signOut()

// Token refresh is automatic!
```

## Benefits of NextAuth Integration

### 1. Production-Ready

- Battle-tested by thousands of applications
- Regular security updates
- Active community support

### 2. Automatic Token Management

- No manual token storage
- Automatic refresh before expiration
- Secure token handling

### 3. Better Developer Experience

- Simple API (`useSession`, `signIn`, `signOut`)
- TypeScript support out of the box
- Server-side and client-side support

### 4. Security Best Practices

- PKCE handled automatically
- CSRF protection with state parameter
- Secure cookie-based sessions
- No tokens in localStorage

### 5. Flexibility

- Easy to add more OAuth providers
- Customizable callbacks
- Extensible with middleware

## Comparison: Custom vs NextAuth

| Feature            | Custom Implementation    | NextAuth          |
| ------------------ | ------------------------ | ----------------- |
| PKCE               | Manual implementation    | ✅ Automatic      |
| Token Refresh      | Manual with interceptors | ✅ Automatic      |
| Session Management | sessionStorage           | ✅ Secure cookies |
| TypeScript         | Manual types             | ✅ Built-in       |
| Server-side Auth   | Complex                  | ✅ Simple         |
| Multiple Providers | Manual for each          | ✅ Easy to add    |
| Security Updates   | Manual                   | ✅ Automatic      |
| Code Maintenance   | High                     | ✅ Low            |

## Testing

### 1. Login Flow

1. Navigate to `http://localhost:8363`
2. Click "Login with OAuth2"
3. Complete login/consent
4. Verify session is created

### 2. Token Refresh

1. Wait for token to expire (or manually expire it)
2. Navigate to protected page
3. Verify token is automatically refreshed
4. No re-login required

### 3. Logout

1. Click "Logout"
2. Verify session is cleared
3. Verify redirect to home page

## Troubleshooting

### Issue: "redirect_uri does not match"

**Error Message:**

```
The 'redirect_uri' parameter does not match any of the OAuth 2.0 Client's pre-registered redirect urls.
```

**Cause:** NextAuth uses a specific callback URL format that must be registered in Hydra.

**Solution:** Update your OAuth2 client in Hydra to include the correct redirect URI.

NextAuth callback URL format: `{NEXTAUTH_URL}/api/auth/callback/{provider_id}`

For this demo: `http://localhost:8363/api/auth/callback/hydra`

**Quick Fix (PowerShell):**

```powershell
cd apps/api
.\scripts\update-oauth2-client.ps1
```

**Quick Fix (Bash):**

```bash
cd apps/api
chmod +x scripts/update-oauth2-client.sh
./scripts/update-oauth2-client.sh
```

**Manual Fix (curl):**

```bash
curl -X PUT http://localhost:4445/admin/clients/YOUR_CLIENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_name": "NextAuth OAuth2 Demo Client",
    "redirect_uris": ["http://localhost:8363/api/auth/callback/hydra"],
    "post_logout_redirect_uris": ["http://localhost:8363"],
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "scope": "openid email profile offline_access",
    "token_endpoint_auth_method": "none"
  }'
```

### Issue: "NEXTAUTH_URL not set"

**Solution:** Add to `.env.local`:

```bash
NEXTAUTH_URL=http://localhost:8363
```

### Issue: "NEXTAUTH_SECRET not set"

**Solution:** Generate and add secret:

```bash
openssl rand -base64 32
# Add to .env.local
NEXTAUTH_SECRET=generated-secret-here
```

### Issue: Token refresh fails

**Possible causes:**

- Refresh token expired
- Client not configured with `refresh_token` grant type
- Token endpoint URL incorrect

**Solution:** Check client configuration in Hydra

### Issue: PKCE error

**Solution:** Ensure client has:

```typescript
{
  token_endpoint_auth_method: "none", // For public clients
  grant_types: ["authorization_code", "refresh_token"]
}
```

## Next Steps

1. **Add NEXTAUTH_SECRET** to `.env.local`
2. **Test the login flow**
3. **Test token refresh** by waiting or manually expiring tokens
4. **Customize** the provider configuration as needed
5. **Add more providers** if needed (Google, GitHub, etc.)

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth2 Provider Configuration](https://next-auth.js.org/configuration/providers/oauth)
- [Ory Hydra Documentation](https://www.ory.com/docs/hydra/)
- [PKCE RFC](https://datatracker.ietf.org/doc/html/rfc7636)

## Code Quality Improvements

### Removed Unused Code

The following legacy files and folders have been removed:

- ❌ `src/lib/` - All custom OAuth2 implementation files
- ❌ `src/app/callback/` - Legacy callback handler
- ❌ All `any` types replaced with proper TypeScript types

### Fixed Linting Issues

- ✅ Removed unnecessary type assertions
- ✅ Fixed `style jsx` warnings by using `dangerouslySetInnerHTML`
- ✅ Simplified nested ternary operations
- ✅ Used optional chaining where appropriate
- ✅ All TypeScript diagnostics passing

### Clean Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts  # NextAuth configuration
│   │       └── userinfo/route.ts       # Userinfo endpoint proxy
│   ├── profile/page.tsx                # User profile page
│   ├── protected/page.tsx              # Protected route example
│   ├── page.tsx                        # Home page
│   └── layout.tsx                      # Root layout
├── components/
│   └── providers.tsx                   # SessionProvider wrapper
└── types/
    └── next-auth.d.ts                  # NextAuth type definitions
```

## Conclusion

NextAuth.js provides a robust, production-ready solution for OAuth2 authentication. The integration with Hydra is seamless and handles all the complex OAuth2 flows automatically, including PKCE, token refresh, and session management.

All legacy custom implementation files have been removed, and the codebase is now clean, type-safe, and follows best practices with zero linting errors.
