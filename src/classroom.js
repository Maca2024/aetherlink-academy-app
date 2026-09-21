/** Wave daily deck — Google Slides embed (LIS-54 v1). Free browse; day is chrome hint only. */
export const CLASSROOM_DECK_ID = '1DZ9-9XynhHBj62e-_r9wAy3MQHOni85VCGnW6kgh8bI';

export const SLIDES_EMBED_URL =
  `https://docs.google.com/presentation/d/${CLASSROOM_DECK_ID}/embed?start=false&loop=false&delayms=60000`;

export function classroomEmbedUrl(day) {
  const url = new URL(SLIDES_EMBED_URL);
  // day is chrome-only; keep URL free-browse (no slide lock)
  if (day != null) url.searchParams.set('rm', 'minimal');
  return url.toString();
}

/**
 * Sandbox tokens for the embed. The deck is cross-origin (docs.google.com),
 * so allow-same-origin only hands Google back its own origin — it grants the
 * frame nothing over this page, and the usual allow-scripts+allow-same-origin
 * escape only applies to a same-origin frame, which could rewrite this very
 * attribute. Scripts + same-origin are what the Slides viewer needs to render;
 * popups (and escaping the sandbox) keep links inside a slide clickable;
 * presentation covers the Presentation API behind the fullscreen teach flow.
 * Deliberately withheld: top-navigation (a deck must never navigate the
 * facilitator out of the room), forms, downloads, modals, pointer-lock.
 */
export const CLASSROOM_SANDBOX =
  'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation';
