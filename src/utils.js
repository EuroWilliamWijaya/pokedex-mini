import { SPRITE_BASE_URL, ARTWORK_BASE_URL, API_BASE_URL } from "./config.js";

export function getIdFromUrl(url) {
  // url looks like "https://pokeapi.co/api/v2/pokemon/25/"
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

export const KNOWN_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

/**
 * Map a Pokémon type name to its CSS variable.
 * Falls back to --type-normal if the type is unknown.
 */
export function getTypeColor(typeName) {
  const key = KNOWN_TYPES.includes(typeName) ? typeName : "normal";
  return `var(--type-${key})`;
}

/* ======================================================
   In-memory API cache
   ====================================================== */

const apiCache = new Map();

/**
 * Fetch JSON from a URL, caching the result in memory so the same
 * endpoint is never requested twice during a session.
 * Checks response.ok and throws on failure.
 */
export async function cachedFetch(url) {
  if (apiCache.has(url)) {
    return apiCache.get(url);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  apiCache.set(url, data);
  return data;
}

/**
 * Fetch full details for a single Pokémon by name or id.
 * Results are cached in memory.
 */
export async function fetchPokemonDetails(nameOrId) {
  return cachedFetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
}