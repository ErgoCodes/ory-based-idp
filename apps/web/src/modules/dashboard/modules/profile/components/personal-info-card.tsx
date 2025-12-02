"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { updateUserProfile, type UserProfile } from "@/lib/services/user"

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
})

interface PersonalInfoCardProps {
  initialProfile: UserProfile
}

export function PersonalInfoCard({ initialProfile }: PersonalInfoCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialProfile.traits.name?.first || "",
      lastName: initialProfile.traits.name?.last || "",
      email: initialProfile.traits.email,
    },
  })

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    try {
      await updateUserProfile({
        name: {
          first: data.firstName,
          last: data.lastName,
        },
        email: data.email,
      })
      toast.success("Profile updated successfully")
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and contact information.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">
                  {initialProfile.traits.name
                    ? `${initialProfile.traits.name.first} ${initialProfile.traits.name.last}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{initialProfile.traits.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Role</Label>
                <p className="font-medium capitalize">{initialProfile.traits.role}</p>
              </div>
              {initialProfile.created_at && (
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-medium">
                    {new Date(initialProfile.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

function Label({ className, children, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
