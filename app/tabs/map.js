import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, View } from 'react-native';
import TrailQueryState from '@/components/TrailQueryState';
import { fetchTrails } from '@/data/trails';
import { colors } from '@/theme';
import styles from '@/styles/map.styles';


function polylineColorHandler(difficulty) {
  switch (difficulty) {
    case 'Beginner':
      return colors.mapRouteBeginner;
    case 'Intermediate':
      return colors.mapRouteIntermediate;
    case 'Expert':
      return colors.mapRouteExpert;
    default:
      return colors.mapRouteBeginner;
  }
}

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

function isPointInRegion(point, region) {
  return (
    point.latitude >= region.latitude - region.latitudeDelta / 2 &&
    point.latitude <= region.latitude + region.latitudeDelta / 2 &&
    point.longitude >= region.longitude - region.longitudeDelta / 2 &&
    point.longitude <= region.longitude + region.longitudeDelta / 2
  );
}

function doesSegmentIntersectRegion(start, end, region) {
  const minLongitude = region.longitude - region.longitudeDelta / 2;
  const maxLongitude = region.longitude + region.longitudeDelta / 2;
  const minLatitude = region.latitude - region.latitudeDelta / 2;
  const maxLatitude = region.latitude + region.latitudeDelta / 2;
  const deltaLongitude = end.longitude - start.longitude;
  const deltaLatitude = end.latitude - start.latitude;
  let minProgress = 0;
  let maxProgress = 1;

  const boundaries = [
    [-deltaLongitude, start.longitude - minLongitude],
    [deltaLongitude, maxLongitude - start.longitude],
    [-deltaLatitude, start.latitude - minLatitude],
    [deltaLatitude, maxLatitude - start.latitude],
  ];

  for (const [direction, distance] of boundaries) {
    if (direction === 0) {
      if (distance < 0) return false;
      continue;
    }

    const progress = distance / direction;
    if (direction < 0) {
      minProgress = Math.max(minProgress, progress);
    } else {
      maxProgress = Math.min(maxProgress, progress);
    }

    if (minProgress > maxProgress) return false;
  }

  return true;
}

function trailIntersectsRegion(trail, region) {
  const points = trail.coordinates.filter(isValidCoordinate);
  if (points.some((point) => isPointInRegion(point, region))) return true;

  return points.some((point, index) => {
    const nextPoint = points[index + 1];
    return nextPoint && doesSegmentIntersectRegion(point, nextPoint, region);
  });
}

function getInitialRegion(trails) {
  const points = trails.flatMap((trail) => trail.coordinates.filter(isValidCoordinate));
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const latitudeSpan = Math.max(...latitudes) - Math.min(...latitudes);
  const longitudeSpan = Math.max(...longitudes) - Math.min(...longitudes);

  return {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    latitudeDelta: Math.max(latitudeSpan * 1.25, 0.03),
    longitudeDelta: Math.max(longitudeSpan * 1.25, 0.03),
  };
}

export default function MapTabScreen() {
  const router = useRouter();
  const [trails, setTrails] = useState([]);
  const [visibleRegion, setVisibleRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTrails(await fetchTrails());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load trails.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrails();
  }, [loadTrails]);

  const mappableTrails = useMemo(
    () =>
      trails.filter(
        (trail) => Array.isArray(trail.coordinates) && trail.coordinates.some(isValidCoordinate)
      ),
    [trails]
  );
  const initialRegion = useMemo(
    () => (mappableTrails.length > 0 ? getInitialRegion(mappableTrails) : null),
    [mappableTrails]
  );
  const trailsInRegion = useMemo(
    () =>
      visibleRegion
        ? mappableTrails.filter((trail) => trailIntersectsRegion(trail, visibleRegion))
        : mappableTrails,
    [mappableTrails, visibleRegion]
  );

  const openTrail = (trail) => {
    router.push({ pathname: '/trail/[id]', params: { id: trail.id } });
  };

  if (loading || error || mappableTrails.length === 0) {
    return (
      <View style={styles.statusContainer}>
        <TrailQueryState
          loading={loading}
          error={error}
          onRetry={loadTrails}
          emptyMessage="No trails with route coordinates found."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={setVisibleRegion}
      >
        {trailsInRegion.flatMap((trail) => {
          const coordinates = trail.coordinates.filter(isValidCoordinate);
          return (
            <Polyline
              key={`route-${trail.id}`}
              coordinates={coordinates}
              strokeColor={polylineColorHandler(trail.difficulty)}
              strokeWidth={4}
              tappable
              onPress={() => openTrail(trail)}
            />
          );
        })}
      </MapView>

      <View style={styles.regionBadge} pointerEvents="none">
        <Text style={styles.regionBadgeText}>
          {trailsInRegion.length === 1
            ? '1 trail in this area'
            : `${trailsInRegion.length} trails in this area`}
        </Text>
        {trailsInRegion.length === 0 && (
          <Text style={styles.regionHint}>Move the map to explore nearby trails.</Text>
        )}
        <Text style={styles.mapAttribution}>Route data © OpenStreetMap contributors (ODbL)</Text>
      </View>
    </View>
  );
}
