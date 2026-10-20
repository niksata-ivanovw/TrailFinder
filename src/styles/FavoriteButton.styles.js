import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: spacing.xs,
    elevation: 3,
  },
  pressed: { opacity: 0.7 },
  pending: { opacity: 0.55 },
});

export default styles;
