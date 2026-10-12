import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  notFound: { padding: spacing.xl },
});

export default styles;
