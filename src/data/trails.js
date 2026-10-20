import { collection, doc, getDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const TRAILS_COLLECTION = 'trails';
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Expert'];

function normalizeTrail(trail) {
  return {
    ...trail,
    waypoints: Array.isArray(trail.waypoints)
      ? trail.waypoints.map((waypoint) => {
          if (
            waypoint &&
            typeof waypoint === 'object' &&
            !Array.isArray(waypoint) &&
            (!Number.isFinite(waypoint.latitude) || !Number.isFinite(waypoint.longitude)) &&
            Number.isFinite(waypoint['0']) &&
            Number.isFinite(waypoint['1'])
          ) {
            return {
              ...waypoint,
              latitude: waypoint['0'],
              longitude: waypoint['1'],
            };
          }
          return waypoint;
        })
      : trail.waypoints,
  };
}

export async function fetchTrails() {
  const userId = auth.currentUser?.uid;
  const [sharedSnapshot, personalSnapshot] = await Promise.all([
    getDocs(collection(db, TRAILS_COLLECTION)),
    userId ? getDocs(collection(db, 'users', userId, 'trails')) : Promise.resolve(null),
  ]);

  const sharedTrails = sharedSnapshot.docs.map((trailDoc) =>
    normalizeTrail({ ...trailDoc.data(), id: trailDoc.id })
  );
  const personalTrails =
    personalSnapshot?.docs.map((trailDoc) =>
      normalizeTrail({ ...trailDoc.data(), id: trailDoc.id })
    ) ?? [];

  return [...sharedTrails, ...personalTrails];
}

export async function fetchTrail(id) {
  const trailDoc = await getDoc(doc(db, TRAILS_COLLECTION, id));
  if (trailDoc.exists()) {
    return normalizeTrail({ ...trailDoc.data(), id: trailDoc.id });
  }

  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const personalTrailDoc = await getDoc(doc(db, 'users', userId, 'trails', id));
  return personalTrailDoc.exists()
    ? normalizeTrail({ ...personalTrailDoc.data(), id: personalTrailDoc.id })
    : null;
}

function isValidCoordinate(point) {
  return (
    Number.isFinite(point?.latitude) &&
    Number.isFinite(point?.longitude) &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  );
}

export async function createPrivateTrail(trail) {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('Sign in to create a private trail.');
  }

  const name = trail.name?.trim();
  const location = trail.location?.trim();
  const difficulty = trail.difficulty;
  const coordinates = trail.coordinates;
  if (!name || !location || !DIFFICULTIES.includes(difficulty)) {
    throw new Error('Enter a trail name, location, and difficulty.');
  }
  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    !coordinates.every(isValidCoordinate)
  ) {
    throw new Error('Add at least two valid route points on the map.');
  }

  const distanceMiles = trail.distanceMiles == null ? null : Number(trail.distanceMiles);
  const elevationGainFt = trail.elevationGainFt == null ? null : Number(trail.elevationGainFt);
  if (
    (distanceMiles != null && (!Number.isFinite(distanceMiles) || distanceMiles <= 0)) ||
    (elevationGainFt != null && (!Number.isFinite(elevationGainFt) || elevationGainFt < 0))
  ) {
    throw new Error('Distance must be positive and elevation gain cannot be negative.');
  }

  const trailData = {
    name,
    location,
    difficulty,
    surfaceType: trail.surfaceType?.trim() || '',
    description: trail.description?.trim() || '',
    imageUrl: trail.imageUrl?.trim() || null,
    distanceMiles,
    elevationGainFt,
    coordinates,
    waypoints: [
      { type: 'trailhead', title: 'Trail start', ...coordinates[0] },
      {
        type: 'trailhead',
        title: 'Trail end',
        ...coordinates[coordinates.length - 1],
      },
    ],
    visibility: 'private',
    createdBy: userId,
    createdAt: serverTimestamp(),
  };

  const trailRef = await addDoc(collection(db, 'users', userId, 'trails'), trailData);
  return { ...trailData, id: trailRef.id };
}
