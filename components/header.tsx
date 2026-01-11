"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BananaIcon className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">Nano Banana</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
              Generator
            </Link>
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
                Generator
              </Link>
              <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="justify-start">
                  Sign In
                </Button>
                <Button className="bg-primary text-primary-foreground">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
