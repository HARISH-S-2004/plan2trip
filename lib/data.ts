export interface TourPackage {
  id: string
  title: string
  destination: string
  duration: string
  durationDays: number
  price: number
  rating: number
  reviewCount: number
  image: string
  description: string
  highlights: string[]
  itinerary: { day: number; title: string; description: string }[]
  inclusions: string[]
  exclusions: string[]
  status: "Active" | "Inactive"
  bookingsCount: number
  category?: string
  isPopular?: boolean
}

export interface PackageCategory {
  id: string
  name: string
  image: string
  count?: number // Derived field
}

export interface Booking {
  id: string
  packageId: string
  packageTitle: string
  destination: string
  travelDate: string
  travelers: number
  totalPrice: number
  status: "Confirmed" | "Pending" | "Cancelled"
  bookedOn: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  serviceInterested?: string
  requirements?: string
}

export interface Hotel {
  id: string
  name: string
  destination: string
  pricePerNight: number
  rating: number
  reviewCount: number
  image: string
  description: string
  amenities: string[]
  rooms: {
    type: string;
    price: number;
    description: string;
    image?: string;
    taxesAndFees?: number;
  }[]
  status: "Active" | "Inactive"
  bookingsCount: number
}

export interface Villa {
  id: string
  name: string
  destination: string
  pricePerNight: number
  rating: number
  reviewCount: number
  image: string
  description: string
  amenities: string[]
  rooms?: {
    type: string;
    price: number;
    description: string;
    image?: string;
    taxesAndFees?: number;
  }[]
  status: "Active" | "Inactive"
  bookingsCount: number
}

export interface Advertisement {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  buttonText: string
  status: "Active" | "Inactive" | "Deleted"
  position: "Hero" | "Banner"
}

export interface Testimonial {
  id: string
  name: string
  location: string
  text: string
  rating: number
  avatar: string
}

export interface FooterData {
  description: string
  email: string
  phone: string
  address: string
  destinations: string[]
}

export const packages: TourPackage[] = [
  {
    id: "kerala-backwaters",
    title: "Kerala Backwater Bliss",
    destination: "Alleppey, Kerala",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    price: 25000,
    rating: 4.9,
    reviewCount: 156,
    image: "/images/package-bali.jpg",
    description: "Experience the ultimate serenity of Kerala's backwaters. Stay in traditional houseboats and discover why this is truly God's Own Country.",
    highlights: ["Luxury houseboat stay", "Village walks", "Authentic Sadhya meal", "Sunset cruise"],
    itinerary: [
      { day: 1, title: "Arrival in Cochin", description: "Arrive at Cochin International Airport. Transfer to your hotel. Evening visit to Fort Kochi and Chinese Fishing Nets." },
      { day: 2, title: "Munnar Hills", description: "Drive to Munnar. Visit tea plantations and Eravikulam National Park. Overnight stay at Munnar." },
      { day: 3, title: "Thekkady Wildlife", description: "Proceed to Thekkady. Enjoy a boat ride in Periyar Lake. Visit spice plantations in the evening." },
      { day: 4, title: "Alleppey Houseboat", description: "Transfer to Alleppey. Check-in to a traditional luxury houseboat. Enjoy a sunset cruise along the backwaters." },
      { day: 5, title: "Departure", description: "After breakfast, transfer to Cochin Airport for your onward journey." },
    ],
    inclusions: ["All meals", "Transfers", "Guide"],
    exclusions: ["Flights"],
    status: "Active",
    bookingsCount: 45,
    category: "South India Tour Packages",
    isPopular: true,
  },
  {
    id: "coorg-coffee-mist",
    title: "Coorg Coffee & Mist",
    destination: "Coorg, Karnataka",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: 18000,
    rating: 4.7,
    reviewCount: 128,
    image: "/images/package-tokyo.jpg",
    description: "Escape to the Scotland of India. Wander through lush coffee plantations and witness the majesty of Abbey Falls.",
    highlights: ["Coffee tour", "Golden Temple visit", "Elephant Camp", "Raja's Seat"],
    itinerary: [
      { day: 1, title: "Arrival in Coorg", description: "Transfer from Bangalore/Mangalore. Check-in and relax. Evening visit to Raja's Seat for sunset views." },
      { day: 2, title: "Talakaveri & Abbey Falls", description: "Visit the origin of River Kaveri at Talakaveri and the stunning Abbey Falls. Explore coffee plantations in the afternoon." },
      { day: 3, title: "Dubare & Golden Temple", description: "Visit Dubare Elephant Camp for an interactive experience. Later, visit the Namdroling Monastery (Golden Temple)." },
      { day: 4, title: "Departure", description: "Leisurely breakfast and shop for local spices and coffee before heading back to the airport/station." },
    ],
    inclusions: ["Breakfast", "SUV transfer"],
    exclusions: ["Personal expenses"],
    status: "Active",
    bookingsCount: 32,
    category: "South India Tour Packages",
  },
  {
    id: "ooty-queen-hills",
    title: "Ooty: Queen of Hills",
    destination: "Ooty, Tamil Nadu",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: 15500,
    rating: 4.6,
    reviewCount: 210,
    image: "/images/package-swiss.jpg",
    description: "Discover the colonial charm of the Nilgiris. Ride the heritage Toy Train and explore sprawling gardens.",
    highlights: ["Toy Train ride", "Botanical Garden", "Boating", "Doddabetta Peak"],
    itinerary: [
      { day: 1, title: "Arrival in Ooty", description: "Transfer to Ooty and check-in. Evening walk around the scenic Ooty Lake." },
      { day: 2, title: "Botanical Garden & Peak", description: "Explore the vast Government Botanical Garden and enjoy panoramic views from Doddabetta Peak." },
      { day: 3, title: "Coonoor Day Trip", description: "Take the historic Toy Train to Coonoor. Visit Sim's Park and Dolphin's Nose viewpoint." },
      { day: 4, title: "Departure", description: "Visit the Rose Garden and local markets before departing." },
    ],
    inclusions: ["Breakfast", "Sightseeing"],
    exclusions: [],
    status: "Active",
    bookingsCount: 88,
    category: "Family Tour Packages",
  },
  {
    id: "hampi-heritage",
    title: "Hampi: The Empire of Ruins",
    destination: "Hampi, Karnataka",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    price: 12000,
    rating: 4.8,
    reviewCount: 145,
    image: "/images/package-madurai.jpg",
    description: "Step back in time at Hampi, a UNESCO World Heritage site. Explore the magnificent ruins of the Vijayanagara Empire.",
    highlights: ["Virupaksha Temple", "Coracle ride", "Vittala Temple", "Matanga Hill"],
    itinerary: [
      { day: 1, title: "The Royal Enclosure", description: "Arrive at Hampi. Explore the Queen's Bath, Elephant Stables, and Lotus Mahal." },
      { day: 2, title: "Temple & River Trails", description: "Visit Virupaksha Temple and Vittala Temple (Stone Chariot). Enjoy a coracle ride on the Tungabhadra River." },
      { day: 3, title: "Matanga Hill Sunrise", description: "Hike up Matanga Hill for a breath-taking sunrise. Final exploration of HEMAKUTA HILL before departure." },
    ],
    status: "Active",
    bookingsCount: 52,
    inclusions: ["Guide", "Breakfast"],
    exclusions: [],
    category: "Educational Tour Packages",
  },
  {
    id: "mysore-palace-tour",
    title: "Mysore: Royal Heritage",
    destination: "Mysore, Karnataka",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    price: 9500,
    rating: 4.7,
    reviewCount: 86,
    image: "/images/package-madurai.jpg",
    description: "Experience the royal grandeur of the City of Palaces. Visit the illuminated Mysore Palace and the serene Chamundi Hills.",
    highlights: ["Mysore Palace visit", "Brindavan Gardens", "Chamundi Hill", "St. Philomena's Church"],
    itinerary: [
      { day: 1, title: "The Royal City", description: "Arrival in Mysore. Visit the magnificently illuminated Mysore Palace in the evening." },
      { day: 2, title: "Temples & Gardens", description: "Drive up Chamundi Hill. Visit St. Philomena's Church and spend the evening at Brindavan Gardens." },
      { day: 3, title: "Museums & Departure", description: "Explore the Jaganmohan Palace Art Gallery and the Sand Sculpture Museum before departure." },
    ],
    status: "Active",
    bookingsCount: 64,
    inclusions: ["Hotel stay", "Breakfast", "Sightseeing"],
    exclusions: [],
    category: "Family Tour Packages",
  },
  {
    id: "madurai-temple-trail",
    title: "Madurai & Rameshwaram Trail",
    destination: "Madurai, Tamil Nadu",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: 19000,
    rating: 4.9,
    reviewCount: 112,
    image: "/images/package-madurai.jpg",
    description: "A spiritual journey through the soul of Tamil Nadu. Visit the Meenakshi Temple and the sacred shores of Rameshwaram.",
    highlights: ["Meenakshi Amman Temple", "Rameshwaram Pamban Bridge", "Dhanushkodi visit", "Annadhanam experience"],
    itinerary: [
      { day: 1, title: "Madurai Arrival", description: "Arrive in Madurai and visit the iconic Meenakshi Amman Temple." },
      { day: 2, title: "Drive to Rameshwaram", description: "Cross the historic Pamban Bridge. Visit the Ramanathaswamy Temple and Agni Theertham." },
      { day: 3, title: "Dhanushkodi Exploration", description: "Drive to the ghost town of Dhanushkodi and visit the Land's End point." },
      { day: 4, title: "Departure", description: "Final temple visits in Madurai and departure flight/train." },
    ],
    status: "Active",
    bookingsCount: 38,
    inclusions: ["AC Accommodation", "Breakfast", "Temple transfers"],
    exclusions: [],
    category: "South India Tour Packages",
  },
]

export const hotels: Hotel[] = [
  {
    id: "hotel-munnar",
    name: "Munnar Tea Estates Resort",
    destination: "Munnar, Kerala",
    pricePerNight: 200,
    rating: 4.9,
    reviewCount: 156,
    image: "/images/package-bali.jpg",
    description: "Nestled amidst sprawling tea plantations, this luxury resort offers unparalleled peace and breathtaking views of the Anamudi peaks.",
    amenities: ["Free WiFi", "Spa", "Tea Lounge", "Infinity Pool", "Garden"],
    rooms: [
      { type: "Garden Villa", price: 200, description: "Private balcony overlooking the tea gardens." },
      { type: "Cloud View Suite", price: 350, description: "Panoramic valley views from the highest point of the resort." },
    ],
    status: "Active",
    bookingsCount: 45,
  },
  {
    id: "hotel-hampi",
    name: "Heritage Resort Hampi",
    destination: "Hampi, Karnataka",
    pricePerNight: 150,
    rating: 4.8,
    reviewCount: 94,
    image: "/images/package-madurai.jpg",
    description: "Stay in luxury while you explore the ruins of the Vijayanagara Empire. The resort blends historic architecture with modern comforts.",
    amenities: ["Free WiFi", "Sauna", "Cultural Evenings", "Bicycle Rental"],
    rooms: [
      { type: "Deluxe Room", price: 150, description: "Elegant rooms with ethnic decor." },
      { type: "Executive Suite", price: 250, description: "Spacious suites with private courtyards." },
    ],
    status: "Active",
    bookingsCount: 22,
  },
  {
    id: "hotel-pondicherry",
    name: "The Palais de Mahe",
    destination: "Pondicherry",
    pricePerNight: 250,
    rating: 4.7,
    reviewCount: 112,
    image: "/images/package-bali.jpg",
    description: "Located in the heart of the French Quarter, this boutique hotel exudes colonial charm with its yellow facades and arched doorways.",
    amenities: ["Free WiFi", "Rooftop Restaurant", "Pool", "Chauffeur Service"],
    rooms: [
      { type: "Heritage Room", price: 250, description: "High ceilings and period furniture." },
    ],
    status: "Active",
    bookingsCount: 67,
  },
]

export const villas: Villa[] = [
  {
    id: "villa-wayanad",
    name: "Wayanad Rainforest Retreat",
    destination: "Wayanad, Kerala",
    pricePerNight: 300,
    rating: 4.9,
    reviewCount: 88,
    image: "/images/package-bali.jpg",
    description: "A luxury villa hidden in the dense forests of Wayanad. Wake up to the sound of exotic birds and the smell of fresh forest air.",
    amenities: ["WiFi", "Private Pool", "Kitchen", "Daily Cleaning", "Garden"],
    status: "Active",
    bookingsCount: 34,
  },
  {
    id: "villa-ooty",
    name: "Nilgiri Mist Manor",
    destination: "Ooty, Tamil Nadu",
    pricePerNight: 400,
    rating: 4.8,
    reviewCount: 65,
    image: "/images/package-bali.jpg",
    description: "A heritage British-era villa restored with modern luxury. Features a working fireplace and a beautiful lawn over the valley.",
    amenities: ["WiFi", "Daily Cleaning", "Kitchen", "Airport Transfer"],
    status: "Active",
    bookingsCount: 28,
  },
  {
    id: "villa-gokarna",
    name: "Gokarna Cliffside Villa",
    destination: "Gokarna, Karnataka",
    pricePerNight: 350,
    rating: 4.7,
    reviewCount: 42,
    image: "/images/package-bali.jpg",
    description: "Overlooking the Arabian Sea, this cliffside villa offers private beach access and the best sunset views in Gokarna.",
    amenities: ["WiFi", "Private Pool", "Bicycle Rental", "Home Cooked Meals"],
    status: "Active",
    bookingsCount: 15,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Sarah Mitchell",
    location: "New York, USA",
    text: "Plan2Trip made our honeymoon absolutely perfect. Every detail was taken care of!",
    rating: 5,
    avatar: "SM",
  },
  {
    id: "t-2",
    name: "James Chen",
    location: "London, UK",
    text: "The South India tour exceeded all expectations. The views and food were breathtaking.",
    rating: 5,
    avatar: "JC",
  },
  {
    id: "t-3",
    name: "Priya Sharma",
    location: "Mumbai, India",
    text: "Booked the Kerala retreat for our anniversary. The houseboat was a dream come true.",
    rating: 5,
    avatar: "PS",
  },
]

export const initialFooterData: FooterData = {
  description: "Plan Smart. Travel Better. Your trusted partner for unforgettable travel experiences around the world.",
  email: "hello@plan2trip.com",
  phone: "+1 (555) 234-5678",
  address: "123 Travel Avenue, Suite 100, New York, NY 10001",
  destinations: ["Bali", "Paris", "Switzerland", "Maldives", "Tokyo", "Dubai"],
}

export const initialBookings: Booking[] = [
  {
    id: "BK-001",
    packageId: "kerala-backwaters",
    packageTitle: "Kerala Backwater Bliss",
    destination: "Alleppey, Kerala",
    travelDate: "2026-04-15",
    travelers: 2,
    totalPrice: 50000,
    status: "Confirmed",
    bookedOn: "2026-02-20",
    customerName: "Sarah Mitchell",
    customerEmail: "sarah@example.com",
  },
  {
    id: "booking-2",
    packageId: "ooty-queen-hills",
    packageTitle: "Ooty: Queen of Hills",
    destination: "Ooty, Tamil Nadu",
    travelDate: "2024-07-10",
    travelers: 2,
    totalPrice: 31000,
    status: "Pending",
    bookedOn: "2024-03-05",
    customerName: "James Chen",
    customerEmail: "james@example.com",
  },
  {
    id: "BK-003",
    packageId: "hampi-heritage",
    packageTitle: "Hampi: The Empire of Ruins",
    destination: "Hampi, Karnataka",
    travelDate: "2026-03-01",
    travelers: 1,
    totalPrice: 12000,
    status: "Cancelled",
    bookedOn: "2026-01-15",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
  },
  {
    id: "BK-004",
    packageId: "kerala-backwaters",
    packageTitle: "Kerala Backwater Bliss",
    destination: "Munnar, Kerala",
    travelDate: "2026-05-10",
    travelers: 4,
    totalPrice: 120000,
    status: "Confirmed",
    bookedOn: "2026-02-21",
    customerName: "Anil Kumar",
    customerEmail: "anil@example.com",
  },
  {
    id: "BK-005",
    packageId: "kerala-backwaters",
    packageTitle: "Kerala Backwater Bliss",
    destination: "Wayanad, Kerala",
    travelDate: "2026-05-15",
    travelers: 2,
    totalPrice: 45000,
    status: "Confirmed",
    bookedOn: "2026-02-22",
    customerName: "Meera Nair",
    customerEmail: "meera@example.com",
  },
  {
    id: "BK-006",
    packageId: "ooty-queen-hills",
    packageTitle: "Ooty: Queen of Hills",
    destination: "Kodaikanal, Tamil Nadu",
    travelDate: "2026-06-05",
    travelers: 3,
    totalPrice: 65000,
    status: "Confirmed",
    bookedOn: "2026-02-23",
    customerName: "Suresh Pillai",
    customerEmail: "suresh@example.com",
  },
  {
    id: "BK-007",
    packageId: "hampi-heritage",
    packageTitle: "Hampi: The Empire of Ruins",
    destination: "Coorg, Karnataka",
    travelDate: "2026-04-20",
    travelers: 2,
    totalPrice: 35000,
    status: "Confirmed",
    bookedOn: "2026-02-24",
    customerName: "Rohan Das",
    customerEmail: "rohan@example.com",
  },
  {
    id: "BK-008",
    packageId: "hampi-heritage",
    packageTitle: "Hampi: The Empire of Ruins",
    destination: "Mysore, Karnataka",
    travelDate: "2026-04-25",
    travelers: 5,
    totalPrice: 85000,
    status: "Pending",
    bookedOn: "2026-02-25",
    customerName: "Vikram Singh",
    customerEmail: "vikram@example.com",
  },
]

export const ads: Advertisement[] = [
  {
    id: "banner-1",
    title: "Kerala Houseboat Special",
    subtitle: "Up to 30% Off on Alleppey Bookings",
    image: "/images/package-maldives.jpg",
    link: "/packages/kerala-backwaters",
    buttonText: "Book Houseboat",
    status: "Active",
    position: "Banner",
  },
  {
    id: "banner-2",
    title: "Coffee Estate Escape",
    subtitle: "Luxury stays in the heart of Coorg",
    image: "/images/package-tokyo.jpg",
    link: "/packages/coorg-coffee-mist",
    buttonText: "Explore Coorg",
    status: "Active",
    position: "Banner",
  },
  {
    id: "banner-3",
    title: "Heritage Hampi Tour",
    subtitle: "Walk through the ruins of Vijayanagara",
    image: "/images/package-madurai.jpg",
    link: "/packages/hampi-heritage",
    buttonText: "View History",
    status: "Active",
    position: "Banner",
  },
  {
    id: "hero-1",
    title: "Misty Munnar Tea Gardens",
    subtitle: "Experience the green carpet of Kerala",
    image: "/images/package-swiss.jpg",
    link: "/packages",
    buttonText: "Explore Munnar",
    status: "Active",
    position: "Hero",
  },
  {
    id: "hero-2",
    title: "Ooty: The Blue Mountains",
    subtitle: "Colonial charm and scenic Nilgiris",
    image: "/images/package-paris.jpg",
    link: "/packages/ooty-queen-hills",
    buttonText: "Visit Ooty",
    status: "Active",
    position: "Hero",
  },
  {
    id: "hero-3",
    title: "Pondicherry: French Riviera",
    subtitle: "Yellow streets and serene beaches",
    image: "/images/package-bali.jpg",
    link: "/packages",
    buttonText: "Discover Pondy",
    status: "Active",
    position: "Hero",
  },
]

export const initialCategories: PackageCategory[] = [
  {
    id: "cat-1",
    name: "South India Tour Packages",
    image: "/images/package-bali.jpg",
  },
  {
    id: "cat-2",
    name: "Family Tour Packages",
    image: "/images/package-swiss.jpg",
  },
  {
    id: "cat-3",
    name: "Educational Tour Packages",
    image: "/images/package-madurai.jpg",
  },
  {
    id: "cat-4",
    name: "Honeymoon Packages",
    image: "/images/package-tokyo.jpg",
  },
  {
    id: "cat-5",
    name: "North India Tour Packages",
    image: "/images/package-madurai.jpg",
  }
]
