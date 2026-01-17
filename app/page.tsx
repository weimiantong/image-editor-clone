import { Header } from "@/components/header-server"
import { HeroSection } from "@/components/hero-section"
import { GeneratorSection } from "@/components/generator-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <GeneratorSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
