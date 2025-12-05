import { Suspense } from "react"
import { LoginPageContent } from "../../../modules/oauth/components/login-page-content"

interface PageProps {
  searchParams: Promise<{ login_challenge?: string }>
}

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  )
}
