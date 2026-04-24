// Cinematic background videos served from Lovable Cloud Storage (public `videos` bucket).
// Centralizing URLs here so swapping a clip never requires touching components.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const BASE = `${SUPABASE_URL}/storage/v1/object/public/videos`;

export const VIDEOS = {
  hero: `${BASE}/01-hero.mp4`,
  dnaStrand: `${BASE}/02-dna-strand.mp4`,
  dnaHelix: `${BASE}/03-dna-helix.mp4`,
  seed: `${BASE}/04-seed.mp4`,
  seedling: `${BASE}/05-seedling.mp4`,
  plant: `${BASE}/06-plant.mp4`,
  field: `${BASE}/07-field.mp4`,
} as const;

/**
 * Lightweight (1280×704, ~20–90KB) JPG posters that render instantly while the
 * matching video is lazy-loading. Same key set as VIDEOS for 1:1 pairing.
 */
// Cache-bust suffix — bump when poster files in the bucket are replaced so
// the CDN + browser fetch the new content instead of a stale cached copy.
const POSTER_V = "v=2";

export const POSTERS = {
  hero: `${BASE}/posters/01-hero.jpg?${POSTER_V}`,
  dnaStrand: `${BASE}/posters/02-dna-strand.jpg?${POSTER_V}`,
  dnaHelix: `${BASE}/posters/03-dna-helix.jpg?${POSTER_V}`,
  seed: `${BASE}/posters/04-seed.jpg?${POSTER_V}`,
  seedling: `${BASE}/posters/05-seedling.jpg?${POSTER_V}`,
  plant: `${BASE}/posters/06-plant.jpg?${POSTER_V}`,
  field: `${BASE}/posters/07-field.jpg?${POSTER_V}`,
} as const;

export type VideoKey = keyof typeof VIDEOS;
