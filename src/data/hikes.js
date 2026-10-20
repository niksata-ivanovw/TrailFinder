import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function getUserHikesCollection(userId) {
  if (!userId) {
    throw new Error('Sign in to access your hike history.');
  }
  return collection(db, 'users', userId, 'hikes');
}

export async function logCompletedHike(userId, trail) {
  if (!trail?.id) {
    throw new Error('Cannot log a hike without a trail ID.');
  }

  return addDoc(getUserHikesCollection(userId), {
    trailId: trail.id,
    trailName: trail.name,
    location: trail.location ?? '',
    difficulty: trail.difficulty ?? '',
    distanceMiles: Number.isFinite(trail.distanceMiles) ? trail.distanceMiles : null,
    elevationGainFt: Number.isFinite(trail.elevationGainFt) ? trail.elevationGainFt : null,
    imageUrl: trail.imageUrl ?? '',
    completedAt: serverTimestamp(),
  });
}

export async function fetchCompletedHikes(userId) {
  const hikesQuery = query(getUserHikesCollection(userId), orderBy('completedAt', 'desc'));
  const snapshot = await getDocs(hikesQuery);
  return snapshot.docs.map((hikeDoc) => ({
    ...hikeDoc.data(),
    id: hikeDoc.id,
  }));
}

export async function removeCompletedHike(userId, hikeId) {
  if (!hikeId) {
    throw new Error('Cannot remove a hike without a hike ID.');
  }

  await deleteDoc(doc(getUserHikesCollection(userId), hikeId));
}
