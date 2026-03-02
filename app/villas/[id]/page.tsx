import { notFound } from "next/navigation"
import { villas } from "@/lib/data"
import { VillaDetailsClient } from "@/components/villas/villa-details"

export async function generateStaticParams() {
    return villas.map((v) => ({
        id: v.id,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const villa = villas.find((v) => v.id === id)
    if (!villa) return { title: "Not Found" }
    return {
        title: `${villa.name} - Plan2Trip`,
        description: `Stay at ${villa.name} in ${villa.destination}. ${villa.description.substring(0, 100)}...`,
    }
}

export default async function VillaDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <VillaDetailsClient villaId={id} />
}
