# OAuth2 Client Management Scripts

Este directorio contiene scripts para gestionar clientes OAuth2 en Hydra.

## Scripts Disponibles

### 1. Actualizar Cliente OAuth2

Actualiza la configuración de un cliente OAuth2 existente en Hydra, específicamente para configurar los redirect URIs necesarios para NextAuth.js.

#### PowerShell (Windows)

```powershell
.\scripts\update-oauth2-client.ps1
```

#### Bash (Linux/Mac)

```bash
chmod +x scripts/update-oauth2-client.sh
./scripts/update-oauth2-client.sh
```

## Configuración para NextAuth.js

NextAuth.js requiere que el cliente OAuth2 tenga configurado el siguiente redirect URI:

```
http://localhost:8363/api/auth/callback/hydra
```

Donde:

- `http://localhost:8363` es tu `NEXTAUTH_URL`
- `/api/auth/callback/` es el path fijo de NextAuth
- `hydra` es el ID del provider configurado en NextAuth

## Verificar la Configuración

Después de ejecutar el script, puedes verificar la configuración del cliente usando:

### Usando curl

```bash
curl http://localhost:4445/admin/clients/64f5d226-5e02-47b4-b56b-e58d160d6fc0
```

### Usando la API de tu backend

```bash
curl http://localhost:3000/oauth2/clients/64f5d226-5e02-47b4-b56b-e58d160d6fc0
```

## Troubleshooting

### Error: "redirect_uri does not match"

Este error ocurre cuando el redirect_uri que NextAuth está usando no está registrado en el cliente OAuth2.

**Solución:** Ejecuta el script `update-oauth2-client.ps1` o `update-oauth2-client.sh`

### Error: "Connection refused"

Asegúrate de que Hydra esté corriendo:

```bash
docker-compose -f docker/quickstart.yml up -d
```

### Cambiar el CLIENT_ID

Si necesitas actualizar un cliente diferente, edita la variable `CLIENT_ID` en el script:

**PowerShell:**

```powershell
$CLIENT_ID = "tu-client-id-aqui"
```

**Bash:**

```bash
CLIENT_ID="tu-client-id-aqui"
```

## API Endpoint para Actualizar Clientes

También puedes actualizar clientes usando el endpoint de la API:

```bash
curl -X PUT http://localhost:3000/oauth2/clients/YOUR_CLIENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "My OAuth2 Client",
    "redirect_uris": ["http://localhost:8363/api/auth/callback/hydra"],
    "post_logout_redirect_uris": ["http://localhost:8363"],
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "scope": "openid email profile offline_access",
    "token_endpoint_auth_method": "none"
  }'
```

## Recursos

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Ory Hydra Documentation](https://www.ory.sh/docs/hydra/)
- [OAuth2 Redirect URIs](https://www.oauth.com/oauth2-servers/redirect-uris/)
