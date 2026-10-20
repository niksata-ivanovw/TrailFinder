import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoidingView: { flex: 1 },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    marginBottom: spacing.md,
    color: colors.textProfileHeading,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.searchBackground,
    padding: spacing.md,
    borderRadius: spacing.sm,
    fontSize: typography.body,
  },
  favoriteError: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontSize: typography.caption,
  },
  listContent: { padding: spacing.lg },
  emptyListContent: { flexGrow: 1 },
});

export default styles;
