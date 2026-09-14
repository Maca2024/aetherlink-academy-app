import { randomUUID } from 'node:crypto';
import { unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function run(): Promise<void> {
  const dbName = `proof-agent-edit-v2-access-epoch-${Date.now()}-${randomUUID()}.db`;
  const dbPath = path.join(os.tmpdir(), dbName);
  process.env.DATABASE_PATH = dbPath;

  const db = await import('../../server/db.ts');
  const collab = await import('../../server/collab.ts');
  const canonical = await import('../../server/canonical-document.ts');

  const slug = `epoch-bump-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const created = db.createDocument(
      slug,
      '# Access epoch bump\n\nBase paragraph.',
      {},
      'access epoch bump regression',
    );
    assert(typeof created.access_epoch === 'number', 'Expected test document to have access_epoch');

    await collab.startCollabRuntimeEmbedded(4100);

    const result = await canonical.mutateCanonicalDocument({
      slug,
      nextMarkdown: '# Access epoch bump\n\nBase paragraph.\n\nAPI append.',
      nextMarks: {},
      source: 'ai:epoch-bump-regression',
      baseRevision: created.revision,
      strictLiveDoc: true,
    });
    assert(result.ok, `Expected canonical mutation to succeed: ${JSON.stringify(result)}`);

    const updated = db.getDocumentBySlug(slug);
    assert(Boolean(updated), 'Expected document row after mutation');
    assert(
      updated?.access_epoch === created.access_epoch,
      `Expected a canonical content mutation to preserve access_epoch. before=${created.access_epoch} after=${updated?.access_epoch}`,
    );

    console.log('✓ canonical content mutations preserve access_epoch when no collab clients are connected');
  } finally {
    await collab.stopCollabRuntime();
    for (const suffix of ['', '-wal', '-shm']) {
      try {
        unlinkSync(`${dbPath}${suffix}`);
      } catch {
        // ignore cleanup errors
      }
    }
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
