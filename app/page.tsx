import { HeroSection } from "@/components/home/hero-section"
import { FeaturedPackages } from "@/components/home/featured-packages"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { PromoBanner } from "@/components/home/promo-banner"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPackages />
      <PromoBanner />
      <WhyChooseUs />
      <Testimonials />
    </>
  )
}
