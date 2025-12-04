import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { redirect } from "next/navigation"

interface ResetPasswordPageProps {
  searchParams: {
    flowId?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const flowId = searchParams.flowId

  if (!flowId) {
    // If no flowId is present, we can't complete the flow.
    // Redirecting to recovery start page or showing an error might be appropriate.
    // For now, let's redirect to the main recovery page.
    redirect("/recovery")
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Reset your password</h1>
      <ResetPasswordForm flowId={flowId} />
    </div>
  )
}
