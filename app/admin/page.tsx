"use client"

import {
  IndianRupee,
  CalendarCheck,
  Users,
  Package,
  Building,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"
import { useState, useEffect } from "react"
import { useData } from "@/context/data-context"
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

export default function AdminDashboardPage() {
  const { bookings, users, packages, payments } = useData()

  const calculateRevenue = () => payments.reduce((acc: number, p: any) => acc + p.amount, 0)

  const [liveStats, setLiveStats] = useState([
    {
      title: "Total Revenue",
      value: calculateRevenue(),
      change: "+12.5%",
      trend: "up" as const,
      icon: IndianRupee,
      accent: "bg-primary/10 text-primary",
      prefix: "₹",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      change: "+8.2%",
      trend: "up" as const,
      icon: CalendarCheck,
      accent: "bg-chart-3/10 text-chart-3",
    },
    {
      title: "Total Users",
      value: users.length,
      change: "+23.1%",
      trend: "up" as const,
      icon: Users,
      accent: "bg-gold/10 text-gold",
    },
    {
      title: "Active Packages",
      value: packages.filter(p => p.status === "Active").length,
      change: "-1",
      trend: "down" as const,
      icon: Package,
      accent: "bg-chart-4/10 text-chart-4",
    },
  ])

  // Calculate Revenue Data from Payments
  const dynamicRevenueData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleString('en-US', { month: 'short' })
    const monthYear = d.toLocaleString('en-US', { month: 'short', year: 'numeric' })

    const monthlyRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.date)
        return paymentDate.getMonth() === d.getMonth() && paymentDate.getFullYear() === d.getFullYear()
      })
      .reduce((acc: number, p: any) => acc + p.amount, 0)

    return { month, revenue: monthlyRevenue }
  })

  // Calculate Bookings by Destination
  const destinationCounts = bookings.reduce((acc: Record<string, number>, b) => {
    const parts = b.destination.split(',')
    const dest = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim()
    acc[dest] = (acc[dest] || 0) + 1
    return acc
  }, {})

  const dynamicBookingsByDestination = Object.entries(destinationCounts)
    .map(([destination, count]) => ({ destination, bookings: count }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5)

  // Update liveStats when shared data changes
  useEffect(() => {
    setLiveStats(prev => prev.map(stat => {
      if (stat.title === "Total Revenue") return { ...stat, value: calculateRevenue() }
      if (stat.title === "Total Bookings") return { ...stat, value: bookings.length }
      if (stat.title === "Total Users") return { ...stat, value: users.length }
      if (stat.title === "Active Packages") return { ...stat, value: packages.filter(p => p.status === "Active").length }
      return stat
    }))
  }, [bookings.length, users.length, packages.length, payments.length])

  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here is an overview of your travel business.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {liveStats.map((stat) => (
          <Card key={stat.title} className="gap-0 py-0 border-none shadow-sm bg-card/50 overflow-hidden">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4">
              <div
                className={cn(
                  "flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl",
                  stat.accent
                )}
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 w-full">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                  {stat.title}
                </span>
                <span className="text-base sm:text-xl font-bold text-foreground">
                  {"prefix" in stat ? stat.prefix : ""}{stat.value.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 overflow-hidden">
                  <span
                    className={cn(
                      "text-[9px] sm:text-[11px] font-medium whitespace-nowrap",
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-7 overflow-hidden">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold">Revenue Overview</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs">
                  Past 6 months activity
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                +12.5%
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 pb-4">
            <div className="h-[200px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dynamicRevenueData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.005 250)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 10 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.92 0.005 250)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.45 0.15 250)"
                    strokeWidth={2.5}
                    dot={{ fill: "oklch(0.45 0.15 250)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bookings by Destination */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-bold">Bookings by Destination</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">Top destinations</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 pb-4">
            <div className="h-[200px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dynamicBookingsByDestination}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.005 250)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 10 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="destination"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 10 }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.92 0.005 250)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "11px",
                    }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="oklch(0.75 0.14 85)"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity across all packages</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-muted/30 hover:bg-muted/30">
                  <TableHead className="px-4 font-bold text-foreground">ID</TableHead>
                  <TableHead className="font-bold text-foreground">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell font-bold text-foreground">Package</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-foreground">Date</TableHead>
                  <TableHead className="font-bold text-foreground">Amount</TableHead>
                  <TableHead className="text-right px-4 font-bold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-foreground px-4">
                      {booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {booking.customerName}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                          {booking.customerEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {booking.packageTitle}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground whitespace-nowrap">
                      {new Date(booking.travelDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ₹{booking.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <StatusBadge status={booking.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
