import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migração valida travas, atomicidade, duplicidade, limite e permissões em PostgreSQL local', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated; create role service_role;
      create schema auth; create schema storage;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql as $$ select coalesce(nullif(current_setting('request.jwt.claim.role',true),''),'postgres') $$;
      create table public.profiles(id uuid primary key references auth.users,plan text default 'free',brand_kit jsonb,updated_at timestamptz default now());
      create table public.properties(id text primary key,user_id uuid references auth.users,details jsonb);
      create function public.check_property_limit() returns trigger language plpgsql as $$ begin return new; end $$;
      create trigger enforce_property_limit_trigger before insert on public.properties for each row execute function public.check_property_limit();
      create table storage.objects(id uuid primary key,bucket_id text,owner_id text,owner uuid);
      alter table storage.objects enable row level security;
      grant usage on schema public,auth,storage to authenticated,anon;
      grant all on public.profiles,public.properties,storage.objects to authenticated,anon;
      create policy original_permissive on storage.objects for all to public using(true) with check(true);
    `);
    await db.exec(await readFile(new URL('../supabase/migrations/202610130001_billing_safety.sql', import.meta.url), 'utf8'));
    const id = crypto.randomUUID(); const token = crypto.randomUUID();
    await db.query('insert into auth.users(id) values($1)', [id]);
    const first = await db.query<any>('select public.pn_claim_billing($1,$2) as result', [id, token]);
    const second = await db.query<any>('select public.pn_claim_billing($1,$2) as result', [id, crypto.randomUUID()]);
    assert.equal(first.rows[0].result.acquired, true);
    assert.equal(second.rows[0].result.acquired, false);
    await db.query('select public.pn_apply_billing_event($1,$2,$3,$4,$5,false)', ['evt_sql', id, token, 'pro', 'sub_sql']);
    const duplicate = await db.query<any>('select public.pn_apply_billing_event($1,$2,$3,$4,$5,false) as result', ['evt_sql', id, token, 'free', 'sub_sql']);
    assert.equal(duplicate.rows[0].result.duplicate, true);
    assert.equal((await db.query<any>('select plan from public.profiles where id=$1',[id])).rows[0].plan, 'pro');
    const otherToken = crypto.randomUUID();
    await assert.rejects(db.query('select public.pn_apply_billing_event($1,$2,$3,$4,$5,false)', ['evt_invalid', id, otherToken, 'free', null]));
    assert.equal((await db.query<any>("select count(*)::int as total from public.pn_billing_events where event_id='evt_invalid'")).rows[0].total, 0);
    await db.query('select public.pn_release_billing($1,$2)', [id, token]);
    assert.equal((await db.query<any>('select public.pn_claim_billing($1,$2) as result', [id, otherToken])).rows[0].result.acquired, true);
    const grants = await db.query<any>("select has_function_privilege('authenticated','public.pn_claim_billing(uuid,uuid)','EXECUTE') as allowed, has_table_privilege('anon','public.pn_billing_events','SELECT') as readable");
    assert.equal(grants.rows[0].allowed, false); assert.equal(grants.rows[0].readable, false);
    await db.query("select set_config('request.jwt.claim.role','authenticated',false)");
    await assert.rejects(db.query("update public.profiles set plan='free' where id=$1", [id]));
    await db.query("select set_config('request.jwt.claim.role','postgres',false)");
    await db.query("update public.profiles set plan='free' where id=$1",[id]);
    for (let i=0;i<5;i++) await db.query('insert into public.properties(id,user_id) values($1,$2)', [`sql-${i}`,id]);
    await assert.rejects(db.query('insert into public.properties(id,user_id) values($1,$2)', ['sql-sixth',id]));
    await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
    await db.exec('set role authenticated');
    await db.query('insert into storage.objects(id,bucket_id,owner_id) values($1,$2,$3)', [crypto.randomUUID(),'logos',id]);
    await assert.rejects(db.query('insert into storage.objects(id,bucket_id,owner_id) values($1,$2,$3)', [crypto.randomUUID(),'logos',crypto.randomUUID()]));
    await db.exec('reset role');
  } finally { await db.close(); }
});
