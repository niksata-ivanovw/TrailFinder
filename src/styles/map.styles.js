import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statusContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  map: { flex: 1 },
  regionBadge: {
    position: 'absolute',
    top: spacing.lg,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.15,
    shadowRadius: spacing.sm,
    elevation: 4,
  },
  regionBadgeText: { fontSize: typography.small, fontWeight: '700', color: colors.text },
  regionHint: { marginTop: spacing.xs, fontSize: typography.small, color: colors.textSecondary },
  mapAttribution: { marginTop: spacing.xs, fontSize: 10, color: colors.textSecondary },
});

export default styles;
