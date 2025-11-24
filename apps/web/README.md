# Admin Dashboard

> Modern admin dashboard for managing users and OAuth2 clients

## Overview

This is the administrative interface for the Ory-Based Identity Provider. It provides a clean, intuitive UI for managing users, OAuth2 clients, and personal profiles with role-based access control.

## Features

### For All Users

- **Profile Management**: View and edit personal information
- **Password Change**: Secure password update with current password verification
- **Session Management**: Secure authentication with NextAuth.js

### For Superadmins

- **User Management**:
  - View all registered users
  - Edit user profiles (name, email)
  - Change user roles
  - Delete users
- **OAuth2 Client Management**:
  - Create new OAuth2 clients
  - View client details and credentials
  - Update client configuration
  - Delete clients
- **Role-Based Navigation**: Dynamic sidebar based on user permissions

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind
- **Type Safety**: TypeScript
- **HTTP Client**: Fetch API with authentication wrapper

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-here
```

3. Start the development server:

```bash
pnpm run dev
```

4. Open [http://localhost:3001](http://localhost:3001)

### Default Credentials

- Email: `admin@example.com`
- Password: `admin123`

⚠️ Change these credentials immediately after first login!

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard (OAuth2 clients)
│   │   ├── profile/
│   │   │   └── page.tsx          # Profile management
│   │   ├── users/
│   │   │   ├── page.tsx          # User list
│   │   │   └── [id]/page.tsx     # User details/edit
│   │   └── clients/
│   │       ├── new/page.tsx      # Create OAuth2 client
│   │       ├── [id]/page.tsx     # Client details
│   │       └── success/page.tsx  # Client creation success
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   └── oauth2/
│       ├── login/page.tsx        # OAuth2 login flow
│       ├── consent/page.tsx      # OAuth2 consent flow
│       └── logout/page.tsx       # OAuth2 logout flow
├── components/
│   ├── auth-guard.tsx            # Route protection component
│   └── role-based-nav.tsx        # Dynamic navigation
├── lib/
│   ├── api/
│   │   └── client.ts             # Authenticated HTTP client
│   └── auth/
│       └── auth-config.ts        # NextAuth configuration
└── types/
    ├── next-auth.d.ts            # NextAuth type extensions
    └── oauth-client.types.ts     # OAuth2 client types
```

## Key Components

### AuthGuard

Protects routes and redirects unauthorized users:

```typescript
<AuthGuard allowedRoles={["superadmin"]}>
  <YourProtectedComponent />
</AuthGuard>
```

### RoleBasedNav

Dynamic navigation based on user role:

```typescript
<RoleBasedNav role={session.user.role} />
```

### Authenticated API Client

HTTP client with automatic token injection:

```typescript
import { fetchWithAuth } from "@/lib/api/client"

const response = await fetchWithAuth("/users/me")
const data = await response.json()
```

## Pages

### Dashboard (`/dashboard`)

- Lists all OAuth2 clients (superadmin only)
- Quick actions: view, delete clients
- Create new client button

### Profile (`/dashboard/profile`)

- View current user information
- Edit name and email
- Change password

### Users (`/dashboard/users`)

- List all users (superadmin only)
- Search and filter users
- Quick actions: view, delete users

### User Details (`/dashboard/users/[id]`)

- View user details (superadmin only)
- Edit user profile
- Change user role
- Delete user

### Create Client (`/dashboard/clients/new`)

- Form to create new OAuth2 client (superadmin only)
- Configure redirect URIs, scopes, grant types
- Validation and error handling

### Client Details (`/dashboard/clients/[id]`)

- View client configuration (superadmin only)
- Copy client ID and secret
- Delete client

## Authentication Flow

1. User visits protected route
2. AuthGuard checks for valid session
3. If no session, redirect to `/login`
4. User logs in with email/password
5. Backend validates credentials
6. JWT token issued and stored in session
7. User redirected to original route

## Role-Based Access Control

### User Role

- Access: Profile management only
- Restrictions: Cannot access Users or Clients pages

### Superadmin Role

- Access: Full system access
- Permissions:
  - Manage all users
  - Manage OAuth2 clients
  - View system-wide data

## API Integration

All API calls go through the authenticated client:

```typescript
// GET request
const response = await fetchWithAuth("/endpoint")

// POST request
const response = await fetchWithAuth("/endpoint", {
  method: "POST",
  body: JSON.stringify(data),
})

// With custom headers
const response = await fetchWithAuth("/endpoint", {
  headers: {
    "Custom-Header": "value",
  },
})
```

## Environment Variables

| Variable              | Description         | Example                                 |
| --------------------- | ------------------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL     | `http://localhost:3000`                 |
| `NEXTAUTH_URL`        | Dashboard URL       | `http://localhost:3001`                 |
| `NEXTAUTH_SECRET`     | NextAuth secret key | Generate with `openssl rand -base64 32` |

## Building for Production

```bash
# Build
pnpm run build

# Start production server
pnpm run start
```

## Troubleshooting

### "Unauthorized" errors

- Check that backend API is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure you're logged in with valid credentials

### Session expires immediately

- Check `NEXTAUTH_SECRET` is set and consistent
- Verify backend JWT_SECRET matches

### Cannot access superadmin pages

- Verify your user has "superadmin" role
- Check backend role assignment
- Clear browser cookies and login again

## Contributing

See main project README for contribution guidelines.

## License

MIT License - see LICENSE file in project root.
