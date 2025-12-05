"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLogin } from "../../../lib/services/oauth-login"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  loginChallenge: string
  clientName: string
  requestedScopes: string[]
}

export function LoginForm({ loginChallenge, clientName, requestedScopes }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  async function onSubmit(values: LoginFormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitLogin(loginChallenge, values)

      if (!result.success) {
        setError(result.error || "Login failed")
        setIsSubmitting(false)
        return
      }

      // Redirect to the URL provided by Hydra
      if (result.redirect_to) {
        window.location.href = result.redirect_to
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md w-full p-8 bg-card border rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">
            <span className="font-medium">{clientName}</span> is requesting access to your account
          </p>
          {requestedScopes.length > 0 && (
            <div className="mt-3">
              <p className="font-medium mb-1">Requested permissions:</p>
              <ul className="list-disc list-inside space-y-1">
                {requestedScopes.map((scope) => (
                  <li key={scope} className="text-xs">
                    {scope}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
          <FormField
            control={form.control as any}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <Label className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
