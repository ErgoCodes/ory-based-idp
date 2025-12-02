import { AlertTriangle } from "lucide-react"

export function SecurityNote() {
  return (
    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <div className="flex-1">
          <p className="mb-1 font-medium text-yellow-900 dark:text-yellow-200">
            Important: Save your client secret now!
          </p>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            This is the only time you&apos;ll be able to see the client secret. Make sure to copy
            and store it securely.
          </p>
        </div>
      </div>
    </div>
  )
}
