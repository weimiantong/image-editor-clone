import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Minimal Creem checkout session creation proxy.
// Docs: https://docs.creem.io/api-reference/introduction
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { priceId?: string; returnUrl?: string }
    if (!body?.priceId) {
      return NextResponse.json({ error: "priceId required" }, { status: 400 })
    }

    const apiKey = process.env.CREEM_API_KEY
    const creemBase = process.env.CREEM_API_BASE || "https://api.creem.io"
    if (!apiKey) {
      return NextResponse.json({ error: "CREEM_API_KEY not set" }, { status: 500 })
    }

    const origin = new URL(request.url).origin
    const fromUrl = body.returnUrl || "/pricing"
    const successUrl = `${origin}${fromUrl}?status=success`
    const cancelUrl = `${origin}${fromUrl}?status=cancelled`

    // Attach user context if logged in
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload: any = {
      price_id: body.priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }

    if (!user) {
      const login = `/auth/login?next=${encodeURIComponent(fromUrl)}`
      return NextResponse.json({ login }, { status: 401 })
    }

    if (user) {
      payload.customer = {
        email: user.email,
        name: (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name,
      }
    }

    // Call Creem API - path may differ depending on their latest spec.
    const res = await fetch(`${creemBase}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt || "creem error" }, { status: 500 })
    }
    const data = await res.json()

    // Assume response has a hosted checkout URL
    return NextResponse.json({ url: data?.url || data?.hosted_url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown" }, { status: 500 })
  }
}
