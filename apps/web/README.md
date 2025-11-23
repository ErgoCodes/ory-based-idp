# OAuth2 Identity Provider - Admin Dashboard

This application provides an admin dashboard for managing OAuth2 clients and serves as the Login/Consent Provider for Ory Hydra.

## Features

### 🔐 Authentication

- Admin login with email/password
- User registration
- Session management with NextAuth.js
- Protected routes

### 📊 OAuth2 Client Management

- View all registered OAuth2 clients
- Create new OAuth2 clients
- Edit existing clients
- Delete clients
- View client details (client_id, redirect_uris, scopes, etc.)

### 🎨 UI/UX

- Modern, responsive design with shadcn/ui
- Dark/Light theme support
- Clean and intuitive interface

## Getting Started

### Prerequisites

1. Backend API running on `http://localhost:3000`
2. Ory Hydra running on `http://localhost:4444`
3. Ory Kratos running (for user management)

### Environment Variables

Create a `.env.local` file with:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8362
NEXTAUTH_SECRET=your-secret-key-here

# Generate secret with: openssl rand -base64 32
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

The application will be available at `http://localhost:8362`

## Usage

### 1. Register an Admin Account

1. Navigate to `http://localhost:8362`
2. Click "Register"
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password (min 8 characters)
4. Click "Create Account"

### 2. Login

1. Navigate to `http://localhost:8362/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 3. Manage OAuth2 Clients

#### View Clients

- After login, you'll see the dashboard with all registered clients
- Each client card shows:
  - Client Name
  - Client ID
  - Redirect URIs
  - Grant Types
  - Scopes

#### Create New Client

1. Click "New Client" button
2. Fill in the form:
   - **Client Name**: Name of your application
   - **Redirect URIs**: Where users will be redirected after auth (required)
   - **Post Logout Redirect URIs**: Where users go after logout (optional)
   - **Scopes**: Space-separated list (default: `openid email profile offline_access`)
   - **Token Endpoint Auth Method**:
     - `none` for public clients with PKCE (recommended for SPAs)
     - `client_secret_basic` for confidential clients
     - `client_secret_post` for confidential clients
3. Click "Create Client"
4. Save the `client_id` (and `client_secret` if applicable)

#### Edit Client

1. Click the edit icon (pencil) on a client card
2. Modify the client details
3. Click "Save Changes"

#### Delete Client

1. Click the delete icon (trash) on a client card
2. Confirm the deletion
3. The client will be permanently removed

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### OAuth2 Flows (Hydra Integration)

- `GET /oauth2/login` - Login page for OAuth2 flow
- `GET /oauth2/consent` - Consent page for OAuth2 flow
- `GET /oauth2/logout` - Logout page for OAuth2 flow

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Admin Dashboard (apps/web)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  NextAuth.js │────────▶│  Backend API │                  │
│  │  (Session)   │         │  (NestJS)    │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                          │
│  ┌──────────────┐                 │                          │
│  │  Dashboard   │─────────────────┤                          │
│  │  (React)     │                 │                          │
│  └──────────────┘                 │                          │
│                                   │                          │
└───────────────────────────────────┼──────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │  Backend Services             │
                    ├───────────────────────────────┤
                    │  - Ory Kratos (Users)         │
                    │  - Ory Hydra (OAuth2)         │
                    └───────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes

## Development

### Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   └── clients/
│   │       └── new/            # Create new client
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── oauth2/                 # OAuth2 flow pages
├── components/
│   ├── auth-guard.tsx          # Protected route wrapper
│   └── providers.tsx           # App providers
├── lib/
│   └── auth/
│       └── auth-config.ts      # NextAuth configuration
└── types/
    ├── next-auth.d.ts          # NextAuth type definitions
    └── oauth-client.types.ts   # OAuth2 client types
```

### Adding New Features

1. **New Protected Page**: Wrap with `<AuthGuard>`
2. **New API Route**: Add to `src/app/api/`
3. **New Component**: Add to `src/components/`

## Troubleshooting

### "Invalid credentials" error

- Ensure the backend API is running
- Check that the user exists in Kratos
- Verify the password is correct

### "Failed to fetch clients" error

- Ensure Hydra is running
- Check that the backend API can connect to Hydra
- Verify CORS is configured correctly

### Session not persisting

- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your application URL
- Clear browser cookies and try again

## Security Notes

- Always use HTTPS in production
- Generate a strong `NEXTAUTH_SECRET`
- Implement rate limiting for login attempts
- Use secure password requirements
- Regularly update dependencies

## License

UNLICENSED
