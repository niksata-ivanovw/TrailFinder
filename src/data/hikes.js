import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function getUserHikesCollection(userId) {
  if (!userId) {
    throw new Error('Sign in to access your hike history.');
  }
  return collection(db, 'users', userId, 'hikes');
}

function normalizeHikeDetails(details = {}) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    throw new Error('Hike notes and rating must be provided as a valid object.');
  }
  if (details.notes != null && typeof details.notes !== 'string') {
    throw new Error('Hike notes must be text.');
  }

  const notes = details.notes?.trim() ?? '';
  if (notes.length > 2000) {
    throw new Error('Hike notes cannot exceed 2000 characters.');
  }
  const rating = details.rating ?? null;
  if (rating != null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new Error('Hike rating must be between 1 and 5.');
  }
  return { notes, rating };
}

export async function logCompletedHike(userId, trail, details = {}) {
  if (!trail?.id) {
    throw new Error('Cannot log a hike without a trail ID.');
  }

  const hikeDetails = normalizeHikeDetails(details);
  return addDoc(getUserHikesCollection(userId), {
    trailId: trail.id,
    trailName: trail.name,
    location: trail.location ?? '',
    difficulty: trail.difficulty ?? '',
    distanceMiles: Number.isFinite(trail.distanceMiles) ? trail.distanceMiles : null,
    elevationGainFt: Number.isFinite(trail.elevationGainFt) ? trail.elevationGainFt : null,
    imageUrl: trail.imageUrl ?? '',
    ...hikeDetails,
    completedAt: serverTimestamp(),
  });
}

export async function updateCompletedHike(userId, hikeId, details) {
  if (!hikeId) {
    throw new Error('Cannot update a hike without a hike ID.');
  }

  const hikeDetails = normalizeHikeDetails(details);
  await updateDoc(doc(getUserHikesCollection(userId), hikeId), hikeDetails);
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
