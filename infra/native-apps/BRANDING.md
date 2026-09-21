# Academy branding without rewriting native apps

Audit: 21 September 2026. Source: BuilderIO/agent-native
`adec853eb337cbe0ead48464305d6f30cc07806e`; Academy PoC branch based on
`8691b46e4a074d99f23d08da6395ed5d76699af6`.

## Small maintained overlay

Reuse all six native applications. Keep branding changes in versioned adapters
and patches so upstream updates remain practical. This is a design proposal,
not an implemented or browser-accepted six-app theme.

Academy `src/style.css` defines the existing dark navy/cyan/violet palette:
`--bg:#06111e`, `--surface:#0c1928`, `--text:#e9f0fc`, `--cyan:#69e2f2`,
`--violet:#b99aff`, Inter typography, focus-visible rings, and a light theme.
The newer `apps/web/src/authoring/authoring.css` uses a light authoring palette.
Extract one canonical light/dark token contract rather than independently styling
six apps. Keep content/canvas styling separate from product chrome.

Upstream `templates/slides/app/design-system.ts` exposes
`defineDesignSystem({})`. The template `app/global.css` files use toolkit/shadcn
variables. Map Academy tokens into these hooks; do not import Academy's entire
stylesheet or use broad selectors that change slide/document/media content.
Upstream `packages/toolkit/src/app-shell/sidebar.tsx` exposes `brandName`,
`brandHref` and `brandIcon` for branded navigation. Custom app shells need a small
adapter. Include Assets, Calendar, Chat, Clips, Content and Slides in the audit.

Required work:

- Shared logo/favicon, semantic color tokens, Inter, spacing, radius and focus.
- Academy app launcher and a visible return-to-Academy link preserving context.
- Native light/dark preference mapping; respect per-deck presentation styles.
- EN/NL UI policy: audit actual locale support per app and label fallbacks;
  do not silently translate course content or claim complete Dutch support.
- Keyboard, dialog/focus, contrast, responsive and reduced-motion acceptance.
- Screenshots for login, app shell and editor after each overlay is deployed.

## Identity is separate from styling

A matching logo does not provide SSO. Existing Academy and native Better Auth
sessions differ. Begin with explicit authenticated deep links; evaluate supported
shared auth/SSO hooks before introducing a one-time launch-code exchange.
A custom launch exchange is a proposal requiring threat modeling and ownership
checks, not a verified upstream feature. Never place bearer/MCP/admin keys in
URLs or copy browser session storage between origins.

Academy owns classroom state, role authorization and immutable published lesson
versions. Native apps own their editors and draft resources. Adapters must verify
ownership and read canonical content before attaching/publishing an artifact.

Linear: AET-51 (branding), AET-53 (identity and adapters), AET-34 (main cutover).
