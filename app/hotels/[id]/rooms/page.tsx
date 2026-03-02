import { hotels } from "@/lib/data"
import { HotelRooms } from "@/components/hotels/hotel-rooms"

export async function generateStaticParams() {
    return hotels.map((h) => ({
        id: h.id,
    }))
}

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function HotelRoomsPage({ params }: PageProps) {
    const { id } = await params

    return <HotelRooms hotelId={id} />
}
