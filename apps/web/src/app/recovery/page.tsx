"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form"
import { Button } from "@workspace/ui/components/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp"

const formSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
})

export default function RecoveryCodePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get("flowId") || "" // read flowId from query param
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}/auth/recovery/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          flowId,
          code: values.code,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[RecoveryCodePage] Error response:", errorText)
        setError("Invalid or expired recovery code.")
        return
      }

      const recovery_complete_json_response = await response.json()
      console.log("[RecoveryCodePage] Success response:", recovery_complete_json_response)
      //here
      const settingsResponse = await fetch(`${apiUrl}/auth/settings/flow/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT: ensures cookies are sent
      })

      if (!settingsResponse.ok) {
        const errorText = await settingsResponse.text()
        console.error("[RecoveryCodePage] Settings flow creation failed:", errorText)
        return
      }

      const settingsJson = await settingsResponse.json()
      console.log("[RecoveryCodePage] Settings flow created:", settingsJson)

      const settingsFlowId = settingsJson.flowId

      router.push(`/recovery/reset-password?flowId=${settingsFlowId}`)
    } catch (err) {
      console.error("[RecoveryCodePage] Exception:", err)
      setError("Unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Enter Recovery Code</CardTitle>
          <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col justify-center items-center"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
