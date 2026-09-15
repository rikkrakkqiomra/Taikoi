# Taikoi / Aivoinko — Architecture

Authoritative description of the live repository as of 2026-09-15. This file is the source of truth for structure, data flow, integrations, and engineering constraints. Update it whenever those change.

---

## 1. Executive Overview & Purpose

**Product identity:** Aivoinko (stylized “Machine Metaphysics”) is a public artistic website: an interactive 3D solar-system simulator plus two narrative subpages. README branding is “Aivoinko Aurinko Reality Simulator”; live document titles are `Aivoinko Machine Metaphysics` (`index.html`), `The Opening of Reality` (`brain.html`), and `Pure Systems - Gamma Log` (`pure_systems.html`).

**Core purpose:** Present a cinematic, sci-fi 3D solar system in the browser, then route visitors into manifesto/log content. Interaction is exploratory (orbit, zoom, planet tooltips) rather than transactional.

**Target users:** Desktop and mobile visitors of a public Netlify site. No accounts, no roles, no authenticated surfaces.

**Architectural pattern:** **Jamstack static multi-page application (MPA)** with **zero build step**. Each route is a self-contained HTML document (inline CSS + ES module). There is no SPA router, no SSR/ISR, no Node server, no API, and no database. Navigation is full document loads (`window.location.href` or `<a href>`). 3D is client-only WebGL via Three.js loaded from a CDN import map.

---

## 2. Technology Stack & Runtime Matrix

| Layer | Choice | Version / notes |
|---|---|---|
| Languages | HTML5, CSS3, vanilla JavaScript (ES modules) | No TypeScript. No `package.json`. |
| Frameworks | None | No React/Svelte/Vue/Next. |
| 3D | Three.js + OrbitControls | **Pinned `0.160.0`** via HTML import maps → unpkg ESM. |
| Styling | Inline `<style>` per HTML file | Shared visual language via duplicated CSS custom properties. No Tailwind, CSS Modules, or shared stylesheet. |
| Fonts | Google Fonts | `Orbitron`, `Rajdhani` (index, brain); `Orbitron` + `Courier Prime` (pure_systems). |
| Database / ORM | None | All content is hardcoded in HTML/JS. |
| Build tools | None | No Vite, Webpack, Turbopack, or bundler. Netlify publishes the repo root as-is. |
| Runtime | Browser (WebGL) | Static files on Netlify CDN. No Node.js app runtime, no edge functions, no serverless functions. |
| Hosting | Netlify | `publish = "."` in `netlify.toml`. Remote: `https://github.com/rikkrakkqiomra/Taikoi`. |

### Core dependency breakdown

| Dependency | Role | How loaded |
|---|---|---|
| `three@0.160.0` (`three.module.js`) | Scene graph, WebGL renderer, geometries, materials, lights, raycaster, sprites | Import map → `https://unpkg.com/three@0.160.0/build/three.module.js` |
| `three/addons/controls/OrbitControls.js` | Camera orbit / zoom on `index.html` only | Import map prefix `three/addons/` → unpkg `examples/jsm/` |
| HTML5 Canvas 2D | Procedural planet/sun/glow textures; circular crop of the sun logo | Created at runtime; not shipped as image assets except the logo JPEG |
| Google Fonts | Display / body / terminal typography | CSS `<link>` after `preconnect` to `fonts.googleapis.com` / `fonts.gstatic.com` |

**Not in the live tree:** npm packages, service workers, analytics SDKs, i18n runtime. Commit `85d5131` (2026-09-15) removed `i18n.js`, `translations/*.json`, `script.js`, `styles.css`, and `Analysis.md`. Do not assume those layers still exist.

---

## 3. Repository & Directory Topology

Flat root. There is no `src/`, `public/`, `components/`, or `netlify/functions/` directory.

```
Taikoi/
├── index.html                 # Home / solar-system simulator (site entry)
├── brain.html                 # Manifesto page (“The Opening of Reality”)
├── pure_systems.html          # Terminal “Gamma Log” page + outbound social links
├── AiiAold.8dde82cb.jpg       # Favicon, preload, sun-portal sprite, header logos
├── taikoi-sun-portal.png      # Tracked asset; not referenced by any HTML (unused)
├── netlify.toml               # Publish root + security + cache headers
├── README.md                  # Human-facing project description
└── architecture.md            # This file
```

No `.gitignore` in the current tree (removed in `85d5131`).

### Entry points

| Path | URL (Netlify static) | Role |
|---|---|---|
| `index.html` | `/` | Primary 3D solar system. Nav to Pure Systems. Sun click → `brain.html`. |
| `brain.html` | `/brain.html` | Starfield + floating manifesto blocks. Header click → `index.html`. |
| `pure_systems.html` | `/pure_systems.html` | Green starfield + log copy + social icons. Header click → `index.html`. |
| `netlify.toml` | n/a | Deployment contract: publish directory and HTTP headers. |

Each HTML file is a **layout wrapper for itself**: `<head>` (meta, import map, fail-open script, fonts, CSS) + `<body>` (chrome + `#canvas-container` + page content) + trailing `<script type="module">` (Three.js scene). There is no shared layout partial or middleware.

### Navigation graph

```
index.html  --nav "Pure Systems"-->  pure_systems.html  --header click-->  index.html
index.html  --sun click/tap------->  brain.html         --header click-->  index.html
index.html  --nav "DIY Realities"->  # (no-op stub; page does not exist)
```

---

## 4. Architecture, State & Data Flow

### Client vs server

**100% client.** Netlify serves immutable (or must-revalidate) static files. The browser:

1. Parses HTML.
2. Resolves the import map and fetches Three.js from unpkg (network, CORS).
3. Runs the inline module: constructs scene, starts the render loop.
4. Optionally fetches `AiiAold.8dde82cb.jpg` (TextureLoader on index; `<img>` on subpages).

There are no server components, no hydration boundary, no BFF, and no form POSTs.

### Data flow lifecycle

```
User gesture / page load
  → DOM + inline module execute
  → in-memory PLANETS / copy (hardcoded)
  → Three.js scene + Canvas-generated textures
  → WebGLRenderer.render each frame
  → Raycaster (index only) maps pointer/touch → planet tooltip or sun transition
  → Full navigation via window.location.href or <a>
  → Previous page JS heap discarded (MPA; no shared client store)
```

Planet science fields (`mass`, `diameter`, `temp`) live in the `PLANETS` array inside `index.html`. Manifesto/log copy lives in HTML. Nothing is fetched from an API.

### State management

No React Context, Zustand, Redux, SWR, or TanStack Query.

State is **page-local closures**:

| State | Location | Lifetime |
|---|---|---|
| Scene, camera, renderer, meshes | Module scope per page | Until unload |
| `activePlanet` / tooltip DOM | `index.html` | Frame-to-frame; cleared on transition |
| `isTransitioning` | `index.html` | Guards double-fire of sun → brain navigation |
| `speedMultiplier` | `index.html` | `0.15` if `innerWidth < 768` at init; not recomputed on rotate-to-landscape unless reload |
| `window.__aivoinko3d` | All pages | `true` after module starts; `false` if WebGL constructor throws |
| `window.__aivoinkoReveal` | All pages | Fail-open UI if the module never sets `__aivoinko3d` |

No `localStorage`, `sessionStorage`, cookies, or IndexedDB.

### Auth / session

**None.** No login, tokens, CSRF, RBAC, or session cookies. Outbound social links are public `target="_blank"` anchors with `rel="noopener noreferrer"`.

### Shared runtime pattern (all three pages)

1. **Fail-open UI:** Head script registers `error` / `unhandledrejection` and a 2500 ms timeout. If `window.__aivoinko3d` is still falsy, `html.ui-ready` is applied so chrome is not trapped behind a blank WebGL failure. `index.html` also removes `#loading`.
2. **WebGL try/catch:** Renderer construction failure sets `__aivoinko3d = false`, calls `__aivoinkoReveal`, rethrows.
3. **Loop control:** Prefer `renderer.setAnimationLoop`; fall back to `requestAnimationFrame`. Pause on `document.hidden`; resume on visible; reset `lastFrameTime` to avoid a huge delta spike.
4. **Delta time:** `dt = min(deltaMs, 50) / (1000/60)` so motion is frame-rate independent and hitch-capped.
5. **Pixel ratio:** `Math.min(devicePixelRatio, 2)`.
6. **Entry/exit:** Scene scale 0.001 → 1 (cubic out) on enter; reverse cubic in then `location.href` on exit (brain / pure_systems header; index sun).

### `index.html` simulation specifics

- **Sun:** procedural Canvas texture + additive glow sprite + invisible collider (`radius * 0.9`) for picking. Logo JPEG is cropped to a circle and applied to a pulsing `THREE.Sprite`.
- **Planets:** 8 solar-system bodies + fictional `Astroteles Aivoinko II` (`type: 'synthetic'`). Saturn has a `RingGeometry`. Orbits are `EllipseCurve` line loops.
- **Desktop:** camera starts at `(0, 140, 280)` (3/4 view). `mousemove` updates NDC mouse; click on sun collider starts transition; hover raycast drives tooltip + cursor.
- **Mobile:** camera starts top-down at `(0, 250, 6)` so orbits read as circles; `touchstart` (passive) raycasts planets + sun; tap planet locks tooltip; tap empty space clears; tap sun transitions. Header nav is full-width `space-between` with two-line labels (CSS `max-width: 768px` only).
- **bfcache:** `pageshow` resets `isTransitioning` and replays entry animation.

---

## 5. External Services & Integrations

| Service | Use | Failure mode |
|---|---|---|
| **Netlify** | Static hosting, TLS, header injection | Site down if deploy/CDN fails |
| **unpkg.com** | Three.js ESM + addons | 3D fails; fail-open UI still reveals chrome after 2.5s / on error |
| **Google Fonts** | Orbitron, Rajdhani, Courier Prime | Fallback to `sans-serif` / `monospace` |
| **DeviantArt** | `pure_systems.html` outbound | Link only |
| **Etsy** | `pure_systems.html` outbound (Kiomra Trionfi listing) | Link only |
| **SoundCloud** | `pure_systems.html` outbound | Link only |
| **LinkedIn** | `pure_systems.html` outbound | Link only |
| **Trepo (trepo.tuni.fi)** | `pure_systems.html` outbound (thesis handle) | Link only |

No analytics, CMS, payments, webhooks, auth providers, or first-party APIs.

### Environment variables

**None required.** No `.env`, no Netlify env bindings referenced in code, no secrets. Sensitivity classification: N/A.

If a future change adds secrets, document name, purpose, and classification (`public` / `secret`) here **without values**.

### HTTP contract (`netlify.toml`)

Global: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

Cache: `/` and `/*.html` → `public, max-age=0, must-revalidate`. `*.jpg|jpeg|webp|avif` → `public, max-age=31536000, immutable`. Logo filename includes a hash-like suffix (`AiiAold.8dde82cb.jpg`); renaming without cache-busting will stick for a year on those extensions.

---

## 6. Key Engineering Conventions & Patterns

### Conventions in force

- **One file = one route.** CSS and JS are colocated in the HTML they serve. Duplication of the Three.js bootstrap (renderer, loop, visibility pause, fail-open) is intentional; extract only if all three pages stay in sync.
- **Pin Three.js in all three import maps together.** Version drift between pages is a defect.
- **Hardcoded content.** Copy and planet stats are source, not CMS.
- **WebGL is optional for readability.** Subpage text and index chrome must remain reachable if WebGL/CDN fails (`__aivoinkoReveal`).
- **Performance caps:** DPR ≤ 2; mobile orbit speed × 0.15; pause loop when the tab is hidden; gas-giant texture turbulence uses a precomputed `xWave` array.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` + `aria-label`.
- **Local preview:** Serve over HTTP (`python -m http.server`, Live Server). `file://` can CORS-block the sun logo texture.

### Naming

- DOM ids: kebab-case (`canvas-container`, `planet-name`).
- JS locals: camelCase (`planetMeshes`, `startTransition`).
- CSS custom properties: `--glass-bg`, `--accent-color` (cyan `#00f3ff` on index/brain; green `#00ff00` on pure_systems).
- Global flags: `window.__aivoinko3d`, `window.__aivoinkoReveal` (double-underscore prefix = cross-script contract between head snippet and module).

### Error handling

- WebGL init: `try/catch` → warn, fail-open, rethrow.
- Texture load: `TextureLoader` error callback logs `"Portal logo failed to load."`; sun remains on procedural map.
- Module/CDN failure: capture-phase `error` + `unhandledrejection` → reveal UI.

There is no API response schema.

### Critical constraints — do not

1. **Do not add a bundler or `package.json` without updating this document and the Netlify publish model.** The site is currently opened as raw HTML.
2. **Do not introduce a backend, env secrets, or Netlify functions without a new architecture section** (auth, data store, API contract).
3. **Do not unpin or CDN-swap Three.js on one page only.**
4. **Do not assume `taikoi-sun-portal.png` is wired.** It is unused; `AiiAold.8dde82cb.jpg` is the live logo/favicon/sun sprite.
5. **Do not treat `href="#"` “DIY Realities” as a route.** It is an unimplemented stub.
6. **Do not persist user state across pages** unless you add an explicit store; MPA navigations wipe memory.
7. **Do not raise `setPixelRatio` uncapped** or run the animation loop in background tabs — thermal/battery regressions on mobile.
8. **Do not load Three.js from a second CDN or a different major** without verifying import-map + OrbitControls paths.
9. **Do not cache-bust HTML via long `max-age` on `/*.html`** — `netlify.toml` currently forces revalidation for a reason.
10. **Do not claim MIT licensing in docs without a `LICENSE` file.** README asserts MIT; the file is absent.

---

## 7. Known gaps (factual)

| Item | Status |
|---|---|
| `DIY Realities` nav | Dead `#` link |
| `taikoi-sun-portal.png` | Unreferenced binary |
| `LICENSE` | Missing despite README MIT claim |
| Shared CSS/JS modules | None; three-way copy of bootstrap |
| i18n | Removed; English-only |
| Analytics | None |
| Automated tests | None |

---

## Living Changelog & Debug Journal

Append-only. Newest rows at the **bottom**. Do not rewrite prior rows.

| Date (YYYY-MM-DD) | Change Summary | Affected Paths | Root Cause / Rationale | Debug Notes / Side Effects |
|---|---|---|---|---|
| 2026-09-15 | Initial Architecture Snapshot | Full repo | System audit and documentation baseline | Zero-build Jamstack MPA; Three.js 0.160.0 via unpkg; no env/API/auth. `85d5131` stripped i18n/`styles.css`/`script.js`. `taikoi-sun-portal.png` unused. DIY Realities is a stub. |
| 2026-09-15 | Mobile home: top-down camera + nav to header edges | index.html | Default `(0, 140, 280)` 3/4 camera made orbits ellipses on phones; nav was centered with `gap` | Desktop camera and `min-width: 768px` header row unchanged. Mobile camera `(0, 250, 6)`. Polar angle not reset on resize. |
