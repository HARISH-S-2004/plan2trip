import { notFound } from "next/navigation"
import { packages } from "@/lib/data"
import { BookingClient } from "@/components/booking/booking-form"

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    id: pkg.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pkg = packages.find((p) => p.id === id)
  if (!pkg) return { title: "Not Found" }
  return {
    title: `Book ${pkg.title} - Plan2Trip`,
    description: `Complete your booking for ${pkg.title} in ${pkg.destination}.`,
  }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pkg = packages.find((p) => p.id === id)
  if (!pkg) notFound()

  return <BookingClient pkg={pkg} />
}
