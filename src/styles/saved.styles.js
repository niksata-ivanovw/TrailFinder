import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  pageTitle: {
    color: colors.textProfileHeading,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  summaryLabel: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchInput: {
    marginTop: spacing.md,
    backgroundColor: colors.searchBackground,
    padding: spacing.md,
    borderRadius: spacing.sm,
    fontSize: typography.body,
  },
  filterButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
});

export default styles;
