import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import styles from '@/styles/FavoriteButton.styles';

export default function FavoriteButton({ trail, isFavorite, pending, onToggle, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? `Remove ${trail.name} from favorites` : `Add ${trail.name} to favorites`
      }
      accessibilityState={{ checked: isFavorite, disabled: pending }}
      disabled={pending}
      hitSlop={8}
      onPress={() => onToggle(trail)}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && !pending && styles.pressed,
        pending && styles.pending,
      ]}
    >
      <Ionicons
        name={isFavorite ? 'bookmark' : 'bookmark-outline'}
        size={20}
        color={isFavorite ? colors.primary : colors.textSecondary}
      />
    </Pressable>
  );
}
