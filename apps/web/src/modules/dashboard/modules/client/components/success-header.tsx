import { CheckCircle } from "lucide-react"

interface SuccessHeaderProps {
  clientName?: string
}

export function SuccessHeader({ clientName }: SuccessHeaderProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Client Created Successfully!</h1>
        <p className="text-muted-foreground">
          {clientName || "Your OAuth2 client"} has been registered
        </p>
      </div>
    </div>
  )
}
