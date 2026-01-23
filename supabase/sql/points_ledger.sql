-- Ledger to track all point changes (earn/spend)
create table if not exists public.user_points_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_points_ledger_user_created on public.user_points_ledger(user_id, created_at desc);

-- Ensure RLS policies (read own rows only)
alter table public.user_points enable row level security;
alter table public.user_points_ledger enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_points' and policyname = 'select_own_points'
  ) then
    create policy select_own_points on public.user_points for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_points_ledger' and policyname = 'select_own_ledger'
  ) then
    create policy select_own_ledger on public.user_points_ledger for select using (auth.uid() = user_id);
  end if;
end $$;

grant select on table public.user_points_ledger to authenticated;

-- Update functions to also write ledger entries
create or replace function public.add_points(delta integer, in_reason text default 'earn', in_meta jsonb default '{}'::jsonb)
returns integer
language plpgsql
security definer
as $$
declare
  uid uuid := auth.uid();
  out_points integer;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  update public.user_points
     set points = greatest(0, points + delta), updated_at = now()
   where user_id = uid
   returning points into out_points;
  if not found then
    insert into public.user_points(user_id, points)
      values (uid, greatest(0, delta))
    returning points into out_points;
  end if;
  insert into public.user_points_ledger(user_id, delta, reason, meta)
  values (uid, delta, coalesce(in_reason, 'earn'), coalesce(in_meta, '{}'::jsonb));
  return out_points;
end;
$$;

create or replace function public.spend_points(cost integer, in_reason text default 'spend', in_meta jsonb default '{}'::jsonb)
returns integer
language plpgsql
security definer
as $$
declare
  uid uuid := auth.uid();
  remaining integer;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  update public.user_points
     set points = points - cost, updated_at = now()
   where user_id = uid and points >= cost
   returning points into remaining;
  if remaining is not null then
    insert into public.user_points_ledger(user_id, delta, reason, meta)
    values (uid, -cost, coalesce(in_reason, 'spend'), coalesce(in_meta, '{}'::jsonb));
  end if;
  return remaining; -- null means insufficient
end;
$$;

grant execute on function public.add_points(integer, text, jsonb) to authenticated;
grant execute on function public.spend_points(integer, text, jsonb) to authenticated;

