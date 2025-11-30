import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function DashboardHeader({ total }: { total: number }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-semibold">OAuth2 Clients</h2>
        <p className="text-sm text-muted-foreground">
          {total} client{total !== 1 ? "s" : ""} registered
        </p>
      </div>

      <Button>
        <Link className="flex flex-row items-center" href={"/dashboard/clients/new"}>
          <Plus className="h-4 w-4 mr-2" /> New Client
        </Link>
      </Button>
    </div>
  )
}
