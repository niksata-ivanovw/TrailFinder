import { Pressable, Text } from 'react-native';
import { Funnel } from 'lucide-react-native';
import { colors } from '@/theme';
import styles from '@/styles/trail-filter-button.styles';

export default function TrailFilterButton({ count, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `Filter trails, ${count} active filters` : 'Filter trails'}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <Funnel size={18} color={colors.textOnPrimary} strokeWidth={2.5} />
      <Text style={styles.label}>Filter</Text>
      {count > 0 ? <Text style={styles.count}>{count}</Text> : null}
    </Pressable>
  );
}
