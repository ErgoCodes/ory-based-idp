# Backend API

> NestJS REST API for identity and OAuth2 management

## Overview

This is the backend API that orchestrates Ory Kratos (identity management) and Ory Hydra (OAuth2/OIDC server) to provide a complete authentication and authorization solution with Role-Based Access Control.

## Features

- **Authentication**: User login, registration, password management
- **Authorization**: JWT-based with role claims, RBAC guards
- **User Management**: Profile and admin user management
- **OAuth2 Server**: Complete OAuth2/OIDC flow implementation
- **Client Management**: CRUD operations for OAuth2 clients
- **Auto-initialization**: Creates default superadmin on startup
- **API Documentation**: Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript with Zod validation

## Technology Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Validation**: Zod schemas
- **Authentication**: JWT tokens
- **Identity Provider**: Ory Kratos SDK
- **OAuth2 Server**: Ory Hydra SDK
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose (for Ory services)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Ory Kratos
KRATOS_PUBLIC_URL=http://localhost:4433
KRATOS_ADMIN_URL=http://localhost:4434

# Ory Hydra
HYDRA_ADMIN_URL=http://localhost:4445
HYDRA_PUBLIC_URL=http://localhost:4444

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Default Superadmin
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=admin123

# API
PORT=3000
NODE_ENV=development
```

3. Start Ory services:

```bash
docker-compose -f ../../docker/quickstart.yml up -d
```

4. Start the API:

```bash
pnpm run dev
```

5. Access Swagger documentation at [http://localhost:3000/api](http://localhost:3000/api)

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts        # Login, registration endpoints
│   ├── auth.service.ts           # Authentication logic
│   └── auth.module.ts
├── users/
│   ├── user.controller.ts        # Profile management endpoints
│   ├── user.service.ts           # User profile logic
│   └── user.module.ts
├── admin/
│   ├── admin.controller.ts       # User management endpoints (superadmin)
│   ├── admin.service.ts          # Admin operations
│   └── admin.module.ts
├── hydra/
│   ├── oauth2-flow.controller.ts # OAuth2 login/consent/logout
│   ├── oauth2-flow.service.ts    # OAuth2 flow logic
│   ├── oauth2-clients.controller.ts # Client CRUD endpoints
│   ├── oauth2-clients.service.ts # Client management logic
│   ├── hydra-error.handler.ts    # Error handling
│   ├── mappers/                  # Response mappers
│   └── hydra.module.ts
├── kratos/
│   ├── kratos.service.ts         # Kratos integration
│   ├── kratos-error.handler.ts   # Error handling
│   └── kratos.module.ts
├── common/
│   ├── guards/
│   │   ├── auth.guard.ts         # JWT authentication guard
│   │   └── roles.guard.ts        # RBAC authorization guard
│   ├── decorators/
│   │   ├── public.decorator.ts   # Mark endpoints as public
│   │   └── roles.decorator.ts    # Specify required roles
│   ├── services/
│   │   ├── jwt.service.ts        # JWT token operations
│   │   └── init.service.ts       # Startup initialization
│   ├── pipes/
│   │   └── zod-validation.pipe.ts # Request validation
│   └── result.ts                 # Result type for error handling
├── scripts/
│   └── clear-consents.ts         # Utility script
├── app.module.ts                 # Root module
└── main.ts                       # Application entry point
```

## API Endpoints

### Authentication (Public)

#### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "access_token": "jwt-token"
}
```

#### POST /auth/registration

Register a new user (automatically assigned "user" role).

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": {
    "first": "John",
    "last": "Doe"
  }
}
```

### Profile Management (Authenticated)

#### GET /users/me

Get current user profile.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

#### PATCH /users/me

Update current user profile (name, email only).

**Request:**

```json
{
  "name": {
    "first": "Jane",
    "last": "Smith"
  },
  "email": "jane@example.com"
}
```

#### POST /users/me/password

Change password.

**Request:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### User Management (Superadmin Only)

#### GET /admin/users

List all users with pagination.

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

#### GET /admin/users/:id

Get user details by ID.

#### PATCH /admin/users/:id

Update user (including role).

**Request:**

```json
{
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "email": "john@example.com",
  "role": "superadmin"
}
```

#### DELETE /admin/users/:id

Delete user by ID.

### OAuth2 Client Management (Superadmin Only)

#### POST /oauth2/clients

Create new OAuth2 client.

**Request:**

```json
{
  "client_name": "My Application",
  "redirect_uris": ["http://localhost:8363/api/auth/callback/hydra"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "scope": "openid email profile offline_access",
  "token_endpoint_auth_method": "client_secret_post"
}
```

**Response:**

```json
{
  "client_id": "uuid",
  "client_secret": "secret",
  "client_name": "My Application",
  "redirect_uris": ["..."],
  ...
}
```

#### GET /oauth2/clients

List all OAuth2 clients.

#### GET /oauth2/clients/:id

Get client details by ID.

#### PUT /oauth2/clients/:id

Update OAuth2 client.

#### DELETE /oauth2/clients/:id

Delete OAuth2 client.

### OAuth2 Flow (Public)

#### GET /oauth2/login?login_challenge=...

Get login request details.

#### POST /oauth2/login?login_challenge=...

Process login (accept or reject).

#### GET /oauth2/consent?consent_challenge=...

Get consent request details.

#### POST /oauth2/consent?consent_challenge=...

Process consent (grant or deny).

#### GET /oauth2/logout?logout_challenge=...

Get logout request details.

#### POST /oauth2/logout?logout_challenge=...

Process logout.

## Authentication & Authorization

### JWT Tokens

JWT tokens are issued on successful login and include:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Guards

#### AuthGuard

Validates JWT tokens on protected endpoints.

```typescript
@UseGuards(AuthGuard)
@Get('protected')
async protectedRoute() {
  // Only accessible with valid JWT
}
```

#### RolesGuard

Checks user role against required roles.

```typescript
@UseGuards(RolesGuard)
@Roles('superadmin')
@Get('admin-only')
async adminRoute() {
  // Only accessible by superadmins
}
```

### Public Endpoints

Mark endpoints as public (skip AuthGuard):

```typescript
@Public()
@Post('login')
async login() {
  // Accessible without authentication
}
```

## Validation

All request bodies are validated using Zod schemas:

```typescript
@Post('login')
async login(
  @Body(new ZodValidationPipe(LoginSchema)) body: LoginDto
) {
  // body is type-safe and validated
}
```

## Error Handling

The API uses a Result type for consistent error handling:

```typescript
type Result<T, E> = { success: true; value: T } | { success: false; error: E };
```

Errors are automatically mapped to appropriate HTTP status codes.

## Initialization

On startup, the API:

1. Connects to Kratos and Hydra
2. Checks for default superadmin
3. Creates superadmin if not exists
4. Logs initialization status

## Environment Variables

| Variable              | Description                   | Default                 |
| --------------------- | ----------------------------- | ----------------------- |
| `KRATOS_PUBLIC_URL`   | Kratos public API URL         | `http://localhost:4433` |
| `KRATOS_ADMIN_URL`    | Kratos admin API URL          | `http://localhost:4434` |
| `HYDRA_PUBLIC_URL`    | Hydra public API URL          | `http://localhost:4444` |
| `HYDRA_ADMIN_URL`     | Hydra admin API URL           | `http://localhost:4445` |
| `JWT_SECRET`          | Secret for signing JWT tokens | Required                |
| `JWT_EXPIRES_IN`      | JWT expiration time           | `24h`                   |
| `SUPERADMIN_EMAIL`    | Default superadmin email      | `admin@example.com`     |
| `SUPERADMIN_PASSWORD` | Default superadmin password   | `admin123`              |
| `PORT`                | API port                      | `3000`                  |
| `NODE_ENV`            | Environment                   | `development`           |

## Scripts

```bash
# Development
pnpm run dev          # Start with hot reload

# Production
pnpm run build        # Build for production
pnpm run start        # Start production server

# Testing
pnpm run test         # Run unit tests
pnpm run test:e2e     # Run E2E tests
pnpm run test:cov     # Generate coverage report

# Linting
pnpm run lint         # Run ESLint
pnpm run format       # Format with Prettier

# Utilities
pnpm run clear:consents  # Clear OAuth2 consent sessions
```

## Development

### Adding a New Endpoint

1. Create/update controller:

```typescript
@Controller('resource')
export class ResourceController {
  @Get()
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  async list() {
    // Implementation
  }
}
```

2. Add Swagger documentation:

```typescript
@ApiOperation({ summary: 'List resources' })
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 403, description: 'Forbidden' })
```

3. Add validation:

```typescript
@Post()
async create(
  @Body(new ZodValidationPipe(CreateResourceSchema))
  body: CreateResourceDto
) {
  // Implementation
}
```

### Adding a New Role

1. Update Kratos schema (`docker/config/identity.schema.json`)
2. Update type definitions (`packages/api/src/dtos/kratos.dto.ts`)
3. Use in guards: `@Roles('newrole')`

## Troubleshooting

### Cannot connect to Kratos/Hydra

- Ensure Docker services are running
- Check URLs in `.env` match Docker Compose configuration
- Verify network connectivity

### JWT validation fails

- Check `JWT_SECRET` is consistent
- Verify token hasn't expired
- Ensure Authorization header format: `Bearer <token>`

### Superadmin not created

- Check `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` are set
- Review application logs for errors
- Verify Kratos is accessible

## Contributing

See main project README for contribution guidelines.

## License

MIT License - see LICENSE file in project root.
