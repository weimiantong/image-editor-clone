"use client"

import { Button } from "@/components/ui/button"

type PricingCardProps = {
  name: string
  price: string
  period?: string
  highlight?: boolean
  features: string[]
  ctaLabel: string
  ctaAction?: () => void
  href?: string
  disabled?: boolean
}

export function PricingCard({
  name,
  price,
  period,
  highlight,
  features,
  ctaLabel,
  ctaAction,
  href,
  disabled,
}: PricingCardProps) {
  return (
    <div
      className={
        "border rounded-xl p-6 flex flex-col gap-6 bg-background " +
        (highlight ? "border-primary shadow-lg" : "border-border")
      }
    >
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{price}</div>
          {period ? <div className="text-sm text-muted-foreground">{period}</div> : null}
        </div>
      </div>
      <ul className="text-sm text-muted-foreground space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        {href ? (
          <Button asChild className="w-full" disabled={disabled}>
            <a href={href}>{ctaLabel}</a>
          </Button>
        ) : (
          <Button onClick={ctaAction} className="w-full" disabled={disabled}>
            {ctaLabel}
          </Button>
        )}
        {disabled ? (
          <p className="text-xs text-muted-foreground mt-2">Not available: price not configured</p>
        ) : null}
      </div>
    </div>
  )
}
