import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// This route completes the OAuth flow. Supabase will set the auth cookies.
export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()
  const url = new URL(request.url)

  // Exchange OAuth code and set cookies via supabase-js internally.
  const { data, error } = await supabase.auth.exchangeCodeForSession(
    url.searchParams.get("code") || undefined,
  )

  // Decide where to land the user after login
  const redirectTo = url.searchParams.get("next") || "/"
  const to = new URL(redirectTo, url.origin)

  if (error) {
    to.searchParams.set("auth_error", "1")
    return NextResponse.redirect(to)
  }

  return NextResponse.redirect(to)
}
