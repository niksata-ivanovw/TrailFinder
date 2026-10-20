export const DEFAULT_TRAIL_FILTERS = {
  difficulty: 'All',
  distance: 'All',
  elevation: 'All',
  location: '',
  favoriteStatus: 'All',
};

const DISTANCE_RANGES = {
  'Under 5 mi': [null, 5],
  '5–10 mi': [5, 10],
  '10–20 mi': [10, 20],
  '20+ mi': [20, null],
};

const ELEVATION_RANGES = {
  'Under 500 ft': [null, 500],
  '500–1,500 ft': [500, 1500],
  '1,500–3,000 ft': [1500, 3000],
  '3,000+ ft': [3000, null],
};

function matchesRange(value, range) {
  if (value == null || value === '') return false;
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return false;
  const [minimum, maximum] = range;
  return (
    (minimum == null || numericValue >= minimum) && (maximum == null || numericValue < maximum)
  );
}

export function filterTrails(trails, filters, favoriteTrailIds = new Set()) {
  const locationQuery = filters.location.trim().toLowerCase();
  const distanceRange = DISTANCE_RANGES[filters.distance];
  const elevationRange = ELEVATION_RANGES[filters.elevation];

  return trails.filter((trail) => {
    if (filters.difficulty !== 'All' && trail.difficulty !== filters.difficulty) return false;
    if (
      locationQuery &&
      !String(trail.location ?? '')
        .toLowerCase()
        .includes(locationQuery)
    ) {
      return false;
    }
    if (distanceRange && !matchesRange(trail.distanceMiles, distanceRange)) return false;
    if (elevationRange && !matchesRange(trail.elevationGainFt, elevationRange)) return false;
    if (filters.favoriteStatus === 'Saved' && !favoriteTrailIds.has(trail.id)) return false;
    if (filters.favoriteStatus === 'Not saved' && favoriteTrailIds.has(trail.id)) return false;
    return true;
  });
}

export function countActiveTrailFilters(filters, includeFavoriteStatus = true) {
  return [
    filters.difficulty !== 'All',
    filters.distance !== 'All',
    filters.elevation !== 'All',
    Boolean(filters.location.trim()),
    includeFavoriteStatus && filters.favoriteStatus !== 'All',
  ].filter(Boolean).length;
}
