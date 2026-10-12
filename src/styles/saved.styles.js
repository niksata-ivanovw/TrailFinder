import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: typography.large,
    fontWeight: 'bold',
    color: colors.textDark,
  },
});

export default styles;
