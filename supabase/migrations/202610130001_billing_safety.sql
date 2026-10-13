-- Additive billing ledger. No API keys, prices or existing customer data are replaced.
create table public.pn_billing_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  customer_id text,
  subscription_id text,
  checkout_url text,
  phase text not null default 'idle' check (phase in ('idle','creating','ready','uncertain','cancelled')),
  lock_token uuid,
  lock_until timestamptz,
  updated_at timestamptz not null default now()
);
create table public.pn_billing_events (
  event_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  applied_plan text not null check (applied_plan in ('free','pro')),
  processed_at timestamptz not null default now()
);
alter table public.pn_billing_accounts enable row level security;
alter table public.pn_billing_events enable row level security;
revoke all on public.pn_billing_accounts, public.pn_billing_events from public, anon, authenticated;
grant all on public.pn_billing_accounts, public.pn_billing_events to service_role;

create function public.pn_claim_billing(p_user_id uuid, p_lock_token uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare account public.pn_billing_accounts%rowtype;
begin
  insert into public.pn_billing_accounts(user_id) values(p_user_id) on conflict do nothing;
  update public.pn_billing_accounts set lock_token=p_lock_token,
    lock_until=pg_catalog.now() + interval '2 minutes', updated_at=pg_catalog.now()
    where user_id=p_user_id and (lock_until is null or lock_until < pg_catalog.now())
    returning * into account;
  if not found then return pg_catalog.jsonb_build_object('acquired', false); end if;
  return pg_catalog.jsonb_build_object('acquired', true, 'account', pg_catalog.to_jsonb(account));
end $$;

create function public.pn_release_billing(p_user_id uuid, p_lock_token uuid)
returns void language sql security definer set search_path = '' as $$
  update public.pn_billing_accounts set lock_token=null, lock_until=null
  where user_id=p_user_id and lock_token=p_lock_token;
$$;

create function public.pn_apply_billing_event(p_event_id text, p_user_id uuid, p_lock_token uuid,
  p_plan text, p_subscription_id text default null, p_cancelled boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare inserted text;
begin
  if p_plan not in ('free','pro') then raise exception 'Invalid plan'; end if;
  if not exists (select 1 from public.pn_billing_accounts where user_id=p_user_id
    and lock_token=p_lock_token and lock_until > pg_catalog.now()) then
    raise exception 'Billing lease expired';
  end if;
  insert into public.pn_billing_events(event_id,user_id,applied_plan)
    values(p_event_id,p_user_id,p_plan) on conflict do nothing returning event_id into inserted;
  if inserted is null then return pg_catalog.jsonb_build_object('duplicate',true); end if;
  insert into public.profiles(id,plan,updated_at) values(p_user_id,p_plan,pg_catalog.now())
    on conflict(id) do update set plan=excluded.plan, updated_at=excluded.updated_at;
  update public.pn_billing_accounts set
    subscription_id=case when p_cancelled then null else p_subscription_id end,
    checkout_url=case when p_cancelled then null else checkout_url end,
    phase=case when p_cancelled then 'cancelled' else phase end,
    updated_at=pg_catalog.now()
    where user_id=p_user_id and lock_token=p_lock_token;
  return pg_catalog.jsonb_build_object('duplicate',false,'plan',p_plan);
end $$;

revoke all on function public.pn_claim_billing(uuid,uuid) from public,anon,authenticated;
revoke all on function public.pn_release_billing(uuid,uuid) from public,anon,authenticated;
revoke all on function public.pn_apply_billing_event(text,uuid,uuid,text,text,boolean) from public,anon,authenticated;
grant execute on function public.pn_claim_billing(uuid,uuid) to service_role;
grant execute on function public.pn_release_billing(uuid,uuid) to service_role;
grant execute on function public.pn_apply_billing_event(text,uuid,uuid,text,text,boolean) to service_role;

-- Browser clients may edit their brand, but may not promote their subscription plan.
create function public.pn_guard_profile_plan() returns trigger
language plpgsql set search_path = '' as $$
begin
  if auth.role() in ('anon','authenticated') then
    if tg_op='INSERT' and coalesce(new.plan,'free') <> 'free' then
      raise exception 'Subscription plans are managed by the payment server' using errcode='42501';
    elsif tg_op='UPDATE' and new.plan is distinct from old.plan then
      raise exception 'Subscription plans are managed by the payment server' using errcode='42501';
    end if;
  end if;
  return new;
end $$;
create trigger pn_guard_profile_plan before insert or update on public.profiles
  for each row execute function public.pn_guard_profile_plan();

-- Preserve the existing five-property limit and serialize simultaneous inserts.
create or replace function public.check_property_limit() returns trigger
language plpgsql set search_path = '' as $$
declare user_plan text;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text, 0));
  if exists(select 1 from public.properties where id=new.id and user_id=new.user_id) then return new; end if;
  select plan into user_plan from public.profiles where id=new.user_id;
  if coalesce(user_plan,'free') <> 'pro' and
    (select count(*) from public.properties where user_id=new.user_id) >= 5 then
    raise exception 'PN_FREE_PROPERTY_LIMIT: limite de 5 imóveis atingido.' using errcode='23514';
  end if;
  return new;
end $$;

-- Restrictive policies strengthen existing permissive policies without changing public image URLs.
create policy pn_owned_uploads on storage.objects as restrictive for insert to public
  with check(bucket_id not in ('logos','fotos_imoveis') or
    (auth.uid() is not null and (owner_id=auth.uid()::text or owner=auth.uid())));
create policy pn_owned_updates on storage.objects as restrictive for update to public
  using(bucket_id not in ('logos','fotos_imoveis') or
    (auth.uid() is not null and (owner_id=auth.uid()::text or owner=auth.uid())))
  with check(bucket_id not in ('logos','fotos_imoveis') or
    (auth.uid() is not null and (owner_id=auth.uid()::text or owner=auth.uid())));
create policy pn_owned_deletes on storage.objects as restrictive for delete to public
  using(bucket_id not in ('logos','fotos_imoveis') or
    (auth.uid() is not null and (owner_id=auth.uid()::text or owner=auth.uid())));
