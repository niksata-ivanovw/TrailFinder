import { Link } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Pressable, Text, View } from 'react-native';
import { dummyTrails } from '@/data/dummyTrails';
import { colors } from '@/theme';
import styles from '@/styles/map.styles';

export default function MapTabScreen() {
  const trail = dummyTrails[0];

  if (!trail) {
    return null;
  }

  const latitudes = trail.coordinates.map(point => point.latitude);
  const longitudes = trail.coordinates.map(point => point.longitude);
  const initialRegion = {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    latitudeDelta: Math.max((Math.max(...latitudes) - Math.min(...latitudes)) * 1.5, 0.03),
    longitudeDelta: Math.max((Math.max(...longitudes) - Math.min(...longitudes)) * 1.5, 0.03),
  };

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion}>
        <Polyline coordinates={trail.coordinates} strokeColor={colors.mapRoute} strokeWidth={4} />
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
