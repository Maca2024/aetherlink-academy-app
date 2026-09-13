import { invalidateLoadedCollabDocumentAndWait } from './collab.js';
import { addEvent, pauseDocument } from './db-postgres.js';
import { refreshSnapshotForSlug } from './snapshot.js';
import { closeRoom } from './ws.js';

export async function pauseDocumentAndPropagate(
  slug: string,
  actor: string,
): Promise<boolean> {
  const paused = (await pauseDocument(slug));
  (await invalidateLoadedCollabDocumentAndWait(slug));
  closeRoom(slug);
  (await addEvent(slug, 'document.paused', {}, actor));
  (await refreshSnapshotForSlug(slug));
  return paused;
}
