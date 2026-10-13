import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export default function TrailQueryState({ loading, error, onRetry, emptyMessage }) {
  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Loading trails...</Text>
        </>
      ) : (
        <>
          <Text style={[styles.message, error && styles.error]}>{error || emptyMessage}</Text>
          {error && onRetry && (
            <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  error: { color: colors.danger },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: { color: colors.textOnPrimary, fontWeight: '600' },
});
