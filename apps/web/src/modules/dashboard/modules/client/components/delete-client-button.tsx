"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/api/client"
import type { OAuth2Client } from "@/types/oauth-client.types"
import { Button } from "@workspace/ui/components/button"

export function DeleteClientButton({ client }: { client: OAuth2Client }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${client.client_name}"? This cannot be undone.`)) return

    try {
      const res = await fetchWithAuth(`/oauth2/clients/${client.client_id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()
      router.push("/dashboard")
    } catch {
      toast.error("Failed to delete client")
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 mr-2" />
      Delete Client
    </Button>
  )
}
