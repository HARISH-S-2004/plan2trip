"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useData } from "@/context/data-context"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const router = useRouter()
  const { ads } = useData()
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [travelers, setTravelers] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroAds = ads.filter(a => a.status === "Active" && a.position === "Hero")

  // Auto-slide effect
  useEffect(() => {
    if (heroAds.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroAds.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroAds.length])

  const activeAd = heroAds[currentSlide]
  const heroImage = activeAd?.image || "/images/hero-travel.jpg"
  const heroTitle = activeAd?.title || "Plan Smart. Travel Better."
  const heroSubtitle = activeAd?.subtitle || "Discover curated travel packages to the world's most breathtaking destinations. Unforgettable experiences, expertly planned."

  function handleSearch() {
    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (date) params.set("date", date)
    if (travelers) params.set("travelers", travelers)
    router.push(`/packages?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden lg:min-h-[700px]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-foreground/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
        <div key={activeAd?.id || "fallback"} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {activeAd && (
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gold">
              {activeAd.subtitle}
            </p>
          )}
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-card md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-card/80">
            {activeAd ? "Limited time exclusive travel deals handpicked just for you." : heroSubtitle}
          </p>

          {activeAd && (
            <div className="mb-10 flex justify-center">
              <Link href={activeAd.link}>
                <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
                  {activeAd.buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Slide Indicators */}
        {heroAds.length > 1 && (
          <div className="mb-8 flex justify-center gap-2">
            {heroAds.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  currentSlide === i ? "w-8 bg-primary" : "w-2 bg-card/30 hover:bg-card/50"
                )}
              />
            ))}
          </div>
        )}

        <div className="mx-auto max-w-3xl rounded-2xl bg-card/95 p-3 shadow-xl backdrop-blur-sm md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Destination
              </label>
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-border/60 bg-secondary"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Travel Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-border/60 bg-secondary"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Travelers
              </label>
              <Input
                type="number"
                placeholder="Guests"
                min={1}
                max={10}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="border-border/60 bg-secondary"
              />
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 md:px-8"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
