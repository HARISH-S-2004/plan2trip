"use client"

import { Star } from "lucide-react"
import { useData } from "@/context/data-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const { testimonials } = useData()

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gold">
          Happy Travelers
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          What Our Travelers Say
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="mb-4 flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-gold text-gold"
                />
              ))}
            </div>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {t.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
