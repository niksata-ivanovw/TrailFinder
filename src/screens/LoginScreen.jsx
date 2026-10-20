import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { colors } from '@/theme';
import styles from '@/styles/LoginScreen.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/tabs');
    } catch (err) {
      const message = err?.message || 'Unable to sign in. Please try again.';
      setError(message);
      //TODO replace firebase pop-up with custom alert
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>TrailFinder</Text>
          <Text style={styles.subtitle}>Plan your next hike and discover scenic routes.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.inputPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.inputPlaceholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
