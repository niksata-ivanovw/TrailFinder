import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { dummyTrails } from '@/data/dummyTrails';

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams();
  const trail = dummyTrails.find(t => t.id === id);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    })();
  }, []);

  if (!trail) return <Text style={{ padding: 20 }}>Trail not found.</Text>;

  // Calculate the center of the map based on the first coordinate
  const initialRegion = {
    latitude: trail.coordinates[0].latitude,
    longitude: trail.coordinates[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map} 
        initialRegion={initialRegion}
        showsUserLocation={hasLocationPermission} // Shows the blue dot if allowed
      >
        {/* Draw the route */}
        <Polyline
          coordinates={trail.coordinates}
          strokeColor="#2E7D32" // TrailFinder Green
          strokeWidth={4}
        />

        {/* Plot Waypoints */}
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

      {/* Floating Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.stats}>
          {trail.difficulty} • {trail.distanceMiles} mi • {trail.elevationGainFt} ft gain
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  infoCard: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  stats: { fontSize: 14, color: '#666' }
});