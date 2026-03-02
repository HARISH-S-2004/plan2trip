"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"

interface PageHeroProps {
    title: string
    subtitle: string
    category?: string
}

export function PageHero({ title, subtitle, category }: PageHeroProps) {
    const { ads } = useData()
    const [currentSlide, setCurrentSlide] = useState(0)

    // Filter ads for this page specifically or just use Hero ads
    const heroAds = ads.filter(a => a.status === "Active" && a.position === "Hero")

    useEffect(() => {
        if (heroAds.length <= 1) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroAds.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [heroAds.length])

    const activeAd = heroAds[currentSlide]
    const backgroundImage = activeAd?.image || "/images/hero-travel.jpg"

    return (
        <section className="relative h-[400px] w-full overflow-hidden bg-foreground flex items-center justify-center">
            {/* Background Image with Transition */}
            <div key={backgroundImage} className="absolute inset-0 transition-opacity duration-1000">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    unoptimized
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <div key={activeAd?.id || "static"} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {category && (
                        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
                            {category}
                        </p>
                    )}
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
                        {activeAd?.title || title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-white/80">
                        {activeAd?.subtitle || subtitle}
                    </p>
                    {activeAd && (
                        <Link href={activeAd.link} className="mt-8 inline-block">
                            <Button size="lg" className="rounded-full px-8 gap-2 shadow-xl hover:scale-105 transition-all">
                                {activeAd.buttonText}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Indicators */}
                {heroAds.length > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {heroAds.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentSlide === i ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
