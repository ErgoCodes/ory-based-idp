"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { toast } from "sonner"
import { verifyEmail } from "../actions"

const verificationSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Verification code must be 6 digits"),
})

type VerificationFormValues = z.infer<typeof verificationSchema>

interface VerificationFormProps {
  flowId: string
}

export function VerificationForm({ flowId }: VerificationFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: VerificationFormValues) => {
    setLoading(true)
    try {
      const result = await verifyEmail(flowId, data.code)

      if (!result.success && result.error) {
        toast.error(result.error)
      } else {
        toast.success("Email verified successfully!")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>An email with a verification code has been sent to you</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Enter verification code</FormLabel>
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
