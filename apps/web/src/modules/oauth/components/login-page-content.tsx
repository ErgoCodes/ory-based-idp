import { getLoginRequest } from "../../../lib/services/oauth-login"
import { LoginError } from "./login-error"
import { LoginForm } from "./login-form"

interface PageProps {
  searchParams: Promise<{ login_challenge?: string }>
}

export async function LoginPageContent({ searchParams }: PageProps) {
  const params = await searchParams
  const loginChallenge = params.login_challenge

  // Validate login challenge parameter
  if (!loginChallenge) {
    return <LoginError error="Missing login challenge parameter" />
  }

  // Fetch login request details on the server
  const { data: loginRequest, error } = await getLoginRequest(loginChallenge)

  // Handle errors
  if (error || !loginRequest) {
    return <LoginError error={error || "Failed to load login request"} />
  }

  // Render the login form (client component for interactivity)
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm
        loginChallenge={loginChallenge}
        clientName={loginRequest.client.client_name}
        requestedScopes={loginRequest.requested_scope}
      />
    </div>
  )
}
