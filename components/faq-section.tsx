import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BananaDecoration } from "@/components/banana-icon"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "Nano Banana is an AI-powered image generation and editing platform. It allows you to create stunning visuals from text descriptions or transform existing images using advanced AI models.",
  },
  {
    question: "How does the credit system work?",
    answer:
      "Credits are used to generate images. Each generation typically costs 2 credits. You can purchase credit packs or subscribe to a plan for unlimited generations. New users receive 20 free credits to get started.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support all major image formats including JPG, PNG, WebP, and GIF. Uploaded images should be under 10MB. Generated images are delivered in high-quality PNG format.",
  },
  {
    question: "Can I use generated images commercially?",
    answer:
      "Yes! All images generated with Nano Banana can be used for commercial purposes. You retain full rights to your creations. We do not claim any ownership over your generated content.",
  },
  {
    question: "What AI models are available?",
    answer:
      "We offer multiple AI models including Nano Banana (fast, versatile), Nano Banana Pro (highest quality), and SeeDream 4 (specialized for realistic images). Each model has unique strengths.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Yes, we offer a comprehensive API for developers. You can integrate Nano Banana's image generation capabilities directly into your applications. Contact us for API access and documentation.",
  },
  {
    question: "How do I get better results?",
    answer:
      "For best results, use detailed prompts that describe style, lighting, composition, and specific details. Reference images can also help guide the AI. Check our prompt guide for tips and examples.",
  },
  {
    question: "What's the difference between Image Edit and Text to Image?",
    answer:
      "Image Edit transforms existing images based on your prompts, while Text to Image creates entirely new images from scratch using only your text description. Both use the same powerful AI models.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-20 px-4 relative overflow-hidden">
      <BananaDecoration className="top-20 right-0 opacity-20 rotate-90" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about Nano Banana</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
