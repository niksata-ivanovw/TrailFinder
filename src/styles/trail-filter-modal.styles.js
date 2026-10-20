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
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.xxl,
    borderTopRightRadius: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  title: {
    color: colors.textProfileHeading,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  resetText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.searchBackground,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '700',
  },
  locationInput: {
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.searchBackground,
    borderRadius: spacing.sm,
    fontSize: typography.small,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: spacing.md,
    backgroundColor: colors.searchBackground,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: spacing.md,
    backgroundColor: colors.primary,
  },
  applyText: {
    color: colors.textOnPrimary,
    fontSize: typography.small,
    fontWeight: '700',
  },
});

export default styles;
