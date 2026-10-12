import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import LoginScreen from '@/screens/LoginScreen';

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
        <ActivityIndicator size="large" color="#2E7D32" />
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    color: '#B42318',
    fontSize: 16,
    textAlign: 'center',
  },
});
