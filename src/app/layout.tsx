import { fontMono, fontRoboto, fontRoobert, fontReckless } from "@/lib/fonts"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/common/toast-layout"
import { AppProviders } from "@/providers"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-roobert font-medium antialiased",
          fontRoboto.variable,
          fontMono.variable,
          fontRoobert.variable,
          fontReckless.variable
        )}
      >
        <AppProviders>
          <main className="relative min-h-screen">{children}</main>
        </AppProviders>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
