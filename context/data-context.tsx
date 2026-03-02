"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { TourPackage, Hotel, Villa, Booking, Advertisement, Testimonial, FooterData, PackageCategory, packages as initialPackages, hotels as initialHotels, villas as initialVillas, ads as initialAds, initialBookings, testimonials as initialTestimonials, initialFooterData, initialCategories } from "@/lib/data"
import { adminUsers as initialUsers, adminBookings as adminDataBookings } from "@/lib/admin-data"

// Helper to convert adminBookings to internal Payment format
const initialPayments = [
    { id: "PAY-001", bookingId: "BK-001", customer: "Sarah Mitchell", amount: 2598, method: "Credit Card", status: "Completed", date: "2026-02-20" },
    { id: "PAY-002", bookingId: "BK-002", customer: "James Chen", amount: 3798, method: "PayPal", status: "Pending", date: "2026-02-22" },
    { id: "PAY-003", bookingId: "BK-003", customer: "Priya Sharma", amount: 1799, method: "Credit Card", status: "Refunded", date: "2026-01-15" },
    { id: "PAY-004", bookingId: "BK-004", customer: "Michael Brown", amount: 6598, method: "Bank Transfer", status: "Completed", date: "2026-02-18" },
    { id: "PAY-005", bookingId: "BK-005", customer: "Emily Davis", amount: 7497, method: "Credit Card", status: "Pending", date: "2026-02-24" },
    { id: "PAY-006", bookingId: "BK-006", customer: "David Wilson", amount: 4398, method: "Credit Card", status: "Completed", date: "2026-02-10" },
]

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
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const KEYS = {
    packages: "p2t_packages",
    hotels: "p2t_hotels",
    villas: "p2t_villas",
    ads: "p2t_ads",
    bookings: "p2t_bookings",
    testimonials: "p2t_testimonials",
    footer: "p2t_footer",
    users: "p2t_users",
    payments: "p2t_payments",
    categories: "p2t_categories",
    settings: "p2t_admin_settings",
}

const defaultSettings = {
    siteName: "Plan2Trip",
    contactEmail: "support@plan2trip.com",
    currency: "inr",
    timezone: "ist",
    emailNotifications: true,
    bookingAlerts: true,
    maintenanceMode: false,
}

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        if (typeof window === 'undefined') return fallback
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

function saveToStorage(key: string, value: any) {
    try {
        if (typeof window === 'undefined') return
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn("Storage quota reached. Further changes won't be saved until space is cleared.")
        }
    }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [packages, setPackages] = useState<TourPackage[]>(initialPackages)
    const [hotels, setHotels] = useState<Hotel[]>(initialHotels)
    const [villas, setVillas] = useState<Villa[]>(initialVillas)
    const [ads, setAds] = useState<Advertisement[]>(initialAds)
    const [bookings, setBookings] = useState<Booking[]>(initialBookings)
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
    const [footerData, setFooterData] = useState<FooterData>(initialFooterData)
    const [users, setUsers] = useState<any[]>(initialUsers)
    const [payments, setPayments] = useState<any[]>(initialPayments)
    const [categories, setCategories] = useState<PackageCategory[]>(initialCategories)
    const [settings, setSettings] = useState(defaultSettings)

    // Set mounted to true on client
    useEffect(() => {
        setMounted(true)
    }, [])

    // Load from localStorage on mount
    useEffect(() => {
        const storedPackages = loadFromStorage(KEYS.packages, initialPackages)
        // Auto-fix empty itineraries or categories if they exist in initialPackages
        const fixedPackages = storedPackages.map(pkg => {
            const initial = initialPackages.find(p => p.id === pkg.id)
            if (initial) {
                let updated = { ...pkg }
                let modified = false

                if ((!pkg.itinerary || pkg.itinerary.length === 0) && initial.itinerary.length > 0) {
                    updated.itinerary = initial.itinerary
                    modified = true
                }

                if (!pkg.category && initial.category) {
                    updated.category = initial.category
                    modified = true
                }

                return modified ? updated : pkg
            }
            return pkg
        })

        setPackages(fixedPackages)
        setHotels(loadFromStorage(KEYS.hotels, initialHotels))
        setVillas(loadFromStorage(KEYS.villas, initialVillas))
        setAds(loadFromStorage(KEYS.ads, initialAds))
        setBookings(loadFromStorage(KEYS.bookings, initialBookings))
        setTestimonials(loadFromStorage(KEYS.testimonials, initialTestimonials))
        setFooterData(loadFromStorage(KEYS.footer, initialFooterData))
        setUsers(loadFromStorage(KEYS.users, initialUsers))
        setPayments(loadFromStorage(KEYS.payments, initialPayments))
        setCategories(loadFromStorage(KEYS.categories, initialCategories))
        setSettings(loadFromStorage(KEYS.settings, defaultSettings))
        setHasLoaded(true)
    }, [])

    // Cross-tab sync: listen for localStorage changes made in OTHER tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === KEYS.packages) setPackages(e.newValue ? JSON.parse(e.newValue) : initialPackages)
            if (e.key === KEYS.hotels) setHotels(e.newValue ? JSON.parse(e.newValue) : initialHotels)
            if (e.key === KEYS.villas) setVillas(e.newValue ? JSON.parse(e.newValue) : initialVillas)
            if (e.key === KEYS.ads) setAds(e.newValue ? JSON.parse(e.newValue) : initialAds)
            if (e.key === KEYS.bookings) setBookings(e.newValue ? JSON.parse(e.newValue) : initialBookings)
            if (e.key === KEYS.testimonials) setTestimonials(e.newValue ? JSON.parse(e.newValue) : initialTestimonials)
            if (e.key === KEYS.footer) setFooterData(e.newValue ? JSON.parse(e.newValue) : initialFooterData)
            if (e.key === KEYS.users) setUsers(e.newValue ? JSON.parse(e.newValue) : initialUsers)
            if (e.key === KEYS.payments) setPayments(e.newValue ? JSON.parse(e.newValue) : initialPayments)
            if (e.key === KEYS.categories) setCategories(e.newValue ? JSON.parse(e.newValue) : initialCategories)
            if (e.key === KEYS.settings) setSettings(e.newValue ? JSON.parse(e.newValue) : defaultSettings)
        }
        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    // Save to localStorage when state changes
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.packages, packages) }, [packages, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.hotels, hotels) }, [hotels, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.villas, villas) }, [villas, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.ads, ads) }, [ads, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.bookings, bookings) }, [bookings, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.testimonials, testimonials) }, [testimonials, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.footer, footerData) }, [footerData, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.users, users) }, [users, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.payments, payments) }, [payments, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.categories, categories) }, [categories, mounted, hasLoaded])
    useEffect(() => { if (mounted && hasLoaded) saveToStorage(KEYS.settings, settings) }, [settings, mounted, hasLoaded])

    // --- Settings actions ---
    const updateSettings = useCallback((newSettings: any) => { setSettings(newSettings) }, [])

    // --- Package actions ---
    const updatePackage = useCallback((updatedPkg: TourPackage) => {
        setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p))
    }, [])
    const addPackage = useCallback((newPkg: TourPackage) => { setPackages(prev => [newPkg, ...prev]) }, [])
    const deletePackage = useCallback((id: string) => { setPackages(prev => prev.filter(p => p.id !== id)) }, [])

    // --- Category actions ---
    const updateCategory = useCallback((updatedCat: PackageCategory) => {
        setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c))
    }, [])
    const addCategory = useCallback((newCat: PackageCategory) => { setCategories(prev => [...prev, newCat]) }, [])
    const deleteCategory = useCallback((id: string) => { setCategories(prev => prev.filter(c => c.id !== id)) }, [])

    // --- Hotel actions ---
    const updateHotel = useCallback((updatedHotel: Hotel) => {
        setHotels(prev => prev.map(h => h.id === updatedHotel.id ? updatedHotel : h))
    }, [])
    const addHotel = useCallback((newHotel: Hotel) => { setHotels(prev => [newHotel, ...prev]) }, [])
    const deleteHotel = useCallback((id: string) => { setHotels(prev => prev.filter(h => h.id !== id)) }, [])

    // --- Villa actions ---
    const updateVilla = useCallback((updatedVilla: Villa) => {
        setVillas(prev => prev.map(v => v.id === updatedVilla.id ? updatedVilla : v))
    }, [])
    const addVilla = useCallback((newVilla: Villa) => { setVillas(prev => [newVilla, ...prev]) }, [])
    const deleteVilla = useCallback((id: string) => { setVillas(prev => prev.filter(v => v.id !== id)) }, [])

    // --- Ad actions ---
    const updateAd = useCallback((updatedAd: Advertisement) => {
        setAds(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a))
    }, [])
    const addAd = useCallback((newAd: Advertisement) => { setAds(prev => [newAd, ...prev]) }, [])
    const deleteAd = useCallback((id: string) => { setAds(prev => prev.filter(a => a.id !== id)) }, [])

    // --- Booking actions ---
    const addBooking = useCallback((newBooking: Booking) => { setBookings(prev => [newBooking, ...prev]) }, [])
    const deleteBooking = useCallback((id: string) => { setBookings(prev => prev.filter(b => b.id !== id)) }, [])
    const updateBookingStatus = useCallback((id: string, status: "Confirmed" | "Pending" | "Cancelled") => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }, [])

    // --- User actions ---
    const deleteUser = useCallback((id: string) => { setUsers(prev => prev.filter(u => u.id !== id)) }, [])
    const updateUserRole = useCallback((id: string, role: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    }, [])
    const toggleUserBlock = useCallback((id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u))
    }, [])
    const addUser = useCallback((newUser: any) => {
        setUsers(prev => [...prev, newUser])
    }, [])

    // --- Payment actions ---
    const addPayment = useCallback((newPayment: any) => { setPayments(prev => [newPayment, ...prev]) }, [])
    const updatePayment = useCallback((updatedPayment: any) => {
        setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p))
    }, [])
    const deletePayment = useCallback((id: string) => { setPayments(prev => prev.filter(p => p.id !== id)) }, [])

    // --- Testimonial actions ---
    const updateTestimonial = useCallback((updatedTestimonial: Testimonial) => {
        setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t))
    }, [])
    const addTestimonial = useCallback((newTestimonial: Testimonial) => { setTestimonials(prev => [newTestimonial, ...prev]) }, [])
    const deleteTestimonial = useCallback((id: string) => { setTestimonials(prev => prev.filter(t => t.id !== id)) }, [])

    // --- Footer actions ---
    const updateFooter = useCallback((data: FooterData) => { setFooterData(data) }, [])

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
            }}
        >
            {mounted ? children : <div className="min-h-screen bg-background" />}
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
