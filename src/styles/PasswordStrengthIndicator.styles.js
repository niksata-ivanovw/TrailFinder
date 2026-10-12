import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  barContainer: {
    height: 6,
    backgroundColor: colors.neutral,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default styles;
