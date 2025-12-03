import { CheckCircle2 } from "lucide-react"

interface ConsentScopesProps {
  scopes: string[]
}

export function ConsentScopes({ scopes }: ConsentScopesProps) {
  if (scopes.length === 0) {
    return null
  }

  return (
    <div className="mb-6 p-4 bg-muted rounded-md">
      <p className="font-medium text-sm mb-2">This application will be able to:</p>
      <ul className="space-y-2">
        {scopes.map((scope) => (
          <li key={scope} className="flex items-start text-sm">
            <CheckCircle2 className="w-5 h-5 mr-2 text-primary shrink-0" />
            <span>{scope}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
