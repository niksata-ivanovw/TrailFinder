import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrailCard from '@/components/TrailCard';
import TrailQueryState from '@/components/TrailQueryState';
import useFavorites from '@/hooks/useFavorites';
import styles from '@/styles/saved.styles';

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
  const filteredTrails = favoriteTrails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
            <Text style={styles.title}>Saved trails</Text>
            <Text style={styles.subtitle}>
              {favoriteTrails.length === 1
                ? '1 trail saved for later.'
                : `${favoriteTrails.length} trails saved for later.`}
            </Text>
            <TextInput
              accessibilityLabel="Search saved trails"
              style={styles.searchInput}
              placeholder="Search trails..."
              value={searchQuery}
              onChangeText={setSearchQuery}
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
                : 'No saved trails match your search.'
            }
          />
        }
      />
    </SafeAreaView>
  );
}
