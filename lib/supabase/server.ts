// Server-side Supabase client for Next.js App Router
// Uses @supabase/ssr to persist the auth session in HTTP-only cookies.
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // In route handlers and server actions, cookies() is mutable.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options as any)
          } catch {
            // ignore in static generation contexts
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, "", { ...(options as any), maxAge: 0 })
          } catch {
            // ignore in static generation contexts
          }
        },
      },
    },
  )
}
