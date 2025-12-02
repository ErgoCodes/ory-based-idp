import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { CredentialCard } from "../../../../modules/dashboard/modules/client/components/credential-card"
import { SecurityNote } from "../../../../modules/dashboard/modules/client/components/security-note"
import { SuccessHeader } from "../../../../modules/dashboard/modules/client/components/success-header"
import ClientSuccessContent from "@/modules/dashboard/modules/client/containers/cliente-success-container"

export type PageProps = {
  searchParams: Promise<{
    client_id?: string
    client_secret?: string
    client_name?: string
  }>
}

export default function ClientSuccessPage(props: PageProps) {
  return (
    <AuthGuard>
      <ClientSuccessContent {...props} />
    </AuthGuard>
  )
}
