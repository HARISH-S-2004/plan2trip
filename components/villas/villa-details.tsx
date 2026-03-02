"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Star,
    MapPin,
    Wifi,
    Coffee,
    Waves,
    ShieldCheck,
    Clock,
    BadgeCheck,
    Users,
    Utensils,
    Bike,
    Building,
    Plane,
    Home,
    Check,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/context/data-context"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Villa } from "@/lib/data"
import { EnquiryDialog } from "../enquiry-dialog"

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

export function VillaDetailsClient({ villaId }: { villaId: string }) {
    const { villas } = useData()
    const villa = villas.find(v => v.id === villaId)
    const [activeTab, setActiveTab] = useState("overview")

    if (!villa) {
        notFound()
        return null
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/villas" className="hover:text-primary">Villas</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">{villa.name}</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Badge className={cn(
                                "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                                villa.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : "bg-red-500/10 text-red-600 border-red-200"
                            )} variant="outline">
                                {villa.status}
                            </Badge>
                            <div className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold border border-gold/20">
                                <Star className="h-3.5 w-3.5 fill-gold" />
                                {villa.rating} ({villa.reviewCount} Reviews)
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                            {villa.name}
                        </h1>
                        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-lg">{villa.destination}</span>
                        </div>
                    </div>

                    {/* Gallery Preview */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border shadow-2xl">
                        <Image src={villa.image} alt={villa.name} fill className="object-cover" priority unoptimized />
                    </div>

                    {/* Details Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-8 inline-flex h-12 w-auto items-center justify-center gap-2 rounded-2xl bg-secondary/30 p-1.5 backdrop-blur-sm shadow-inner border border-secondary/50">
                            <TabsTrigger
                                value="overview"
                                className="rounded-xl px-6 py-2 text-sm font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-primary/10 text-muted-foreground hover:text-foreground"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="amenities"
                                className="rounded-xl px-6 py-2 text-sm font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-primary/10 text-muted-foreground hover:text-foreground"
                            >
                                Amenities
                            </TabsTrigger>
                            <TabsTrigger
                                value="rooms"
                                className="relative rounded-xl px-6 py-2 text-sm font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-primary/10 text-muted-foreground hover:text-foreground"
                            >
                                Rooms
                                {villa.rooms && villa.rooms.length > 0 && (
                                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black group-data-[state=active]:bg-primary group-data-[state=active]:text-white">
                                        {villa.rooms.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-8 space-y-6 animate-in fade-in duration-300">
                            <div className="prose prose-slate max-w-none dark:prose-invert">
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {villa.description}
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-4 rounded-2xl border bg-secondary/30 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Safe & Secure</h4>
                                        <p className="text-sm text-muted-foreground">Verified property with 24/7 security support</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-2xl border bg-secondary/30 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <BadgeCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Prime Location</h4>
                                        <p className="text-sm text-muted-foreground">Handpicked for proximity to local attractions</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="amenities" className="mt-8 animate-in fade-in duration-300">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {villa.amenities.map((amenity) => {
                                    const Icon = amenityIcons[amenity] || Home
                                    return (
                                        <div key={amenity} className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-secondary/50">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium">{amenity}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </TabsContent>
                        <TabsContent value="rooms" className="mt-8 animate-in fade-in duration-300">
                            <div className="grid gap-6">
                                {villa.rooms?.map((room, index) => (
                                    <div key={index} className="overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:shadow-md">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="relative aspect-video w-full md:w-64">
                                                <Image src={room.image || villa.image} alt={room.type} fill className="object-cover" unoptimized />
                                            </div>
                                            <div className="flex flex-1 flex-col p-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{room.type}</h3>
                                                        <p className="mt-1 text-sm text-muted-foreground font-medium">{room.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-primary">₹{room.price.toLocaleString()}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">per night</div>
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                        {room.taxesAndFees ? (
                                                            <span className="flex items-center gap-1 text-emerald-600">
                                                                <Check className="h-3 w-3" />
                                                                + ₹{room.taxesAndFees.toLocaleString()} TAXES
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-emerald-600">
                                                                <Check className="h-3 w-3" />
                                                                TAXES INCLUDED
                                                            </span>
                                                        )}
                                                    </div>
                                                    <EnquiryDialog defaultDestination={`${villa.name} - ${room.type}`}>
                                                        <Button size="sm" className="rounded-xl px-6 bg-primary font-bold shadow-lg shadow-primary/20">Select Room</Button>
                                                    </EnquiryDialog>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!villa.rooms || villa.rooms.length === 0) && (
                                    <div className="text-center py-20 rounded-3xl border border-dashed border-muted bg-secondary/10">
                                        <Home className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                                        <h3 className="text-lg font-semibold text-muted-foreground">No specific rooms listed</h3>
                                        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto mt-2 font-medium">This property is available for full booking at the base price. Check the overview for more details.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Booking Card */}
                <div className="lg:relative">
                    <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-xl lg:p-8">
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">₹{villa.pricePerNight.toLocaleString()}</span>
                                <span className="text-muted-foreground">/night</span>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600">
                                <Check className="h-4 w-4" />
                                No extra cleaning fees
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border bg-secondary/30 p-4">
                                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Check-in</label>
                                        <div className="text-sm font-medium">Add date</div>
                                    </div>
                                    <div className="space-y-1 border-l pl-4">
                                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Check-out</label>
                                        <div className="text-sm font-medium">Add date</div>
                                    </div>
                                </div>
                                <div className="pt-4 space-y-1">
                                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Guests</label>
                                    <div className="text-sm font-medium">2 guests</div>
                                </div>
                            </div>

                            <EnquiryDialog defaultDestination={villa.name}>
                                <Button
                                    size="lg"
                                    className={cn(
                                        "w-full text-lg h-14 rounded-2xl transition-all duration-300 shadow-lg",
                                        villa.status === "Active"
                                            ? "bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground hover:scale-[1.02] active:scale-95"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                    )}
                                    disabled={villa.status === "Inactive"}
                                >
                                    {villa.status === "Active" ? "Enquire Now" : "Currently Unavailable"}
                                </Button>
                            </EnquiryDialog>

                            <p className="text-center text-xs text-muted-foreground">
                                You won't be charged yet
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="underline text-muted-foreground decoration-muted-foreground/30 underline-offset-4">₹{villa.pricePerNight} x 5 nights</span>
                                <span className="font-medium">₹{(villa.pricePerNight * 5).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="underline text-muted-foreground decoration-muted-foreground/30 underline-offset-4">Plan2Trip service fee</span>
                                <span className="font-medium">₹0</span>
                            </div>
                            <div className="h-px bg-border pt-2" />
                            <div className="flex items-center justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{(villa.pricePerNight * 5).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
