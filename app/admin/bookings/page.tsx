"use client"

import { useState } from "react"
import {
  Search,
  CheckCircle,
  XCircle,
  Filter,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useData } from "@/context/data-context"
import { type Booking } from "@/lib/data"
import { cn } from "@/lib/utils"

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        status === "Confirmed" &&
        "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "Pending" &&
        "border-amber-200 bg-amber-50 text-amber-700",
        status === "Cancelled" &&
        "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {status}
    </Badge>
  )
}

export default function AdminBookingsPage() {
  const { bookings, deleteBooking, updateBookingStatus } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionTarget, setActionTarget] = useState<{
    booking: Booking
    action: "confirm" | "cancel" | "delete"
  } | null>(null)

  const filtered = bookings.filter((b) => {
    const customerName = b.customerName || ""
    const customerEmail = b.customerEmail || ""
    const matchesSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.packageTitle.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleAction() {
    if (!actionTarget) return

    if (actionTarget.action === "delete") {
      deleteBooking(actionTarget.booking.id)
    } else {
      const newStatus = actionTarget.action === "confirm" ? "Confirmed" : "Cancelled"
      updateBookingStatus(actionTarget.booking.id, newStatus)
    }
    setActionTarget(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all customer bookings.
        </p>
      </div>

      {/* Filters */}
      <Card className="gap-0 py-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Bookings
            <Badge variant="secondary" className="ml-2">
              {filtered.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage customer bookings, confirm or cancel pending ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Package</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Travel Date
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  Travelers
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-foreground">
                    {booking.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {booking.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {booking.customerEmail}
                      </span>
                      {booking.customerPhone && (
                        <span className="text-[10px] text-primary font-medium mt-0.5">
                          {booking.customerPhone}
                        </span>
                      )}
                      {booking.requirements && (
                        <p className="text-[10px] text-muted-foreground mt-1 bg-secondary/30 p-1.5 rounded italic line-clamp-2 max-w-[200px]">
                          "{booking.requirements}"
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    <div className="flex flex-col">
                      <span>{booking.packageTitle}</span>
                      {booking.packageId === "enquiry" && (
                        <Badge variant="outline" className="w-fit text-[9px] h-4 px-1 mt-1 border-primary/30 text-primary">Enquiry</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {new Date(booking.travelDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {booking.travelers}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    ₹{booking.totalPrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {booking.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() =>
                              setActionTarget({
                                booking,
                                action: "confirm",
                              })
                            }
                            aria-label="Confirm booking"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              setActionTarget({
                                booking,
                                action: "cancel",
                              })
                            }
                            aria-label="Cancel booking"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                        onClick={() =>
                          setActionTarget({
                            booking,
                            action: "delete",
                          })
                        }
                        aria-label="Delete booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action confirmation dialog */}
      <Dialog
        open={!!actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionTarget?.action === "confirm"
                ? "Confirm Booking"
                : actionTarget?.action === "cancel"
                  ? "Cancel Booking"
                  : "Delete Booking"}
            </DialogTitle>
            <DialogDescription>
              {actionTarget?.action === "confirm"
                ? `Are you sure you want to confirm booking ${actionTarget?.booking.id} for ${actionTarget?.booking.customerName}?`
                : actionTarget?.action === "cancel"
                  ? `Are you sure you want to cancel booking ${actionTarget?.booking.id} for ${actionTarget?.booking.customerName}? This cannot be undone.`
                  : `Are you sure you want to permanently delete booking ${actionTarget?.booking.id}? This will remove all records of this booking.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionTarget(null)}>
              Go Back
            </Button>
            <Button
              variant={
                actionTarget?.action === "delete" || actionTarget?.action === "cancel"
                  ? "destructive"
                  : "default"
              }
              className={
                actionTarget?.action === "confirm"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }
              onClick={handleAction}
            >
              {actionTarget?.action === "confirm"
                ? "Confirm"
                : actionTarget?.action === "cancel"
                  ? "Cancel Booking"
                  : "Delete Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
