"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"

export function PromoBanner() {
    const { ads } = useData()
    const [currentSlide, setCurrentSlide] = useState(0)

    const bannerAds = ads.filter(a => a.status === "Active" && a.position === "Banner")

    // Auto-slide effect
    useEffect(() => {
        if (bannerAds.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerAds.length)
        }, 6000) // Slightly longer than hero to avoid sync clashing

        return () => clearInterval(timer)
    }, [bannerAds.length])

    if (bannerAds.length === 0) return null

    const activeBanner = bannerAds[currentSlide]

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-foreground text-card shadow-2xl">
                {/* Background Image with Transition */}
                <div key={`bg-${activeBanner.id}`} className="absolute inset-0 opacity-40 animate-in fade-in duration-1000">
                    <Image
                        src={activeBanner.image || "/images/hero-travel.jpg"}
                        alt="Background"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>

                {/* Content with Transition */}
                <div key={`content-${activeBanner.id}`} className="relative z-10 flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-16 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
                            {activeBanner.title}
                        </h2>
                        <p className="text-lg text-card/80">
                            {activeBanner.subtitle}
                        </p>
                    </div>
                    <Link href={activeBanner.link}>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-7 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                            {activeBanner.buttonText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Indicators */}
                {bannerAds.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:left-16 md:translate-x-0">
                        {bannerAds.map((_, i) => (
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
            </div>
        </section>
    )
}
