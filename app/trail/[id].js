import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import TrailQueryState from '@/components/TrailQueryState';
import FavoriteButton from '@/components/FavoriteButton';
import HikeLogModal from '@/components/HikeLogModal';
import { fetchCompletedHikes, logCompletedHike, removeCompletedHike } from '@/data/hikes';
import { fetchTrail } from '@/data/trails';
import { getCachedFavoriteTrails } from '@/data/offlineTrailCache';
import { colors } from '@/theme';
import styles from '@/styles/trail-detail.styles';
import useFavorites from '@/hooks/useFavorites';
import { auth } from '../../firebaseConfig';

function isValidCoordinate(point) {
  return (
    Number.isFinite(point?.latitude) &&
    Number.isFinite(point?.longitude) &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  );
}

export default function TrailDetailScreen() {
  const router = useRouter();
  const { favoriteTrailIds, pendingTrailIds, loadingFavorites, favoriteError, toggleFavorite } =
    useFavorites();
  const { id } = useLocalSearchParams();
  const trailId = Array.isArray(id) ? id[0] : id;
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offlineNotice, setOfflineNotice] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loggingHike, setLoggingHike] = useState(false);
  const [showHikeLogModal, setShowHikeLogModal] = useState(false);
  const [hikeRecordIds, setHikeRecordIds] = useState([]);
  const [removingHike, setRemovingHike] = useState(false);
  const [hikeLogError, setHikeLogError] = useState(null);

  const loadTrail = useCallback(async () => {
    if (!trailId) {
      setTrail(null);
      setError('Trail not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setOfflineNotice(null);
    try {
      let fetchedTrail;
      let remoteLoadError;
      try {
        fetchedTrail = await fetchTrail(trailId);
      } catch (loadError) {
        remoteLoadError = loadError;
      }

      if (!fetchedTrail) {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const cachedTrails = await getCachedFavoriteTrails(userId);
          fetchedTrail = cachedTrails.find((cachedTrail) => cachedTrail.id === trailId);
        }
        if (!fetchedTrail && remoteLoadError) throw remoteLoadError;
        if (fetchedTrail) {
          setOfflineNotice(
            'Showing the saved offline copy. Map tiles may need an internet connection.'
          );
        }
      }
      if (
        Array.isArray(fetchedTrail?.waypoints) &&
        fetchedTrail.waypoints.some((waypoint) => !isValidCoordinate(waypoint))
      ) {
        console.warn(
          `Trail ${trailId} has waypoints with invalid coordinates; those markers were omitted.`
        );
      }
      setTrail(fetchedTrail);
      setError(null);
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const hikes = await fetchCompletedHikes(userId);
          setHikeRecordIds(hikes.filter((hike) => hike.trailId === trailId).map((hike) => hike.id));
        } catch (historyError) {
          setHikeLogError(
            historyError instanceof Error
              ? historyError.message
              : 'Unable to load your hike history.'
          );
        }
      } else {
        setHikeRecordIds([]);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this trail.');
    } finally {
      setLoading(false);
    }
  }, [trailId]);

  useEffect(() => {
    loadTrail();
  }, [loadTrail]);

  useEffect(() => {
    setHikeRecordIds([]);
    setHikeLogError(null);
  }, [trailId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    })();
  }, []);

  if (loading || error || !trail) {
    return (
      <View style={styles.statusContainer}>
        <TrailQueryState
          loading={loading}
          error={error}
          onRetry={loadTrail}
          emptyMessage="Trail not found."
        />
      </View>
    );
  }

  const coordinates = Array.isArray(trail.coordinates)
    ? trail.coordinates.filter(isValidCoordinate)
    : [];
  if (coordinates.length === 0) {
    return (
      <View style={styles.statusContainer}>
        <TrailQueryState error="This trail does not have a route yet." />
      </View>
    );
  }

  const initialRegion = {
    latitude: coordinates[0].latitude,
    longitude: coordinates[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  const waypoints = Array.isArray(trail.waypoints) ? trail.waypoints.filter(isValidCoordinate) : [];

  const handleLogHike = async ({ notes, rating }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setHikeLogError('Sign in to save this hike to your history.');
      return;
    }

    setLoggingHike(true);
    setHikeLogError(null);
    try {
      const hike = await logCompletedHike(userId, trail, { notes, rating });
      setHikeRecordIds((currentIds) => [hike.id, ...currentIds]);
      setShowHikeLogModal(false);
    } catch (logError) {
      setHikeLogError(logError instanceof Error ? logError.message : 'Unable to save this hike.');
    } finally {
      setLoggingHike(false);
    }
  };

  const handleRemoveHike = async () => {
    const userId = auth.currentUser?.uid;
    const hikeRecordId = hikeRecordIds[0];
    if (!userId || !hikeRecordId) {
      setHikeLogError('Sign in to remove this hike from your history.');
      return;
    }

    setRemovingHike(true);
    setHikeLogError(null);
    try {
      await removeCompletedHike(userId, hikeRecordId);
      setHikeRecordIds((currentIds) => currentIds.filter((id) => id !== hikeRecordId));
    } catch (removeError) {
      setHikeLogError(
        removeError instanceof Error ? removeError.message : 'Unable to remove this hike.'
      );
    } finally {
      setRemovingHike(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={hasLocationPermission} // Shows the blue dot if allowed
      >
        {/* Draw the route */}
        <Polyline coordinates={coordinates} strokeColor={colors.mapRoute} strokeWidth={4} />

        {/* Plot Waypoints */}
        {waypoints.map((poi, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.title}
            description={poi.type}
            pinColor={
              index === 0
                ? 'green'
                : index === waypoints.length - 1
                  ? 'red'
                  : poi.type === 'trailhead'
                    ? 'green'
                    : 'red'
            }
          />
        ))}
      </MapView>

      {/* Floating Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{trail.name}</Text>
          <FavoriteButton
            trail={trail}
            isFavorite={favoriteTrailIds.has(trail.id)}
            pending={loadingFavorites || pendingTrailIds.has(trail.id)}
            onToggle={toggleFavorite}
          />
        </View>
        {offlineNotice ? <Text style={styles.offlineNotice}>{offlineNotice}</Text> : null}
        {favoriteError ? <Text style={styles.favoriteError}>{favoriteError}</Text> : null}
        <Text style={styles.stats}>
          {trail.difficulty} • {trail.distanceMiles} mi
          {trail.elevationGainFt == null ? '' : ` • ${trail.elevationGainFt} ft gain`}
        </Text>
        {(trail.description || trail.location || trail.surfaceType) && (
          <Text style={styles.description}>
            {[trail.description, trail.location, trail.surfaceType].filter(Boolean).join(' • ')}
          </Text>
        )}
        {hikeLogError && !showHikeLogModal ? (
          <Text style={styles.hikeLogError}>{hikeLogError}</Text>
        ) : null}
        {hikeRecordIds.length > 0 ? (
          <>
            <Text style={styles.hikeLogSuccess}>
              {hikeRecordIds.length === 1
                ? '1 hike logged for this trail.'
                : `${hikeRecordIds.length} hikes logged for this trail.`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: removingHike }}
              style={[styles.removeHikeButton, removingHike && styles.logHikeButtonDisabled]}
              onPress={handleRemoveHike}
              disabled={removingHike}
            >
              <Text style={styles.removeHikeButtonText}>
                {removingHike ? 'Removing hike...' : 'Remove hike'}
              </Text>
            </Pressable>
          </>
        ) : null}
        <Pressable
          accessibilityRole="button"
          style={styles.logHikeButton}
          onPress={() => {
            setHikeLogError(null);
            setShowHikeLogModal(true);
          }}
        >
          <Text style={styles.logHikeButtonText}>
            {hikeRecordIds.length > 0 ? 'Log another hike' : 'Mark as hiked'}
          </Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
      <HikeLogModal
        visible={showHikeLogModal}
        title="Log a hike"
        trailName={trail.name}
        submitLabel="Save hike"
        saving={loggingHike}
        error={hikeLogError}
        onClose={() => setShowHikeLogModal(false)}
        onSubmit={handleLogHike}
      />
    </View>
  );
}
