import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()
  const url = new URL(request.url)

  const redirectTo = `${url.origin}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        // Request offline access to get refresh_token; recommended for SSR
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error || !data?.url) {
    // Fallback to homepage with an error flag
    const to = new URL("/", url.origin)
    if (error?.message) to.searchParams.set("auth_error", "1")
    return NextResponse.redirect(to)
  }

  // Redirect user to the provider login page
  return NextResponse.redirect(data.url)
}
