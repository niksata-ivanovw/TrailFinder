import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function getUserFavoritesCollection(userId) {
  if (!userId) {
    throw new Error('Sign in to manage your favorite trails.');
  }
  return collection(db, 'users', userId, 'favorites');
}

export async function fetchFavoriteTrails(userId) {
  const snapshot = await getDocs(getUserFavoritesCollection(userId));
  return Promise.all(
    snapshot.docs.map(async (favoriteDoc) => {
      const favorite = { ...favoriteDoc.data(), id: favoriteDoc.id };
      const sharedTrail = await getDoc(doc(db, 'trails', favoriteDoc.id));
      if (sharedTrail.exists()) {
        return { ...favorite, ...sharedTrail.data(), id: favoriteDoc.id };
      }

      const privateTrail = await getDoc(doc(db, 'users', userId, 'trails', favoriteDoc.id));
      return privateTrail.exists()
        ? { ...favorite, ...privateTrail.data(), id: favoriteDoc.id }
        : favorite;
    })
  );
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
    surfaceType: trail.surfaceType ?? '',
    description: trail.description ?? '',
  });
}

export async function removeFavoriteTrail(userId, trailId) {
  if (!trailId) {
    throw new Error('Cannot remove a favorite without a trail ID.');
  }

  await deleteDoc(doc(getUserFavoritesCollection(userId), trailId));
}
