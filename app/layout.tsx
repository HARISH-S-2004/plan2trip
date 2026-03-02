import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { inter, playfair } from "@/lib/fonts"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Plan2Trip - Plan Smart. Travel Better.",
  description:
    "Discover curated travel packages to the world's most stunning destinations. Book your dream vacation with Plan2Trip today.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
}

import { DataProvider } from "@/context/data-context"
import { MaintenanceGuard } from "@/components/maintenance-guard"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <DataProvider>
          <MaintenanceGuard>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </MaintenanceGuard>
          <Toaster position="top-center" richColors />
          <Analytics />
        </DataProvider>
      </body>
    </html>
  )
}
