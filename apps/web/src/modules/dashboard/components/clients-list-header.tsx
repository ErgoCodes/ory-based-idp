import { Button } from "@workspace/ui/components/button"
import { Shield, Plus } from "lucide-react"
import Link from "next/link"

export function ClientsListHeader({ total }: { total: number }) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">OAuth2 Clients</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {total} client{total !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>

        {/* Actions */}
        <Button asChild>
          <Link href="/dashboard/clients/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New Client
          </Link>
        </Button>
      </div>
    </div>
  )
}
