import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.textOnPrimary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  count: {
    minWidth: 20,
    paddingHorizontal: spacing.xs,
    color: colors.primary,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: typography.caption,
    fontWeight: '800',
    borderRadius: 999,
    overflow: 'hidden',
  },
});

export default styles;
