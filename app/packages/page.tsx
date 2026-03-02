import { Suspense } from "react"
import { PackageListingClient } from "@/components/packages/package-listing"

export const metadata = {
  title: "Tour Packages - Plan2Trip",
  description: "Browse our curated collection of travel packages to destinations worldwide.",
}

export default function PackagesPage() {
  return (
    <Suspense>
      <PackageListingClient />
    </Suspense>
  )
}
