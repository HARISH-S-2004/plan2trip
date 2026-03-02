"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, SlidersHorizontal, X, Wifi, Coffee, Waves, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"

// Destinations are now dynamically derived inside the component

const amenityIcons: Record<string, any> = {
    "Free WiFi": Wifi,
    "Infinity Pool": Waves,
    "Indoor Pool": Waves,
    "Private Beach": MapPin,
    "Spa": Coffee,
    "Fitness Center": Dumbbell,
    "Michelin Star Dining": Coffee,
    "Garden": MapPin,
    "Chauffeur Service": MapPin,
    "Ski-in/Ski-out": MapPin,
    "Sauna": Coffee,
    "Fireplace": MapPin,
    "Mountain View Balcony": MapPin,
}

export function HotelListingClient() {
    const { hotels } = useData()
    const searchParams = useSearchParams()
    const initialDest = searchParams.get("destination") || ""

    // Dynamically generate destinations from available hotels
    const destinations = useMemo(() => {
        const hotelDestinations = hotels.filter(h => h.status === "Active").map(h => h.destination)
        return ["All Destinations", ...Array.from(new Set(hotelDestinations)).sort()]
    }, [hotels])

    const [priceRange, setPriceRange] = useState<number[]>([0, 500000])
    const [selectedDest, setSelectedDest] = useState(
        initialDest
            ? destinations.find((d) =>
                d.toLowerCase().includes(initialDest.toLowerCase())
            ) || "All Destinations"
            : "All Destinations"
    )
    const [showFilters, setShowFilters] = useState(false)

    const filtered = useMemo(() => {
        return hotels.filter((hotel) => {
            const matchDest =
                selectedDest === "All Destinations" ||
                hotel.destination === selectedDest
            const matchPrice =
                hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1]
            return matchDest && matchPrice
        })
    }, [selectedDest, priceRange, hotels])

    const hasFilters =
        selectedDest !== "All Destinations" ||
        priceRange[0] > 0 ||
        priceRange[1] < 500000

    function clearFilters() {
        setSelectedDest("All Destinations")
        setPriceRange([0, 500000])
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Luxury Hotels
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Find the perfect stay for your next adventure
                </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Mobile Filter Toggle */}
                <div className="flex items-center gap-3 lg:hidden">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </Button>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-primary">
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Sidebar Filters */}
                <aside
                    className={`w-full shrink-0 lg:block lg:w-72 ${showFilters ? "block" : "hidden"
                        }`}
                >
                    <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
                            {hasFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs text-primary">
                                    Clear all
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Destination
                            </label>
                            <Select value={selectedDest} onValueChange={setSelectedDest}>
                                <SelectTrigger className="bg-secondary">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {destinations.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {d}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-medium text-muted-foreground">
                                Price Per Night
                            </label>
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={500000}
                                min={0}
                                step={500}
                            />
                            <div className="flex items-center justify-between">
                                <Input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([Number(e.target.value), priceRange[1]])
                                    }
                                    className="h-8 w-24 bg-secondary text-xs"
                                />
                                <span className="text-xs text-muted-foreground">to</span>
                                <Input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([priceRange[0], Number(e.target.value)])
                                    }
                                    className="h-8 w-24 bg-secondary text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Hotel Grid */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing{" "}
                            <span className="font-medium text-foreground">
                                {filtered.length}
                            </span>{" "}
                            hotels
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
                            <MapPin className="mb-4 h-12 w-12 text-muted-foreground/40" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No hotels found
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Try adjusting your filters to see more results
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {filtered.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={hotel.image}
                                            alt={hotel.name}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute left-3 top-3 z-10">
                                            <Badge
                                                className={cn(
                                                    "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors",
                                                    hotel.status === "Active"
                                                        ? "bg-emerald-500/80 text-white hover:bg-emerald-500/90"
                                                        : "bg-red-500/80 text-white hover:bg-red-500/90"
                                                )}
                                            >
                                                {hotel.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute right-3 top-3 rounded-lg bg-card/90 px-2.5 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
                                            ₹{hotel.pricePerNight.toLocaleString()}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                /night
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5 text-primary" />
                                            {hotel.destination}
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                                            {hotel.name}
                                        </h3>
                                        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                                                {hotel.rating} ({hotel.reviewCount})
                                            </span>
                                        </div>
                                        <div className="mb-5 flex flex-wrap gap-2">
                                            {hotel.amenities.slice(0, 3).map((amenity) => {
                                                const Icon = amenityIcons[amenity] || Wifi
                                                return (
                                                    <Badge key={amenity} variant="secondary" className="font-normal gap-1 h-6">
                                                        <Icon className="h-3 w-3" />
                                                        {amenity}
                                                    </Badge>
                                                )
                                            })}
                                            {hotel.amenities.length > 3 && (
                                                <Badge variant="secondary" className="font-normal h-6">
                                                    +{hotel.amenities.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                        <Link href={`/hotels/${hotel.id}/rooms`}>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full transition-all",
                                                    hotel.status === "Active"
                                                        ? "border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                                                        : "cursor-not-allowed border-muted bg-muted text-muted-foreground hover:bg-muted"
                                                )}
                                                disabled={hotel.status === "Inactive"}
                                            >
                                                {hotel.status === "Active" ? "View Rooms" : "Currently Unavailable"}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
