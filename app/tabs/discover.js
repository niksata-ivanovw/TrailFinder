import { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import TrailCard from '@/components/TrailCard';
import { dummyTrails } from '@/data/dummyTrails';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Expert'];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTrails = dummyTrails.filter(trail => {
    const matchesSearch = trail.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || trail.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trails..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterRow}>
          {DIFFICULTIES.map(diff => (
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
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TrailCard trail={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, backgroundColor: '#fff', paddingBottom: 12 },
  searchInput: {
    backgroundColor: '#F0F2F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F0F2F5',
  },
  activeChip: { backgroundColor: '#2E7D32' },
  filterText: { color: '#666', fontSize: 14, fontWeight: '500' },
  activeText: { color: '#fff' },
  listContent: { padding: 16 },
});
