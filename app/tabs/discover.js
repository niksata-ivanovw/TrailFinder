import { useCallback, useEffect, useState } from 'react';
import { View, TextInput, FlatList, Pressable, Text, RefreshControl } from 'react-native';
import TrailCard from '@/components/TrailCard';
import TrailQueryState from '@/components/TrailQueryState';
import { fetchTrails } from '@/data/trails';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '@/styles/discover.styles';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Expert'];

export default function DiscoverScreen() {
  const [trails, setTrails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
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

  const filteredTrails = trails.filter((trail) => {
    const matchesSearch = trail.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || trail.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trails..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterRow}>
          {DIFFICULTIES.map((diff) => (
            <Pressable
              key={diff}
              style={[styles.filterChip, activeFilter === diff && styles.activeChip]}
              onPress={() => setActiveFilter(diff)}
            >
              <Text style={[styles.filterText, activeFilter === diff && styles.activeText]}>
                {diff}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrailCard trail={item} />}
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
    </SafeAreaView>
  );
}
