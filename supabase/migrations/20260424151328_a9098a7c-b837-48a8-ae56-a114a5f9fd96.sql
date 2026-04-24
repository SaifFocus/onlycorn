drop policy if exists "Public read videos mp4 only" on storage.objects;

create policy "Public read videos mp4 and jpg"
on storage.objects for select
using (
  bucket_id = 'videos'
  and lower(right(name, 4)) in ('.mp4', '.jpg')
);