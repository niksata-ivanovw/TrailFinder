import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  infoCard: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: 18,
    right: 18,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  title: { fontSize: typography.subtitle, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: typography.small, color: colors.textMapSecondary, marginBottom: 14 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.textOnPrimary, fontSize: 15, fontWeight: '700' },
});

export default styles;
