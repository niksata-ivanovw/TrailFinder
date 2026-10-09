import { Link } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { dummyTrails } from '@/data/dummyTrails';

export default function MapTabScreen() {
  const trail = dummyTrails[0];

  if (!trail) {
    return null;
  }

  const initialRegion = {
    latitude: trail.coordinates[0].latitude,
    longitude: trail.coordinates[0].longitude,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  };

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion}>
        <Polyline coordinates={trail.coordinates} strokeColor="#2E7D32" strokeWidth={4} />
        {trail.waypoints?.map((poi, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.title}
            description={poi.type}
            pinColor={poi.type === 'trailhead' ? 'green' : 'red'}
          />
        ))}
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.subtitle}>
          {trail.difficulty} • {trail.distanceMiles} mi • {trail.elevationGainFt} ft gain
        </Text>

        <Link href={`/trail/${trail.id}`} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>View trail</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  map: { flex: 1 },
  infoCard: {
    position: 'absolute',
    bottom: 28,
    left: 18,
    right: 18,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1D1D1D', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#576675', marginBottom: 14 },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
