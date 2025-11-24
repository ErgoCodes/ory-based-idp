# Script para actualizar el redirect_uri del cliente OAuth2 en Hydra (PowerShell)
# Este script actualiza el cliente para que funcione con NextAuth.js

$CLIENT_ID = "64f5d226-5e02-47b4-b56b-e58d160d6fc0"
$HYDRA_ADMIN_URL = "http://localhost:4445"

Write-Host "Actualizando cliente OAuth2: $CLIENT_ID" -ForegroundColor Cyan
Write-Host "Agregando redirect_uri para NextAuth.js..." -ForegroundColor Cyan

$body = @{
    client_id = $CLIENT_ID
    client_name = "NextAuth OAuth2 Demo Client"
    redirect_uris = @(
        "http://localhost:8363/api/auth/callback/hydra"
    )
    post_logout_redirect_uris = @(
        "http://localhost:8363"
    )
    grant_types = @(
        "authorization_code",
        "refresh_token"
    )
    response_types = @(
        "code"
    )
    scope = "openid email profile offline_access"
    token_endpoint_auth_method = "none"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$HYDRA_ADMIN_URL/admin/clients/$CLIENT_ID" `
        -Method Put `
        -ContentType "application/json" `
        -Body $body

    Write-Host ""
    Write-Host "✅ Cliente actualizado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Redirect URI configurado: http://localhost:8363/api/auth/callback/hydra" -ForegroundColor Yellow
    Write-Host "Post Logout Redirect URI: http://localhost:8363" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Detalles del cliente:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host ""
    Write-Host "❌ Error al actualizar el cliente:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegúrate de que Hydra esté corriendo en $HYDRA_ADMIN_URL" -ForegroundColor Yellow
}
