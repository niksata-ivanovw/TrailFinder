import { useRouter } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user } =await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/tabs');

      await updateProfile(user, {
      displayName: fullName.trim(),
        });
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
            placeholderTextColor="#7E8A95"
            keyboardType="email-address"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#7E8A95"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7E8A95"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {/* <TextInput style={styles.input} placeholder="Confirm password" placeholderTextColor="#7E8A95" secureTextEntry />
          TODO Add password strength indicator */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF7EE',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  eyebrow: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1D1D1D',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E6EBF0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#1D1D1D',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '700',
  },
});
