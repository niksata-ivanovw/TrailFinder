import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from '@/styles/root-layout.styles';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.content,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="tabs" />
      </Stack>
    </SafeAreaProvider>
  );
}
