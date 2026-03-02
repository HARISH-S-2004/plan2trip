"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { initialBookings, type Booking } from "@/lib/data"

const statusStyles: Record<
  Booking["status"],
  string
> = {
  Confirmed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function MyBookingsClient() {
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get("booked") === "true") {
      setToast("Booking submitted successfully! It will appear as Pending.")
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  function cancelBooking(id: string) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" as const } : b))
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {toast && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all your travel bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            No bookings yet
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start exploring our packages and book your dream trip!
          </p>
          <Link href="/packages">
            <Button>Browse Packages</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Booking ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Package
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Travel Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Travelers
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-sm font-medium text-foreground">
                      {b.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {b.packageTitle}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {b.destination}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.travelDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.travelers}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">
                      ₹{b.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`rounded-md text-xs font-medium ${statusStyles[b.status]}`}
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {b.status !== "Cancelled" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Booking {b.id}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel your booking for{" "}
                                <span className="font-medium">
                                  {b.packageTitle}
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelBooking(b.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {b.id}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground">
                      {b.packageTitle}
                    </h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`rounded-md text-xs font-medium ${statusStyles[b.status]}`}
                  >
                    {b.status}
                  </Badge>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {b.destination}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {b.travelDate}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {b.travelers} travelers
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    ₹{b.totalPrice.toLocaleString()}
                  </span>
                  {b.status !== "Cancelled" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel Booking {b.id}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your booking for{" "}
                            <span className="font-medium">
                              {b.packageTitle}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelBooking(b.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
