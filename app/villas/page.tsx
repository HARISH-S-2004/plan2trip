import { Suspense } from "react"
import { VillaListingClient } from "@/components/hotels/villa-listing"

export const metadata = {
    title: "Villas & Homestays - Plan2Trip",
    description: "Discover private villas and authentic homestays for a unique travel experience.",
}

export default function VillasPage() {
    return (
        <Suspense>
            <VillaListingClient />
        </Suspense>
    )
}
