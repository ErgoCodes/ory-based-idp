import { redirect } from "next/navigation"
import { VerificationForm } from "@/modules/auth/verification/components/verification-form"

interface VerificationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  const resolvedSearchParams = await searchParams
  const flowId = resolvedSearchParams.flow as string | undefined

  if (!flowId) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <VerificationForm flowId={flowId} />
    </div>
  )
}
