# Ory-Based Identity Provider

> Enterprise-grade, open-source Identity Provider built with Ory Kratos and Ory Hydra

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)

## 🎯 Project Description

**Ory-Based Identity Provider** is a complete, production-ready authentication and authorization solution that combines the power of Ory Kratos (identity management) and Ory Hydra (OAuth2/OIDC server) with a modern tech stack. This project provides an open-source alternative to commercial solutions.

### Problem Solved

Organizations need secure, scalable authentication systems but face:

- High costs of commercial identity providers ($$$)
- Vendor lock-in and limited customization
- Complex integration with existing systems
- Lack of control over user data

### Solution

A self-hosted, fully customizable identity provider that offers:

- ✅ Complete OAuth2/OIDC compliance
- ✅ Role-Based Access Control (RBAC) out of the box
- ✅ Production-ready architecture
- ✅ Zero licensing costs
- ✅ Full data ownership

### Value Proposition

**For Companies:**

- **Cost Savings**: Eliminate monthly fees
- **Reusability**: Use across multiple projects and microservices
- **Customization**: Adapt to specific business needs
- **Compliance**: Keep sensitive data in-house

**For Developers:**

- **Modern Stack**: TypeScript, NestJS, Next.js, Docker
- **Best Practices**: Clean architecture, type safety, validation
- **Documentation**: Comprehensive guides and examples
- **Extensibility**: Easy to add features and integrations

## 👥 Team Members

- Andy Alvarez Lujardo
- Carlos Raúl Robinson Thompson
- José Carlos Vilaseca Illnait
- Sergio Manuel Mir Sánchez

**Repository**: [https://github.com/ErgoCodes/ory-based-idp](https://github.com/ErgoCodes/ory-based-idp)

## ✨ Key Features

### 🔐 Authentication & Identity Management

- User registration and login
- Password management (change, reset)
- Session management with "remember me"
- Email verification ready
- Profile management

### 🎫 OAuth2/OIDC Authorization Server

- Full OAuth2 Authorization Code Flow
- Refresh tokens support
- Consent management with "remember" option
- Multiple OAuth2 clients support
- Scopes: `openid`, `email`, `profile`, `offline_access`

### 👑 Role-Based Access Control (RBAC)

- **Superadmin Role**: Full system access
  - Manage OAuth2 clients (CRUD)
  - Manage users (view, edit, delete)
  - Assign/change user roles
- **User Role**: Limited access
  - View and edit own profile
  - Change own password

### 🎨 Admin Dashboard

- Modern, responsive UI built with Next.js and Tailwind CSS
- Role-based navigation
- OAuth2 client management interface
- User management interface
- Real-time updates

### 🔧 Developer Experience

- Monorepo architecture with Turborepo
- Shared TypeScript types and DTOs
- Docker Compose for easy local development
- Comprehensive API documentation (Swagger)
- Type-safe API client

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Applications                          │
│  (Web Apps, Mobile Apps, Third-party Services)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ OAuth2/OIDC Flow
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Admin Dashboard (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Profile    │  │    Users     │  │   Clients    │         │
│  │  Management  │  │  Management  │  │  Management  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API + JWT
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers: Auth, Users, Admin, OAuth2 Flow/Clients   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Guards: AuthGuard (JWT), RolesGuard (RBAC)             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Services: Kratos, Hydra, JWT, Init                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────┬────────────────────┘
                         │                   │
                         ↓                   ↓
┌────────────────────────────────┐  ┌──────────────────────────┐
│   Ory Kratos (Identity Mgmt)   │  │  Ory Hydra (OAuth2/OIDC) │
│  - User identities              │  │  - Access tokens         │
│  - Authentication               │  │  - Refresh tokens        │
│  - Password management          │  │  - Client management     │
│  - User traits (with roles)     │  │  - Consent management    │
└────────────────┬───────────────┘  └──────────┬───────────────┘
                 │                              │
                 └──────────────┬───────────────┘
                                ↓
                    ┌───────────────────────┐
                    │  PostgreSQL Database  │
                    │  - Identities         │
                    │  - OAuth2 clients     │
                    │  - Sessions           │
                    └───────────────────────┘
```

### Technology Stack

**Backend:**

- NestJS 10 (Node.js framework)
- TypeScript 5
- Ory Kratos SDK (identity management)
- Ory Hydra SDK (OAuth2/OIDC)
- Zod (validation)
- JWT (authentication)

**Frontend:**

- Next.js 15 (React framework)
- NextAuth.js (authentication)
- Tailwind CSS (styling)
- TypeScript 5

**Infrastructure:**

- Docker & Docker Compose
- PostgreSQL (database)
- Ory Kratos (identity provider)
- Ory Hydra (OAuth2 server)

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (for Ory services and PostgreSQL)
- **Node.js** 18+ and **pnpm** (for applications)
- **Git** (to clone the repository)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ErgoCodes/ory-based-idp.git
cd ory-based-idp
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Before starting the services, you need to configure the environment variables:

```bash
# Docker services (Kratos, Hydra, PostgreSQL)
cp docker/.env.example docker/.env

# Backend API
cp apps/api/.env.example apps/api/.env

# Admin Dashboard
cp apps/web/.env.example apps/web/.env.local

# OAuth2 Demo Client (optional)
cp apps/client-oauth2-demo/.env.local.example apps/client-oauth2-demo/.env.local
```

**Important**: Edit `docker/.env` and configure your SMTP settings for email functionality:

```bash
# Example SMTP configuration for Gmail
COURIER_SMTP_CONNECTION_URI=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587/
COURIER_SMTP_FROM_ADDRESS=your-email@gmail.com
COURIER_SMTP_FROM_NAME=Your App Name

# Generate strong secrets for production (use: openssl rand -hex 32)
SECRETS_COOKIE=your-generated-secret-here
SECRETS_CIPHER=your-generated-secret-here
```

See the [Environment Variables](#-environment-variables) section for detailed configuration.

4. **Start infrastructure services**

```bash
pnpm infra:up
```

This will start:

- Ory Kratos (ports 4433, 4434)
- Ory Hydra (ports 4444, 4445)
- PostgreSQL (port 5432)

5. **Start all applications**

From the root directory, run:

```bash
pnpm dev
```

This single command will start all applications in parallel:

- Backend API at `http://localhost:3000`
- Admin Dashboard at `http://localhost:8362`
- OAuth2 Demo Client at `http://localhost:8363`

**Alternative**: Start applications individually if needed:

```bash
# Backend API only
cd apps/api && pnpm run dev

# Admin Dashboard only
cd apps/web && pnpm run dev

# OAuth2 Demo Client only
cd apps/client-oauth2-demo && pnpm run dev
```

### First Login

The system automatically creates a default superadmin account:

- **Email**: `admin@example.com`
- **Password**: `changeme123`

⚠️ **IMPORTANT**: Change the password immediately after first login!

## 🔧 Environment Variables

### Docker Services (`docker/.env`)

These variables configure Ory Kratos, Ory Hydra, and PostgreSQL:

| Variable                                      | Description                          | Example                                                           | Required |
| --------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- | -------- |
| `DSN`                                         | PostgreSQL connection string         | `postgres://admin:secret@postgres:5432/kratos_db?sslmode=disable` | ✅       |
| `SECRETS_COOKIE`                              | Cookie encryption secret (32+ chars) | Generate with `openssl rand -hex 32`                              | ✅       |
| `SECRETS_CIPHER`                              | Cipher encryption secret (32+ chars) | Generate with `openssl rand -hex 32`                              | ✅       |
| `COURIER_SMTP_CONNECTION_URI`                 | SMTP server for emails               | `smtp://user:pass@smtp.gmail.com:587/`                            | ✅       |
| `COURIER_SMTP_FROM_ADDRESS`                   | Sender email address                 | `noreply@example.com`                                             | ✅       |
| `COURIER_SMTP_FROM_NAME`                      | Sender display name                  | `Your App Name`                                                   | ✅       |
| `KRATOS_PUBLIC_PORT`                          | Kratos public API port               | `4433`                                                            | ✅       |
| `KRATOS_ADMIN_PORT`                           | Kratos admin API port                | `4434`                                                            | ✅       |
| `METHODS_CODE_CONFIG_LIFESPAN`                | Verification code validity           | `120m`                                                            | ❌       |
| `METHODS_PASSWORD_CONFIG_MIN_PASSWORD_LENGTH` | Min password length                  | `6`                                                               | ❌       |
| `FLOWS_RECOVERY_LIFESPAN`                     | Recovery flow validity               | `120m`                                                            | ❌       |
| `FLOWS_SETTINGS_PRIVILEGED_SESSION_MAX_AGE`   | Privileged session duration          | `15m`                                                             | ❌       |
| `FLOWS_SETTINGS_VERIFICATION_LIFESPAN`        | Verification flow validity           | `120m`                                                            | ❌       |

**SMTP Configuration Examples:**

```bash
# Gmail (requires App Password)
COURIER_SMTP_CONNECTION_URI=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587/

# Outlook/Hotmail
COURIER_SMTP_CONNECTION_URI=smtp://your-email@outlook.com:your-password@smtp-mail.outlook.com:587/

# Custom SMTP (URL-encode special characters in password)
COURIER_SMTP_CONNECTION_URI=smtp://username:password@smtp.example.com:587/
```

### Backend API (`apps/api/.env`)

| Variable              | Description            | Example                                 | Required |
| --------------------- | ---------------------- | --------------------------------------- | -------- |
| `PORT`                | API server port        | `3000`                                  | ❌       |
| `NODE_ENV`            | Environment mode       | `development` or `production`           | ✅       |
| `KRATOS_PUBLIC_URL`   | Kratos public API URL  | `http://localhost:4433`                 | ✅       |
| `KRATOS_ADMIN_URL`    | Kratos admin API URL   | `http://localhost:4434`                 | ✅       |
| `HYDRA_ADMIN_URL`     | Hydra admin API URL    | `http://localhost:4445`                 | ✅       |
| `JWT_SECRET`          | JWT signing secret     | Generate with `openssl rand -base64 32` | ✅       |
| `JWT_EXPIRES_IN`      | JWT token expiration   | `1h`                                    | ❌       |
| `SUPERADMIN_EMAIL`    | Default admin email    | `admin@example.com`                     | ✅       |
| `SUPERADMIN_PASSWORD` | Default admin password | `admin123`                              | ✅       |

### Admin Dashboard (`apps/web/.env.local`)

| Variable              | Description                | Example                                 | Required |
| --------------------- | -------------------------- | --------------------------------------- | -------- |
| `NEXTAUTH_URL`        | Application URL            | `http://localhost:8362`                 | ✅       |
| `NEXTAUTH_SECRET`     | NextAuth encryption secret | Generate with `openssl rand -base64 32` | ✅       |
| `NEXT_PUBLIC_API_URL` | Backend API URL            | `http://localhost:3000`                 | ✅       |

### OAuth2 Demo Client (`apps/client-oauth2-demo/.env.local`)

| Variable                                    | Description                | Example                                 | Required |
| ------------------------------------------- | -------------------------- | --------------------------------------- | -------- |
| `NEXTAUTH_URL`                              | Demo app URL               | `http://localhost:8363`                 | ✅       |
| `NEXTAUTH_SECRET`                           | NextAuth encryption secret | Generate with `openssl rand -base64 32` | ✅       |
| `NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT` | OAuth2 auth endpoint       | `http://localhost:4444/oauth2/auth`     | ✅       |
| `NEXT_PUBLIC_OAUTH2_SCOPE`                  | OAuth2 scopes              | `openid email profile offline_access`   | ✅       |
| `NEXT_PUBLIC_OAUTH2_USERINFO_ENDPOINT`      | Userinfo endpoint          | `http://localhost:4444/userinfo`        | ✅       |
| `OAUTH2_CLIENT_ID`                          | OAuth2 client ID           | Get from admin dashboard                | ✅       |
| `OAUTH2_TOKEN_ENDPOINT`                     | Token endpoint             | `http://localhost:4444/oauth2/token`    | ✅       |

**Note**: The `OAUTH2_CLIENT_ID` must be created in the admin dashboard first. See [Managing OAuth2 Clients](#2-managing-oauth2-clients).

## 📖 Usage Guide

### For Administrators

#### 1. Managing Users

1. Login to the admin dashboard at `http://localhost:8362`
2. Navigate to **Users** in the sidebar
3. View all registered users
4. Click on a user to:
   - Edit their profile (name, email)
   - Change their role (user ↔ superadmin)
   - Delete the user

#### 2. Managing OAuth2 Clients

1. Navigate to **OAuth2 Clients** in the sidebar
2. Click **Create New Client**
3. Fill in the client details:
   - Client name
   - Redirect URIs (where to redirect after auth)
   - Grant types (authorization_code, refresh_token)
   - Scopes (openid, email, profile, offline_access)
4. Save and copy the **Client ID** and **Client Secret**
5. Use these credentials in your application

#### 3. Managing Your Profile

1. Navigate to **Profile** in the sidebar
2. Update your name and email
3. Change your password (requires current password)

### For Developers

#### Integrating with Your Application

1. **Create an OAuth2 client** in the admin dashboard

2. **Configure your application** with the client credentials:

**Option A: Using PKCE (Recommended for public clients - no client secret needed)**

```typescript
// Example with NextAuth.js using PKCE
import { OAuthConfig } from "next-auth/providers"

export const HydraProvider: OAuthConfig<any> = {
  id: "hydra",
  name: "Hydra",
  type: "oauth",
  authorization: {
    url: "http://localhost:4444/oauth2/auth",
    params: { scope: "openid email profile offline_access" },
  },
  token: "http://localhost:4444/oauth2/token",
  userinfo: "http://localhost:4444/userinfo",
  clientId: process.env.OAUTH2_CLIENT_ID,
  clientSecret: "", // Empty string for PKCE (public clients)
  checks: ["pkce", "state"], // Enable PKCE
}
```

**Option B: Using Client Secret (for confidential clients)**

```typescript
// Example with NextAuth.js using client secret
import { OAuthConfig } from "next-auth/providers"

export const HydraProvider: OAuthConfig<any> = {
  id: "hydra",
  name: "Hydra",
  type: "oauth",
  authorization: {
    url: "http://localhost:4444/oauth2/auth",
    params: { scope: "openid email profile offline_access" },
  },
  token: "http://localhost:4444/oauth2/token",
  userinfo: "http://localhost:4444/userinfo",
  clientId: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET, // Required for confidential clients
}
```

**Note**: When creating the OAuth2 client in the admin dashboard:

- Select **"None"** as the token endpoint authentication method for PKCE (public clients)
- Select **"Client Secret (Basic/Post)"** if you want to use a client secret (confidential clients)
- PKCE is more secure for browser-based applications (SPAs, mobile apps)
- Client secrets should only be used in server-side applications where the secret can be kept secure

3. **Implement the OAuth2 flow** in your application (see `apps/client-oauth2-demo` for a complete PKCE example)

#### API Endpoints

**Authentication (Public)**

- `POST /auth/login` - User login
- `POST /auth/registration` - User registration

**Profile Management (Authenticated)**

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update profile
- `POST /users/me/password` - Change password

**User Management (Superadmin only)**

- `GET /admin/users` - List all users
- `GET /admin/users/:id` - Get user details
- `PATCH /admin/users/:id` - Update user (including role)
- `DELETE /admin/users/:id` - Delete user

**OAuth2 Client Management (Superadmin only)**

- `GET /oauth2/clients` - List OAuth2 clients
- `POST /oauth2/clients` - Create OAuth2 client
- `GET /oauth2/clients/:id` - Get client details
- `PUT /oauth2/clients/:id` - Update client
- `DELETE /oauth2/clients/:id` - Delete client

**OAuth2 Flow (Public)**

- `GET /oauth2/login` - OAuth2 login page
- `POST /oauth2/login` - Process login
- `GET /oauth2/consent` - OAuth2 consent page
- `POST /oauth2/consent` - Process consent
- `POST /oauth2/logout` - OAuth2 logout

Full API documentation available at `http://localhost:3000/api/docs` (Swagger UI)

## 🔒 Security

### Authentication

- Passwords hashed with bcrypt (managed by Kratos)
- JWT tokens for API authentication
- Secure session management
- CSRF protection

### Authorization

- Role-Based Access Control (RBAC)
- JWT tokens include role claims
- Guards protect sensitive endpoints
- Principle of least privilege

### OAuth2 Security

- Authorization Code Flow (most secure)
- Refresh token rotation
- Consent management
- Redirect URI validation

### Production Recommendations

1. **Change default credentials**
   - Update `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD`
   - Use strong, unique passwords

2. **Secure secrets**
   - Generate strong `JWT_SECRET` (256+ bits)
   - Generate strong `NEXTAUTH_SECRET`
   - Never commit secrets to version control

3. **Enable HTTPS**
   - Use TLS certificates in production
   - Configure secure cookies

4. **Configure CORS**
   - Whitelist only trusted origins
   - Restrict allowed methods

5. **Add rate limiting**
   - Protect against brute force attacks
   - Limit API requests per IP

6. **Enable audit logging**
   - Log all admin actions
   - Monitor suspicious activity

## 📁 Project Structure

```
ory-based-idp/
├── apps/
│   ├── api/                          # Backend NestJS API
│   │   ├── src/
│   │   │   ├── auth/                 # Authentication module
│   │   │   ├── users/                # User profile management
│   │   │   ├── admin/                # Admin user management
│   │   │   ├── hydra/                # OAuth2 flow & clients
│   │   │   │   ├── oauth2-flow.controller.ts
│   │   │   │   ├── oauth2-flow.service.ts
│   │   │   │   ├── oauth2-clients.controller.ts
│   │   │   │   └── oauth2-clients.service.ts
│   │   │   ├── kratos/               # Kratos integration
│   │   │   └── common/
│   │   │       ├── guards/           # AuthGuard, RolesGuard
│   │   │       ├── decorators/       # @Roles(), @Public()
│   │   │       └── services/         # JWT, Init services
│   │   └── ...
│   ├── web/                          # Admin Dashboard (Next.js)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/        # Dashboard pages
│   │   │   │   │   ├── page.tsx      # Main dashboard
│   │   │   │   │   ├── profile/      # Profile management
│   │   │   │   │   ├── users/        # User management
│   │   │   │   │   └── clients/      # OAuth2 client management
│   │   │   │   ├── login/            # Login page
│   │   │   │   ├── register/         # Registration page
│   │   │   │   └── oauth2/           # OAuth2 flow pages
│   │   │   ├── components/
│   │   │   │   ├── auth-guard.tsx    # Route protection
│   │   │   │   └── role-based-nav.tsx # Role-based navigation
│   │   │   └── lib/
│   │   │       ├── api/client.ts     # HTTP client with auth
│   │   │       └── auth/             # NextAuth configuration
│   │   └── ...
│   └── client-oauth2-demo/           # OAuth2 Demo Client
│       └── ...
├── packages/
│   └── api/                          # Shared TypeScript types
│       └── src/
│           └── dtos/                 # Data Transfer Objects
├── docker/
│   ├── config/
│   │   ├── kratos.yml                # Kratos configuration
│   │   └── identity.schema.json     # Identity schema with roles
│   └── quickstart.yml                # Docker Compose file
├── .kiro/
│   └── specs/                        # Project specifications
│       └── rbac-user-management/
├── LICENSE                           # MIT License
└── README.md                         # This file
```

## 📜 Available Scripts

From the root directory:

```bash
# Start all applications in development mode
pnpm dev

# Start infrastructure services (Kratos, Hydra, PostgreSQL)
pnpm infra:up

# Stop infrastructure services
pnpm infra:down

# Build all applications for production
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

From individual app directories (`apps/api`, `apps/web`, `apps/client-oauth2-demo`):

```bash
# Start in development mode
pnpm run dev

# Build for production
pnpm run build

# Start production build
pnpm run start

# Run tests
pnpm run test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ory** for providing excellent open-source identity solutions
- **NestJS** and **Next.js** communities for amazing frameworks
- **Yarey Tech** for organizing the hackathon and supporting open-source development

## 🐛 Troubleshooting

### Common Issues

**1. SMTP Email Errors**

- Verify your SMTP credentials are correct
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
- Ensure special characters in passwords are URL-encoded
- Check firewall/network allows SMTP connections

**2. Docker Services Not Starting**

- Ensure Docker is running
- Check ports 4433, 4434, 4444, 4445, 5432 are not in use
- Run `pnpm infra:down` then `pnpm infra:up` to restart

**3. Database Connection Errors**

- Wait a few seconds for PostgreSQL to fully start
- Check `docker/.env` DSN configuration
- Verify PostgreSQL container is running: `docker ps`

**4. OAuth2 Flow Errors**

- Ensure redirect URIs match exactly (including protocol and port)
- Verify OAuth2 client is created in admin dashboard
- Check client ID and secret are correct

**5. JWT/Authentication Errors**

- Verify `JWT_SECRET` is set in `apps/api/.env`
- Ensure `NEXTAUTH_SECRET` is set in frontend `.env.local` files
- Clear browser cookies and try again

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on [GitHub](https://github.com/ErgoCodes/ory-based-idp/issues)
- Check existing issues for solutions
- Review the documentation carefully

**Built with ❤️ by the Git Gud team for the Yarey Tech Hackathon**
