"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  Clock,
  MapPin,
  Check,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { TourPackage } from "@/lib/data"
import { EnquiryDialog } from "../enquiry-dialog"

export function PackageDetailsClient({ pkg }: { pkg: TourPackage }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div>
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-sm text-card/80">
              <Link href="/" className="hover:text-card">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/packages" className="hover:text-card">
                Packages
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-card">{pkg.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge className="gap-1 rounded-md bg-primary/10 text-primary hover:bg-primary/10">
                  <Clock className="h-3 w-3" />
                  {pkg.duration}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0 font-medium transition-colors",
                    pkg.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-red-500/30 bg-red-500/10 text-red-600"
                  )}
                >
                  {pkg.status}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {pkg.destination}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span className="font-medium text-foreground">
                    {pkg.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({pkg.reviewCount} reviews)
                  </span>
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {pkg.title}
              </h1>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 h-auto w-full justify-start gap-1 rounded-xl bg-secondary p-1">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="inclusions"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Inclusions
                </TabsTrigger>
                <TabsTrigger
                  value="exclusions"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Exclusions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-3 text-lg font-semibold text-foreground">
                      About This Trip
                    </h2>
                    <p className="leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>
                  <div>
                    <h2 className="mb-3 text-lg font-semibold text-foreground">
                      Trip Highlights
                    </h2>
                    <ul className="space-y-2.5">
                      {pkg.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-0">
                <div className="space-y-0">
                  {pkg.itinerary.map((item, idx) => (
                    <div
                      key={item.day}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {item.day}
                        </div>
                        {idx < pkg.itinerary.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="pb-2 pt-1.5">
                        <h3 className="mb-1 text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-0">
                <ul className="space-y-3">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="exclusions" className="mt-0">
                <ul className="space-y-3">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                      </div>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">From</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / person
                  </span>
                </div>
              </div>

              <div className="mb-6 space-y-3 rounded-xl bg-secondary p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">
                    {pkg.duration}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium text-foreground">
                    {pkg.destination}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {pkg.rating}
                  </span>
                </div>
              </div>

              <EnquiryDialog defaultDestination={pkg.title}>
                <Button
                  size="lg"
                  className={cn(
                    "w-full transition-all text-lg font-bold",
                    pkg.status === "Active"
                      ? "bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground"
                      : "cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted"
                  )}
                  disabled={pkg.status === "Inactive"}
                >
                  {pkg.status === "Active" ? (
                    "Enquire Now"
                  ) : (
                    <span>Inquiry Paused</span>
                  )}
                </Button>
              </EnquiryDialog>

              {pkg.status === "Inactive" && (
                <p className="mt-2 text-center text-[11px] font-medium text-red-500">
                  This package is currently not accepting new enquiries.
                </p>
              )}

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free cancellation up to 48 hours before the trip
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
