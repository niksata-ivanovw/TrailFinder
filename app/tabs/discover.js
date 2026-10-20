import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import TrailCard from '@/components/TrailCard';
import TrailFilterButton from '@/components/TrailFilterButton';
import TrailFilterModal from '@/components/TrailFilterModal';
import TrailQueryState from '@/components/TrailQueryState';
import { fetchTrails } from '@/data/trails';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '@/styles/discover.styles';
import useFavorites from '@/hooks/useFavorites';
import { countActiveTrailFilters, DEFAULT_TRAIL_FILTERS, filterTrails } from '@/utils/trailFilters';

export default function DiscoverScreen() {
  const { favoriteTrailIds, pendingTrailIds, loadingFavorites, favoriteError, toggleFavorite } =
    useFavorites();
  const [trails, setTrails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_TRAIL_FILTERS });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadTrails = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setTrails(await fetchTrails());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load trails.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTrails();
  }, [loadTrails]);

  const filteredTrails = filterTrails(
    trails.filter((trail) => trail.name.toLowerCase().includes(searchQuery.toLowerCase())),
    filters,
    favoriteTrailIds
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Discover</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search trails..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TrailFilterButton
              count={countActiveTrailFilters(filters)}
              onPress={() => setShowFilterModal(true)}
            />
          </View>
          {favoriteError ? <Text style={styles.favoriteError}>{favoriteError}</Text> : null}
        </View>
        <TrailFilterModal
          visible={showFilterModal}
          filters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={(nextFilters) => {
            setFilters(nextFilters);
            setShowFilterModal(false);
          }}
        />

        <FlatList
          data={filteredTrails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrailCard
              trail={item}
              isFavorite={favoriteTrailIds.has(item.id)}
              favoritePending={loadingFavorites || pendingTrailIds.has(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredTrails.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadTrails(true)} />
          }
          ListHeaderComponent={
            error && trails.length > 0 ? (
              <TrailQueryState error={error} onRetry={() => loadTrails()} />
            ) : null
          }
          ListEmptyComponent={
            <TrailQueryState
              loading={loading}
              error={trails.length === 0 ? error : null}
              onRetry={() => loadTrails()}
              emptyMessage={
                trails.length === 0 ? 'No trails found.' : 'No trails match your filters.'
              }
            />
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
