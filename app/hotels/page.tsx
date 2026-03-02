import { Suspense } from "react"
import { HotelListingClient } from "@/components/hotels/hotel-listing"

export const metadata = {
    title: "Hotels - Plan2Trip",
    description: "Find and book luxury hotels at your favorite destinations.",
}

export default function HotelsPage() {
    return (
        <Suspense>
            <HotelListingClient />
        </Suspense>
    )
}
