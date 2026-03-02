"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin, SlidersHorizontal, X } from "lucide-react"
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

const durations = [
  { label: "Any Duration", value: "all" },
  { label: "Up to 5 days", value: "5" },
  { label: "6-7 days", value: "7" },
]

export function PackageListingClient() {
  const { packages } = useData()
  const searchParams = useSearchParams()
  const initialDest = searchParams.get("destination") || ""
  const initialCategory = searchParams.get("category") || "All Categories"

  // Dynamically generate destinations from available packages
  const destinations = useMemo(() => {
    const pkgDestinations = packages.filter(p => p.status === "Active").map(p => p.destination)
    return ["All Destinations", ...Array.from(new Set(pkgDestinations)).sort()]
  }, [packages])

  // Dynamically generate categories from available packages
  const categories = useMemo(() => {
    const pkgCategories = packages.filter(p => p.status === "Active" && p.category).map(p => p.category as string)
    return ["All Categories", ...Array.from(new Set(pkgCategories)).sort()]
  }, [packages])

  const [priceRange, setPriceRange] = useState<number[]>([0, 100000])
  const [selectedDest, setSelectedDest] = useState(
    initialDest
      ? destinations.find((d) =>
        d.toLowerCase().includes(initialDest.toLowerCase())
      ) || "All Destinations"
      : "All Destinations"
  )
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory !== "All Categories"
      ? categories.find(c => c === initialCategory) || "All Categories"
      : "All Categories"
  )
  const [selectedDuration, setSelectedDuration] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const matchDest =
        selectedDest === "All Destinations" ||
        pkg.destination === selectedDest
      const matchCategory =
        selectedCategory === "All Categories" ||
        pkg.category === selectedCategory
      const matchPrice =
        pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
      const matchDuration =
        selectedDuration === "all" ||
        (selectedDuration === "5" && pkg.durationDays <= 5) ||
        (selectedDuration === "7" &&
          pkg.durationDays >= 6 &&
          pkg.durationDays <= 7)
      return matchDest && matchCategory && matchPrice && matchDuration
    })
  }, [selectedDest, selectedCategory, priceRange, selectedDuration, packages])

  const hasFilters =
    selectedDest !== "All Destinations" ||
    selectedCategory !== "All Categories" ||
    selectedDuration !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000

  function clearFilters() {
    setSelectedDest("All Destinations")
    setSelectedCategory("All Categories")
    setSelectedDuration("all")
    setPriceRange([0, 100000])
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Tour Packages
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore our handpicked collection of travel experiences
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

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground">
                Price Range
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
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

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Duration
              </label>
              <Select
                value={selectedDuration}
                onValueChange={setSelectedDuration}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Package Grid */}
        <div className="flex-1">
          {/* Popular Packages Section */}
          {!hasFilters && packages.some(p => p.status === "Active" && p.isPopular) && (
            <div className="mb-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Popular Packages</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  Top Picks
                </Badge>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {packages
                  .filter(p => p.status === "Active" && p.isPopular)
                  .sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0))
                  .slice(0, 2)
                  .map((pkg) => (
                    <Link
                      key={`popular-${pkg.id}`}
                      href={`/packages/${pkg.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[21/9] overflow-hidden">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/90">
                            <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
                            {pkg.destination}
                          </div>
                          <h3 className="text-lg font-bold leading-tight">
                            {pkg.title}
                          </h3>
                        </div>
                        <div className="absolute right-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground shadow-lg">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                        <div className="absolute left-3 top-3">
                          <Badge className="bg-amber-500 text-white">Popular</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="mt-8 border-b border-border" />
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              {hasFilters ? "Search Results" : "All Packages"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>{" "}
              packages
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
              <MapPin className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No packages found
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
              {filtered.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 z-10">
                      <Badge
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors",
                          pkg.status === "Active"
                            ? "bg-emerald-500/80 text-white hover:bg-emerald-500/90"
                            : "bg-red-500/80 text-white hover:bg-red-500/90"
                        )}
                      >
                        {pkg.status}
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3 rounded-lg bg-card/90 px-2.5 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
                      ₹{pkg.price.toLocaleString()}
                      <span className="text-xs font-normal text-muted-foreground">
                        /person
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {pkg.destination}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                      {pkg.title}
                    </h3>
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className="gap-1 rounded-md font-normal"
                      >
                        <Clock className="h-3 w-3" />
                        {pkg.duration}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        {pkg.rating} ({pkg.reviewCount})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
