import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { fetchCompletedHikes } from '@/data/hikes';
import { colors } from '@/theme';
import styles from '@/styles/profile.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const [activityStats, setActivityStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [error, setError] = useState('');
  const user = auth.currentUser;
  const displayName = user?.displayName?.trim() || 'Trail explorer';
  const initial = (user?.displayName?.trim() || user?.email || 'T').charAt(0).toUpperCase();

  const loadActivityStats = useCallback(async () => {
    if (!user?.uid) {
      setActivityStats(null);
      setLoadingStats(false);
      setStatsError('Sign in to view your activity stats.');
      return;
    }

    setLoadingStats(true);
    setStatsError('');
    try {
      const hikes = await fetchCompletedHikes(user.uid);
      const ratedHikes = hikes.filter(
        (hike) => Number.isInteger(hike.rating) && hike.rating >= 1 && hike.rating <= 5
      );
      const totalDistanceMiles = hikes.reduce(
        (total, hike) => total + (Number.isFinite(hike.distanceMiles) ? hike.distanceMiles : 0),
        0
      );

      setActivityStats({
        hikeCount: hikes.length,
        trailCount: new Set(hikes.map((hike) => hike.trailId).filter(Boolean)).size,
        totalDistanceMiles,
        averageRating:
          ratedHikes.length > 0
            ? ratedHikes.reduce((total, hike) => total + hike.rating, 0) / ratedHikes.length
            : null,
      });
    } catch (loadError) {
      setStatsError(
        loadError instanceof Error ? loadError.message : 'Unable to load your activity stats.'
      );
    } finally {
      setLoadingStats(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      loadActivityStats();
    }, [loadActivityStats])
  );

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

        <Text style={styles.sectionTitle}>Your activity</Text>
        <View style={styles.activityStatsCard}>
          {loadingStats && !activityStats ? (
            <ActivityIndicator color={colors.primary} />
          ) : statsError && !activityStats ? (
            <View style={styles.statsErrorContainer}>
              <Text style={styles.statsErrorText}>{statsError}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={loadActivityStats}
                style={styles.statsRetryButton}
              >
                <Text style={styles.statsRetryText}>Try again</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ActivityStat
                icon="footsteps-outline"
                label="HIKES LOGGED"
                value={activityStats?.hikeCount ?? 0}
              />
              <ActivityStat
                icon="map-outline"
                label="TRAILS HIKED"
                value={activityStats?.trailCount ?? 0}
              />
              <ActivityStat
                icon="navigate-outline"
                label="MILES HIKED"
                value={(activityStats?.totalDistanceMiles ?? 0).toFixed(1)}
              />
              <ActivityStat
                icon="star-outline"
                label="AVERAGE RATING"
                value={
                  activityStats?.averageRating == null
                    ? '—'
                    : `${activityStats.averageRating.toFixed(1)}/5`
                }
              />
            </>
          )}
        </View>
        {statsError && activityStats ? (
          <View style={styles.statsRefreshErrorContainer}>
            <Text style={styles.statsRefreshError}>
              {statsError} Showing your last loaded stats.
            </Text>
            <Pressable accessibilityRole="button" onPress={loadActivityStats}>
              <Text style={styles.statsRetryText}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

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
              <Text style={styles.accountValue}>{user?.email || 'Not available'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
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
          <Text style={styles.signOutText}>{signingOut ? 'Signing out...' : 'Sign out'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityStat({ icon, label, value }) {
  return (
    <View style={styles.activityStat}>
      <View style={styles.activityStatIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.activityStatValue}>{value}</Text>
      <Text style={styles.activityStatLabel}>{label}</Text>
    </View>
  );
}

function ProfileLink({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
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
