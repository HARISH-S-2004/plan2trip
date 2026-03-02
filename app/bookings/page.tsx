import { Suspense } from "react"
import { MyBookingsClient } from "@/components/booking/my-bookings"

export const metadata = {
  title: "My Bookings - Plan2Trip",
  description: "View and manage all your travel bookings on Plan2Trip.",
}

export default function BookingsPage() {
  return (
    <Suspense>
      <MyBookingsClient />
    </Suspense>
  )
}
