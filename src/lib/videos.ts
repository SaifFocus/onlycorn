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

export type VideoKey = keyof typeof VIDEOS;
