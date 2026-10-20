import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { DEFAULT_TRAIL_FILTERS } from '@/utils/trailFilters';
import styles from '@/styles/trail-filter-modal.styles';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Expert'];
const DISTANCES = ['All', 'Under 5 mi', '5–10 mi', '10–20 mi', '20+ mi'];
const ELEVATIONS = ['All', 'Under 500 ft', '500–1,500 ft', '1,500–3,000 ft', '3,000+ ft'];
const FAVORITE_STATUSES = ['All', 'Saved', 'Not saved'];

function FilterOptions({ label, options, selected, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === option }}
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.option, selected === option && styles.selectedOption]}
          >
            <Text style={[styles.optionText, selected === option && styles.selectedOptionText]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function TrailFilterModal({
  visible,
  filters,
  includeFavoriteStatus = true,
  onApply,
  onClose,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    if (visible) {
      setDraftFilters({ ...filters });
    }
  }, [filters, visible]);

  const updateFilter = (key, value) => {
    setDraftFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          style={styles.backdrop}
          onPress={onClose}
        />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter trails</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDraftFilters({ ...DEFAULT_TRAIL_FILTERS })}
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FilterOptions
              label="Difficulty"
              options={DIFFICULTIES}
              selected={draftFilters.difficulty}
              onSelect={(value) => updateFilter('difficulty', value)}
            />
            <FilterOptions
              label="Distance"
              options={DISTANCES}
              selected={draftFilters.distance}
              onSelect={(value) => updateFilter('distance', value)}
            />
            <FilterOptions
              label="Elevation gain"
              options={ELEVATIONS}
              selected={draftFilters.elevation}
              onSelect={(value) => updateFilter('elevation', value)}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TextInput
                accessibilityLabel="Filter by location"
                placeholder="Enter a location..."
                value={draftFilters.location}
                onChangeText={(value) => updateFilter('location', value)}
                style={styles.locationInput}
              />
            </View>
            {includeFavoriteStatus ? (
              <FilterOptions
                label="Saved status"
                options={FAVORITE_STATUSES}
                selected={draftFilters.favoriteStatus}
                onSelect={(value) => updateFilter('favoriteStatus', value)}
              />
            ) : null}
          </ScrollView>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onApply(draftFilters)}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Show results</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
