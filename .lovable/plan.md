# Move Videos to Lovable Cloud Storage

Right now all 7 videos (~82MB total) live in `public/videos/` and ship with the app bundle. That bloats the deploy, hurts cold-load, and gives no CDN-level caching control. We'll move them to a public Lovable Cloud Storage bucket and reference them by URL.

## What you'll get

- Videos served from Cloud Storage CDN (cached, range-request friendly for video streaming)
- App bundle drops from ~85MB to ~3MB
- Same lazy-load behavior in `VideoSection` — no visual change
- Easy to swap a video later without redeploying the app

## Steps

1. **Enable Lovable Cloud** on the project (one-click; no external Supabase account needed).

2. **Create a public storage bucket** `videos` via SQL migration, with RLS policies allowing public read.

3. **Upload the 7 video files** from `public/videos/` into the `videos` bucket (done by me via the storage API during the build step).

4. **Centralize video URLs** in a small helper `src/lib/videos.ts`:
   ```ts
   export const VIDEOS = {
     hero:    `${SUPABASE_URL}/storage/v1/object/public/videos/01-hero.mp4`,
     dnaStrand: `${SUPABASE_URL}/storage/v1/object/public/videos/02-dna-strand.mp4`,
     // ...etc
   };
   ```
   Using the public object URL directly (no SDK call needed at runtime) so there's zero extra JS.

5. **Replace the 8 hardcoded `/videos/...` paths** in `src/pages/Index.tsx` with `VIDEOS.xxx`. Also update the `og:image` reference in `index.html` (will switch it to a poster image path or remove — `og:image` shouldn't point at an mp4 anyway).

6. **Delete `public/videos/`** so the files no longer ship in the bundle.

## Technical notes

- Bucket is **public** — videos are non-sensitive marketing assets, and public buckets get the best CDN behavior plus simplest `<video src>` usage (no signed URLs to refresh).
- `VideoSection` already does `IntersectionObserver` lazy loading and uses `preload="metadata"` for non-hero videos, so we keep streaming benefits.
- `SUPABASE_URL` comes from the auto-generated `src/integrations/supabase/client.ts` env that Lovable Cloud creates on enable.
- No changes to `VideoSection.tsx` — it already accepts any URL via `src`.

## Files touched

- new: `supabase/migrations/<ts>_videos_bucket.sql` (create bucket + RLS)
- new: `src/lib/videos.ts` (URL map)
- edit: `src/pages/Index.tsx` (swap 8 src paths)
- edit: `index.html` (fix `og:image`)
- delete: `public/videos/*.mp4`
