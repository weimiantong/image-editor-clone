import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-2">Account</h1>
        <p className="text-muted-foreground">Please sign in to view your account.</p>
      </main>
    )
  }

  const [{ data: balance }, { data: ledger }] = await Promise.all([
    supabase.from("user_points").select("points").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("user_points_ledger")
      .select("delta, reason, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">账户</h1>
      <section className="mb-10">
        <div className="text-lg">当前积分余额</div>
        <div className="text-3xl font-bold">{balance?.points ?? 0} 分</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">历史记录</h2>
        <div className="border rounded-lg divide-y">
          {(ledger || []).length === 0 ? (
            <div className="p-4 text-muted-foreground">暂无记录</div>
          ) : (
            (ledger || []).map((row: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="text-sm">
                  <div className={row.delta >= 0 ? "text-green-600" : "text-red-600"}>
                    {row.delta >= 0 ? `+${row.delta}` : row.delta} 分
                  </div>
                  <div className="text-muted-foreground">{row.reason || "unknown"}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

