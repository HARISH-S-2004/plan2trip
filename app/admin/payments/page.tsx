"use client"

import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Trash2,
  Plus,
  Pencil,
  Search,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"


function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        status === "Completed" &&
        "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "Pending" &&
        "border-amber-200 bg-amber-50 text-amber-700",
        status === "Refunded" &&
        "border-blue-200 bg-blue-50 text-blue-700"
      )}
    >
      {status}
    </Badge>
  )
}

export default function AdminPaymentsPage() {
  const { payments, deletePayment, addPayment, updatePayment } = useData()
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [form, setForm] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    method: "Credit Card",
    status: "Completed",
    date: new Date().toISOString().split('T')[0]
  })

  // Filtering
  const filteredPayments = payments.filter(p =>
    p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === "Pending")
    .reduce((acc, p) => acc + p.amount, 0)

  const refundAmount = payments
    .filter((p) => p.status === "Refunded")
    .reduce((acc, p) => acc + p.amount, 0)

  const dynamicPaymentStats = [
    {
      label: "Total Collected",
      value: `₹${totalCollected.toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
    },
    {
      label: "Pending Payments",
      value: `₹${pendingAmount.toLocaleString()}`,
      change: `+${payments.filter(p => p.status === "Pending").length} new`,
      trend: "up" as const,
    },
    {
      label: "Refunds Issued",
      value: `₹${refundAmount.toLocaleString()}`,
      change: `-${payments.filter(p => p.status === "Refunded").length}`,
      trend: "down" as const,
    },
  ]

  function resetForm() {
    setForm({
      bookingId: "",
      customer: "",
      amount: "",
      method: "Credit Card",
      status: "Completed",
      date: new Date().toISOString().split('T')[0]
    })
  }

  function handleAdd() {
    const newPayment = {
      ...form,
      id: `PAY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: Number(form.amount) || 0,
    }
    addPayment(newPayment)
    setAddOpen(false)
    resetForm()
  }

  function handleEdit(payment: any) {
    setEditTarget(payment)
    setForm({
      bookingId: payment.bookingId,
      customer: payment.customer,
      amount: payment.amount.toString(),
      method: payment.method,
      status: payment.status,
      date: payment.date
    })
  }

  function handleSaveEdit() {
    if (!editTarget) return
    const updated = {
      ...editTarget,
      ...form,
      amount: Number(form.amount) || 0,
    }
    updatePayment(updated)
    setEditTarget(null)
    resetForm()
  }

  function handleDelete() {
    if (!deleteTarget) return
    deletePayment(deleteTarget.id)
    setDeleteTarget(null)
  }

  function handleExport() {
    // Mock export
    const dataString = "Payment ID,Booking,Customer,Amount,Method,Date,Status\n" +
      payments.map(p => `${p.id},${p.bookingId},${p.customer},${p.amount},${p.method},${p.date},${p.status}`).join("\n")
    const blob = new Blob([dataString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', 'payments_export.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Payments
          </h1>
          <p className="text-sm text-muted-foreground">
            Track all payment transactions and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => { resetForm(); setAddOpen(true); }} className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {dynamicPaymentStats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-0 overflow-hidden border-none shadow-sm bg-card/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-foreground tracking-tight">
                  {stat.value}
                </span>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      stat.trend === "up"
                        ? "text-emerald-600"
                        : "text-red-500"
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                Transaction History
                <Badge variant="secondary" className="ml-2 font-black rounded-full px-2">
                  {filteredPayments.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                All payment transactions across bookings.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or booking..."
                className="pl-9 h-10 rounded-xl bg-secondary/20 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold py-4">Payment ID</TableHead>
                  <TableHead className="hidden sm:table-cell font-bold">Booking</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="hidden md:table-cell font-bold">Method</TableHead>
                  <TableHead className="hidden lg:table-cell font-bold">Date</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="w-[100px] text-right pr-6 font-bold font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="group hover:bg-secondary/5 transition-colors border-secondary/20">
                    <TableCell className="font-bold text-foreground">
                      {payment.id}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground/80 font-medium sm:table-cell">
                      {payment.bookingId}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{payment.customer}</div>
                    </TableCell>
                    <TableCell className="font-black text-primary">
                      ₹{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {payment.method}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground font-medium lg:table-cell">
                      {new Date(payment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                          onClick={() => handleEdit(payment)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
                          onClick={() => setDeleteTarget(payment)}
                          aria-label="Delete payment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="h-40 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-10 w-10 opacity-20" />
                        <p className="text-sm font-medium">No payment records match your search.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Payment Dialog */}
      <Dialog
        open={addOpen || !!editTarget}
        onOpenChange={(open) => {
          if (!open) {
            setAddOpen(false)
            setEditTarget(null)
          }
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editTarget ? "Edit Payment Record" : "Add New Payment"}
            </DialogTitle>
            <DialogDescription>
              {editTarget
                ? "Update the details for this transaction record."
                : "Enter the details to record a new payment transaction."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bookingId" className="font-bold text-xs uppercase text-muted-foreground">Booking ID</Label>
                <Input
                  id="bookingId"
                  placeholder="BK-001"
                  className="rounded-xl bg-secondary/20 border-none h-11"
                  value={form.bookingId}
                  onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="font-bold text-xs uppercase text-muted-foreground">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="rounded-xl bg-secondary/20 border-none h-11"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer" className="font-bold text-xs uppercase text-muted-foreground">Customer Name</Label>
              <Input
                id="customer"
                placeholder="Full name"
                className="rounded-xl bg-secondary/20 border-none h-11"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount" className="font-bold text-xs uppercase text-muted-foreground">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="rounded-xl bg-secondary/20 border-none h-11 font-bold text-primary"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="method" className="font-bold text-xs uppercase text-muted-foreground">Payment Method</Label>
                <Select
                  value={form.method}
                  onValueChange={(val) => setForm({ ...form, method: val })}
                >
                  <SelectTrigger className="rounded-xl bg-secondary/20 border-none h-11 font-medium">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Net Banking">Net Banking</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className="font-bold text-xs uppercase text-muted-foreground">Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm({ ...form, status: val })}
              >
                <SelectTrigger className="rounded-xl bg-secondary/20 border-none h-11 font-medium">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              className="rounded-xl font-bold"
              onClick={() => {
                setAddOpen(false)
                setEditTarget(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl px-8 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              onClick={editTarget ? handleSaveEdit : handleAdd}
            >
              {editTarget ? "Save Changes" : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Payment Record</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to permanently delete record{" "}
              <span className="font-black text-foreground">
                {deleteTarget?.id}
              </span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="ghost"
              className="rounded-xl font-bold"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl px-6 font-bold shadow-lg shadow-red-200"
              onClick={handleDelete}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
