"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import type { OAuth2Client } from "@/types/oauth-client.types"
import { Button } from "@workspace/ui/components/button"
import { DeleteClientButton } from "./delete-client-button"

export function ClientActions({ client }: { client: OAuth2Client }) {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-4 flex items-center justify-end">
      <Button variant="ghost" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <DeleteClientButton client={client} />
    </div>
  )
}
