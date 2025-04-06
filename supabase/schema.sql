-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar text,
  gender text,
  country text,
  interests text[],
  is_premium boolean default false,
  ghost_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat rooms table
create table public.chat_rooms (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  unique(user1_id, user2_id)
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reports table
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) not null,
  reported_id uuid references public.profiles(id) not null,
  reason text not null,
  description text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create premium subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null,
  plan text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view their own chat rooms"
  on public.chat_rooms for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "Users can view messages in their chat rooms"
  on public.messages for select
  using (
    exists (
      select 1 from public.chat_rooms
      where id = room_id
      and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

create policy "Users can insert their own reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index profiles_username_idx on public.profiles(username);
create index chat_rooms_user1_id_idx on public.chat_rooms(user1_id);
create index chat_rooms_user2_id_idx on public.chat_rooms(user2_id);
create index messages_room_id_idx on public.messages(room_id);
create index messages_created_at_idx on public.messages(created_at);
create index reports_reported_id_idx on public.reports(reported_id);
create index subscriptions_user_id_idx on public.subscriptions(user_id);

-- Set up realtime for chat messages
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.chat_rooms; 