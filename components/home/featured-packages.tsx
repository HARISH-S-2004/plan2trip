"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/data-context"
import { cn } from "@/lib/utils"

export function FeaturedPackages() {
  const { packages, categories } = useData()

  // Calculate package count for each category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: packages.filter(pkg => pkg.category === cat.name).length
  }))

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-playfair">
          Popular Packages
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesWithCounts.map((category, index) => (
          <Link
            key={category.id}
            href={`/packages?category=${encodeURIComponent(category.name)}`}
            className={cn(
              "group relative block overflow-hidden rounded-xl bg-muted transition-all duration-500",
              index === 0 && "sm:col-span-2 lg:col-span-2 aspect-[16/10] sm:aspect-[16/7]",
              index !== 0 && "aspect-[4/3]"
            )}
          >
            {/* Fallback pattern if image is missing/broken */}
            <div className="absolute inset-0 bg-slate-200" />

            <Image
              src={category.image}
              alt={category.name}
              fill
              unoptimized
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl text-balance px-4">
                {category.name}
              </h3>
              <div className="rounded-md bg-gold px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                {category.count} Tours
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/packages">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-primary/30 px-8 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Packages
          </Button>
        </Link>
      </div>
    </section>
  )
}
