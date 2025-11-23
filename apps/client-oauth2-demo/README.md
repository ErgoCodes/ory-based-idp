# OAuth2 Client Demo with Refresh Token Support

This is a demonstration OAuth2 client application that showcases the complete OAuth2 Authorization Code Flow with PKCE and automatic token refresh.

## Features

- ✅ OAuth2 Authorization Code Flow with PKCE
- ✅ Automatic access token refresh using refresh tokens
- ✅ Token rotation support
- ✅ Protected routes with authentication
- ✅ Automatic retry on 401 errors
- ✅ User session management

## Getting Started

### 1. Prerequisites

- Ory Hydra running on `http://localhost:4444` (public) and `http://localhost:4445` (admin)
- An OAuth2 client registered in Hydra with:
  - `grant_types`: `['authorization_code', 'refresh_token']`
  - `response_types`: `['code']`
  - `scope`: `'openid email profile offline_access'`
  - `token_endpoint_auth_method`: `'none'` (for PKCE)
  - `redirect_uris`: `['http://localhost:3001/callback']`

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# Client-side configuration (exposed to browser)
NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT=http://localhost:4444/oauth2/auth
NEXT_PUBLIC_OAUTH2_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_OAUTH2_REDIRECT_URI=http://localhost:3001/callback
NEXT_PUBLIC_OAUTH2_SCOPE=openid email profile offline_access
NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT=http://localhost:4444/userinfo

# Server-side configuration (not exposed to browser)
OAUTH2_TOKEN_ENDPOINT=http://localhost:4444/oauth2/token
OAUTH2_CLIENT_ID=your-client-id-here
OAUTH2_REDIRECT_URI=http://localhost:3001/callback
```

**Important:** Make sure to include `offline_access` in the scope to receive refresh tokens.

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3001`.

## Application Structure

```
apps/client-oauth2-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page with login
│   │   ├── callback/page.tsx           # OAuth2 callback handler
│   │   ├── protected/page.tsx          # Protected page (requires auth)
│   │   └── api/
│   │       └── auth/
│   │           ├── token/route.ts      # Token exchange endpoint
│   │           └── refresh/route.ts    # Token refresh endpoint
│   └── lib/
│       ├── pkce.ts                     # PKCE utilities
│       └── token-manager.ts            # Token management & auto-refresh
├── .env.example                        # Environment variables template
├── README.md                           # This file
└── REFRESH_TOKEN.md                    # Detailed refresh token documentation
```

## Usage Flow

### 1. Login

1. Navigate to `http://localhost:3001`
2. Click "Login with OAuth2"
3. You'll be redirected to the login page
4. Enter your credentials
5. Grant consent
6. You'll be redirected back with tokens

### 2. Access Protected Resources

1. After login, click "Go to Protected Page"
2. The page will display your user information
3. Click "Test API Call" to make an authenticated request
4. If your access token has expired, it will automatically refresh

### 3. Automatic Token Refresh

The application automatically handles token refresh:

```typescript
import { fetchWithAuth } from "@/lib/token-manager"

// This will automatically refresh the token if it's expired
const response = await fetchWithAuth("http://localhost:4444/userinfo")
```

### 4. Logout

Click "Logout" to clear all tokens and end the session.

## Key Components

### Token Manager (`src/lib/token-manager.ts`)

Provides utilities for token management:

- `refreshAccessToken()`: Manually refresh the access token
- `fetchWithAuth(url, options)`: Make authenticated requests with auto-refresh
- `getAccessToken()`: Get the current access token
- `isAuthenticated()`: Check if user is authenticated
- `clearTokens()`: Clear all stored tokens
- `getUserClaims()`: Get stored user claims

### PKCE Utilities (`src/lib/pkce.ts`)

Implements PKCE (Proof Key for Code Exchange):

- `generateCodeVerifier()`: Generate random code verifier
- `generateCodeChallenge(verifier)`: Generate code challenge (S256)
- `generateState()`: Generate state parameter for CSRF protection
- `initiateOAuth2Flow()`: Start the OAuth2 authorization flow

### Token Exchange Endpoint (`src/app/api/auth/token/route.ts`)

Exchanges authorization code for tokens:

```
POST /api/auth/token
Body: { code, code_verifier }
Response: { access_token, refresh_token, id_token, ... }
```

### Token Refresh Endpoint (`src/app/api/auth/refresh/route.ts`)

Refreshes access token using refresh token:

```
POST /api/auth/refresh
Body: { refresh_token }
Response: { access_token, refresh_token, id_token, ... }
```

### Userinfo Endpoint (`src/app/api/auth/userinfo/route.ts`)

Fetches user information from Hydra (acts as CORS proxy):

```
GET /api/auth/userinfo
Headers: { Authorization: Bearer <access_token> }
Response: { sub, email, name, ... }
```

## Security Features

### 1. PKCE (Proof Key for Code Exchange)

Protects against authorization code interception attacks:

- Code verifier generated with cryptographically secure random values
- Code challenge uses SHA-256 hashing (S256 method)
- Code verifier validated during token exchange

### 2. State Parameter

Protects against CSRF attacks:

- Random state generated for each authorization request
- State validated on callback

### 3. Token Rotation

Hydra implements refresh token rotation:

- Each refresh returns a new refresh token
- Old refresh token is invalidated
- Detects and prevents token replay attacks

### 4. Token Storage

Tokens are stored in `sessionStorage`:

- Cleared when browser tab is closed
- Not shared across tabs
- Consider using `httpOnly` cookies in production

## Testing

### Test Token Refresh

1. Log in to the application
2. Navigate to the protected page
3. Open browser DevTools → Application → Session Storage
4. Note the current `access_token` value
5. Delete the `access_token` from session storage
6. Click "Test Token Refresh"
7. Verify that a new access token is obtained automatically and the API call succeeds

### Test Token Rotation

1. Log in to the application
2. Note the current `refresh_token` value in session storage
3. Trigger a token refresh (delete access token and make API call)
4. Verify that a new `refresh_token` is stored

### Test Expired Refresh Token

1. Log in to the application
2. Corrupt the `refresh_token` in session storage
3. Delete the `access_token`
4. Try to make an API call
5. Verify that you're redirected to login

## Troubleshooting

### Not receiving refresh token

**Cause:** Missing `offline_access` scope

**Solution:** Ensure your authorization request includes `offline_access` in the scope:

```typescript
scope: "openid email profile offline_access"
```

### Token refresh fails with 401

**Possible causes:**

- Refresh token has expired
- Refresh token has been revoked
- Client ID mismatch

**Solution:** Clear tokens and re-authenticate

### CORS errors when calling Hydra

**Cause:** Browser blocking cross-origin requests

**Solution:** Use the API routes (`/api/auth/token` and `/api/auth/refresh`) which act as proxies to Hydra

## Documentation

- [REFRESH_TOKEN.md](./REFRESH_TOKEN.md) - Detailed refresh token implementation guide
- [Ory Hydra Documentation](https://www.ory.com/docs/oauth2-oidc/authorization-code-flow)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)

## License

MIT
