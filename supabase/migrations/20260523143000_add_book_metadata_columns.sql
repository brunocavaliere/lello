alter table public.books
add column if not exists description text,
add column if not exists cover_url text,
add column if not exists publisher text,
add column if not exists published_at text;
