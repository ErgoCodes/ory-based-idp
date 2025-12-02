"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { CreateClientForm } from "../components/create-client-form"

export function CreateClientView() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Create New OAuth2 Client</h1>
          <p className="text-sm text-muted-foreground">
            Register a new application to use your identity provider
          </p>
        </div>

        <CreateClientForm />
      </main>
    </div>
  )
}
