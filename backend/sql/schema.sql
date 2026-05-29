create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  credits integer not null default 0,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  target_username text not null,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists analyses_user_id_idx on analyses(user_id);
