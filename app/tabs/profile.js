import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { colors } from '@/theme';
import styles from '@/styles/profile.styles';

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
              <Ionicons name="log-out-outline" size={24} color={colors.danger} />
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
              <Ionicons name="leaf" size={13} color={colors.primary} />
              <Text style={styles.memberBadgeText}>TrailFinder member</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your TrailFinder</Text>
        <View style={styles.shortcutsCard}>
          <ProfileLink
            icon="add-circle-outline"
            title="Create a private trail"
            subtitle="Plot a route and add your own trail details"
            onPress={() => router.push('/trail/create')}
          />
          <View style={styles.divider} />
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
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
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
                color={colors.primary}
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
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
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
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.shortcutText}>
        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.shortcutSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textIconMuted} />
    </Pressable>
  );
}
