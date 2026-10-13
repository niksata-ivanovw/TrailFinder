import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const TRAILS_COLLECTION = 'trails';

export async function fetchTrails() {
  const snapshot = await getDocs(collection(db, TRAILS_COLLECTION));
  return snapshot.docs.map((trailDoc) => ({
    ...trailDoc.data(),
    id: trailDoc.id,
  }));
}

export async function fetchTrail(id) {
  const trailDoc = await getDoc(doc(db, TRAILS_COLLECTION, id));
  return trailDoc.exists()
    ? {
        ...trailDoc.data(),
        id: trailDoc.id,
      }
    : null;
}