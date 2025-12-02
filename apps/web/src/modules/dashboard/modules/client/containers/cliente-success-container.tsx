import { Button } from "@workspace/ui/components/button"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import { CredentialCard } from "../components/credential-card"
import { SecurityNote } from "../components/security-note"
import { SuccessHeader } from "../components/success-header"
import Link from "next/link"
import type { PageProps } from "@/app/dashboard/clients/success/page"

export default async function ClientSuccessContent({ searchParams }: PageProps) {
  const params = await searchParams
  const { client_id: clientId, client_secret: clientSecret, client_name: clientName } = params

  if (!clientId) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <SuccessHeader clientName={clientName} />

        {clientSecret && <SecurityNote />}

        <div className="space-y-6">
          <CredentialCard clientId={clientId} clientSecret={clientSecret} />

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/clients/${clientId}`}>View Details</Link>
            </Button>
          </div>

          {clientSecret && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Security Note:</strong> Store your client secret in a secure location such
                as environment variables or a secrets manager. Never commit it to version control or
                expose it in client-side code.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
