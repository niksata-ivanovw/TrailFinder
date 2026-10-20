import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function getUserFavoritesCollection(userId) {
  if (!userId) {
    throw new Error('Sign in to manage your favorite trails.');
  }
  return collection(db, 'users', userId, 'favorites');
}

export async function fetchFavoriteTrails(userId) {
  const snapshot = await getDocs(getUserFavoritesCollection(userId));
  return snapshot.docs.map((favoriteDoc) => ({
    ...favoriteDoc.data(),
    id: favoriteDoc.id,
  }));
}

export async function saveFavoriteTrail(userId, trail) {
  if (!trail?.id) {
    throw new Error('Cannot favorite a trail without a trail ID.');
  }

  await setDoc(doc(getUserFavoritesCollection(userId), trail.id), {
    name: trail.name ?? '',
    location: trail.location ?? '',
    difficulty: trail.difficulty ?? '',
    distanceMiles: Number.isFinite(trail.distanceMiles) ? trail.distanceMiles : null,
    elevationGainFt: Number.isFinite(trail.elevationGainFt) ? trail.elevationGainFt : null,
    imageUrl: trail.imageUrl ?? '',
  });
}

export async function removeFavoriteTrail(userId, trailId) {
  if (!trailId) {
    throw new Error('Cannot remove a favorite without a trail ID.');
  }

  await deleteDoc(doc(getUserFavoritesCollection(userId), trailId));
}
