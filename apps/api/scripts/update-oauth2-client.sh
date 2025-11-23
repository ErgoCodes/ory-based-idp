#!/bin/bash

# Script para actualizar el redirect_uri del cliente OAuth2 en Hydra
# Este script actualiza el cliente para que funcione con NextAuth.js

CLIENT_ID="64f5d226-5e02-47b4-b56b-e58d160d6fc0"
HYDRA_ADMIN_URL="http://localhost:4445"

echo "Actualizando cliente OAuth2: $CLIENT_ID"
echo "Agregando redirect_uri para NextAuth.js..."

# Actualizar el cliente con el nuevo redirect_uri
curl -X PUT "${HYDRA_ADMIN_URL}/admin/clients/${CLIENT_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "'"${CLIENT_ID}"'",
    "client_name": "NextAuth OAuth2 Demo Client",
    "redirect_uris": [
      "http://localhost:8363/api/auth/callback/hydra"
    ],
    "post_logout_redirect_uris": [
      "http://localhost:8363"
    ],
    "grant_types": [
      "authorization_code",
      "refresh_token"
    ],
    "response_types": [
      "code"
    ],
    "scope": "openid email profile offline_access",
    "token_endpoint_auth_method": "none"
  }'

echo ""
echo "✅ Cliente actualizado exitosamente!"
echo ""
echo "Redirect URI configurado: http://localhost:8363/api/auth/callback/hydra"
echo "Post Logout Redirect URI: http://localhost:8363"
