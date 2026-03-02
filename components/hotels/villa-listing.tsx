"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, SlidersHorizontal, X, Wifi, Coffee, Waves, Dumbbell, Home, Utensils, Bike } from "lucide-react"
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
    "WiFi": Wifi,
    "Private Pool": Waves,
    "Kitchen": Utensils,
    "Daily Cleaning": Coffee,
    "Airport Transfer": Plane,
    "Garden": MapPin,
    "Home Cooked Meals": Utensils,
    "Bicycle Rental": Bike,
}

// Fallback Plane icon if not imported from lucide
import { Plane } from "lucide-react"

export function VillaListingClient() {
    const { villas } = useData()
    const searchParams = useSearchParams()
    const initialDest = searchParams.get("destination") || ""

    // Dynamically generate destinations from available villas
    const destinations = useMemo(() => {
        const villaDestinations = villas.filter(v => v.status === "Active").map(v => v.destination)
        return ["All Destinations", ...Array.from(new Set(villaDestinations)).sort()]
    }, [villas])

    const [priceRange, setPriceRange] = useState<number[]>([0, 50000])
    const [selectedDest, setSelectedDest] = useState(
        initialDest
            ? destinations.find((d) =>
                d.toLowerCase().includes(initialDest.toLowerCase())
            ) || "All Destinations"
            : "All Destinations"
    )
    const [showFilters, setShowFilters] = useState(false)

    const filtered = useMemo(() => {
        return villas.filter((villa) => {
            const matchDest =
                selectedDest === "All Destinations" ||
                villa.destination === selectedDest
            const matchPrice =
                villa.pricePerNight >= priceRange[0] && villa.pricePerNight <= priceRange[1]
            return matchDest && matchPrice
        })
    }, [selectedDest, priceRange, villas])

    function clearFilters() {
        setSelectedDest("All Destinations")
        setPriceRange([0, 100000])
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Villas & Homestays
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Private sanctuaries and authentic local stays for a unique experience
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
                    {(selectedDest !== "All Destinations" || priceRange[0] > 0 || priceRange[1] < 100000) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-primary">
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Filters Sidebar */}
                <aside className={cn(
                    "w-full shrink-0 lg:w-64",
                    showFilters ? "block" : "hidden lg:block"
                )}>
                    <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Filters
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-auto p-0 text-xs font-medium text-primary hover:bg-transparent"
                            >
                                Reset All
                            </Button>
                        </div>

                        {/* Destination */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                Destination
                            </label>
                            <Select value={selectedDest} onValueChange={setSelectedDest}>
                                <SelectTrigger className="bg-secondary">
                                    <SelectValue placeholder="Select Destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {destinations.map((dest) => (
                                        <SelectItem key={dest} value={dest}>
                                            {dest}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground">
                                Price per Night (₹{priceRange[0]} - ₹{priceRange[1]})
                            </label>
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={100000}
                                min={0}
                                step={100}
                            />
                        </div>
                    </div>
                </aside>

                {/* Villa Grid */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{filtered.length}</span> properties
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
                            <Home className="mb-4 h-12 w-12 text-muted-foreground/40" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">No villas found</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Try adjusting your filters</p>
                            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {filtered.map((villa) => (
                                <div key={villa.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image src={villa.image} alt={villa.name} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute left-3 top-3 z-10">
                                            <Badge className={cn(
                                                "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors",
                                                villa.status === "Active" ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
                                            )}>
                                                {villa.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute right-3 top-3 rounded-lg bg-card/90 px-2.5 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
                                            ₹{villa.pricePerNight.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/night</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5 text-primary" />
                                            {villa.destination}
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">{villa.name}</h3>
                                        <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                                                {villa.rating} ({villa.reviewCount})
                                            </span>
                                        </div>
                                        <div className="mb-5 flex flex-wrap gap-2">
                                            {villa.amenities.slice(0, 3).map((amenity) => {
                                                const Icon = amenityIcons[amenity] || Home
                                                return (
                                                    <Badge key={amenity} variant="secondary" className="font-normal gap-1 h-6">
                                                        <Icon className="h-3 w-3" />
                                                        {amenity}
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                        <Link href={`/villas/${villa.id}`}>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full transition-all",
                                                    villa.status === "Active"
                                                        ? "border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                                                        : "cursor-not-allowed border-muted bg-muted text-muted-foreground"
                                                )}
                                                disabled={villa.status === "Inactive"}
                                                asChild={villa.status === "Active"}
                                            >
                                                {villa.status === "Active" ? <span>Check Availability</span> : <span>Currently Unavailable</span>}
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
