import { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrailCard from '@/components/TrailCard';
import TrailFilterButton from '@/components/TrailFilterButton';
import TrailFilterModal from '@/components/TrailFilterModal';
import TrailQueryState from '@/components/TrailQueryState';
import useFavorites from '@/hooks/useFavorites';
import styles from '@/styles/saved.styles';
import { countActiveTrailFilters, DEFAULT_TRAIL_FILTERS, filterTrails } from '@/utils/trailFilters';

export default function SavedScreen() {
  const {
    favoriteTrails,
    favoriteTrailIds,
    pendingTrailIds,
    loadingFavorites,
    favoriteError,
    refreshFavorites,
    toggleFavorite,
  } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_TRAIL_FILTERS });
  const [showFilterModal, setShowFilterModal] = useState(false);

  const renderTrail = useCallback(
    ({ item }) => (
      <TrailCard
        trail={item}
        isFavorite={favoriteTrailIds.has(item.id)}
        favoritePending={loadingFavorites || pendingTrailIds.has(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favoriteTrailIds, loadingFavorites, pendingTrailIds, toggleFavorite]
  );
  const filteredTrails = filterTrails(
    favoriteTrails.filter((trail) => trail.name.toLowerCase().includes(searchQuery.toLowerCase())),
    filters
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={filteredTrails}
          keyExtractor={(item) => item.id}
          renderItem={renderTrail}
          contentContainerStyle={[
            styles.listContent,
            filteredTrails.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loadingFavorites} onRefresh={refreshFavorites} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.pageTitle}>Saved Trails</Text>
              <Text style={styles.subtitle}>Your bookmarked trails, ready for later.</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{favoriteTrails.length}</Text>
                  <Text style={styles.summaryLabel}>
                    {favoriteTrails.length === 1 ? 'SAVED TRAIL' : 'SAVED TRAILS'}
                  </Text>
                </View>
              </View>
              <TextInput
                accessibilityLabel="Search saved trails"
                style={styles.searchInput}
                placeholder="Search trails..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TrailFilterButton
                count={countActiveTrailFilters(filters, false)}
                onPress={() => setShowFilterModal(true)}
                style={styles.filterButton}
              />
              {favoriteError && favoriteTrails.length > 0 ? (
                <TrailQueryState error={favoriteError} onRetry={refreshFavorites} />
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <TrailQueryState
              loading={loadingFavorites}
              error={favoriteError}
              onRetry={refreshFavorites}
              emptyMessage={
                favoriteTrails.length === 0
                  ? 'No saved trails yet. Bookmark trails you want to hike later.'
                  : 'No saved trails match your search and filters.'
              }
            />
          }
        />
      </KeyboardAvoidingView>
      <TrailFilterModal
        visible={showFilterModal}
        filters={filters}
        includeFavoriteStatus={false}
        onClose={() => setShowFilterModal(false)}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setShowFilterModal(false);
        }}
      />
    </SafeAreaView>
  );
}
