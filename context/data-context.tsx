"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import {
    TourPackage, Hotel, Villa, Booking, Advertisement, Testimonial,
    FooterData, PackageCategory,
    packages as initialPackages, hotels as initialHotels,
    villas as initialVillas, ads as initialAds, initialBookings,
    testimonials as initialTestimonials, initialFooterData, initialCategories,
} from "@/lib/data"
import { adminUsers as initialUsers } from "@/lib/admin-data"
import {
    COLLECTIONS,
    upsertDoc, removeDoc,
    subscribeCollection, subscribeDoc,
    seedCollectionIfEmpty, seedDocIfEmpty,
    deleteImage,
} from "@/lib/firestore-service"

// Helper initial payments
const initialPayments = [
    { id: "PAY-001", bookingId: "BK-001", customer: "Sarah Mitchell", amount: 2598, method: "Credit Card", status: "Completed", date: "2026-02-20" },
    { id: "PAY-002", bookingId: "BK-002", customer: "James Chen", amount: 3798, method: "PayPal", status: "Pending", date: "2026-02-22" },
    { id: "PAY-003", bookingId: "BK-003", customer: "Priya Sharma", amount: 1799, method: "Credit Card", status: "Refunded", date: "2026-01-15" },
    { id: "PAY-004", bookingId: "BK-004", customer: "Michael Brown", amount: 6598, method: "Bank Transfer", status: "Completed", date: "2026-02-18" },
    { id: "PAY-005", bookingId: "BK-005", customer: "Emily Davis", amount: 7497, method: "Credit Card", status: "Pending", date: "2026-02-24" },
    { id: "PAY-006", bookingId: "BK-006", customer: "David Wilson", amount: 4398, method: "Credit Card", status: "Completed", date: "2026-02-10" },
]

const defaultSettings = {
    siteName: "Plan2Trip",
    contactEmail: "support@plan2trip.com",
    currency: "inr",
    timezone: "ist",
    emailNotifications: true,
    bookingAlerts: true,
    maintenanceMode: false,
}

interface DataContextType {
    packages: TourPackage[]
    hotels: Hotel[]
    bookings: Booking[]
    users: any[]
    payments: any[]
    updatePackage: (pkg: TourPackage) => void
    addPackage: (pkg: TourPackage) => void
    deletePackage: (id: string) => void
    categories: PackageCategory[]
    updateCategory: (cat: PackageCategory) => void
    addCategory: (cat: PackageCategory) => void
    deleteCategory: (id: string) => void
    updateHotel: (hotel: Hotel) => void
    addHotel: (hotel: Hotel) => void
    deleteHotel: (id: string) => void
    villas: Villa[]
    updateVilla: (villa: Villa) => void
    addVilla: (villa: Villa) => void
    deleteVilla: (id: string) => void
    ads: Advertisement[]
    updateAd: (ad: Advertisement) => void
    addAd: (ad: Advertisement) => void
    deleteAd: (id: string) => void
    addBooking: (booking: Booking) => void
    deleteBooking: (id: string) => void
    updateBookingStatus: (id: string, status: "Confirmed" | "Pending" | "Cancelled") => void
    deleteUser: (id: string) => void
    updateUserRole: (id: string, role: string) => void
    toggleUserBlock: (id: string) => void
    addUser: (user: any) => void
    addPayment: (payment: any) => void
    updatePayment: (payment: any) => void
    deletePayment: (id: string) => void
    testimonials: Testimonial[]
    updateTestimonial: (testimonial: Testimonial) => void
    addTestimonial: (testimonial: Testimonial) => void
    deleteTestimonial: (id: string) => void
    footerData: FooterData
    updateFooter: (data: FooterData) => void
    settings: any
    updateSettings: (settings: any) => void
    loading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [packages, setPackages] = useState<TourPackage[]>(initialPackages)
    const [hotels, setHotels] = useState<Hotel[]>(initialHotels)
    const [villas, setVillas] = useState<Villa[]>(initialVillas)
    const [ads, setAds] = useState<Advertisement[]>(initialAds)
    const [bookings, setBookings] = useState<Booking[]>(initialBookings)
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
    const [categories, setCategories] = useState<PackageCategory[]>(initialCategories)
    const [users, setUsers] = useState<any[]>(initialUsers)
    const [payments, setPayments] = useState<any[]>(initialPayments)
    const [footerData, setFooterData] = useState<FooterData>(initialFooterData)
    const [settings, setSettings] = useState<any>(defaultSettings)

    const seeded = useRef(false)

    // ── Seed initial data on first load, then subscribe to real-time updates ──
    useEffect(() => {
        let unsubscribes: (() => void)[] = []
        let isMounted = true;

        async function init() {
            console.log("Initializing DataProvider with Firestore...");

            // Safety timeout: don't stay stuck on a blank screen for more than 4 seconds
            const timeoutId = setTimeout(() => {
                if (isMounted && loading) {
                    console.warn("Firestore initialization timed out, showing app anyway.");
                    setLoading(false);
                }
            }, 4000);

            if (!seeded.current) {
                seeded.current = true
                try {
                    console.log("Checking if seeding is required...");
                    await Promise.all([
                        seedCollectionIfEmpty(COLLECTIONS.packages, initialPackages),
                        seedCollectionIfEmpty(COLLECTIONS.villas, initialVillas),
                        seedCollectionIfEmpty(COLLECTIONS.hotels, initialHotels),
                        seedCollectionIfEmpty(COLLECTIONS.bookings, initialBookings),
                        seedCollectionIfEmpty(COLLECTIONS.users, initialUsers),
                        seedCollectionIfEmpty(COLLECTIONS.payments, initialPayments),
                        seedCollectionIfEmpty(COLLECTIONS.ads, initialAds),
                        // seedCollectionIfEmpty("coupons", initialCoupons), // Not defined in original context
                        // seedCollectionIfEmpty("activities", initialActivities), // Not defined in original context
                        seedCollectionIfEmpty(COLLECTIONS.testimonials, initialTestimonials),
                        seedCollectionIfEmpty(COLLECTIONS.categories, initialCategories), // Renamed from packageCategories
                        seedDocIfEmpty(COLLECTIONS.footer, "footer", initialFooterData),
                        seedDocIfEmpty(COLLECTIONS.settings, "settings", defaultSettings),
                    ])
                    console.log("Seeding check complete.");
                } catch (err) {
                    console.error("Firestore seed error:", err)
                }
            }

            // If connection is blocked (net::ERR_BLOCKED_BY_CLIENT), we still want to show the app
            try {
                unsubscribes = [
                    subscribeCollection<TourPackage>(COLLECTIONS.packages, setPackages),
                    subscribeCollection<Hotel>(COLLECTIONS.hotels, setHotels),
                    subscribeCollection<Villa>(COLLECTIONS.villas, setVillas),
                    subscribeCollection<Advertisement>(COLLECTIONS.ads, setAds),
                    subscribeCollection<Booking>(COLLECTIONS.bookings, setBookings),
                    subscribeCollection<Testimonial>(COLLECTIONS.testimonials, setTestimonials),
                    subscribeCollection<any>(COLLECTIONS.users, setUsers),
                    subscribeCollection<any>(COLLECTIONS.payments, setPayments),
                    subscribeCollection<PackageCategory>(COLLECTIONS.categories, setCategories),
                    subscribeDoc<FooterData>(COLLECTIONS.footer, "footer", (data) => {
                        if (data) setFooterData(data)
                    }),
                    subscribeDoc<any>(COLLECTIONS.settings, "settings", (data) => {
                        if (data) setSettings(data)
                    }),
                ]
                console.log("Real-time subscriptions established.");
            } catch (err) {
                console.error("Subscription error (Firestore might be blocked):", err);
            }

            if (isMounted) {
                clearTimeout(timeoutId);
                setLoading(false);
                console.log("DataProvider initialization complete (showing app).");
            }
        }

        init()

        return () => {
            unsubscribes.forEach((unsub) => unsub())
        }
    }, [])

    // ── Package actions ──────────────────────────────────────────
    const updatePackage = useCallback((updatedPkg: TourPackage) => {
        upsertDoc(COLLECTIONS.packages, updatedPkg.id, updatedPkg)
    }, [])

    const addPackage = useCallback((newPkg: TourPackage) => {
        upsertDoc(COLLECTIONS.packages, newPkg.id, newPkg)
    }, [])

    const deletePackage = useCallback(async (id: string) => {
        // Find and delete the image from storage
        const pkg = packages.find((p) => p.id === id)
        if (pkg?.image) await deleteImage(pkg.image)
        removeDoc(COLLECTIONS.packages, id)
    }, [packages])

    // ── Category actions ─────────────────────────────────────────
    const updateCategory = useCallback((updatedCat: PackageCategory) => {
        upsertDoc(COLLECTIONS.categories, updatedCat.id, updatedCat)
    }, [])

    const addCategory = useCallback((newCat: PackageCategory) => {
        upsertDoc(COLLECTIONS.categories, newCat.id, newCat)
    }, [])

    const deleteCategory = useCallback(async (id: string) => {
        const cat = categories.find((c) => c.id === id)
        if (cat?.image) await deleteImage(cat.image)
        removeDoc(COLLECTIONS.categories, id)
    }, [categories])

    // ── Hotel actions ────────────────────────────────────────────
    const updateHotel = useCallback((updatedHotel: Hotel) => {
        upsertDoc(COLLECTIONS.hotels, updatedHotel.id, updatedHotel)
    }, [])

    const addHotel = useCallback((newHotel: Hotel) => {
        upsertDoc(COLLECTIONS.hotels, newHotel.id, newHotel)
    }, [])

    const deleteHotel = useCallback(async (id: string) => {
        const hotel = hotels.find((h) => h.id === id)
        if (hotel?.image) await deleteImage(hotel.image)
        // Also delete room images
        if (hotel?.rooms) {
            for (const room of hotel.rooms) {
                if (room.image) await deleteImage(room.image)
            }
        }
        removeDoc(COLLECTIONS.hotels, id)
    }, [hotels])

    // ── Villa actions ────────────────────────────────────────────
    const updateVilla = useCallback((updatedVilla: Villa) => {
        upsertDoc(COLLECTIONS.villas, updatedVilla.id, updatedVilla)
    }, [])

    const addVilla = useCallback((newVilla: Villa) => {
        upsertDoc(COLLECTIONS.villas, newVilla.id, newVilla)
    }, [])

    const deleteVilla = useCallback(async (id: string) => {
        const villa = villas.find((v) => v.id === id)
        if (villa?.image) await deleteImage(villa.image)
        if (villa?.rooms) {
            for (const room of villa.rooms) {
                if (room.image) await deleteImage(room.image)
            }
        }
        removeDoc(COLLECTIONS.villas, id)
    }, [villas])

    // ── Ad actions ───────────────────────────────────────────────
    const updateAd = useCallback((updatedAd: Advertisement) => {
        upsertDoc(COLLECTIONS.ads, updatedAd.id, updatedAd)
    }, [])

    const addAd = useCallback((newAd: Advertisement) => {
        upsertDoc(COLLECTIONS.ads, newAd.id, newAd)
    }, [])

    const deleteAd = useCallback(async (id: string) => {
        const ad = ads.find((a) => a.id === id)
        if (ad?.image) await deleteImage(ad.image)
        removeDoc(COLLECTIONS.ads, id)
    }, [ads])

    // ── Booking actions ──────────────────────────────────────────
    const addBooking = useCallback((newBooking: Booking) => {
        upsertDoc(COLLECTIONS.bookings, newBooking.id, newBooking)
    }, [])

    const deleteBooking = useCallback((id: string) => {
        removeDoc(COLLECTIONS.bookings, id)
    }, [])

    const updateBookingStatus = useCallback((id: string, status: "Confirmed" | "Pending" | "Cancelled") => {
        const booking = bookings.find((b) => b.id === id)
        if (booking) {
            upsertDoc(COLLECTIONS.bookings, id, { ...booking, status })
        }
    }, [bookings])

    // ── User actions ─────────────────────────────────────────────
    const deleteUser = useCallback((id: string) => {
        removeDoc(COLLECTIONS.users, id)
    }, [])

    const updateUserRole = useCallback((id: string, role: string) => {
        const user = users.find((u) => u.id === id)
        if (user) {
            upsertDoc(COLLECTIONS.users, id, { ...user, role })
        }
    }, [users])

    const toggleUserBlock = useCallback((id: string) => {
        const user = users.find((u) => u.id === id)
        if (user) {
            upsertDoc(COLLECTIONS.users, id, { ...user, blocked: !user.blocked })
        }
    }, [users])

    const addUser = useCallback((newUser: any) => {
        upsertDoc(COLLECTIONS.users, newUser.id, newUser)
    }, [])

    // ── Payment actions ──────────────────────────────────────────
    const addPayment = useCallback((newPayment: any) => {
        upsertDoc(COLLECTIONS.payments, newPayment.id, newPayment)
    }, [])

    const updatePayment = useCallback((updatedPayment: any) => {
        upsertDoc(COLLECTIONS.payments, updatedPayment.id, updatedPayment)
    }, [])

    const deletePayment = useCallback((id: string) => {
        removeDoc(COLLECTIONS.payments, id)
    }, [])

    // ── Testimonial actions ──────────────────────────────────────
    const updateTestimonial = useCallback((updatedTestimonial: Testimonial) => {
        upsertDoc(COLLECTIONS.testimonials, updatedTestimonial.id, updatedTestimonial)
    }, [])

    const addTestimonial = useCallback((newTestimonial: Testimonial) => {
        upsertDoc(COLLECTIONS.testimonials, newTestimonial.id, newTestimonial)
    }, [])

    const deleteTestimonial = useCallback((id: string) => {
        removeDoc(COLLECTIONS.testimonials, id)
    }, [])

    // ── Footer actions ───────────────────────────────────────────
    const updateFooter = useCallback((data: FooterData) => {
        upsertDoc(COLLECTIONS.footer, "footer", data)
    }, [])

    // ── Settings actions ─────────────────────────────────────────
    const updateSettings = useCallback((newSettings: any) => {
        upsertDoc(COLLECTIONS.settings, "settings", newSettings)
    }, [])

    return (
        <DataContext.Provider
            value={{
                packages,
                hotels,
                bookings,
                users,
                payments,
                updatePackage,
                addPackage,
                deletePackage,
                categories,
                updateCategory,
                addCategory,
                deleteCategory,
                updateHotel,
                addHotel,
                deleteHotel,
                villas,
                updateVilla,
                addVilla,
                deleteVilla,
                ads,
                updateAd,
                addAd,
                deleteAd,
                addBooking,
                deleteBooking,
                updateBookingStatus,
                deleteUser,
                updateUserRole,
                toggleUserBlock,
                addUser,
                addPayment,
                updatePayment,
                deletePayment,
                testimonials,
                updateTestimonial,
                addTestimonial,
                deleteTestimonial,
                footerData,
                updateFooter,
                settings,
                updateSettings,
                loading,
            }}
        >
            {loading ? <div className="min-h-screen bg-background" /> : children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}
