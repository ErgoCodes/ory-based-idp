"use client"

import { useFormContext } from "react-hook-form"
import { useTranslations } from "next-intl"
import React, { FunctionComponent } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

type RHFSubmitButtonProps = React.ComponentProps<typeof Button> & {
  label?: string
}

const RHFSubmitButton: FunctionComponent<RHFSubmitButtonProps> = ({
  label = "Submit",
  ...props
}) => {
  const { formState } = useFormContext()
  const isSubmitting = formState.isSubmitting

  return (
    <Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : label}
    </Button>
  )
}

export default RHFSubmitButton
