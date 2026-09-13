import type * as Y from 'yjs';

export function observeDeferredMarks(
  ydoc: Y.Doc,
  notify: (deletedIds: string[]) => void,
  shouldIgnore: (transaction: Y.Transaction) => boolean = () => false,
): () => void {
  const marks = ydoc.getMap('marks');
  let queued = false;
  let disposed = false;
  const deleted = new Set<string>();
  const observe = (_event: Y.YMapEvent<unknown>, transaction: Y.Transaction) => {
    if (disposed || shouldIgnore(transaction)) return;
    for (const [id, change] of _event.changes.keys) {
      if (change.action === 'delete') deleted.add(id);
    }
    if (queued) return;
    queued = true;
    // Map observers precede y-prosemirror's deep fragment observer. Dispatching
    // editor hydration here would write the old editor document back into Yjs.
    queueMicrotask(() => {
      queued = false;
      const deletedIds = [...deleted].filter(id => !marks.has(id));
      deleted.clear();
      if (!disposed) notify(deletedIds);
    });
  };
  const dispose = () => {
    disposed = true;
    marks.unobserve(observe);
    ydoc.off('destroy', dispose);
  };
  marks.observe(observe);
  ydoc.on('destroy', dispose);
  return dispose;
}
