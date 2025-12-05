import { Suspense } from "react"
import { AlertCircle } from "lucide-react"
import { getConsentRequest } from "@/modules/auth/oauth2/actions"
import { ConsentCard } from "../../../modules/oauth/components/consent-card"

interface ConsentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const resolvedSearchParams = await searchParams
  const consentChallenge = resolvedSearchParams.consent_challenge as string | undefined

  if (!consentChallenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold text-destructive">Authorization Error</h2>
          <p className="text-sm text-muted-foreground">Missing consent challenge parameter</p>
        </div>
      </div>
    )
  }

  const { data: consentRequest, error } = await getConsentRequest(consentChallenge)

  if (error || !consentRequest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold text-destructive">Authorization Error</h2>
          <p className="text-sm text-muted-foreground">
            {error || "Failed to load consent request"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ConsentCard consentRequest={consentRequest} consentChallenge={consentChallenge} />
      </Suspense>
    </div>
  )
}
