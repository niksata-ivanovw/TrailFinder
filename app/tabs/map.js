import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrailFilterButton from '@/components/TrailFilterButton';
import TrailFilterModal from '@/components/TrailFilterModal';
import TrailQueryState from '@/components/TrailQueryState';
import FavoriteButton from '@/components/FavoriteButton';
import { fetchTrails } from '@/data/trails';
import { colors, spacing } from '@/theme';
import styles from '@/styles/map.styles';
import useFavorites from '@/hooks/useFavorites';
import { countActiveTrailFilters, DEFAULT_TRAIL_FILTERS, filterTrails } from '@/utils/trailFilters';

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
  const insets = useSafeAreaInsets();
  const { favoriteTrailIds, pendingTrailIds, loadingFavorites, favoriteError, toggleFavorite } =
    useFavorites();
  const [trails, setTrails] = useState([]);
  const [visibleRegion, setVisibleRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTrailDetailsModal, setShowTrailDetailsModal] = useState(false);
  const [filters, setFilters] = useState({ ...DEFAULT_TRAIL_FILTERS });
  const [selectedTrailId, setSelectedTrailId] = useState(null);

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
  const filteredMappableTrails = useMemo(
    () => filterTrails(mappableTrails, filters, favoriteTrailIds),
    [favoriteTrailIds, filters, mappableTrails]
  );
  const trailsInRegion = useMemo(
    () =>
      visibleRegion
        ? filteredMappableTrails.filter((trail) => trailIntersectsRegion(trail, visibleRegion))
        : filteredMappableTrails,
    [filteredMappableTrails, visibleRegion]
  );
  const selectedTrail = mappableTrails.find((trail) => trail.id === selectedTrailId);
  const selectedTrailCoordinates = selectedTrail?.coordinates.filter(isValidCoordinate) ?? [];
  const fallbackCoordinate = mappableTrails[0]?.coordinates.find(isValidCoordinate);
  const isSelectedTrailVisible = Boolean(
    selectedTrail && filteredMappableTrails.some((trail) => trail.id === selectedTrail.id)
  );

  const highlightSelectedTrailHandler = (trailId, showDetails = true) => {
    const trail = mappableTrails.find((item) => item.id === trailId);
    if (trail && !trail.coordinates.some(isValidCoordinate)) {
      console.warn('Selected trail has no valid coordinates to fit the map region.');
    }

    setSelectedTrailId(trail?.id ?? null);
    setShowTrailDetailsModal(showDetails && Boolean(trail));
  };

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
        initialRegion={visibleRegion ?? initialRegion}
        onRegionChangeComplete={setVisibleRegion}
      >
        {mappableTrails.map((trail) => {
          const coordinates = trail.coordinates.filter(isValidCoordinate);
          const isVisible = filteredMappableTrails.some((item) => item.id === trail.id);

          return (
            <Polyline
              key={`route-${trail.id}`}
              coordinates={coordinates}
              strokeColor={isVisible ? polylineColorHandler(trail.difficulty) : 'transparent'}
              strokeWidth={isVisible ? 4 : 0}
              tappable={isVisible}
              onPress={() => highlightSelectedTrailHandler(trail.id)}
            />
          );
        })}
        <Polyline
          key="selected-trail-highlight"
          coordinates={
            selectedTrailCoordinates.length ? selectedTrailCoordinates : [fallbackCoordinate]
          }
          strokeColor={isSelectedTrailVisible ? colors.surface : 'transparent'}
          strokeWidth={isSelectedTrailVisible ? 10 : 0}
          tappable={false}
        />
        <Polyline
          key="selected-trail-route"
          coordinates={
            selectedTrailCoordinates.length ? selectedTrailCoordinates : [fallbackCoordinate]
          }
          strokeColor={
            isSelectedTrailVisible ? polylineColorHandler(selectedTrail.difficulty) : 'transparent'
          }
          strokeWidth={isSelectedTrailVisible ? 6 : 0}
          tappable={false}
        />
        <Marker
          coordinate={selectedTrailCoordinates[0] ?? fallbackCoordinate}
          opacity={isSelectedTrailVisible ? 1 : 0}
          anchor={{ x: 0.5, y: 1 }}
          title="Trail start"
          pinColor="green"
        />
        <Marker
          coordinate={
            selectedTrailCoordinates[selectedTrailCoordinates.length - 1] ?? fallbackCoordinate
          }
          opacity={isSelectedTrailVisible ? 1 : 0}
          anchor={{ x: 0.5, y: 1 }}
          title="Trail end"
          pinColor="red"
        />
      </MapView>

      <View style={[styles.regionBadge, { top: insets.top + spacing.lg }]} pointerEvents="none">
        <Text style={styles.regionBadgeText}>
          {trailsInRegion.length === 1
            ? '1 trail in this area'
            : `${trailsInRegion.length} trails in this area`}
        </Text>
        {trailsInRegion.length === 0 && (
          <Text style={styles.regionHint}>Move the map to explore nearby trails.</Text>
        )}
      </View>
      <TrailFilterButton
        count={countActiveTrailFilters(filters)}
        style={[styles.filterButton, { bottom: insets.bottom + spacing.lg }]}
        onPress={() => setShowFilterModal(true)}
      />
      <TrailFilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setShowFilterModal(false);
        }}
      />

      {showTrailDetailsModal && (
        <View
          pointerEvents="box-none"
          style={[styles.trailDetailsModalOverlay, { paddingBottom: insets.bottom + spacing.sm }]}
        >
          <View style={styles.trailDetailsModalCard}>
            <View style={styles.trailDetailsModalHandle} />
            <View style={styles.trailDetailsHeader}>
              <View style={styles.trailDetailsTitleContainer}>
                <Text style={styles.trailDetailsTitle} numberOfLines={2}>
                  {selectedTrail.name}
                </Text>
              </View>
              <FavoriteButton
                trail={selectedTrail}
                isFavorite={favoriteTrailIds.has(selectedTrail.id)}
                pending={loadingFavorites || pendingTrailIds.has(selectedTrail.id)}
                onToggle={toggleFavorite}
              />
              <View
                style={[
                  styles.trailDetailsDifficultyBadge,
                  { borderColor: polylineColorHandler(selectedTrail.difficulty) },
                ]}
              >
                <Text
                  style={[
                    styles.trailDetailsDifficultyText,
                    { color: polylineColorHandler(selectedTrail.difficulty) },
                  ]}
                >
                  {selectedTrail.difficulty}
                </Text>
              </View>
            </View>
            {favoriteError ? <Text style={styles.favoriteError}>{favoriteError}</Text> : null}
            {selectedTrail.location ? (
              <Text style={styles.trailDetailsLocation} numberOfLines={2}>
                {selectedTrail.location}
              </Text>
            ) : null}
            <View style={styles.trailDetailsStats}>
              <View style={styles.trailDetailsStat}>
                <Text style={styles.trailDetailsStatLabel}>DISTANCE</Text>
                <Text style={styles.trailDetailsStatValue}>
                  {selectedTrail.distanceMiles ?? '—'} mi
                </Text>
              </View>
              <View style={styles.trailDetailsStatDivider} />
              <View style={styles.trailDetailsStat}>
                <Text style={styles.trailDetailsStatLabel}>ELEVATION GAIN</Text>
                <Text style={styles.trailDetailsStatValue}>
                  {selectedTrail.elevationGainFt == null
                    ? '—'
                    : `${selectedTrail.elevationGainFt} ft`}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.trailDetailsPrimaryButton,
                pressed && styles.trailDetailsButtonPressed,
              ]}
              onPress={() => {
                openTrail(selectedTrail);
              }}
            >
              <Text style={styles.trailDetailsPrimaryButtonText}>See full trail details</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.trailDetailsSecondaryButton,
                pressed && styles.trailDetailsButtonPressed,
              ]}
              onPress={() => {
                highlightSelectedTrailHandler(null, false);
              }}
            >
              <Text style={styles.trailDetailsSecondaryButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
