import { RecoveryCodeForm } from "@/components/auth/recovery-code-form"
import { redirect } from "next/navigation"

interface RecoveryCodePageProps {
  searchParams: Promise<{
    flowId?: string
  }>
}

export default async function RecoveryCodePage(props: RecoveryCodePageProps) {
  const searchParams = await props.searchParams
  console.log(searchParams)

  if (!searchParams.flowId) {
    // If no flowId is present, we can't verify the code.
    // Redirect to login page as a fallback.
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RecoveryCodeForm flowId={searchParams.flowId} />
    </div>
  )
}
