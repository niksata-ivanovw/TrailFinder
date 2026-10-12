import { useState } from 'react';
import { View, TextInput, FlatList, Pressable, Text } from 'react-native';
import TrailCard from '@/components/TrailCard';
import { dummyTrails } from '@/data/dummyTrails';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '@/styles/discover.styles';

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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
    </SafeAreaView>
  );
}
