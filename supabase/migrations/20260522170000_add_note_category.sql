alter table public.notes
add column if not exists category text not null default 'note';

alter table public.notes
drop constraint if exists notes_category_check;

alter table public.notes
add constraint notes_category_check
check (category in ('note', 'reflection', 'quote', 'summary'));
