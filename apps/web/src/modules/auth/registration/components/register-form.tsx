"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form"
import { toast } from "sonner"
import { registerUser } from "../../../../lib/services/register"
import RHFTextField from "@/components/common/rhf-text-field"
import RHFSubmitButton from "@/components/common/rhf-submit-button"

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })

      console.log("Registration result:", result)

      if (result.shouldRedirect) {
        console.log("Redirecting to verification page...")
        console.log("FlowId received:", result.flowId)

        if (result.error) {
          toast.warning(result.error)
        } else {
          toast.success("Registration successful! Verification email sent.")
        }

        // Redirect to verification page with flowId
        if (result.flowId) {
          const redirectUrl = `/verification?flow=${result.flowId}`
          console.log("Redirecting to:", redirectUrl)
          window.location.href = redirectUrl
        } else {
          console.warn("No flowId received, redirecting to notice page")
          // Fallback to notice page if no flowId
          window.location.href = "/verification/notice"
        }
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to use the authentication system</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <RHFTextField name="firstName" label="First Name" placeholder="John" required />
              <RHFTextField name="lastName" label="Last Name" placeholder="Doe" required />
            </div>

            <RHFTextField name="email" label="Email" placeholder="you@example.com" required />

            <RHFTextField
              name="password"
              label="Password"
              placeholder="••••••••"
              required
              useCase="password"
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              required
              useCase="password"
            />
            <div className="flex w-full justify-center">
              <RHFSubmitButton label="Create Account" disabled={loading} />
            </div>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-primary hover:underline"
            >
              Back to home
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
