"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider } from "./theme"
import React from "react"

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
