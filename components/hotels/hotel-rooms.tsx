"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Star, MapPin, Wifi, Coffee, Waves, Dumbbell, Shield, Info, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"
import { EnquiryDialog } from "../enquiry-dialog"

interface HotelRoomsProps {
    hotelId: string
}

export function HotelRooms({ hotelId }: HotelRoomsProps) {
    const { hotels } = useData()

    const hotel = useMemo(() => {
        return hotels.find(h => h.id === hotelId)
    }, [hotels, hotelId])

    if (!hotel) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold">Hotel not found</h2>
                <p className="mt-2 text-muted-foreground">The hotel you are looking for does not exist or has been removed.</p>
                <Link href="/hotels" className="mt-6">
                    <Button>Back to Hotels</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            {/* Breadcrumbs & Back */}
            <div className="mb-8">
                <Link href="/hotels" className="group mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to all hotels
                </Link>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                Luxury Hotel
                            </Badge>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-gold text-gold" />
                                <span className="text-sm font-semibold">{hotel.rating}</span>
                                <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {hotel.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm">{hotel.destination}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                        <span className="text-sm text-muted-foreground">Starting from</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-primary">₹{hotel.pricePerNight.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Hotel Image Gallery (Preview) */}
                    <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg border border-border">
                        <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Description */}
                    <section>
                        <h2 className="mb-4 text-xl font-bold">About the Hotel</h2>
                        <p className="leading-relaxed text-muted-foreground">
                            {hotel.description}
                        </p>
                    </section>

                    {/* Room List */}
                    <section id="rooms">
                        <h2 className="mb-6 text-xl font-bold">Select Your Room</h2>
                        <div className="grid gap-6">
                            {hotel.rooms.map((room, idx) => (
                                <Card key={idx} className="overflow-hidden border border-border transition-all hover:shadow-md">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative h-48 w-full md:h-auto md:w-64 shrink-0">
                                            <Image
                                                src={room.image || hotel.image}
                                                alt={room.type}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <CardContent className="flex flex-1 flex-col p-6">
                                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground">{room.type}</h3>
                                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                        {room.description}
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap gap-4">
                                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Shield className="h-3.5 w-3.5 text-emerald-500" />
                                                            Free Cancellation
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Coffee className="h-3.5 w-3.5 text-primary" />
                                                            Breakfast Included
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start md:items-end shrink-0">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-primary">₹{room.price.toLocaleString()}</span>
                                                        <span className="text-xs text-muted-foreground">/night</span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">+ ₹{(room.taxesAndFees ?? 450).toLocaleString()} taxes & fees</p>
                                                    <EnquiryDialog defaultDestination={`${hotel.name} - ${room.type}`}>
                                                        <Button className="mt-4 w-full md:w-auto font-bold h-11 px-6 bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground transition-all">
                                                            Enquire Now
                                                        </Button>
                                                    </EnquiryDialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Hotel Highlights */}
                    <Card className="border border-border bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Hotel Highlights</h3>
                            <div className="grid gap-4">
                                {hotel.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                            <Info className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Info Card */}
                    <Card className="border border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                            <h3 className="mb-2 text-lg font-bold">Why book with us?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                                        <Shield className="h-3 w-3 text-primary" />
                                    </div>
                                    <span>Secure & easy booking process</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                                        <CreditCard className="h-3 w-3 text-primary" />
                                    </div>
                                    <span>Best price guaranteed</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                                        <Waves className="h-3 w-3 text-primary" />
                                    </div>
                                    <span>Exclusive perks for members</span>
                                </li>
                            </ul>
                            <EnquiryDialog defaultDestination={hotel.name}>
                                <Button variant="outline" className="mt-6 w-full border-primary/20 text-primary hover:bg-primary/10">
                                    Contact Support
                                </Button>
                            </EnquiryDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
