"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

type Props = {
  userEmail?: string
  displayName?: string
  avatarUrl?: string
}

export function Header({ userEmail, displayName, avatarUrl }: Props) {
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
            {userEmail ? (
              <UserMenu email={userEmail} name={displayName} avatarUrl={avatarUrl} />
            ) : (
              <>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <a href="/auth/login">Sign In</a>
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </>
            )}
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
                {userEmail ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar>
                        <AvatarImage src={avatarUrl} alt={displayName || userEmail} />
                        <AvatarFallback>{(displayName || userEmail || "").slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate max-w-[180px]">
                          {displayName || userEmail}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                    <form action="/auth/logout" method="post">
                      <Button type="submit" variant="ghost">Sign Out</Button>
                    </form>
                  </div>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="justify-start">
                      <a href="/auth/login">Sign In</a>
                    </Button>
                    <Button className="bg-primary text-primary-foreground">Get Started</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function UserMenu({
  email,
  name,
  avatarUrl,
}: {
  email?: string
  name?: string
  avatarUrl?: string
}) {
  const label = name || email || "User"
  const initials = (label || "").slice(0, 2).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={label} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[220px] truncate">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/">Home</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/auth/logout" method="post">
            <button type="submit" className="w-full text-left">
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
