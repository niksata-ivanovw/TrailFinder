import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { varnaMappedTrails } from './varnaMappedTrails';

const TRAILS_COLLECTION = 'trails';
const REPLACEMENT_CONFIRMATION = 'REPLACE ALL TRAILS';
const FIRESTORE_BATCH_LIMIT = 500;

export async function replaceTrailsWithMappedVarnaRoutes(confirmation) {
  if (confirmation !== REPLACEMENT_CONFIRMATION) {
    throw new Error(
      `This operation replaces every document in "${TRAILS_COLLECTION}". ` +
        `Call it with "${REPLACEMENT_CONFIRMATION}" only when you intend to replace them.`
    );
  }

  const trailsCollection = collection(db, TRAILS_COLLECTION);
  const existingTrails = await getDocs(trailsCollection);
  const replacementIds = new Set(varnaMappedTrails.map((trail) => trail.id));
  const trailsToDelete = existingTrails.docs.filter(
    (trailDocument) => !replacementIds.has(trailDocument.id)
  );
  const writeCount = trailsToDelete.length + varnaMappedTrails.length;

  if (writeCount > FIRESTORE_BATCH_LIMIT) {
    throw new Error(
      `Cannot replace ${existingTrails.size} existing trails with one atomic batch: ` +
        `${writeCount} writes exceed Firestore's ${FIRESTORE_BATCH_LIMIT}-write limit.`
    );
  }

  const batch = writeBatch(db);
  trailsToDelete.forEach((trailDocument) => batch.delete(trailDocument.ref));
  varnaMappedTrails.forEach(({ id, ...trail }) => {
    batch.set(doc(trailsCollection, id), trail);
  });

  await batch.commit();

  return {
    replacedCount: varnaMappedTrails.length,
    deletedCount: trailsToDelete.length,
  };
}
