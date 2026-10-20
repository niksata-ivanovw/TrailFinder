import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  title: {
    fontSize: typography.large,
    fontWeight: 'bold',
    color: colors.textProfileHeading,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  searchInput: {
    marginTop: spacing.md,
    backgroundColor: colors.searchBackground,
    padding: spacing.md,
    borderRadius: spacing.sm,
    fontSize: typography.body,
  },
});

export default styles;
