# OAuth2 Identity Provider with RBAC

Prototipo de Identity Provider basado en Ory Kratos y Hydra. Incluye autenticación, emisión de tokens OAuth2, control de acceso basado en roles (RBAC), API NestJS para usuarios y roles, y panel administrativo en Next.js.

## Características

- **Autenticación de usuarios** con Ory Kratos
- **OAuth2/OIDC** con Ory Hydra
- **Control de acceso basado en roles (RBAC)**
  - Rol de Superadmin con acceso completo
  - Rol de Usuario con acceso limitado
- **Gestión de clientes OAuth2** (solo superadmin)
- **Gestión de usuarios** (solo superadmin)
- **Gestión de perfil** (todos los usuarios)
- **Cambio de contraseña** (todos los usuarios)
- **JWT tokens** con claims de rol para autorización

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  - Dashboard con navegación basada en roles                 │
│  - Gestión de perfil                                        │
│  - Gestión de usuarios (superadmin)                         │
│  - Gestión de clientes OAuth2 (superadmin)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP + JWT (con claim de rol)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS)                      │
│  - AuthGuard: Valida JWT tokens                            │
│  - RolesGuard: Verifica permisos por rol                   │
│  - UserController: Gestión de perfil                       │
│  - AdminController: Gestión de usuarios                    │
│  - HydraController: Gestión de clientes OAuth2             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Ory Kratos (Identity Management)                │
│  - Almacena identidades con trait de rol                   │
│  - Maneja autenticación de usuarios                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Ory Hydra (OAuth2/OIDC Server)                  │
│  - Emite access tokens y refresh tokens                    │
│  - Gestiona flujos OAuth2                                  │
└─────────────────────────────────────────────────────────────┘
```

## Sistema de Roles

### Superadmin

- Gestionar clientes OAuth2 (crear, ver, editar, eliminar)
- Gestionar usuarios (ver, editar roles, eliminar)
- Ver y editar su propio perfil
- Cambiar su contraseña

### Usuario Regular

- Ver su propio perfil
- Editar su nombre y email
- Cambiar su contraseña

## Configuración

### Variables de Entorno

#### Backend API (`apps/api/.env`)

```bash
# Ory Kratos
KRATOS_PUBLIC_URL=http://localhost:4433
KRATOS_ADMIN_URL=http://localhost:4434

# Ory Hydra
HYDRA_ADMIN_URL=http://localhost:4445
HYDRA_PUBLIC_URL=http://localhost:4444

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Default Superadmin (se crea automáticamente al iniciar)
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=changeme123

# API
PORT=3000
NODE_ENV=development
```

#### Frontend (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd ory-based-idp
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con tus valores

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
# Editar apps/web/.env.local con tus valores
```

4. **Iniciar servicios de Ory con Docker**

```bash
docker-compose -f docker/quickstart.yml up -d
```

5. **Iniciar el backend**

```bash
cd apps/api
pnpm run dev
```

6. **Iniciar el frontend**

```bash
cd apps/web
pnpm run dev
```

## Uso

### Acceso Inicial

1. El sistema crea automáticamente un superadmin al iniciar:
   - Email: `admin@example.com` (configurable)
   - Password: `changeme123` (configurable)

2. Accede al dashboard en `http://localhost:3001`

3. **IMPORTANTE**: Cambia la contraseña del superadmin inmediatamente después del primer login

### Endpoints del API

#### Autenticación (Público)

- `POST /auth/login` - Login de usuarios
- `POST /auth/registration` - Registro de nuevos usuarios (rol "user" por defecto)

#### Gestión de Perfil (Autenticado)

- `GET /users/me` - Obtener perfil del usuario actual
- `PATCH /users/me` - Actualizar perfil (nombre, email)
- `POST /users/me/password` - Cambiar contraseña

#### Gestión de Usuarios (Solo Superadmin)

- `GET /admin/users` - Listar todos los usuarios
- `GET /admin/users/:id` - Ver detalles de un usuario
- `PATCH /admin/users/:id` - Actualizar usuario (incluye cambio de rol)
- `DELETE /admin/users/:id` - Eliminar usuario

#### Gestión de Clientes OAuth2 (Solo Superadmin)

- `GET /oauth2/clients` - Listar clientes
- `POST /oauth2/clients` - Crear cliente
- `GET /oauth2/clients/:id` - Ver detalles de cliente
- `PUT /oauth2/clients/:id` - Actualizar cliente
- `DELETE /oauth2/clients/:id` - Eliminar cliente

#### Flujos OAuth2 (Público)

- `GET /oauth2/login` - Página de login OAuth2
- `POST /oauth2/login` - Procesar login OAuth2
- `GET /oauth2/consent` - Página de consentimiento
- `POST /oauth2/consent` - Procesar consentimiento
- `POST /oauth2/logout` - Logout OAuth2

## Seguridad

### JWT Tokens

- Los tokens JWT incluyen el rol del usuario en el payload
- Los tokens son firmados con `JWT_SECRET`
- Expiración configurable (por defecto 24 horas)

### Autorización

- **AuthGuard**: Valida que el token JWT sea válido
- **RolesGuard**: Verifica que el usuario tenga el rol requerido
- Los endpoints protegidos usan el decorador `@Roles('superadmin')` o `@Roles('user', 'superadmin')`

### Contraseñas

- Gestionadas por Kratos con bcrypt
- Mínimo 8 caracteres
- Cambio de contraseña requiere contraseña actual

### Recomendaciones de Producción

1. Cambiar `JWT_SECRET` a un valor seguro (mínimo 256 bits)
2. Cambiar `NEXTAUTH_SECRET` a un valor seguro
3. Cambiar credenciales del superadmin por defecto
4. Usar HTTPS en producción
5. Configurar CORS apropiadamente
6. Implementar rate limiting
7. Habilitar logs de auditoría para acciones de superadmin

## Desarrollo

### Estructura del Proyecto

```
.
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── users/         # Gestión de perfil
│   │   │   ├── admin/         # Gestión de usuarios (superadmin)
│   │   │   ├── hydra/         # Integración con Hydra
│   │   │   ├── kratos/        # Integración con Kratos
│   │   │   └── common/
│   │   │       ├── guards/    # AuthGuard, RolesGuard
│   │   │       ├── decorators/# @Roles(), @Public()
│   │   │       └── services/  # JwtService, InitService
│   │   └── ...
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx           # Dashboard principal
│       │   │   │   ├── profile/           # Gestión de perfil
│       │   │   │   ├── users/             # Gestión de usuarios
│       │   │   │   └── clients/           # Gestión de clientes OAuth2
│       │   │   ├── login/                 # Login
│       │   │   └── oauth2/                # Flujos OAuth2
│       │   ├── components/
│       │   │   ├── auth-guard.tsx         # Protección de rutas
│       │   │   └── role-based-nav.tsx     # Navegación por rol
│       │   └── lib/
│       │       ├── api/client.ts          # Cliente HTTP con auth
│       │       └── auth/auth-config.ts    # Configuración NextAuth
│       └── ...
├── packages/
│   └── api/                    # DTOs compartidos
├── docker/
│   ├── config/
│   │   ├── kratos.yml         # Configuración de Kratos
│   │   └── identity.schema.json # Schema con rol
│   └── quickstart.yml         # Docker Compose
└── ...
```

### Agregar Nuevos Roles

Para agregar nuevos roles al sistema:

1. Actualizar el schema de Kratos (`docker/config/identity.schema.json`):

```json
{
  "role": {
    "type": "string",
    "enum": ["user", "superadmin", "moderator"],
    "default": "user"
  }
}
```

2. Actualizar los tipos en `packages/api/src/dtos/kratos.dto.ts`

3. Actualizar los tipos en el frontend (`apps/web/src/types/next-auth.d.ts`)

4. Agregar guards y decoradores según sea necesario

## Troubleshooting

### El superadmin no se crea automáticamente

- Verifica que las variables `SUPERADMIN_EMAIL` y `SUPERADMIN_PASSWORD` estén configuradas
- Revisa los logs del backend para ver errores de Kratos
- Asegúrate de que Kratos esté corriendo y accesible

### Error 403 al acceder a endpoints protegidos

- Verifica que el token JWT incluya el claim de rol
- Revisa que el usuario tenga el rol correcto
- Verifica que el endpoint tenga el decorador `@Roles()` correcto

### Error 401 en peticiones al API

- Verifica que el token JWT sea válido y no haya expirado
- Asegúrate de que el frontend esté enviando el header `Authorization: Bearer <token>`
- Verifica que `JWT_SECRET` sea el mismo en backend y que no haya cambiado

## Licencia

[Tu licencia aquí]
