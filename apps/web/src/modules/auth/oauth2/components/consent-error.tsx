interface ConsentErrorProps {
  error: string
}

export function ConsentError({ error }: ConsentErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-destructive/10 border border-destructive rounded-lg">
        <h2 className="text-xl font-semibold text-destructive mb-2">Authorization Error</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  )
}
