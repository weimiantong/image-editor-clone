import { NextResponse } from "next/server"
import crypto from "node:crypto"

// Webhook endpoint to receive Creem events
// Configure in Creem dashboard to POST to /api/creem/webhook with the signing secret
export async function POST(request: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: "missing secret" }, { status: 500 })

  // Read raw body for signature verification
  const raw = await request.text()

  // Accept several common header variants; confirm exact name in Creem docs
  const sigHeader =
    request.headers.get("x-creem-signature") ||
    request.headers.get("creem-signature") ||
    request.headers.get("x-signature") ||
    ""

  // Compute HMAC-SHA256 over raw body with the webhook secret
  const expected = crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex")

  // Some providers prefix the signature like "sha256=..."; normalize
  const provided = sigHeader.replace(/^sha256=/i, "").trim()

  const valid = safeEqual(expected, provided)
  if (!valid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  // Parse the event after verification
  let event: any
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  // TODO: handle event types per Creem docs
  // e.g., if (event.type === 'checkout.session.completed') { /* mark subscription active */ }

  return NextResponse.json({ received: true })
}

function safeEqual(a: string, b: string) {
  try {
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

