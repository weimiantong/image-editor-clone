import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { BananaIcon } from "@/components/banana-icon"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    avatar: "/professional-woman-avatar.png",
    content:
      "Nano Banana has completely transformed my workflow. The AI understands exactly what I'm looking for and delivers stunning results every time.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Game Developer",
    avatar: "/professional-man-avatar.png",
    content:
      "The quality of concept art I can generate now is incredible. It's like having a whole art team at my fingertips. Absolutely game-changing!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    avatar: "/professional-woman-marketing-avatar.jpg",
    content:
      "We use Nano Banana for all our social media visuals. Fast, high-quality, and incredibly easy to use. Our engagement has skyrocketed!",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Indie Game Creator",
    avatar: "/professional-asian-man-developer-avatar.jpg",
    content:
      "As a solo developer, this tool is invaluable. I can create professional-quality assets without breaking the bank. Highly recommended!",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Content Creator",
    avatar: "/professional-woman-content-creator-avatar.jpg",
    content:
      "The image editing features are phenomenal. I can transform ordinary photos into extraordinary art pieces with just a few clicks.",
    rating: 5,
  },
  {
    name: "Alex Martinez",
    role: "UI/UX Designer",
    avatar: "/professional-designer-man-avatar.jpg",
    content:
      "Perfect for rapid prototyping and mood boards. The consistency in style across generations is what sets Nano Banana apart from others.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <BananaIcon className="w-6 h-6" />
            <span className="text-sm text-primary font-medium">Loved by creators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied creators who have transformed their creative process with Nano Banana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6">{`"${testimonial.content}"`}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
