"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { changeUserPassword } from "@/lib/services/user"
import RHFTextField from "@/components/common/rhf-text-field"
import RHFSubmitButton from "@/components/common/rhf-submit-button"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SecurityCard() {
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof passwordSchema>) {
    try {
      await changeUserPassword(data)
      toast.success("Password changed successfully")
      setIsChangingPassword(false)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your password and security settings.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isChangingPassword ? (
          <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
            Change Password
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RHFTextField
                name="currentPassword"
                label="Current Password"
                type="password"
                useCase="password"
                placeholder="Enter your current password"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <RHFTextField
                  name="newPassword"
                  label="New Password"
                  type="password"
                  useCase="password"
                  placeholder="Enter your new password"
                  required
                />
                <RHFTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  useCase="password"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              <RHFSubmitButton label="Update Password" />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
