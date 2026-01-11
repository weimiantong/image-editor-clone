import { Button } from "@/components/ui/button"
import { BananaDecoration } from "@/components/banana-icon"
import { Sparkles, Zap, ImageIcon } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <BananaDecoration className="top-20 left-10 opacity-50 rotate-12" />
      <BananaDecoration className="top-40 right-10 opacity-30 -rotate-45 scale-75" />
      <BananaDecoration className="bottom-10 left-1/4 opacity-40 rotate-180 scale-50" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">AI-Powered Image Generation</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Transform Your Ideas Into
          <span className="text-primary"> Stunning Visuals</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Create beautiful images with AI. Upload your photos for editing or generate entirely new creations from text
          prompts. Fast, powerful, and incredibly easy to use.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating Free
          </Button>
          <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
            View Examples
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm">Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="text-sm">High Quality Output</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">Multiple AI Models</span>
          </div>
        </div>
      </div>
    </section>
  )
}
