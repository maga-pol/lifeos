create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text default 'Personal',
  frequency text default 'daily',
  created_at timestamptz default now()
);

create table if not exists habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null default current_date,
  created_at timestamptz default now(),
  unique (habit_id, completed_on)
);

create table if not exists sleep_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bedtime timestamptz not null,
  wake_time timestamptz not null,
  quality int check (quality between 1 and 10),
  notes text,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  category text default 'General',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  deadline date,
  progress int default 0 check (progress between 0 and 100),
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists goal_milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  priority text default 'Medium',
  completed boolean default false,
  category text default 'General',
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  category text default 'General',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table habits enable row level security;
alter table habit_completions enable row level security;
alter table sleep_entries enable row level security;
alter table notes enable row level security;
alter table goals enable row level security;
alter table goal_milestones enable row level security;
alter table tasks enable row level security;
alter table events enable row level security;

create policy "Users manage own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own habits" on habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own habit completions" on habit_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own sleep entries" on sleep_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own notes" on notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own goals" on goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own milestones" on goal_milestones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own tasks" on tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own events" on events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
