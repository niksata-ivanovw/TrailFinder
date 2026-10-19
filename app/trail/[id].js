import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import TrailQueryState from '@/components/TrailQueryState';
import { logCompletedHike } from '@/data/hikes';
import { fetchTrail } from '@/data/trails';
import { colors } from '@/theme';
import styles from '@/styles/trail-detail.styles';
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
  const { id } = useLocalSearchParams();
  const trailId = Array.isArray(id) ? id[0] : id;
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loggingHike, setLoggingHike] = useState(false);
  const [hikeLogged, setHikeLogged] = useState(false);
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
    try {
      const fetchedTrail = await fetchTrail(trailId);
      if (
        Array.isArray(fetchedTrail?.waypoints) &&
        fetchedTrail.waypoints.some((waypoint) => !isValidCoordinate(waypoint))
      ) {
        console.warn(
          `Trail ${trailId} has waypoints with invalid coordinates; those markers were omitted.`
        );
      }
      setTrail(fetchedTrail);
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
    setHikeLogged(false);
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

  const handleLogHike = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setHikeLogError('Sign in to save this hike to your history.');
      return;
    }

    setLoggingHike(true);
    setHikeLogError(null);
    try {
      await logCompletedHike(userId, trail);
      setHikeLogged(true);
    } catch (logError) {
      setHikeLogError(logError instanceof Error ? logError.message : 'Unable to save this hike.');
    } finally {
      setLoggingHike(false);
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
        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.stats}>
          {trail.difficulty} • {trail.distanceMiles} mi
          {trail.elevationGainFt == null ? '' : ` • ${trail.elevationGainFt} ft gain`}
        </Text>
        {(trail.description || trail.location || trail.surfaceType) && (
          <Text style={styles.description}>
            {[trail.description, trail.location, trail.surfaceType].filter(Boolean).join(' • ')}
          </Text>
        )}
        {hikeLogError ? <Text style={styles.hikeLogError}>{hikeLogError}</Text> : null}
        {hikeLogged ? <Text style={styles.hikeLogSuccess}>Hike added to My Hikes.</Text> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: loggingHike || hikeLogged }}
          style={[
            styles.logHikeButton,
            (loggingHike || hikeLogged) && styles.logHikeButtonDisabled,
          ]}
          onPress={handleLogHike}
          disabled={loggingHike || hikeLogged}
        >
          <Text style={styles.logHikeButtonText}>
            {loggingHike ? 'Saving hike...' : hikeLogged ? 'Hike logged' : 'Mark as hiked'}
          </Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
