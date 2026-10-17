# Taikoi / Aivoinko — Architecture

Authoritative description of the live repository as of 2026-10-17. This file is the source of truth for structure, data flow, integrations, and engineering constraints. Update it whenever those change.

---

## 1. Executive Overview & Purpose

**Product identity:** Aivoinko (stylized “Machine Metaphysics”) is a public artistic website: an interactive 3D solar-system simulator plus narrative subpages. README branding is “Aivoinko Aurinko Reality Simulator”; live document titles are `Aivoinko Machine Metaphysics` (`index.html`), `The Opening of Reality` (`brain.html`), `Pure Systems - Gamma Log` (`pure_systems.html`), `Gallery` (`gallery.html`), `DIY Realities` (`diy_realities.html`), `Left Aperture` (`gate_left.html`), and `Right Aperture` (`gate_right.html`).

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
| Fonts | Google Fonts | `Orbitron`, `Rajdhani` (index, brain); `Orbitron` + `Courier Prime` (pure_systems); `Orbitron` (gallery); `Orbitron` + `Exo 2` (diy_realities); `Orbitron` + `Cormorant Garamond` (gate_left); `Orbitron` + `Cinzel` (gate_right). |
| Database / ORM | None | All content is hardcoded in HTML/JS. |
| Build tools | None | No Vite, Webpack, Turbopack, or bundler. Netlify publishes the repo root as-is. |
| Runtime | Browser (WebGL) | Static files on Netlify CDN. No Node.js app runtime, no edge functions, no serverless functions. |
| Hosting | Netlify | `publish = "."` in `netlify.toml`. Remote: `https://github.com/rikkrakkqiomra/Taikoi`. |

### Core dependency breakdown

| Dependency | Role | How loaded |
|---|---|---|
| `three@0.160.0` (`three.module.js`) | Scene graph, WebGL renderer, geometries, materials, lights, raycaster, sprites | Import map → `https://unpkg.com/three@0.160.0/build/three.module.js` |
| `three/addons/controls/OrbitControls.js` | Camera orbit / zoom on `index.html` only | Import map prefix `three/addons/` → unpkg `examples/jsm/` |
| HTML5 Canvas 2D | Procedural planet/sun/glow textures; circular crop of the sun logo | Created at runtime; shipped stills are the logo JPEG, `art/*.jpg`, and `art/frames/*.png` |
| Google Fonts | Display / body / terminal typography | CSS `<link>` after `preconnect` to `fonts.googleapis.com` / `fonts.gstatic.com` |

**Not in the live tree:** npm packages, service workers, analytics SDKs, i18n runtime. Commit `85d5131` (2026-09-15) removed `i18n.js`, `translations/*.json`, `script.js`, `styles.css`, and `Analysis.md`. Do not assume those layers still exist.

---

## 3. Repository & Directory Topology

Mostly flat root. There is no `src/`, `public/`, `components/`, or `netlify/functions/` directory. Artwork stills live in `art/` (not `gallery/`, which would collide with Netlify Pretty URL `/gallery` from `gallery.html`).

```
Taikoi/
├── index.html                 # Home / solar-system simulator (site entry)
├── brain.html                 # Manifesto page (“The Opening of Reality”)
├── pure_systems.html          # Terminal “Gamma Log” page + outbound social links
├── gallery.html               # Black starfield + 2D hangings; header reverse-warp home
├── art/
│   ├── 01-elder.jpg           # Source still
│   ├── 02-nautilus.jpg        # Source still
│   ├── 03-altar.jpg           # Source still
│   ├── 04-throne.jpg          # Source still
│   ├── 05-pact.jpg            # Source still
│   ├── 06-yantra.jpg          # Source still
│   ├── hangings/
│   │   ├── 01-elder-gilt.png        # Precomposed 2D hanging (still + photoreal gilt frame, transparent exterior)
│   │   ├── 02-nautilus-titanium.png # Precomposed 2D hanging (still + titanium/walnut frame, transparent exterior)
│   │   ├── 03-altar-bronze.png      # Hero hanging (still + winged bronze frame, transparent exterior)
│   │   ├── 04-throne-brutalist.png  # Finale hanging (still + concrete/steel brutalist frame, transparent exterior)
│   │   ├── 05-pact-ebony.png        # Small cabinet hanging (still + ebony/pewter frame, transparent exterior)
│   │   └── 06-yantra-ivory.png      # Small cabinet hanging (still + ivory/brass frame, transparent exterior)
│   └── frames/                # Photographic PNG overlays for later stills
│       ├── walnut.png
│       ├── gilt.png
│       ├── iron.png
│       ├── titanium.png
│       ├── bronze.png
│       ├── brutalist.png
│       ├── ebony.png
│       └── ivory.png
├── diy_realities.html         # Magenta/amber loom space (“DIY Realities”); content TBD
├── gate_left.html             # Crimson left aperture; content TBD
├── gate_right.html            # Gold/zinc right aperture; content TBD
├── AiiAold.8dde82cb.jpg       # Favicon, preload, sun-portal sprite, header logos, wormhole seals
├── taikoi-sun-portal.png      # Tracked asset; not referenced by any HTML (unused)
├── netlify.toml               # Publish root + security + cache headers
├── README.md                  # Human-facing project description
└── architecture.md            # This file
```

No `.gitignore` in the current tree (removed in `85d5131`).

### Entry points

| Path | URL (Netlify static) | Role |
|---|---|---|
| `index.html` | `/` | Primary 3D solar system. Nav to Pure Systems (href), Gallery (direct streak warp), and DIY Realities (warp + on-page wormhole choice). Sun click → `brain.html`. |
| `brain.html` | `/brain.html` | Starfield + floating manifesto blocks. Header click → `index.html`. |
| `pure_systems.html` | `/pure_systems.html` | Green starfield + log copy + social icons. Header click → `index.html`. |
| `gallery.html` | `/gallery.html` | Black starfield (Three.js warp only) + 2D photographic hangings. Header reverse-warp → `index.html`. Six hangings: gilt elder, titanium nautilus, bronze altar, brutalist throne, ebony pact + ivory yantra (small pair). |
| `diy_realities.html` | `/diy_realities.html` | Magenta/amber hyperspace loom. Default wormhole timeout destination. Header click reverse-warp → `index.html`. Title only. |
| `gate_left.html` | `/gate_left.html` | Crimson vertical slit. Entered by left seal. Header reverse-warp → `index.html`. Title only. |
| `gate_right.html` | `/gate_right.html` | Gold hexagonal aperture. Entered by right seal. Header reverse-warp → `index.html`. Title only. |
| `netlify.toml` | n/a | Deployment contract: publish directory and HTTP headers. |

Each HTML file is a **layout wrapper for itself**: `<head>` (meta, import map, fail-open script, fonts, CSS) + `<body>` (chrome + `#canvas-container` + page content) + trailing `<script type="module">` (Three.js scene). There is no shared layout partial or middleware.

### Navigation graph

```
index.html  --nav "Pure Systems"-->  pure_systems.html  --header click-->  index.html
index.html  --sun click/tap------->  brain.html         --header click-->  index.html
index.html  --nav "Gallery"------->  streak warp (boost → commit, no seals) → gallery.html
                 gallery header --->  reverse-warp → index.html
index.html  --nav "DIY Realities"->  warp boost → on-page choice hold (seals)
                 timeout 3.2s ----->  diy_realities.html --header click-->  index.html
                 left seal -------->  gate_left.html     --header click-->  index.html
                 right seal ------->  gate_right.html    --header click-->  index.html
```

---

## 4. Architecture, State & Data Flow

### Client vs server

**100% client.** Netlify serves immutable (or must-revalidate) static files. The browser:

1. Parses HTML.
2. Resolves the import map and fetches Three.js from unpkg (network, CORS).
3. Runs the inline module: constructs scene, starts the render loop.
4. Optionally fetches `AiiAold.8dde82cb.jpg` (TextureLoader on index; `<img>` on subpages) and `art/hangings/*.png` on `gallery.html`.

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
| `isTransitioning` | `index.html` | Guards double-fire of sun → brain, Gallery → direct warp, and DIY → warp navigation |
| `warpState` | `index.html` | Warp machine: `phase` `boost` / `choose` / `commit`, `destination` `forward`/`left`/`right`/`direct`, optional `directHref` (Gallery skips `choose` and seals). DIY choice is DOM `#wormhole-choice`, not a separate route. |
| `mode` (`enter` / `idle` / `exit`) | `gallery.html`, `diy_realities.html`, `gate_left.html`, `gate_right.html` | Warp-in, settled scene, reverse-warp home |
| `ARTWORKS` / `focusIndex` | `gallery.html` | Hardcoded stills + `FRAMES` overlay (`walnut` / `gilt` / `iron`). Hangings are DOM figures, not meshes. Mobile swipe advances `focusIndex` when more than one hanging exists. |
| `speedMultiplier` | `index.html` | `0.15` if `innerWidth < 768` at init; not recomputed on rotate-to-landscape unless reload |
| `window.__aivoinko3d` | All pages | `true` after module starts; `false` if WebGL constructor throws |
| `window.__aivoinkoReveal` | All pages | Fail-open UI if the module never sets `__aivoinko3d` |

No `localStorage`, `sessionStorage`, cookies, or IndexedDB.

### Auth / session

**None.** No login, tokens, CSRF, RBAC, or session cookies. Outbound social links are public `target="_blank"` anchors with `rel="noopener noreferrer"`.

### Shared runtime pattern (all seven pages)

1. **Fail-open UI:** Head script registers `error` / `unhandledrejection` and a 2500 ms timeout. If `window.__aivoinko3d` is still falsy, `html.ui-ready` is applied so chrome is not trapped behind a blank WebGL failure. `index.html` also removes `#loading`.
2. **WebGL try/catch:** Renderer construction failure sets `__aivoinko3d = false`, calls `__aivoinkoReveal`, rethrows.
3. **Loop control:** Prefer `renderer.setAnimationLoop`; fall back to `requestAnimationFrame`. Pause on `document.hidden`; resume on visible; reset `lastFrameTime` to avoid a huge delta spike.
4. **Delta time:** `dt = min(deltaMs, 50) / (1000/60)` so motion is frame-rate independent and hitch-capped.
5. **Pixel ratio:** `Math.min(devicePixelRatio, 2)`.
6. **Entry/exit:** Scene scale 0.001 → 1 (cubic out) on enter for index / brain / pure_systems; reverse cubic in then `location.href` on exit (brain / pure_systems header; index sun → `brain.html`). **Gallery warp** is `#nav-gallery` `preventDefault` → `boost` (~1500 ms teal/bronze streaks + FOV) → `commit` (~900 ms) → `gallery.html`. Seals stay closed. **DIY Realities warp** stays on `index.html` until a destination is chosen: `#nav-diy` `preventDefault` → `boost` (~1500 ms streaks + FOV) → `choose` (~3200 ms hold, flash ~0.4, left/right logo seals in `#wormhole-choice`, prefetch of the three destinations) → `commit` (~900 ms). Timeout commits `forward` → `diy_realities.html`. Left/right seal (or arrow keys) yaw-shear commit → `gate_left.html` / `gate_right.html`. **Do not** insert a loading page for this beat. Gallery/DIY/gate pages start flash at opacity 0.5 and fade it in ~400 ms; gallery is a 2D photographic hanging over a black starfield; DIY keeps the magenta loom; left is a crimson vertical slit with stars from +X; right is a gold hex torus with stars from −X. Header click reverse-warps to `index.html`. `bfcache` `pageshow` resets warp/FOV/fog/camera pose, hides seals, and replays entry.

### `index.html` simulation specifics

- **Sun:** procedural Canvas texture + additive glow sprite + invisible collider (`radius * 0.9`) for picking. Logo JPEG is cropped to a circle and applied to a pulsing `THREE.Sprite`.
- **Planets:** 8 solar-system bodies + fictional `Astroteles Aivoinko II` (`type: 'synthetic'`). Saturn has a `RingGeometry`. Orbits are `EllipseCurve` line loops.
- **Desktop:** camera starts at `(0, 140, 280)` (3/4 view). `mousemove` updates NDC mouse; click on sun collider starts transition; hover raycast drives tooltip + cursor.
- **Mobile:** camera starts top-down at `(0, 250, 6)` so orbits read as circles; `touchstart` (passive) raycasts planets + sun; tap planet locks tooltip; tap empty space clears; tap sun transitions. Header nav is full-width `space-between` with three labels (CSS `max-width: 768px` only); Pure Systems and DIY Realities wrap to two lines.
- **bfcache:** `pageshow` resets `isTransitioning`, camera pose, warp overlay, and replays entry animation.

### `gallery.html` hall specifics

- **2D hangings:** `#hall` is DOM. Six precomposed PNGs with transparent exteriors: `art/hangings/01-elder-gilt.png`, `art/hangings/02-nautilus-titanium.png`, hero `art/hangings/03-altar-bronze.png`, finale `art/hangings/04-throne-brutalist.png`, and small pair `art/hangings/05-pact-ebony.png` + `art/hangings/06-yantra-ivory.png`. Elder's gilt black inner slip is punched so the starfield shows between gold and canvas. `FRAMES` keeps punched walnut/gilt/iron/titanium/bronze/brutalist/ebony/ivory PNG overlays under `art/frames/`. Assets are not under `gallery/` so they do not collide with Netlify Pretty URL `/gallery` (`gallery.html`).
- **`ARTWORKS`:** `{ src, alt, frame }`. First hanging is gilt; second is titanium/walnut (`The Nautilus`); third is bronze (`The Altar`); fourth is brutalist concrete/steel (`The Throne`); fifth is ebony/pewter (`The Pact`); sixth is ivory/brass (`The Yantra`).
- **Layout:** desktop `#hall` is a fixed, scrollable overlay (`overflow-y: auto`). Four `min-height: 100vh` bays: pair (Elder + Nautilus at ~62vh), solo hero (The Altar at ~86vh), solo finale (The Throne at ~86vh), then a cabinet bay with The Pact and The Yantra at ~38vh in `.bay-row`. `#realm-title` sits after the cabinet row, not `position: fixed`. Canvas/logo stay pinned. Mobile: `display: contents` on bays, one hanging (`is-off` on the rest), swipe changes `focusIndex`. Optional `?focus=N` selects the starting hanging.
- **Three.js:** starfield + enter/exit streaks only. No OrbitControls, no 3D rails. Scene clear is black (`#000`).
- **Fail-open:** `#hall` hangings remain in the HTML/CSS even if WebGL never starts (`html.ui-ready`).

---

## 5. External Services & Integrations

| Service | Use | Failure mode |
|---|---|---|
| **Netlify** | Static hosting, TLS, header injection | Site down if deploy/CDN fails |
| **unpkg.com** | Three.js ESM + addons | 3D fails; fail-open UI still reveals chrome after 2.5s / on error |
| **Google Fonts** | Orbitron, Rajdhani, Courier Prime, Exo 2, Cormorant Garamond, Cinzel | Fallback to `sans-serif` / `serif` / `monospace` |
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

Cache: `/` and `/*.html` → `public, max-age=0, must-revalidate`. `*.jpg|jpeg|webp|avif` → `public, max-age=31536000, immutable`. `/art/*` → `public, max-age=0, must-revalidate` so replaced hangings are not frozen for a year. Logo filename includes a hash-like suffix (`AiiAold.8dde82cb.jpg`); renaming without cache-busting will stick for a year on those extensions.

---

## 6. Key Engineering Conventions & Patterns

### Conventions in force

- **One file = one route.** CSS and JS are colocated in the HTML they serve. Duplication of the Three.js bootstrap (renderer, loop, visibility pause, fail-open) is intentional; extract only if all seven pages stay in sync.
- **Pin Three.js in all seven import maps together.** Version drift between pages is a defect.
- **Hardcoded content.** Copy and planet stats are source, not CMS.
- **WebGL is optional for readability.** Subpage text and index chrome must remain reachable if WebGL/CDN fails (`__aivoinkoReveal`).
- **Performance caps:** DPR ≤ 2; mobile orbit speed × 0.15; pause loop when the tab is hidden; gas-giant texture turbulence uses a precomputed `xWave` array.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` + `aria-label`.
- **Local preview:** Serve over HTTP (`python -m http.server`, Live Server). `file://` can CORS-block the sun logo texture.

### Naming

- DOM ids: kebab-case (`canvas-container`, `planet-name`).
- JS locals: camelCase (`planetMeshes`, `startTransition`).
- CSS custom properties: `--glass-bg`, `--accent-color` (cyan `#00f3ff` on index/brain; green `#00ff00` on pure_systems; bronze `#c48c40` on gallery; magenta `#e040fb` + amber `--amber: #ffab40` on diy_realities; crimson `#ff2d55` on gate_left; gold `#d4af37` on gate_right).
- Global flags: `window.__aivoinko3d`, `window.__aivoinkoReveal` (double-underscore prefix = cross-script contract between head snippet and module).

### Error handling

- WebGL init: `try/catch` → warn, fail-open, rethrow.
- Texture load: `TextureLoader` error callback logs `"Portal logo failed to load."`; sun remains on procedural map. Gallery stills are `<img>` tags (no TextureLoader).
- Module/CDN failure: capture-phase `error` + `unhandledrejection` → reveal UI.

There is no API response schema.

### Critical constraints — do not

1. **Do not add a bundler or `package.json` without updating this document and the Netlify publish model.** The site is currently opened as raw HTML.
2. **Do not introduce a backend, env secrets, or Netlify functions without a new architecture section** (auth, data store, API contract).
3. **Do not unpin or CDN-swap Three.js on one page only.**
4. **Do not assume `taikoi-sun-portal.png` is wired.** It is unused; `AiiAold.8dde82cb.jpg` is the live logo/favicon/sun sprite.
5. **Do not restyle `diy_realities.html` as the index solar system or the green Pure Systems terminal.** The route is a magenta/amber hyperspace loom; copy is still a placeholder title only.
6. **Do not persist user state across pages** unless you add an explicit store; MPA navigations wipe memory.
7. **Do not raise `setPixelRatio` uncapped** or run the animation loop in background tabs — thermal/battery regressions on mobile.
8. **Do not load Three.js from a second CDN or a different major** without verifying import-map + OrbitControls paths.
9. **Do not cache-bust HTML via long `max-age` on `/*.html`** — `netlify.toml` currently forces revalidation for a reason.
10. **Do not claim MIT licensing in docs without a `LICENSE` file.** README asserts MIT; the file is absent.
11. **Do not turn the wormhole choice into a separate HTML loading page.** Seals live in `#wormhole-choice` on `index.html` during `warpState.phase === 'choose'`. `gate_left.html` / `gate_right.html` are destinations, not the interstitial.
12. **Do not route Gallery through the DIY seal hold.** `#nav-gallery` uses `warpState.directHref` and skips `choose`.

---

## 7. Known gaps (factual)

| Item | Status |
|---|---|
| `DIY Realities` body copy | Title chrome only; narrative content not written yet |
| `gate_left.html` / `gate_right.html` copy | Title chrome only; narrative content not written yet |
| `taikoi-sun-portal.png` | Unreferenced binary |
| `LICENSE` | Missing despite README MIT claim |
| Shared CSS/JS modules | None; seven-way copy of bootstrap |
| Gallery hangings | Six stills under `art/` (`01-elder.jpg` … `06-yantra.jpg`); further paste entries append to `ARTWORKS` |
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
| 2026-09-15 | DIY Realities route + hyperspace warp | index.html, diy_realities.html, architecture.md | Nav was `href="#"` with no page; needed a non-index, non-green destination | Index `#nav-diy` intercepts click (native href remains for no-JS). Warp is camera-aligned LineSegments + `#warp-flash`, not scene-scale. DIY page: Exo 2 + magenta/amber loom, tunnel warp-in then Points. Header reverse-warp home. Copy TBD. Sun → brain and Pure Systems href unchanged. |
| 2026-09-15 | Wormhole choice hold on DIY warp | index.html, diy_realities.html, gate_left.html, gate_right.html, architecture.md | White flash + MPA load felt like a loading gap; user asked for a timed left/right seal choice in that beat | Choice is `#wormhole-choice` on index (`boost` 1.5s → `choose` 3.2s → `commit` 0.9s). Timeout → DIY. Seals/arrows → yaw-shear to gate pages. Prefetch three HTML docs. DIY opening flash now 0.5 / ~400 ms. Gate copy TBD. |
| 2026-10-17 | Gallery as middle nav + framed space hall | index.html, gallery.html, gallery/01-elder.jpg, netlify.toml, architecture.md | Need a third home route for pasted stills without touching DIY seals or Pure Systems href | `#nav-gallery` warp is boost→commit with teal/bronze streaks. `gallery.html` uses `ARTWORKS` + wood/bronze/iron factories; first hanging is wood + bronze liner. Desktop staggered xyz, mobile one-at-a-time. `/gallery/*` must-revalidate. Three.js stays 0.160.0. Sun, Pure Systems, DIY choice unchanged. |
| 2026-10-17 | Elder still invisible; gallery backdrop swapped | gallery.html, gallery/01-elder.jpg, architecture.md | `applyLayout` wrote `focusIndex`/`camTargetZ` before `let` init (TDZ), so the module died after WebGL start; `__aivoinko3d` stayed true and hid the CSS hanging. Center vignette + white warp-flash read as an empty orb. | Hanging JPEG is on-screen by default; `is-3d` only after texture bind. Backdrop is black starfield. Recopy `01-elder.jpg`. DIY/index routes unchanged. |
| 2026-10-17 | Gallery hangings rebuilt as 2D photographic frames | gallery.html, gallery/frames/walnut.png, gallery/frames/gilt.png, gallery/frames/iron.png, architecture.md | 3D box rails and flat CSS borders read as painted junk; user asked for a 2D, museum-grade frame | Three.js now drives only the black starfield/warp. Hangings are DOM still + PNG overlay. Walnut on the elder; gilt/iron ready. Index/DIY routes unchanged. |
| 2026-10-17 | Elder hanging recomposed in photoreal gilt frame | gallery.html, gallery/hangings/01-elder-gilt.jpg, gallery/frames/walnut.png, gallery/frames/gilt.png, architecture.md | Previous hanging JPEG baked a punched well (ghost elder + white hole); CSS/3D rails still read as Paint. User asked for 2D, real-looking artistic frames only. | Opaque JPEG: art cover-cropped under the liner, then frame pixels overlaid. Center sample is elder paint, not black/white. Walnut overlay kept for later stills. Index/DIY routes unchanged. |
| 2026-10-17 | Second gallery hanging: Nautilus in titanium/walnut | gallery.html, gallery/02-nautilus.jpg, gallery/hangings/02-nautilus-titanium.jpg, gallery/frames/titanium.png, architecture.md | User added a new still and asked for a masterpiece edge in titanium with wood detail | Precomposed opaque JPEG. Desktop shows both with `--hang-y` stagger; mobile swipe to the second. Elder gilt hanging unchanged. Index/DIY routes unchanged. |
| 2026-10-17 | Move hangings to `art/` so Netlify serves them | gallery.html, netlify.toml, architecture.md, art/**, deleted gallery/ | `gallery.html` Pretty URL `/gallery` collided with folder `gallery/`: live `/gallery/01-elder.jpg` 500, hangings 404 and were also missing from GitHub main | Src is now `art/hangings/*.jpg`. Header `/art/*` must-revalidate. Push `art/` to main. Index/DIY routes unchanged. |
| 2026-10-17 | Punch hanging exteriors so frames sit on starfield | gallery.html, art/hangings/01-elder-gilt.png, art/hangings/02-nautilus-titanium.png, architecture.md | Opaque JPEG hangings baked a black rectangle around each frame, covering the starfield | Flood-fill dark exterior to alpha 0, 1 px feather. Src now `.png`. Old hanging JPEGs removed. Index/DIY routes unchanged. |
| 2026-10-17 | Punch Elder gilt inner slip so stars show through | art/hangings/01-elder-gilt.png, architecture.md | Black velvet mat between gold and canvas covered the starfield | Slip mask from `art/frames/gilt.png` (dark, non-gold, opaque overlay). Gold sight edge and painting stay. Nautilus unchanged. |
| 2026-10-17 | Shrink hanging drop-shadow so punched slip stays open | gallery.html, architecture.md | 52px drop-shadow filled the Elder slip hole and hid the starfield again | Offset shadow 10/16/14px. Nautilus uses the same smaller shadow. |
| 2026-10-17 | Keep gallery hangings out of logo and title | gallery.html, architecture.md | Large hangings plus ±vh stagger overlapped the header logo and GALLERY label | Hall padding 168px / 16vh; hanging height `min(52vh, 100vh - chrome)`; stagger ±8px. Mobile one-up unchanged. |
| 2026-10-17 | Add The Altar as a solo bronze hero hanging | gallery.html, art/03-altar.jpg, art/hangings/03-altar-bronze.png, art/frames/bronze.png, architecture.md | User added a third still to sit below the pair, larger, never paired on desktop | Winged oxidized-bronze frame, transparent exterior. `#hall` is a 2-col grid; `.hanging--hero` spans the second row. Mobile swipe includes it. |
| 2026-10-17 | Make the gallery hall scroll; enlarge hangings | gallery.html, architecture.md | Three pieces crammed into one viewport read as stamps; Altar should appear on scroll | Desktop `#hall` overflow-y auto, two 100vh bays (pair 62vh, hero 72vh). Title after hero. Mobile swipe unchanged. |
| 2026-10-17 | Enlarge The Altar on desktop | gallery.html, architecture.md | Hero at 72vh still read smaller than the pair above | Desktop `.hanging--hero` 86vh; hero bay padding tightened. Mobile swipe size unchanged. |
| 2026-10-17 | Hang The Throne as a brutalist finale | gallery.html, art/04-throne.jpg, art/hangings/04-throne-brutalist.png, art/frames/brutalist.png, architecture.md | User added a seated machine-elder still to sit last, with a futuristic brutalist frame | Concrete/rusted-steel bolted frame, transparent exterior. Third 100vh bay after Altar. Title after finale. Mobile swipe includes it. |
| 2026-10-17 | Hang The Pact as the smallest cabinet picture | gallery.html, art/05-pact.jpg, art/hangings/05-pact-ebony.png, art/frames/ebony.png, architecture.md | User asked for the next still to be the smallest, with room for a companion beside it | Ebony/pewter frame. Fourth bay, `.hanging--small` 38vh in `.bay-row`. Title after the row. Mobile swipe includes it, still smaller. |
| 2026-10-17 | Hang The Yantra beside The Pact | gallery.html, art/06-yantra.jpg, art/hangings/06-yantra-ivory.png, art/frames/ivory.png, architecture.md | User asked for a second miniature next to The Pact | Ivory/brass square frame. Same `.bay-row` at 38vh. Mobile swipe includes it. |
