import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TrailCard({ trail }) {
  return (
    <Link href={`/trail/${trail.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: trail.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{trail.name}</Text>
          <Text style={styles.location}>{trail.location}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="speedometer-outline" size={16} color="#666" />
              <Text style={styles.statText}>{trail.difficulty}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="resize-outline" size={16} color="#666" />
              <Text style={styles.statText}>{trail.distanceMiles} mi</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="trending-up" size={16} color="#666" />
              <Text style={styles.statText}>{trail.elevationGainFt} ft</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  image: { width: '100%', height: 160 },
  content: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  location: { fontSize: 14, color: '#666', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: '#444', fontWeight: '500' }
});