import AsyncStorage from '@react-native-async-storage/async-storage';

function getCacheKey(userId) {
  if (!userId) {
    throw new Error('Sign in to access your saved trail cache.');
  }
  return `trailfinder:saved-trails:${userId}`;
}

function getOfflineTrailData(trail) {
  return {
    id: trail.id,
    name: trail.name ?? '',
    location: trail.location ?? '',
    difficulty: trail.difficulty ?? '',
    distanceMiles: Number.isFinite(trail.distanceMiles) ? trail.distanceMiles : null,
    elevationGainFt: Number.isFinite(trail.elevationGainFt) ? trail.elevationGainFt : null,
    imageUrl: trail.imageUrl ?? '',
    surfaceType: trail.surfaceType ?? '',
    description: trail.description ?? '',
    coordinates: Array.isArray(trail.coordinates) ? trail.coordinates : [],
    waypoints: Array.isArray(trail.waypoints) ? trail.waypoints : [],
  };
}

export async function getCachedFavoriteTrails(userId) {
  const cachedTrails = await AsyncStorage.getItem(getCacheKey(userId));
  if (cachedTrails == null) return [];

  let trails;
  try {
    trails = JSON.parse(cachedTrails);
  } catch {
    throw new Error('Saved trail cache is unreadable. Refresh your saved trails while online.');
  }

  if (!Array.isArray(trails) || trails.some((trail) => !trail?.id)) {
    throw new Error('Saved trail cache is invalid. Refresh your saved trails while online.');
  }
  return trails;
}

export async function cacheFavoriteTrails(userId, trails) {
  const offlineTrails = trails.filter((trail) => trail?.id).map(getOfflineTrailData);
  await AsyncStorage.setItem(getCacheKey(userId), JSON.stringify(offlineTrails));
}

export async function updateCachedFavoriteTrail(userId, trail) {
  const cachedTrails = await getCachedFavoriteTrails(userId);
  await cacheFavoriteTrails(userId, [
    getOfflineTrailData(trail),
    ...cachedTrails.filter((cachedTrail) => cachedTrail.id !== trail.id),
  ]);
}

export async function removeCachedFavoriteTrail(userId, trailId) {
  const cachedTrails = await getCachedFavoriteTrails(userId);
  await cacheFavoriteTrails(
    userId,
    cachedTrails.filter((trail) => trail.id !== trailId)
  );
}
