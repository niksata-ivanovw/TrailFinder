import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.authBackground,
    padding: spacing.xxl,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: spacing.xl,
    padding: spacing.xxxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.textAuthSecondary,
    marginBottom: spacing.xxl,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    marginBottom: spacing.md,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.md,
  },
});

export default styles;
