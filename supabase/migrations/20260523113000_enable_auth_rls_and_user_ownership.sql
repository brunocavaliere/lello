delete from public.notes;
delete from public.books;

alter table public.books
drop column if exists progress;

alter table public.books
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.notes
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.books
alter column user_id set not null;

alter table public.notes
alter column user_id set not null;

grant select, insert, update, delete on public.books to authenticated;
grant select, insert, update, delete on public.notes to authenticated;

revoke all on public.books from anon;
revoke all on public.notes from anon;

alter table public.books enable row level security;
alter table public.notes enable row level security;

drop policy if exists "Users can read own books" on public.books;
create policy "Users can read own books"
on public.books for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own books" on public.books;
create policy "Users can create own books"
on public.books for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own books" on public.books;
create policy "Users can update own books"
on public.books for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own books" on public.books;
create policy "Users can delete own books"
on public.books for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own notes" on public.notes;
create policy "Users can read own notes"
on public.notes for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own notes" on public.notes;
create policy "Users can create own notes"
on public.notes for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.books
    where books.id = notes.book_id
      and books.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own notes" on public.notes;
create policy "Users can update own notes"
on public.notes for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.books
    where books.id = notes.book_id
      and books.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own notes" on public.notes;
create policy "Users can delete own notes"
on public.notes for delete
to authenticated
using (auth.uid() = user_id);

update storage.buckets
set public = false
where id = 'notes-audio';

drop policy if exists "Public can view notes audio" on storage.objects;
drop policy if exists "Public can upload notes audio" on storage.objects;
drop policy if exists "Public can delete notes audio" on storage.objects;

drop policy if exists "Authenticated users can read own notes audio" on storage.objects;
create policy "Authenticated users can read own notes audio"
on storage.objects for select
to authenticated
using (
  bucket_id = 'notes-audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authenticated users can upload own notes audio" on storage.objects;
create policy "Authenticated users can upload own notes audio"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'notes-audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authenticated users can delete own notes audio" on storage.objects;
create policy "Authenticated users can delete own notes audio"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'notes-audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);
