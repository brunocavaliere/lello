create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  status text not null check (status in ('want_to_read', 'reading', 'completed')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_books_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_books_updated_at on public.books;

create trigger set_books_updated_at
before update on public.books
for each row
execute function public.set_books_updated_at();
