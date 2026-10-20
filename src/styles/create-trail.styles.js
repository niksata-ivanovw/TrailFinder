import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    minHeight: 40,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  pageTitle: {
    color: colors.textProfileHeading,
    fontSize: typography.heading,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  intro: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.textProfileSection,
    fontSize: typography.subtitle,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textProfileSection,
    fontSize: typography.small,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: spacing.md,
    borderWidth: 1,
    color: colors.textProfile,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: spacing.md,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  choice: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: spacing.xl,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.sm,
  },
  choiceSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  choiceText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  choiceTextSelected: {
    color: colors.primary,
  },
  routeHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  routeHeadingText: {
    flex: 1,
  },
  routeHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  clearRouteButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  clearRouteText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  mapContainer: {
    borderRadius: spacing.lg,
    height: 300,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  pointCount: {
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    left: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    position: 'absolute',
    top: spacing.sm,
  },
  pointCountText: {
    color: colors.textProfile,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
});

export default styles;
