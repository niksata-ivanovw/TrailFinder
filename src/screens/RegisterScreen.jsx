import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert, KeyboardAvoidingView, Pressable, Text, TextInput, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { colors } from '@/theme';
import styles from '@/styles/RegisterScreen.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!password || !confirmPassword) {
      setShowError(false);
      return;
    }

    const timer = setTimeout(() => {
      if (password !== confirmPassword) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user } =await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/tabs');

      // await updateProfile(user, {
      // displayName: fullName.trim(),
      //   });
      // TODO: Add user profile update to include full name after registration; swiping back can lead to authFlow 
    } catch (err) {
      const message = err?.message || 'Unable to create account. Please try again.';
      setError(message); 
      //TODO replace firebase pop-up with custom alert
      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Create account</Text>
        <Text style={styles.title}>Join TrailFinder</Text>

        <KeyboardAvoidingView behavior="padding">
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={colors.inputPlaceholder}
            keyboardType="email-address"
            value={fullName}
            onChangeText={setFullName}
          />
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
          <PasswordStrengthIndicator password={password} />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={colors.inputPlaceholder}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {showError && (
            <Text style={styles.passwordMismatch}>
            Passwords do not match.
            </Text>
          )}
          
        </KeyboardAvoidingView>

        <Pressable style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back('/')}>
          <Text style={styles.secondaryButtonText}>Already have an account?</Text>
        </Pressable>
      </View>
    </View>
  );
}
