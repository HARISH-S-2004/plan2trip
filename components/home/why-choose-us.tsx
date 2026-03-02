import { Shield, Headphones, Globe } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Curated Destinations",
    description:
      "Every package is handpicked by travel experts who have personally visited and vetted each destination for quality.",
  },
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description:
      "We guarantee the best value for your money. Find a lower price elsewhere, and we will match it - no questions asked.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist you before, during, and after your trip.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-secondary/50 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gold">
            Why Plan2Trip
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            We go the extra mile to ensure every trip is seamless, memorable, and
            worth every penny.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
