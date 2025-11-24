# Ory-Based Identity Provider

> Enterprise-grade, open-source Identity Provider built with Ory Kratos and Ory Hydra

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)

## 🎯 Project Description

**Ory-Based Identity Provider** is a complete, production-ready authentication and authorization solution that combines the power of Ory Kratos (identity management) and Ory Hydra (OAuth2/OIDC server) with a modern tech stack. This project provides an open-source alternative to commercial solutions like Auth0, Okta, or AWS Cognito.

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
- ✅ Modern admin dashboard for user and client management
- ✅ Production-ready architecture
- ✅ Zero licensing costs
- ✅ Full data ownership

### Value Proposition

**For Companies:**

- **Cost Savings**: Eliminate monthly fees (Auth0 starts at $240/month)
- **Reusability**: Use across multiple projects and microservices
- **Customization**: Adapt to specific business needs
- **Compliance**: Keep sensitive data in-house

**For Developers:**

- **Modern Stack**: TypeScript, NestJS, Next.js, Docker
- **Best Practices**: Clean architecture, type safety, validation
- **Documentation**: Comprehensive guides and examples
- **Extensibility**: Easy to add features and integrations

## 👥 Team Members

- Falta por poner

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

**DevOps:**

- Turborepo (monorepo management)
- pnpm (package manager)
- ESLint & Prettier (code quality)

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (for Ory services and PostgreSQL)
- **Node.js** 18+ and **pnpm** (for applications)
- **Git** (to clone the repository)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ory-based-idp.git
cd ory-based-idp
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start Ory services with Docker**

```bash
docker-compose -f docker/quickstart.yml up -d
```

This will start:

- Ory Kratos (ports 4433, 4434)
- Ory Hydra (ports 4444, 4445)
- PostgreSQL (port 5432)

4. **Configure environment variables**

```bash
# Backend API
cp apps/api/.env.example apps/api/.env

# Admin Dashboard
cp apps/web/.env.local.example apps/web/.env.local

# OAuth2 Demo Client (optional)
cp apps/client-oauth2-demo/.env.local.example apps/client-oauth2-demo/.env.local
```

5. **Start the backend API**

```bash
cd apps/api
pnpm run dev
```

The API will be available at `http://localhost:3000`

6. **Start the admin dashboard**

```bash
cd apps/web
pnpm run dev
```

The dashboard will be available at `http://localhost:3001`

7. **(Optional) Start the OAuth2 demo client**

```bash
cd apps/client-oauth2-demo
pnpm run dev
```

The demo client will be available at `http://localhost:8363`

### First Login

The system automatically creates a default superadmin account:

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the password immediately after first login!

## 📖 Usage Guide

### For Administrators

#### 1. Managing Users

1. Login to the admin dashboard at `http://localhost:3001`
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

```typescript
// Example with NextAuth.js
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
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
}
```

3. **Implement the OAuth2 flow** in your application (see `apps/client-oauth2-demo` for a complete example)

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

Full API documentation available at `http://localhost:3000/api` (Swagger UI)

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

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Manual Testing

1. **Test OAuth2 Flow**
   - Start all services
   - Navigate to `http://localhost:8363` (demo client)
   - Click "Sign in with OAuth2"
   - Complete the authorization flow
   - Verify you're redirected back with user info

2. **Test RBAC**
   - Login as superadmin
   - Verify access to Users and Clients pages
   - Create a regular user
   - Login as regular user
   - Verify restricted access (no Users/Clients pages)

## 🚢 Deployment

### Docker Production Build

```bash
# Build production images
docker-compose -f docker/production.yml build

# Start services
docker-compose -f docker/production.yml up -d
```

### Environment Variables for Production

```bash
# Backend
JWT_SECRET=<strong-random-secret-256-bits>
SUPERADMIN_EMAIL=admin@yourdomain.com
SUPERADMIN_PASSWORD=<strong-password>
NODE_ENV=production

# Frontend
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Checklist

- [ ] Update all environment variables
- [ ] Change default superadmin credentials
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for production domains
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up rate limiting
- [ ] Review security headers
- [ ] Test OAuth2 flow end-to-end
- [ ] Document deployment process

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ory** for providing excellent open-source identity solutions
- **NestJS** and **Next.js** communities for amazing frameworks
- **Yarey Tech** for organizing the hackathon and supporting open-source development

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🎥 Demo

[Link to video demo - Coming soon]

---

**Built with ❤️ for the Yarey Tech Hackathon**
