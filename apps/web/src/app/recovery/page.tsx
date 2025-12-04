import { RecoveryCodeForm } from "@/components/auth/recovery-code-form"
import { redirect } from "next/navigation"

interface RecoveryCodePageProps {
  searchParams: {
    flowId?: string
  }
}

export default function RecoveryCodePage({ searchParams }: RecoveryCodePageProps) {
  const flowId = searchParams.flowId

  if (!flowId) {
    // If no flowId is present, we can't verify the code.
    // Redirect to login page as a fallback.
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RecoveryCodeForm flowId={flowId} />
    </div>
  )
}
