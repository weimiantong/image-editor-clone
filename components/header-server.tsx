import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Header as HeaderClient } from "@/components/header"

export async function Header() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const meta = (user?.user_metadata || {}) as any
  const userEmail = user?.email || meta.email || undefined
  const displayName = meta.full_name || meta.name || undefined
  const avatarUrl = meta.avatar_url || meta.picture || undefined
  let points: number | undefined = undefined
  if (user) {
    const { data } = await supabase
      .from("user_points")
      .select("points")
      .eq("user_id", user.id)
      .maybeSingle()
    points = data?.points ?? 0
  }

  return (
    <HeaderClient
      userEmail={userEmail}
      displayName={displayName}
      avatarUrl={avatarUrl}
      points={points}
    />
  )
}
