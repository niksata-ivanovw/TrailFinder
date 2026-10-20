import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPrivateTrail } from '@/data/trails';
import { colors } from '@/theme';
import styles from '@/styles/create-trail.styles';

const difficulties = ['Beginner', 'Intermediate', 'Expert'];
const initialRegion = {
  latitude: 43.214,
  longitude: 27.923,
  latitudeDelta: 0.14,
  longitudeDelta: 0.14,
};

function isValidCoordinate(coordinate) {
  return (
    Number.isFinite(coordinate?.latitude) &&
    Number.isFinite(coordinate?.longitude) &&
    coordinate.latitude >= -90 &&
    coordinate.latitude <= 90 &&
    coordinate.longitude >= -180 &&
    coordinate.longitude <= 180
  );
}

export default function CreateTrailScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [surfaceType, setSurfaceType] = useState('');
  const [description, setDescription] = useState('');
  const [distanceMiles, setDistanceMiles] = useState('');
  const [elevationGainFt, setElevationGainFt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleMapPress = (event) => {
    const coordinate = event?.nativeEvent?.coordinate;
    if (!isValidCoordinate(coordinate)) return;

    setCoordinates((points) => [...points, coordinate]);
  };

  const handleCreateTrail = async () => {
    setError('');
    setSaving(true);

    try {
      const trail = await createPrivateTrail({
        name,
        location,
        difficulty,
        surfaceType,
        description,
        distanceMiles: distanceMiles.trim() ? distanceMiles : null,
        elevationGainFt: elevationGainFt.trim() ? elevationGainFt : null,
        imageUrl,
        coordinates,
      });
      router.replace({ pathname: '/trail/[id]', params: { id: trail.id } });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create trail.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Text style={styles.pageTitle}>Create a trail</Text>
          <Text style={styles.intro}>
            Add a private trail for your own Discover and Map views. Tap the map to plot its route.
          </Text>

          <Text style={styles.sectionTitle}>Trail details</Text>
          <FormField label="Trail name *" value={name} onChangeText={setName} />
          <FormField label="Location *" value={location} onChangeText={setLocation} />
          <Text style={styles.fieldLabel}>Difficulty *</Text>
          <View style={styles.choiceRow}>
            {difficulties.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: difficulty === value }}
                style={[styles.choice, difficulty === value && styles.choiceSelected]}
                onPress={() => setDifficulty(value)}
              >
                <Text
                  style={[styles.choiceText, difficulty === value && styles.choiceTextSelected]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
          <FormField label="Surface type" value={surfaceType} onChangeText={setSurfaceType} />
          <FormField
            label="Distance (miles)"
            value={distanceMiles}
            onChangeText={setDistanceMiles}
            keyboardType="decimal-pad"
          />
          <FormField
            label="Elevation gain (ft)"
            value={elevationGainFt}
            onChangeText={setElevationGainFt}
            keyboardType="decimal-pad"
          />
          <FormField label="Image URL" value={imageUrl} onChangeText={setImageUrl} />
          <FormField
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.routeHeading}>
            <View style={styles.routeHeadingText}>
              <Text style={styles.sectionTitle}>Plot the route *</Text>
              <Text style={styles.routeHint}>
                Tap the map to add points. Add at least two points to create a route.
              </Text>
            </View>
            {coordinates.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                style={styles.clearRouteButton}
                onPress={() => setCoordinates((points) => points.slice(0, -1))}
              >
                <Text style={styles.clearRouteText}>Undo point</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={initialRegion} onPress={handleMapPress}>
              {coordinates.length > 1 ? (
                <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={4} />
              ) : null}
              {coordinates.map((coordinate, index) => (
                <Marker
                  key={`${coordinate.latitude}-${coordinate.longitude}-${index}`}
                  coordinate={coordinate}
                  title={`Route point ${index + 1}`}
                  pinColor={index === 0 ? colors.primary : colors.info}
                />
              ))}
            </MapView>
            <View pointerEvents="none" style={styles.pointCount}>
              <Text style={styles.pointCountText}>
                {coordinates.length} {coordinates.length === 1 ? 'point' : 'points'}
              </Text>
            </View>
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {error}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: saving }}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !saving && styles.submitButtonPressed,
              saving && styles.submitButtonDisabled,
            ]}
            onPress={handleCreateTrail}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color={colors.textOnPrimary} /> : null}
            <Text style={styles.submitButtonText}>
              {saving ? 'Creating trail...' : 'Create private trail'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, value, onChangeText, keyboardType, multiline = false }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={keyboardType ? 'none' : 'sentences'}
        placeholder={label.replace(' *', '')}
        placeholderTextColor={colors.inputPlaceholder}
      />
    </View>
  );
}
