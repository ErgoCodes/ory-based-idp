"use client"

import { useState } from "react"
import { Copy, CheckCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function CopyClientIdButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="icon" onClick={copy}>
      {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
