"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { TourPackage } from "@/lib/data"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function BookingClient({ pkg }: { pkg: TourPackage }) {
  const router = useRouter()
  const [travelers, setTravelers] = useState(2)
  const [date, setDate] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const totalPrice = pkg.price * travelers

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push("/bookings?booked=true")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/packages" className="hover:text-primary">
          Packages
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/packages/${pkg.id}`} className="hover:text-primary">
          {pkg.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Booking</span>
      </div>

      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Complete Your Booking
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Form */}
          <div className="flex-1 space-y-6">
            {/* Trip Details */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Trip Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Travel Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="travelers"
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Number of Travelers
                  </Label>
                  <Input
                    id="travelers"
                    type="number"
                    min={1}
                    max={10}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    required
                    className="bg-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Traveler Info */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Lead Traveler Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="bg-secondary"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="specialRequests">
                  Special Requests (Optional)
                </Label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any dietary requirements, accessibility needs, or special requests..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <aside className="w-full shrink-0 lg:w-96">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Booking Summary
              </h2>

              <div className="mb-4 flex gap-4 rounded-xl bg-secondary p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {pkg.destination}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {pkg.duration}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Price per person
                  </span>
                  <span className="font-medium text-foreground">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-medium text-foreground">
                    {travelers}
                  </span>
                </div>
                {date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Travel Date</span>
                    <span className="font-medium text-foreground">{date}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className={cn(
                  "mt-6 w-full gap-2 transition-all",
                  pkg.status === "Active"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted"
                )}
                disabled={pkg.status === "Inactive"}
              >
                <CreditCard className="h-4 w-4" />
                {pkg.status === "Active" ? "Proceed to Payment" : "Temporarily Unavailable"}
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Your card will not be charged until you confirm
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  )
}
