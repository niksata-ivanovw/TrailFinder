import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { fetchFavoriteTrails, removeFavoriteTrail, saveFavoriteTrail } from '@/data/favorites';
import {
  cacheFavoriteTrails,
  getCachedFavoriteTrails,
  removeCachedFavoriteTrail,
  updateCachedFavoriteTrail,
} from '@/data/offlineTrailCache';

export default function useFavorites() {
  const [favoriteTrails, setFavoriteTrails] = useState([]);
  const [favoriteTrailIds, setFavoriteTrailIds] = useState(() => new Set());
  const [pendingTrailIds, setPendingTrailIds] = useState(() => new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [favoriteError, setFavoriteError] = useState(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFavorites = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setFavoriteTrails([]);
          setFavoriteTrailIds(new Set());
          setFavoriteError(null);
          setLoadingFavorites(false);
          return;
        }

        setLoadingFavorites(true);
        setFavoriteError(null);
        let cachedTrails = [];
        try {
          cachedTrails = await getCachedFavoriteTrails(userId);
          if (isActive && cachedTrails.length > 0) {
            setFavoriteTrails(cachedTrails);
            setFavoriteTrailIds(new Set(cachedTrails.map((trail) => trail.id)));
          }
        } catch (cacheError) {
          if (isActive) {
            setFavoriteError(
              cacheError instanceof Error
                ? cacheError.message
                : 'Unable to read your saved trail cache.'
            );
          }
        }

        try {
          const favorites = await fetchFavoriteTrails(userId);
          const cachedTrailsById = new Map(cachedTrails.map((trail) => [trail.id, trail]));
          const favoritesWithCachedRoutes = favorites.map((favorite) => {
            const cachedTrail = cachedTrailsById.get(favorite.id);
            if (!cachedTrail) return favorite;
            return {
              ...cachedTrail,
              ...favorite,
              coordinates:
                Array.isArray(favorite.coordinates) && favorite.coordinates.length > 0
                  ? favorite.coordinates
                  : cachedTrail.coordinates,
              waypoints:
                Array.isArray(favorite.waypoints) && favorite.waypoints.length > 0
                  ? favorite.waypoints
                  : cachedTrail.waypoints,
            };
          });
          if (isActive) {
            setFavoriteTrails(favoritesWithCachedRoutes);
            setFavoriteTrailIds(new Set(favoritesWithCachedRoutes.map((trail) => trail.id)));
          }
          try {
            await cacheFavoriteTrails(userId, favoritesWithCachedRoutes);
            if (isActive) setFavoriteError(null);
          } catch (cacheError) {
            if (isActive) {
              setFavoriteError(
                `Saved trails loaded, but the offline cache could not be updated: ${
                  cacheError instanceof Error ? cacheError.message : 'Unknown cache error.'
                }`
              );
            }
          }
        } catch (loadError) {
          if (isActive) {
            setFavoriteError(
              cachedTrails.length > 0
                ? 'Unable to refresh saved trails. Showing cached copies from this device.'
                : loadError instanceof Error
                  ? loadError.message
                  : 'Unable to load your favorite trails.'
            );
          }
        } finally {
          if (isActive) {
            setLoadingFavorites(false);
          }
        }
      };

      loadFavorites();
      return () => {
        isActive = false;
      };
    }, [refreshVersion])
  );

  const refreshFavorites = useCallback(() => {
    setFavoriteError(null);
    setLoadingFavorites(true);
    setRefreshVersion((version) => version + 1);
  }, []);

  const toggleFavorite = useCallback(
    async (trail) => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setFavoriteError('Sign in to save favorite trails.');
        return;
      }
      if (!trail?.id) {
        setFavoriteError('Cannot update a favorite without a trail ID.');
        return;
      }

      setFavoriteError(null);
      setPendingTrailIds((currentIds) => new Set(currentIds).add(trail.id));
      try {
        if (favoriteTrailIds.has(trail.id)) {
          await removeFavoriteTrail(userId, trail.id);
          setFavoriteTrails((currentTrails) =>
            currentTrails.filter((favorite) => favorite.id !== trail.id)
          );
          setFavoriteTrailIds((currentIds) => {
            const nextIds = new Set(currentIds);
            nextIds.delete(trail.id);
            return nextIds;
          });
          try {
            await removeCachedFavoriteTrail(userId, trail.id);
          } catch (cacheError) {
            setFavoriteError(
              `Favorite removed online, but the offline cache could not be updated: ${
                cacheError instanceof Error ? cacheError.message : 'Unknown cache error.'
              }`
            );
          }
        } else {
          await saveFavoriteTrail(userId, trail);
          setFavoriteTrails((currentTrails) => [
            trail,
            ...currentTrails.filter((favorite) => favorite.id !== trail.id),
          ]);
          setFavoriteTrailIds((currentIds) => new Set(currentIds).add(trail.id));
          try {
            await updateCachedFavoriteTrail(userId, trail);
          } catch (cacheError) {
            setFavoriteError(
              `Favorite saved online, but the offline cache could not be updated: ${
                cacheError instanceof Error ? cacheError.message : 'Unknown cache error.'
              }`
            );
          }
        }
      } catch (toggleError) {
        setFavoriteError(
          toggleError instanceof Error ? toggleError.message : 'Unable to update your favorites.'
        );
      } finally {
        setPendingTrailIds((currentIds) => {
          const nextIds = new Set(currentIds);
          nextIds.delete(trail.id);
          return nextIds;
        });
      }
    },
    [favoriteTrailIds]
  );

  return {
    favoriteTrails,
    favoriteTrailIds,
    pendingTrailIds,
    loadingFavorites,
    favoriteError,
    refreshFavorites,
    toggleFavorite,
  };
}
