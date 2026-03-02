export interface AdminUser {
  id: string
  name: string
  email: string
  role: "User" | "Admin"
  joinedDate: string
  bookingsCount: number
  blocked: boolean
  password?: string
}

export interface AdminBooking {
  id: string
  customerName: string
  customerEmail: string
  packageTitle: string
  destination: string
  travelDate: string
  travelers: number
  totalPrice: number
  status: "Confirmed" | "Pending" | "Cancelled"
  bookedOn: string
}

export interface AdminPackage {
  id: string
  title: string
  destination: string
  duration: string
  price: number
  rating: number
  bookingsCount: number
  status: "Active" | "Inactive"
  image: string
}

export interface AdminHotel {
  id: string
  name: string
  destination: string
  pricePerNight: number
  rating: number
  bookingsCount: number
  status: "Active" | "Inactive"
  image: string
}

export const adminPackages: AdminPackage[] = [
  {
    id: "bali-paradise",
    title: "Bali Paradise Getaway",
    destination: "Bali, Indonesia",
    duration: "7 Days / 6 Nights",
    price: 1299,
    rating: 4.8,
    bookingsCount: 234,
    status: "Active",
    image: "/images/package-bali.jpg",
  },
  {
    id: "paris-romance",
    title: "Romantic Paris Experience",
    destination: "Paris, France",
    duration: "5 Days / 4 Nights",
    price: 1899,
    rating: 4.9,
    bookingsCount: 187,
    status: "Active",
    image: "/images/package-paris.jpg",
  },
  {
    id: "swiss-alps",
    title: "Swiss Alps Adventure",
    destination: "Switzerland",
    duration: "6 Days / 5 Nights",
    price: 2499,
    rating: 4.7,
    bookingsCount: 156,
    status: "Active",
    image: "/images/package-swiss.jpg",
  },
  {
    id: "maldives-luxury",
    title: "Maldives Luxury Retreat",
    destination: "Maldives",
    duration: "5 Days / 4 Nights",
    price: 3299,
    rating: 4.9,
    bookingsCount: 312,
    status: "Active",
    image: "/images/package-maldives.jpg",
  },
  {
    id: "tokyo-explorer",
    title: "Tokyo Cultural Explorer",
    destination: "Tokyo, Japan",
    duration: "6 Days / 5 Nights",
    price: 1799,
    rating: 4.8,
    bookingsCount: 198,
    status: "Inactive",
    image: "/images/package-tokyo.jpg",
  },
  {
    id: "dubai-grandeur",
    title: "Dubai Grand Experience",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 2199,
    rating: 4.7,
    bookingsCount: 267,
    status: "Active",
    image: "/images/package-dubai.jpg",
  },
]

export const adminHotels: AdminHotel[] = [
  {
    id: "bali-resort",
    name: "Ayana Resort & Spa",
    destination: "Bali, Indonesia",
    pricePerNight: 350,
    rating: 4.9,
    bookingsCount: 450,
    status: "Active",
    image: "/images/package-bali.jpg",
  },
  {
    id: "paris-hotel",
    name: "Hotel Ritz Paris",
    destination: "Paris, France",
    pricePerNight: 850,
    rating: 4.9,
    bookingsCount: 280,
    status: "Active",
    image: "/images/package-paris.jpg",
  },
  {
    id: "swiss-lodge",
    name: "The Alpine Lodge",
    destination: "Switzerland",
    pricePerNight: 450,
    rating: 4.8,
    bookingsCount: 190,
    status: "Active",
    image: "/images/package-swiss.jpg",
  },
]

export const adminBookings: AdminBooking[] = [
  {
    id: "BK-001",
    customerName: "Sarah Mitchell",
    customerEmail: "sarah.m@email.com",
    packageTitle: "Bali Paradise Getaway",
    destination: "Bali, Indonesia",
    travelDate: "2026-04-15",
    travelers: 2,
    totalPrice: 2598,
    status: "Confirmed",
    bookedOn: "2026-02-20",
  },
  {
    id: "BK-002",
    customerName: "James Chen",
    customerEmail: "james.c@email.com",
    packageTitle: "Romantic Paris Experience",
    destination: "Paris, France",
    travelDate: "2026-06-10",
    travelers: 2,
    totalPrice: 3798,
    status: "Pending",
    bookedOn: "2026-02-22",
  },
  {
    id: "BK-003",
    customerName: "Priya Sharma",
    customerEmail: "priya.s@email.com",
    packageTitle: "Tokyo Cultural Explorer",
    destination: "Tokyo, Japan",
    travelDate: "2026-03-01",
    travelers: 1,
    totalPrice: 1799,
    status: "Cancelled",
    bookedOn: "2026-01-15",
  },
  {
    id: "BK-004",
    customerName: "Michael Brown",
    customerEmail: "m.brown@email.com",
    packageTitle: "Maldives Luxury Retreat",
    destination: "Maldives",
    travelDate: "2026-05-20",
    travelers: 2,
    totalPrice: 6598,
    status: "Confirmed",
    bookedOn: "2026-02-18",
  },
  {
    id: "BK-005",
    customerName: "Emily Davis",
    customerEmail: "emily.d@email.com",
    packageTitle: "Swiss Alps Adventure",
    destination: "Switzerland",
    travelDate: "2026-07-05",
    travelers: 3,
    totalPrice: 7497,
    status: "Pending",
    bookedOn: "2026-02-24",
  },
  {
    id: "BK-006",
    customerName: "David Wilson",
    customerEmail: "david.w@email.com",
    packageTitle: "Dubai Grand Experience",
    destination: "Dubai, UAE",
    travelDate: "2026-04-01",
    travelers: 2,
    totalPrice: 4398,
    status: "Confirmed",
    bookedOn: "2026-02-10",
  },
  {
    id: "BK-007",
    customerName: "Lisa Johnson",
    customerEmail: "lisa.j@email.com",
    packageTitle: "Bali Paradise Getaway",
    destination: "Bali, Indonesia",
    travelDate: "2026-08-12",
    travelers: 4,
    totalPrice: 5196,
    status: "Pending",
    bookedOn: "2026-02-25",
  },
]

export const adminUsers: AdminUser[] = [
  {
    id: "USR-001",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    role: "User",
    joinedDate: "2025-06-15",
    bookingsCount: 3,
    blocked: false,
  },
  {
    id: "USR-002",
    name: "James Chen",
    email: "james.c@email.com",
    role: "User",
    joinedDate: "2025-08-22",
    bookingsCount: 2,
    blocked: false,
  },
  {
    id: "USR-003",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    role: "Admin",
    joinedDate: "2025-01-10",
    bookingsCount: 5,
    blocked: false,
  },
  {
    id: "USR-004",
    name: "Michael Brown",
    email: "m.brown@email.com",
    role: "User",
    joinedDate: "2025-09-05",
    bookingsCount: 1,
    blocked: false,
  },
  {
    id: "USR-005",
    name: "Emily Davis",
    email: "emily.d@email.com",
    role: "User",
    joinedDate: "2025-11-18",
    bookingsCount: 4,
    blocked: true,
  },
  {
    id: "USR-006",
    name: "David Wilson",
    email: "david.w@email.com",
    role: "User",
    joinedDate: "2026-01-03",
    bookingsCount: 2,
    blocked: false,
  },
  {
    id: "USR-007",
    name: "Lisa Johnson",
    email: "lisa.j@email.com",
    role: "User",
    joinedDate: "2026-02-14",
    bookingsCount: 1,
    blocked: false,
  },
  {
    id: "USR-008",
    name: "Robert Kim",
    email: "robert.k@email.com",
    role: "Admin",
    joinedDate: "2025-03-20",
    bookingsCount: 0,
    blocked: false,
  },
  {
    id: "USR-009",
    name: "Plan2Trip Admin",
    email: "plan2trip89@gmail.com",
    role: "Admin",
    joinedDate: "2026-02-25",
    bookingsCount: 0,
    blocked: false,
    password: "plantotrip@89",
  },
]

export const revenueData = [
  { month: "Sep", revenue: 42000 },
  { month: "Oct", revenue: 58000 },
  { month: "Nov", revenue: 65000 },
  { month: "Dec", revenue: 78000 },
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 89000 },
]

export const bookingsByDestination = [
  { destination: "Bali", bookings: 234 },
  { destination: "Paris", bookings: 187 },
  { destination: "Switzerland", bookings: 156 },
  { destination: "Maldives", bookings: 312 },
  { destination: "Tokyo", bookings: 198 },
  { destination: "Dubai", bookings: 267 },
]
