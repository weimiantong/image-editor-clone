import { Card } from "@/components/ui/card"
import { BananaDecoration } from "@/components/banana-icon"

const showcaseItems = [
  {
    title: "Fantasy Portrait",
    prompt: "Ethereal warrior princess with flowing silver hair",
    image: "/fantasy-warrior-princess-digital-art-ethereal.jpg",
  },
  {
    title: "Sci-Fi Landscape",
    prompt: "Futuristic cityscape with neon lights at sunset",
    image: "/futuristic-cyberpunk-city-neon-sunset.jpg",
  },
  {
    title: "Nature Art",
    prompt: "Magical forest with bioluminescent plants",
    image: "/magical-forest-bioluminescent-plants-fantasy.jpg",
  },
  {
    title: "Product Design",
    prompt: "Sleek minimalist headphones on marble surface",
    image: "/minimalist-headphones-product-photography-marble.jpg",
  },
  {
    title: "Character Art",
    prompt: "Steampunk inventor with mechanical arm",
    image: "/steampunk-inventor-character-mechanical-arm.jpg",
  },
  {
    title: "Abstract Art",
    prompt: "Flowing liquid gold with cosmic dust particles",
    image: "/liquid-gold-abstract-cosmic-particles-art.jpg",
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 px-4 relative overflow-hidden">
      <BananaDecoration className="top-0 right-0 opacity-20 rotate-45 scale-150" />
      <BananaDecoration className="bottom-0 left-0 opacity-15 -rotate-12" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Creations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore stunning images created by our community using Nano Banana AI. Get inspired and start creating your
            own masterpieces.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
