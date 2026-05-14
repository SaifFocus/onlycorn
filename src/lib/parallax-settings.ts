import { useSyncExternalStore } from "react";

export interface ParallaxOverride {
  background: number;
  foreground: number;
}

const SECTION_IDS = ["hero", "dna", "origin", "seed", "growth", "plant", "field", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];
export const PARALLAX_SECTIONS: readonly SectionId[] = SECTION_IDS;

const STORAGE_KEY = "lovable.parallax-overrides.v1";

type Store = Partial<Record<SectionId, ParallaxOverride>>;

let state: Store = load();
const listeners = new Set<() => void>();

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function setParallaxOverride(id: SectionId, value: Partial<ParallaxOverride>) {
  const prev = state[id] ?? { background: 22, foreground: 8 };
  state = { ...state, [id]: { ...prev, ...value } };
  persist();
  emit();
}

export function resetParallaxOverride(id: SectionId) {
  const next = { ...state };
  delete next[id];
  state = next;
  persist();
  emit();
}

export function resetAllParallax() {
  state = {};
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Store {
  return state;
}

export function useParallaxOverrides(): Store {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useParallaxOverride(id?: string): ParallaxOverride | undefined {
  const all = useParallaxOverrides();
  if (!id) return undefined;
  return all[id as SectionId];
}
