import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: spacing.sm,
    elevation: 3,
  },
  image: { width: '100%', height: 160 },
  content: { padding: spacing.md },
  title: { fontSize: typography.large, fontWeight: 'bold', color: colors.textDark },
  location: { fontSize: typography.small, color: colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: typography.caption, color: colors.textStrong, fontWeight: '500' },
});

export default styles;
