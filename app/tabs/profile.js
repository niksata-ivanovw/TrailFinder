import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';

// TODO when opening links in profile use stack so when going back it goes back to profile instead of discover or saved.

export default function ProfileScreen() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [error, setError] = useState('');
  const user = auth.currentUser;
  const displayName = user?.displayName?.trim() || 'Trail explorer';
  const initial = (user?.displayName?.trim() || user?.email || 'T')
    .charAt(0)
    .toUpperCase();

  const handleSignOut = async () => {
    setConfirmingSignOut(false);
    setSigningOut(true);
    setError('');

    try {
      await signOut(auth);
      router.replace('/');
    } catch (err) {
      setError(err?.message || 'Unable to sign out. Please try again.');
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Modal
        animationType="fade"
        transparent
        visible={confirmingSignOut}
        onRequestClose={() => setConfirmingSignOut(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <Ionicons name="log-out-outline" size={24} color="#B42318" />
            </View>
            <Text style={styles.confirmationTitle}>Sign out?</Text>
            <Text style={styles.confirmationMessage}>
              You can sign back in to pick up where you left off.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.confirmSignOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.confirmSignOutText}>Sign out</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.cancelButton}
              onPress={() => setConfirmingSignOut(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Your profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email || 'No email address'}
            </Text>
            <View style={styles.memberBadge}>
              <Ionicons name="leaf" size={13} color="#2E7D32" />
              <Text style={styles.memberBadgeText}>TrailFinder member</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your TrailFinder</Text>
        <View style={styles.shortcutsCard}>
          <ProfileLink
            icon="bookmark-outline"
            title="Saved trails"
            subtitle="Return to your bookmarked routes"
            onPress={() => router.push('/tabs/saved')}
          />
          <View style={styles.divider} />
          <ProfileLink
            icon="compass-outline"
            title="Discover trails"
            subtitle="Find your next outdoor adventure"
            onPress={() => router.push('/tabs/discover')}
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <Ionicons name="mail-outline" size={18} color="#2E7D32" />
            </View>
            <View style={styles.accountDetails}>
              <Text style={styles.accountLabel}>Email address</Text>
              <Text style={styles.accountValue}>
                {user?.email || 'Not available'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E7D32"
              />
            </View>
            <View style={styles.accountDetails}>
              <Text style={styles.accountLabel}>Email status</Text>
              <Text style={styles.accountValue}>
                {user?.emailVerified ? 'Verified' : 'Not verified'}
              </Text>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: signingOut }}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && !signingOut && styles.signOutButtonPressed,
            signingOut && styles.signOutButtonDisabled,
          ]}
          onPress={() => setConfirmingSignOut(true)}
          disabled={signingOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#B42318" />
          <Text style={styles.signOutText}>
            {signingOut ? 'Signing out...' : 'Sign out'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileLink({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.shortcut,
        pressed && styles.shortcutPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.shortcutIcon}>
        <Ionicons name={icon} size={20} color="#2E7D32" />
      </View>
      <View style={styles.shortcutText}>
        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.shortcutSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#87928A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    color: '#1D3422',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 28,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E7F3E7',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    marginRight: 16,
    width: 64,
  },
  avatarInitial: {
    color: '#2E7D32',
    fontSize: 28,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#E1F0E1',
    fontSize: 13,
    marginBottom: 10,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  memberBadgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#34443A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  shortcutsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 26,
    paddingHorizontal: 14,
  },
  shortcut: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 76,
    paddingVertical: 12,
  },
  shortcutPressed: {
    opacity: 0.7,
  },
  shortcutIcon: {
    alignItems: 'center',
    backgroundColor: '#EEF7EE',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  shortcutText: {
    flex: 1,
  },
  shortcutTitle: {
    color: '#25352A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  shortcutSubtitle: {
    color: '#748078',
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#E9EEEA',
    height: StyleSheet.hairlineWidth,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 70,
  },
  accountIcon: {
    alignItems: 'center',
    backgroundColor: '#EEF7EE',
    borderRadius: 11,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  accountDetails: {
    flex: 1,
  },
  accountLabel: {
    color: '#748078',
    fontSize: 12,
    marginBottom: 4,
  },
  accountValue: {
    color: '#25352A',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 12,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0D8D6',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 52,
  },
  signOutButtonPressed: {
    backgroundColor: '#FFF7F6',
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: '#B42318',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 31, 20, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  confirmationCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxWidth: 360,
    padding: 24,
    width: '100%',
  },
  confirmationIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 14,
    width: 48,
  },
  confirmationTitle: {
    color: '#25352A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  confirmationMessage: {
    color: '#748078',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmSignOutButton: {
    alignItems: 'center',
    backgroundColor: '#B42318',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
    width: '100%',
  },
  confirmSignOutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 44,
    width: '100%',
  },
  cancelText: {
    color: '#34443A',
    fontSize: 14,
    fontWeight: '600',
  },
});
