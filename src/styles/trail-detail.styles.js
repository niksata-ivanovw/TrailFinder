import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  map: { width: '100%', height: '100%' },
  infoCard: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.md,
    width: '90%',
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: typography.subtitle, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  stats: { fontSize: typography.small, color: colors.textSecondary },
  description: { marginTop: spacing.sm, fontSize: typography.small, color: colors.textSecondary },
  backButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  backButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  notFound: { padding: spacing.xl },
});

export default styles;
