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
import { toast } from "sonner"
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
    const [packages, setPackages] = useState<TourPackage[]>([])
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [villas, setVillas] = useState<Villa[]>([])
    const [ads, setAds] = useState<Advertisement[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [categories, setCategories] = useState<PackageCategory[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [payments, setPayments] = useState<any[]>([])
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
                    // Seeding logic removed intentionally.
                    // The system will accurately reflect the live database content
                    // and will not automatically insert mock data upon refresh.
                } catch (error) {
                    console.error("Initialization check failed:", error);
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
    const updatePackage = useCallback(async (updatedPkg: TourPackage) => {
        const oldPackages = [...packages];
        setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p))
        try {
            await upsertDoc(COLLECTIONS.packages, updatedPkg.id, updatedPkg)
        } catch (error: any) {
            setPackages(oldPackages);
            toast.error("Database Save Failed! Please check if Firestore is enabled and AdBlock is off.");
        }
    }, [packages])

    const addPackage = useCallback(async (newPkg: TourPackage) => {
        setPackages(prev => [newPkg, ...prev])
        try {
            await upsertDoc(COLLECTIONS.packages, newPkg.id, newPkg)
        } catch (error: any) {
            setPackages(prev => prev.filter(p => p.id !== newPkg.id));
            toast.error("Failed to add package to database.");
        }
    }, [])

    const deletePackage = useCallback(async (id: string) => {
        const pkg = packages.find((p) => p.id === id)
        const oldPackages = [...packages];
        setPackages(prev => prev.filter(p => p.id !== id))
        try {
            if (pkg?.image) await deleteImage(pkg.image)
            await removeDoc(COLLECTIONS.packages, id)
        } catch (error: any) {
            setPackages(oldPackages);
            toast.error("Failed to delete package.");
        }
    }, [packages])

    // ── Category actions ─────────────────────────────────────────
    const updateCategory = useCallback(async (updatedCat: PackageCategory) => {
        const oldCategories = [...categories];
        setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c))
        try {
            await upsertDoc(COLLECTIONS.categories, updatedCat.id, updatedCat)
        } catch (error: any) {
            setCategories(oldCategories);
            toast.error("Failed to save category card.");
        }
    }, [categories])

    const addCategory = useCallback(async (newCat: PackageCategory) => {
        setCategories(prev => [newCat, ...prev])
        try {
            await upsertDoc(COLLECTIONS.categories, newCat.id, newCat)
        } catch (error: any) {
            setCategories(prev => prev.filter(c => c.id !== newCat.id));
            toast.error("Failed to add category.");
        }
    }, [])

    const deleteCategory = useCallback(async (id: string) => {
        const cat = categories.find((c) => c.id === id)
        const oldCategories = [...categories];
        setCategories(prev => prev.filter(c => c.id !== id))
        try {
            if (cat?.image) await deleteImage(cat.image)
            await removeDoc(COLLECTIONS.categories, id)
        } catch (error: any) {
            setCategories(oldCategories);
            toast.error("Failed to delete category.");
        }
    }, [categories])

    // ── Hotel actions ────────────────────────────────────────────
    const updateHotel = useCallback(async (updatedHotel: Hotel) => {
        const oldHotels = [...hotels];
        setHotels(prev => prev.map(h => h.id === updatedHotel.id ? updatedHotel : h))
        try {
            await upsertDoc(COLLECTIONS.hotels, updatedHotel.id, updatedHotel)
        } catch (error: any) {
            setHotels(oldHotels);
            toast.error("Failed to save hotel changes to database.");
        }
    }, [hotels])

    const addHotel = useCallback(async (newHotel: Hotel) => {
        setHotels(prev => [newHotel, ...prev])
        try {
            await upsertDoc(COLLECTIONS.hotels, newHotel.id, newHotel)
        } catch (error: any) {
            setHotels(prev => prev.filter(h => h.id !== newHotel.id));
            toast.error("Failed to add hotel to database.");
        }
    }, [])

    const deleteHotel = useCallback(async (id: string) => {
        const hotel = hotels.find((h) => h.id === id)
        const oldHotels = [...hotels];
        setHotels(prev => prev.filter(h => h.id !== id))
        try {
            if (hotel?.image) await deleteImage(hotel.image)
            if (hotel?.rooms) {
                for (const room of hotel.rooms) {
                    if (room.image) await deleteImage(room.image)
                }
            }
            await removeDoc(COLLECTIONS.hotels, id)
        } catch (error: any) {
            setHotels(oldHotels);
            toast.error("Failed to delete hotel.");
        }
    }, [hotels])

    // ── Villa actions ────────────────────────────────────────────
    const updateVilla = useCallback(async (updatedVilla: Villa) => {
        const oldVillas = [...villas];
        setVillas(prev => prev.map(v => v.id === updatedVilla.id ? updatedVilla : v))
        try {
            await upsertDoc(COLLECTIONS.villas, updatedVilla.id, updatedVilla)
        } catch (error: any) {
            setVillas(oldVillas);
            toast.error("Failed to save villa changes to database.");
        }
    }, [villas])

    const addVilla = useCallback(async (newVilla: Villa) => {
        setVillas(prev => [newVilla, ...prev])
        try {
            await upsertDoc(COLLECTIONS.villas, newVilla.id, newVilla)
        } catch (error: any) {
            setVillas(prev => prev.filter(v => v.id !== newVilla.id));
            toast.error("Failed to add villa to database.");
        }
    }, [])

    const deleteVilla = useCallback(async (id: string) => {
        const villa = villas.find((v) => v.id === id)
        const oldVillas = [...villas];
        setVillas(prev => prev.filter(v => v.id !== id))
        try {
            if (villa?.image) await deleteImage(villa.image)
            if (villa?.rooms) {
                for (const room of villa.rooms) {
                    if (room.image) await deleteImage(room.image)
                }
            }
            await removeDoc(COLLECTIONS.villas, id)
        } catch (error: any) {
            setVillas(oldVillas);
            toast.error("Failed to delete villa.");
        }
    }, [villas])

    // ── Ad actions ───────────────────────────────────────────────
    const updateAd = useCallback(async (updatedAd: Advertisement) => {
        const oldAds = [...ads];
        setAds(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a))
        try {
            await upsertDoc(COLLECTIONS.ads, updatedAd.id, updatedAd)
        } catch (error: any) {
            setAds(oldAds);
            toast.error("Failed to save advertisement changes.");
        }
    }, [ads])

    const addAd = useCallback(async (newAd: Advertisement) => {
        setAds(prev => [newAd, ...prev])
        try {
            await upsertDoc(COLLECTIONS.ads, newAd.id, newAd)
        } catch (error: any) {
            setAds(prev => prev.filter(a => a.id !== newAd.id));
            toast.error("Failed to add advertisement.");
        }
    }, [])

    const deleteAd = useCallback(async (id: string) => {
        const ad = ads.find((a) => a.id === id)
        const oldAds = [...ads];
        setAds(prev => prev.filter(a => a.id !== id))
        try {
            if (ad?.image) await deleteImage(ad.image)
            await removeDoc(COLLECTIONS.ads, id)
        } catch (error: any) {
            setAds(oldAds);
            toast.error("Failed to delete advertisement.");
        }
    }, [ads])

    // ── Booking actions ──────────────────────────────────────────
    const addBooking = useCallback(async (newBooking: Booking) => {
        setBookings(prev => [newBooking, ...prev])
        try {
            await upsertDoc(COLLECTIONS.bookings, newBooking.id, newBooking)
        } catch (error: any) {
            setBookings(prev => prev.filter(b => b.id !== newBooking.id));
            toast.error("Failed to save booking to database.");
        }
    }, [])

    const deleteBooking = useCallback(async (id: string) => {
        const oldBookings = [...bookings];
        setBookings(prev => prev.filter(b => b.id !== id))
        try {
            await removeDoc(COLLECTIONS.bookings, id)
        } catch (error: any) {
            setBookings(oldBookings);
            toast.error("Failed to delete booking.");
        }
    }, [bookings])

    const updateBookingStatus = useCallback((id: string, status: "Confirmed" | "Pending" | "Cancelled") => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
        const booking = bookings.find((b) => b.id === id)
        if (booking) {
            upsertDoc(COLLECTIONS.bookings, id, { ...booking, status })
        }
    }, [bookings])

    // ── User actions ─────────────────────────────────────────────
    const deleteUser = useCallback((id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id))
        removeDoc(COLLECTIONS.users, id)
    }, [])

    const updateUserRole = useCallback((id: string, role: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
        const user = users.find((u) => u.id === id)
        if (user) {
            upsertDoc(COLLECTIONS.users, id, { ...user, role })
        }
    }, [users])

    const toggleUserBlock = useCallback((id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u))
        const user = users.find((u) => u.id === id)
        if (user) {
            upsertDoc(COLLECTIONS.users, id, { ...user, blocked: !user.blocked })
        }
    }, [users])

    const addUser = useCallback((newUser: any) => {
        setUsers(prev => [newUser, ...prev])
        upsertDoc(COLLECTIONS.users, newUser.id, newUser)
    }, [])

    // ── Payment actions ──────────────────────────────────────────
    const addPayment = useCallback(async (newPayment: any) => {
        setPayments(prev => [newPayment, ...prev])
        try {
            await upsertDoc(COLLECTIONS.payments, newPayment.id, newPayment)
        } catch (error: any) {
            setPayments(prev => prev.filter(p => p.id !== newPayment.id));
            toast.error("Failed to add payment.");
        }
    }, [])

    const updatePayment = useCallback(async (updatedPayment: any) => {
        const oldPayments = [...payments];
        setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p))
        try {
            await upsertDoc(COLLECTIONS.payments, updatedPayment.id, updatedPayment)
        } catch (error: any) {
            setPayments(oldPayments);
            toast.error("Failed to update payment status.");
        }
    }, [payments])

    const deletePayment = useCallback(async (id: string) => {
        const oldPayments = [...payments];
        setPayments(prev => prev.filter(p => p.id !== id))
        try {
            await removeDoc(COLLECTIONS.payments, id)
        } catch (error: any) {
            setPayments(oldPayments);
            toast.error("Failed to delete transaction.");
        }
    }, [payments])

    // ── Testimonial actions ──────────────────────────────────────
    const updateTestimonial = useCallback((updatedTestimonial: Testimonial) => {
        setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t))
        upsertDoc(COLLECTIONS.testimonials, updatedTestimonial.id, updatedTestimonial)
    }, [])

    const addTestimonial = useCallback((newTestimonial: Testimonial) => {
        setTestimonials(prev => [newTestimonial, ...prev])
        upsertDoc(COLLECTIONS.testimonials, newTestimonial.id, newTestimonial)
    }, [])

    const deleteTestimonial = useCallback((id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id))
        removeDoc(COLLECTIONS.testimonials, id)
    }, [])

    // ── Footer actions ───────────────────────────────────────────
    const updateFooter = useCallback(async (data: FooterData) => {
        const oldData = { ...footerData };
        setFooterData(data)
        try {
            await upsertDoc(COLLECTIONS.footer, "footer", data)
        } catch (error: any) {
            setFooterData(oldData);
            toast.error("Failed to save footer settings.");
        }
    }, [footerData])

    // ── Settings actions ─────────────────────────────────────────
    const updateSettings = useCallback(async (newSettings: any) => {
        const oldSettings = { ...settings };
        setSettings(newSettings)
        try {
            await upsertDoc(COLLECTIONS.settings, "settings", newSettings)
        } catch (error: any) {
            setSettings(oldSettings);
            toast.error("Failed to save global settings.");
        }
    }, [settings])

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
