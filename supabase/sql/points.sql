-- Create a simple points ledger table per user
create table if not exists public.user_points (
  user_id uuid primary key references auth.users(id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful index if you later add a separate ledger table
create index if not exists idx_user_points_updated_at on public.user_points(updated_at desc);

-- Ensure a row exists for the current user; if not, create with initial points (default 5).
create or replace function public.ensure_user_points(initial integer default 5)
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
  insert into public.user_points(user_id, points)
    values (uid, initial)
  on conflict (user_id) do nothing;
  select points into out_points from public.user_points where user_id = uid;
  return out_points;
end;
$$;

-- Add points to current user (can be negative, but we keep separate spend for checks)
create or replace function public.add_points(delta integer)
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
  return out_points;
end;
$$;

-- Spend points atomically if enough balance; returns remaining points, or null if insufficient
create or replace function public.spend_points(cost integer)
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
  return remaining; -- null means insufficient
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, update, insert on table public.user_points to authenticated;
grant execute on function public.ensure_user_points(integer) to authenticated;
grant execute on function public.add_points(integer) to authenticated;
grant execute on function public.spend_points(integer) to authenticated;
