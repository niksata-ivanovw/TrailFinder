import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import TrailFilterButton from '@/components/TrailFilterButton';
import TrailFilterModal from '@/components/TrailFilterModal';
import HikeLogModal from '@/components/HikeLogModal';
import { fetchCompletedHikes, removeCompletedHike, updateCompletedHike } from '@/data/hikes';
import { countActiveTrailFilters, DEFAULT_TRAIL_FILTERS, filterTrails } from '@/utils/trailFilters';
import { colors } from '@/theme';
import styles from '@/styles/myhikes.styles';

function formatCompletedDate(timestamp) {
  const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : null;
  return date
    ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently completed';
}

function getCompletedAtMillis(timestamp) {
  if (typeof timestamp?.toMillis === 'function') {
    return timestamp.toMillis();
  }
  if (typeof timestamp?.toDate === 'function') {
    return timestamp.toDate().getTime();
  }
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  return null;
}

export default function MyHikesScreen() {
  const router = useRouter();
  const [hikes, setHikes] = useState([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [filters, setFilters] = useState({ ...DEFAULT_TRAIL_FILTERS });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hikeToEdit, setHikeToEdit] = useState(null);
  const [updatingHike, setUpdatingHike] = useState(false);
  const [editError, setEditError] = useState(null);
  const [hikeToRemove, setHikeToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const loadHikes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Sign in to view your hike history.');
      }
      setHikes(await fetchCompletedHikes(userId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your hikes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHikes();
    }, [loadHikes])
  );

  const totalMiles = hikes.reduce(
    (total, hike) => total + (Number.isFinite(hike.distanceMiles) ? hike.distanceMiles : 0),
    0
  );
  const filteredHikes = filterTrails(hikes, filters);
  const sortedHikes = [...filteredHikes].sort((firstHike, secondHike) => {
    const firstDate = getCompletedAtMillis(firstHike.completedAt);
    const secondDate = getCompletedAtMillis(secondHike.completedAt);
    if (firstDate == null) return secondDate == null ? 0 : 1;
    if (secondDate == null) return -1;
    return sortNewestFirst ? secondDate - firstDate : firstDate - secondDate;
  });

  const handleRemoveHike = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !hikeToRemove) {
      setRemoveError('Sign in to remove a hike from your history.');
      return;
    }

    setRemoving(true);
    setRemoveError(null);
    try {
      await removeCompletedHike(userId, hikeToRemove.id);
      setHikes((currentHikes) => currentHikes.filter((hike) => hike.id !== hikeToRemove.id));
      setHikeToRemove(null);
    } catch (removeHikeError) {
      setRemoveError(
        removeHikeError instanceof Error ? removeHikeError.message : 'Unable to remove this hike.'
      );
    } finally {
      setRemoving(false);
    }
  };

  const handleUpdateHike = async ({ notes, rating }) => {
    const userId = auth.currentUser?.uid;
    if (!userId || !hikeToEdit) {
      setEditError('Sign in to update a hike in your history.');
      return;
    }

    setUpdatingHike(true);
    setEditError(null);
    try {
      await updateCompletedHike(userId, hikeToEdit.id, { notes, rating });
      setHikes((currentHikes) =>
        currentHikes.map((hike) =>
          hike.id === hikeToEdit.id ? { ...hike, notes: notes.trim(), rating } : hike
        )
      );
      setHikeToEdit(null);
    } catch (updateError) {
      setEditError(
        updateError instanceof Error ? updateError.message : 'Unable to update this hike.'
      );
    } finally {
      setUpdatingHike(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(hikeToRemove)}
        onRequestClose={() => {
          if (!removing) {
            setHikeToRemove(null);
            setRemoveError(null);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <Ionicons name="trash-outline" size={23} color={colors.danger} />
            </View>
            <Text style={styles.confirmationTitle}>Remove this hike?</Text>
            <Text style={styles.confirmationMessage}>
              {hikeToRemove?.trailName || 'This hike'} will be removed from your history.
            </Text>
            {removeError ? <Text style={styles.removeErrorText}>{removeError}</Text> : null}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: removing }}
              style={[styles.confirmRemoveButton, removing && styles.removeButtonDisabled]}
              onPress={handleRemoveHike}
              disabled={removing}
            >
              <Text style={styles.confirmRemoveText}>
                {removing ? 'Removing...' : 'Remove hike'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.cancelButton}
              onPress={() => {
                setHikeToRemove(null);
                setRemoveError(null);
              }}
              disabled={removing}
            >
              <Text style={styles.cancelText}>Keep hike</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        data={sortedHikes}
        keyExtractor={(hike) => hike.id}
        contentContainerStyle={[
          styles.listContent,
          filteredHikes.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadHikes(true)}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.pageTitle}>My Hikes</Text>
            <Text style={styles.subtitle}>A record of the trails you’ve explored.</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{hikes.length}</Text>
                <Text style={styles.summaryLabel}>{hikes.length === 1 ? 'HIKE' : 'HIKES'}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalMiles.toFixed(1)}</Text>
                <Text style={styles.summaryLabel}>MILES LOGGED</Text>
              </View>
            </View>
            {hikes.length > 0 ? (
              <>
                <View style={styles.sortRow}>
                  <Text style={styles.sectionTitle}>Hike history</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Sort by date added, ${
                      sortNewestFirst ? 'newest first' : 'oldest first'
                    }. Tap to reverse order.`}
                    onPress={() => setSortNewestFirst((isNewestFirst) => !isNewestFirst)}
                    style={({ pressed }) => [
                      styles.sortButton,
                      pressed && styles.sortButtonPressed,
                    ]}
                  >
                    <Ionicons
                      name={sortNewestFirst ? 'arrow-down' : 'arrow-up'}
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.sortButtonText}>
                      Date added · {sortNewestFirst ? 'Newest' : 'Oldest'}
                    </Text>
                  </Pressable>
                </View>
                <TrailFilterButton
                  count={countActiveTrailFilters(filters, false)}
                  onPress={() => setShowFilterModal(true)}
                  style={styles.filterButton}
                />
              </>
            ) : null}
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable accessibilityRole="button" onPress={() => loadHikes()}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.hikeCard}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.hikeImage} />
            ) : (
              <View style={[styles.hikeImage, styles.imagePlaceholder]}>
                <Ionicons name="trail-sign-outline" size={30} color={colors.primary} />
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.hikeDetails, pressed && styles.cardPressed]}
              onPress={() => router.push(`/trail/${item.trailId}`)}
            >
              <View style={styles.hikeDateRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.hikeDate}>{formatCompletedDate(item.completedAt)}</Text>
              </View>
              <Text style={styles.hikeName} numberOfLines={2}>
                {item.trailName || 'Completed trail'}
              </Text>
              {item.location ? (
                <Text style={styles.hikeLocation} numberOfLines={1}>
                  {item.location}
                </Text>
              ) : null}
              {item.notes ? (
                <Text style={styles.hikeNotes} numberOfLines={2}>
                  {item.notes}
                </Text>
              ) : null}
              <View style={styles.hikeMeta}>
                {item.difficulty ? (
                  <Text style={styles.hikeMetaText}>{item.difficulty}</Text>
                ) : null}
                {Number.isFinite(item.distanceMiles) ? (
                  <Text style={styles.hikeMetaText}>{item.distanceMiles} mi</Text>
                ) : null}
                {Number.isInteger(item.rating) ? (
                  <View style={styles.ratingSummary}>
                    <Ionicons name="star" size={13} color={colors.warning} />
                    <Text style={styles.hikeMetaText}>{item.rating}/5</Text>
                  </View>
                ) : null}
                <Ionicons name="chevron-forward" size={16} color={colors.textIconMuted} />
              </View>
            </Pressable>
            <View style={styles.hikeActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Edit notes and rating for ${item.trailName || 'hike'}`}
                style={({ pressed }) => [
                  styles.hikeActionButton,
                  pressed && styles.hikeActionButtonPressed,
                ]}
                onPress={() => {
                  setEditError(null);
                  setHikeToEdit(item);
                }}
              >
                <Ionicons name="create-outline" size={19} color={colors.primary} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.trailName || 'hike'} from My Hikes`}
                style={({ pressed }) => [
                  styles.hikeActionButton,
                  pressed && styles.hikeActionButtonPressed,
                ]}
                onPress={() => {
                  setRemoveError(null);
                  setHikeToRemove(item);
                }}
              >
                <Ionicons name="trash-outline" size={19} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.emptyMessage}>Loading your hikes...</Text>
            </View>
          ) : error ? null : hikes.length > 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No hikes match these filters</Text>
              <Text style={styles.emptyMessage}>
                Adjust or reset the filters to see your hikes.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="footsteps-outline" size={32} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Your trail story starts here</Text>
              <Text style={styles.emptyMessage}>
                When you finish a trail, mark it as hiked and it’ll be saved here.
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.exploreButton}
                onPress={() => router.push('/tabs/discover')}
              >
                <Text style={styles.exploreButtonText}>Explore trails</Text>
              </Pressable>
            </View>
          )
        }
      />
      <TrailFilterModal
        visible={showFilterModal}
        filters={filters}
        includeFavoriteStatus={false}
        onClose={() => setShowFilterModal(false)}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setShowFilterModal(false);
        }}
      />
      <HikeLogModal
        visible={Boolean(hikeToEdit)}
        title="Edit hike"
        trailName={hikeToEdit?.trailName || 'Completed trail'}
        initialNotes={hikeToEdit?.notes ?? ''}
        initialRating={hikeToEdit?.rating ?? null}
        submitLabel="Save changes"
        saving={updatingHike}
        error={editError}
        onClose={() => {
          if (!updatingHike) {
            setHikeToEdit(null);
            setEditError(null);
          }
        }}
        onSubmit={handleUpdateHike}
      />
    </SafeAreaView>
  );
}
