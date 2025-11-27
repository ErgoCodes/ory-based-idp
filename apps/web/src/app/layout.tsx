import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "../../../../packages/ui/src/components/sonner"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
        <Toaster
          toastOptions={{
            // unstyled: true,
            classNames: {
              default: "!bg-background !border-2 !border-border",
              description: "!text-foreground",
              error: "!bg-background !text-destructive !border-2 !border-border",
              success: "!text-green-400 !bg-background !border-2 !border-border",
              warning: "!text-yellow-400 !bg-background !border-2 !border-border",
              info: "!bg-background !text-blue-400 !border-2 !border-border",
            },
          }}
        />
      </body>
    </html>
  )
}
