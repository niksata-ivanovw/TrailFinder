import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const TRAILS_COLLECTION = 'trails';

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
  const snapshot = await getDocs(collection(db, TRAILS_COLLECTION));
  return snapshot.docs.map((trailDoc) =>
    normalizeTrail({ ...trailDoc.data(), id: trailDoc.id })
  );
}

export async function fetchTrail(id) {
  const trailDoc = await getDoc(doc(db, TRAILS_COLLECTION, id));
  return trailDoc.exists()
    ? normalizeTrail({ ...trailDoc.data(), id: trailDoc.id })
    : null;
}