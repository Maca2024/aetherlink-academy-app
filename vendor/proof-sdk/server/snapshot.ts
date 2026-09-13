import { getDb, getDocumentBySlug } from './db-postgres.js';
import { getCanonicalReadableDocumentSync } from './collab.js';
import { recordSnapshotPublish } from './metrics.js';
import { buildSharePreviewModel, renderSharePreviewHtmlPage, resolvePublicOrigin } from './share-preview.js';

function getSnapshotPreviewOrigin(): string {
  return resolvePublicOrigin(null);
}

function renderSnapshotHtml(input: {
  slug: string;
  title: string;
  markdown: string;
  updatedAt: string;
  shareState: string;
  revision: number | string;
}): string {
  const preview = buildSharePreviewModel({
    slug: input.slug,
    origin: getSnapshotPreviewOrigin(),
    doc: {
      title: input.title,
      markdown: input.markdown,
      updatedAt: input.updatedAt,
      shareState: input.shareState,
      revision: input.revision,
    },
  });
  return renderSharePreviewHtmlPage(preview, {
    note: 'Read-only snapshot. Live collaboration is currently unavailable.',
    markdown: input.markdown,
  });
}

function renderUnavailableSnapshotHtml(input: {
  slug: string;
  title: string;
  updatedAt: string;
  shareState: string;
  revision: number | string;
}): string {
  const preview = buildSharePreviewModel({
    slug: input.slug,
    origin: getSnapshotPreviewOrigin(),
    doc: {
      title: input.title,
      updatedAt: input.updatedAt,
      shareState: input.shareState,
      revision: input.revision,
    },
  });
  return renderSharePreviewHtmlPage(preview);
}

export async function refreshSnapshotForSlug(slug: string): Promise<boolean> {
  const doc = await getCanonicalReadableDocumentSync(slug, 'snapshot') ?? await getDocumentBySlug(slug);
  if (!doc) return false;
  const html = doc.share_state === 'ACTIVE'
    ? renderSnapshotHtml({
        slug: doc.slug,
        title: doc.title || `Shared Document ${doc.slug}`,
        markdown: doc.markdown,
        updatedAt: doc.updated_at,
        shareState: doc.share_state,
        revision: doc.revision,
      })
    : renderUnavailableSnapshotHtml({
        slug: doc.slug,
        title: doc.title || `Shared Document ${doc.slug}`,
        updatedAt: doc.updated_at,
        shareState: doc.share_state,
        revision: doc.revision,
      });
  const result = await getDb().query(`
    INSERT INTO document_html_snapshots (document_slug, revision, document_updated_at, html)
    SELECT slug, revision, updated_at, $4 FROM documents
    WHERE slug = $1 AND revision = $2 AND updated_at = $3
    ON CONFLICT (document_slug) DO UPDATE SET
      revision = EXCLUDED.revision,
      document_updated_at = EXCLUDED.document_updated_at,
      html = EXCLUDED.html
  `, [slug, doc.revision, doc.updated_at, html]);
  if (result.rowCount === 0) return false;
  recordSnapshotPublish('success', 'postgres');
  return true;
}

export async function getSnapshotHtml(slug: string): Promise<string | null> {
  const result = await getDb().query(`
    SELECT s.html FROM document_html_snapshots s
    JOIN documents d ON d.slug = s.document_slug
    WHERE d.slug = $1 AND d.share_state <> 'DELETED'
      AND s.revision = d.revision AND s.document_updated_at = d.updated_at
  `, [slug]);
  const html = result.rows[0]?.html;
  return typeof html === 'string' ? html : null;
}

export function getSnapshotPublicUrl(_slug: string): string | null {
  return null;
}
