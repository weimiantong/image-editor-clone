"use client"

import { useState } from "react"
import { PricingCard } from "@/components/PricingCard"

async function startCheckout(priceId: string) {
  const res = await fetch("/api/creem/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, returnUrl: "/pricing" }),
  })
  const data = await res.json()
  if (res.status === 401 && data?.login) {
    window.location.href = data.login
    return
  }
  if (res.ok && data?.url) window.location.href = data.url
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(true)

  const free = {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Limited image generations",
      "Basic editing tools",
      "Community gallery access",
    ],
  }

  const proMonthly = {
    name: "Pro",
    price: "$12",
    period: "/ month",
    features: [
      "Priority generation queue",
      "Advanced editing (layers, masks)",
      "Higher resolution exports",
      "Commercial usage",
    ],
  }

  const proYearly = { ...proMonthly, price: "$120", period: "/ year (2 months free)" }

  const teamsMonthly = {
    name: "Teams",
    price: "$29",
    period: "/ seat / month",
    features: [
      "Team workspaces",
      "Role-based access",
      "Usage analytics",
      "Priority support",
    ],
  }

  const teamsYearly = { ...teamsMonthly, price: "$290", period: "/ seat / year" }

  const pro = yearly ? proYearly : proMonthly
  const teams = yearly ? teamsYearly : teamsMonthly

  const PRO_PRICE_ID = yearly
    ? process.env.NEXT_PUBLIC_CREEM_PRICE_PRO_YEARLY
    : process.env.NEXT_PUBLIC_CREEM_PRICE_PRO_MONTHLY
  const TEAMS_PRICE_ID = yearly
    ? process.env.NEXT_PUBLIC_CREEM_PRICE_TEAMS_YEARLY
    : process.env.NEXT_PUBLIC_CREEM_PRICE_TEAMS_MONTHLY

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that fits your workflow.</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={!yearly ? "font-semibold" : "text-muted-foreground"}>Monthly</span>
        <button
          className="border rounded-full px-1 py-1 w-14 relative"
          onClick={() => setYearly((v) => !v)}
          aria-label="Toggle billing period"
        >
          <span
            className={
              "block h-6 w-6 rounded-full bg-primary transition-transform " +
              (yearly ? "translate-x-7" : "translate-x-0")
            }
          />
        </button>
        <span className={yearly ? "font-semibold" : "text-muted-foreground"}>Yearly</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PricingCard
          name={free.name}
          price={free.price}
          period={free.period}
          features={free.features}
          ctaLabel="Get Started"
          href="/"
        />
        <PricingCard
          name={pro.name}
          price={pro.price}
          period={pro.period}
          highlight
          features={pro.features}
          ctaLabel="Upgrade to Pro"
          ctaAction={() => PRO_PRICE_ID && startCheckout(PRO_PRICE_ID)}
        />
        <PricingCard
          name={teams.name}
          price={teams.price}
          period={teams.period}
          features={teams.features}
          ctaLabel="Start Teams"
          ctaAction={() => TEAMS_PRICE_ID && startCheckout(TEAMS_PRICE_ID)}
        />
      </div>
    </main>
  )
}
