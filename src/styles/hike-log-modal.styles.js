import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    maxHeight: '88%',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.xxl,
    borderTopRightRadius: spacing.xxl,
  },
  content: {
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textProfileHeading,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  trailName: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  label: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingButton: {
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearRatingButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  clearRatingText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  notesInput: {
    minHeight: 120,
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.searchBackground,
    borderRadius: spacing.sm,
    fontSize: typography.small,
  },
  characterCount: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'right',
  },
  error: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: typography.small,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: colors.searchBackground,
    borderRadius: spacing.md,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
  },
  submitText: {
    color: colors.textOnPrimary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default styles;
