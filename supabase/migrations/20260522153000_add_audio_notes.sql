alter table public.notes
alter column content_html drop not null;

alter table public.notes
drop constraint if exists notes_type_check;

alter table public.notes
add constraint notes_type_check check (type in ('text', 'audio'));

alter table public.notes
add column if not exists audio_url text,
add column if not exists audio_duration_seconds integer check (audio_duration_seconds is null or audio_duration_seconds >= 0);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'notes-audio',
  'notes-audio',
  true,
  52428800,
  array['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/aac']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view notes audio" on storage.objects;
create policy "Public can view notes audio"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'notes-audio');

drop policy if exists "Public can upload notes audio" on storage.objects;
create policy "Public can upload notes audio"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'notes-audio');

drop policy if exists "Public can delete notes audio" on storage.objects;
create policy "Public can delete notes audio"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'notes-audio');
