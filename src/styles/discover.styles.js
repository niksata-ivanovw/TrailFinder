import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, backgroundColor: colors.surface, paddingBottom: spacing.md },
  searchInput: {
    backgroundColor: colors.searchBackground,
    padding: spacing.md,
    borderRadius: spacing.sm,
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.lg,
    backgroundColor: colors.searchBackground,
  },
  activeChip: { backgroundColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: typography.small, fontWeight: '500' },
  activeText: { color: colors.textOnPrimary },
  favoriteError: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontSize: typography.caption,
  },
  listContent: { padding: spacing.lg },
  emptyListContent: { flexGrow: 1 },
});

export default styles;
