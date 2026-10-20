import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { fetchFavoriteTrails, removeFavoriteTrail, saveFavoriteTrail } from '@/data/favorites';

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
        try {
          const favorites = await fetchFavoriteTrails(userId);
          if (isActive) {
            setFavoriteTrails(favorites);
            setFavoriteTrailIds(new Set(favorites.map((trail) => trail.id)));
          }
        } catch (loadError) {
          if (isActive) {
            setFavoriteError(
              loadError instanceof Error
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
        } else {
          await saveFavoriteTrail(userId, trail);
          setFavoriteTrails((currentTrails) => [
            trail,
            ...currentTrails.filter((favorite) => favorite.id !== trail.id),
          ]);
          setFavoriteTrailIds((currentIds) => new Set(currentIds).add(trail.id));
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
