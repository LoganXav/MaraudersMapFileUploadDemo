"use client"
import { QueryClient, QueryClientProvider } from "react-query"

import { fontMono, fontRoboto, fontRoobert, fontReckless } from "@/lib/fonts"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/common/toast-layout"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-secondary font-roobert font-medium antialiased",
          fontRoboto.variable,
          fontMono.variable,
          fontRoobert.variable,
          fontReckless.variable
        )}
      >
        <QueryClientProvider client={queryClient}>
          <main className="container pt-8">{children}</main>
        </QueryClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
