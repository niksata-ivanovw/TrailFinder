import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import LoginScreen from '@/screens/LoginScreen';
import { colors } from '@/theme';
import styles from '@/styles/index.styles';

export default function IndexScreen() {
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      user => setAuthStatus(user ? 'signed-in' : 'signed-out'),
      error => {
        console.error('Failed to restore Firebase authentication state.', error);
        setAuthStatus('error');
      },
    );
  }, []);

  if (authStatus === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (authStatus === 'error') {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>
          Unable to restore your sign-in session. Please restart the app and try again.
        </Text>
      </View>
    );
  }

  if (authStatus === 'signed-in') {
    return <Redirect href="/tabs" />;
  }

  return <LoginScreen />;
}
