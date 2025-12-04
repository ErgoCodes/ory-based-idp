import { handleLogout } from "@/modules/auth/oauth2/actions"

interface LogoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LogoutPage({ searchParams }: LogoutPageProps) {
  const resolvedSearchParams = await searchParams
  const challenge = resolvedSearchParams.logout_challenge as string | undefined

  if (challenge) {
    await handleLogout(challenge)
  }

  // This will never be reached as handleLogout always redirects
  return null
}
