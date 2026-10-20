import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import styles from '@/styles/TrailCard.styles';
import FavoriteButton from '@/components/FavoriteButton';

export default function TrailCard({ trail, isFavorite, favoritePending, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      <Link href={`/trail/${trail.id}`} asChild>
        <Pressable>
          <Image source={{ uri: trail.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{trail.name}</Text>
            <Text style={styles.location}>{trail.location}</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="speedometer-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{trail.difficulty}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="resize-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{trail.distanceMiles} mi</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>
                  {trail.elevationGainFt == null ? 'Not listed' : `${trail.elevationGainFt} ft`}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
      <FavoriteButton
        trail={trail}
        isFavorite={isFavorite}
        pending={favoritePending}
        onToggle={onToggleFavorite}
        style={styles.favoriteButton}
      />
    </View>
  );
}
