"use client"

import Link from "next/link"
import { Plane, Mail, MapPin, Phone } from "lucide-react"
import { useData } from "@/context/data-context"

export function Footer() {
  const { footerData } = useData()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
                <img src="/logo.png" alt="Plan2Trip" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Plan2Trip
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {footerData.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/packages"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Tour Packages
              </Link>
              <Link
                href="/hotels"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Hotels
              </Link>
              <Link
                href="/villas"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Villas
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Destinations
            </h3>
            <nav className="flex flex-col gap-2.5">
              {footerData.destinations.map(
                (dest) => (
                  <Link
                    key={dest}
                    href="/packages"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {dest}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {footerData.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {footerData.phone}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {footerData.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {"2026 Plan2Trip. All rights reserved."}
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
