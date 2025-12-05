"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { AlertCircle } from "lucide-react"

interface LoginErrorProps {
  error: string
}

export function LoginError({ error }: LoginErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="max-w-md w-full border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Authentication Error</CardTitle>
          </div>
          <CardDescription className="text-destructive/80">{error}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
