import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>TrailFinder</Text>
          <Text style={styles.subtitle}>Plan your next hike and discover scenic routes.</Text>

          <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="#7E8A95" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#7E8A95" secureTextEntry />

          <Pressable style={styles.primaryButton} onPress={() => router.push('/tabs')}>
            <Text style={styles.primaryButtonText}>Log in</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 34,
    fontWeight: '800',
    color: '#1D1D1D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5F6B76',
    marginBottom: 24,
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
