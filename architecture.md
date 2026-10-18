# Taikoi / Aivoinko — Architecture

Authoritative description of the live repository as of 2026-10-18. This file is the source of truth for structure, data flow, integrations, and engineering constraints. Update it whenever those change.

---

## 1. Executive Overview & Purpose

**Product identity:** Aivoinko (stylized “Machine Metaphysics”) is a public artistic website: an interactive 3D solar-system simulator plus narrative subpages. README branding is “Aivoinko Aurinko Reality Simulator”; live document titles are `Aivoinko Machine Metaphysics` (`index.html`), `The Opening of Reality` (`brain.html`), `System Log` (`pure_systems.html`), `Gallery` (`gallery.html`), `Physicalus` (`physicalus.html`), `Bio` (`bio.html`), `Khaeos Metalogs` (`diy_realities.html`), `Left Aperture` (`gate_left.html`), and `Fragmenta Apocrypha` (`gate_right.html`).

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
| Styling | Inline `<style>` per HTML file, plus `seal-menu.css` | Page chrome stays inline. The seal index is the one shared stylesheet. No Tailwind or CSS Modules. |
| Fonts | Google Fonts | `Orbitron` + `Rajdhani` + `Cormorant Garamond` 500/italic 500 (index; Cormorant is the Library limen plaques and the Khaeos label); `Orbitron` + `Rajdhani` (brain); `Orbitron` + `Courier Prime` (pure_systems); `Orbitron` + `Cormorant Garamond` (gallery, physicalus, bio, gate_left, gate_right). Seal index uses Cormorant italic 500 + Orbitron on all eight seal pages. `Cinzel` on gate_right folios. On the Khaeos Metalogs hall (`diy_realities.html`): odd `#logs` articles (`.folio--terminal`) use the System Log block — `Orbitron` headings, `Courier Prime` body, `#00ff00`, frame, `>>> SYSTEM_ROOT_ACCESS`, and the `glitch` skew. Even articles stay `Orbitron` + `Cormorant Garamond` in gold/bone. `Courier Prime` is also the System Log body face on `pure_systems.html`. |
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
├── pure_systems.html          # Terminal “System Log” page
├── gallery.html               # Black starfield + 2D hangings; header reverse-warp home
├── physicalus.html            # Gallery side hall: same starfield, steel photo plates; Return → gallery.html
├── bio.html                   # Black starfield + biography hall + outbound work links; header reverse-warp home
├── art/
│   ├── 01-elder.jpg           # Source still
│   ├── 02-nautilus.jpg        # Source still
│   ├── 03-altar.jpg           # Source still
│   ├── 04-throne.jpg          # Source still
│   ├── 05-pact.jpg            # Unused still (removed from hall)
│   ├── 06-yantra.jpg          # Source still
│   ├── 07-window.jpg          # Unused still (removed from hall)
│   ├── 08-visage.jpg          # Source still
│   ├── 09-axis.jpg            # Source still
│   ├── 10-grove.jpg           # Source still
│   ├── 11-sigil.jpg           # Source still
│   ├── 12-chorus.jpg          # Source still
│   ├── 13-prism.jpg           # Source still
│   ├── seal-scroll-top.png    # Seal index roller. Black exterior punched
│   ├── seal-scroll-bottom.png # Matching lower roller
│   ├── seal-stone.png         # Tall salmiakki basalt menu button. Black exterior punched. Page logo sits in the face
│   ├── physicalus/            # Workshop photographs on physicalus.html (no art frames)
│   │   ├── 01-hundred.jpg     # 100-layer Damascus pendant in the palm
│   │   ├── 02-pair.jpg        # Brushed blank beside the etched pendant
│   │   └── 03-ridge.jpg       # Faceted hold of the same pendant
│   ├── hangings/
│   │   ├── 01-elder-gilt.png        # Precomposed 2D hanging (still + photoreal gilt frame, transparent exterior)
│   │   ├── 02-nautilus-walnut.png   # Precomposed 2D hanging (still + carved walnut frame, transparent exterior)
│   │   ├── 03-altar-bronze.png      # Hero hanging (still + winged bronze frame, transparent exterior)
│   │   ├── 04-throne-dark.png       # Finale hanging (still + ebonized frame, transparent exterior)
│   │   ├── 06-yantra-cassetta.png   # Hero hanging (still + walnut/gold cassetta frame, transparent exterior)
│   │   ├── 08-visage-abstract.png   # Hero hanging (still + abstract bronze frame, transparent exterior)
│   │   ├── 09-axis-ivory.png        # Showpiece hanging (still + palace ivory frame, transparent exterior)
│   │   ├── 10-grove-oak.png         # Mid hanging (still + carved oak/antler frame, transparent exterior)
│   │   ├── 11-sigil-victorian.png   # Hero hanging (gilt frame + gold emblem; well black punched for stars)
│   │   ├── 12-chorus-layered.png    # Hero hanging (still + multi-layer gilt/velvet frame, transparent exterior)
│   │   └── 13-prism-spectrum.png    # Hero hanging (still + polychrome Baroque frame, transparent exterior)
│   ├── frames/                # Photographic PNG overlays for later stills
│       ├── walnut.png
│       ├── walnut-carved.png
│       ├── gilt.png
│       ├── iron.png
│       ├── titanium.png
│       ├── bronze.png
│       ├── brutalist.png
│       ├── rococo.png
│       ├── ebonized.png
│       ├── ebony.png
│       ├── ivory.png
│       ├── photo.png
│       ├── cassetta.png
│       ├── palace-ivory.png
│       ├── abstract-bronze.png
│       ├── grove-oak.png
│       ├── victorian-gilt.png
│       ├── layered-gilt.png
│       └── spectrum-gilt.png
│   ├── bio/                   # bio.html portraits (CSS cassetta, not precomposed hangings)
│   │   ├── 01-tie.jpg
│   │   ├── 02-kaari.jpg
│   │   ├── 03-vesi.jpg
│   │   └── 04-metsa.jpg
│   ├── limen/                 # index.html Library choose salon. Wells were keyed and punched to alpha
│   │   ├── lintel.png         # Split limestone entablature with a gilt bead; transparent ground
│   │   ├── codex-hanging.png  # Closed gilt cassetta; circular well punched
│   │   ├── fragment-hanging.png # Same cassetta; right stile broken; parchment tongue; well punched
│   │   ├── codex-study.png    # Sealed scroll; transparent ground
│   │   └── fragment-study.png # Torn cipher scrap; transparent ground
│   └── khaeos/                # diy_realities.html shows khaeos-emblem.png and khaeos-metalogs.png in the DOM
│       ├── khaeos-emblem.png  # Hex star sigil. Khaeos hall seal, and the Library choose vanishing point. Not a circle crop
│       ├── khaeos-metalogs.png # Two-line gold wordmark, Goudy Old Style, transparent
│       ├── khaeos-logo.png    # Unused. Earlier Greek KHAEOΣ plane texture
│       ├── chlos.png          # Unused. Black ΧΛΟΣ
│       ├── hexxacro.png       # Unused. Green hexagram
│       ├── wood-arch.png      # Unused. Wood wall with a punched oculus
│       ├── wood-wall.jpg      # Unused uncut wood source
│       ├── wood-beam.jpg      # Unused lintel strip
│       ├── parchment-left.jpg # Unused
│       ├── parchment-right.jpg # Unused
│       └── nebula.jpg         # Unused night window
├── diy_realities.html         # Khaeos Metalogs: emblem, wordmark, seven rings, scroll hall; nav label stays Library
├── gate_left.html             # Crimson left aperture; content TBD
├── gate_right.html            # Fragmenta Apocrypha; gold starfield + unfinished folio nave
├── seal-menu.css              # Shared seal-index styles (eight subpages). Trigger is the diamond stone button
├── seal-menu.js               # Builds the seal index. Gallery halls on gallery/physicalus; Section 1–4 elsewhere. Return calls __aivoinkoSealExit
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
| `index.html` | `/` | Primary 3D solar system. Nav to System Log (href), Gallery (direct streak warp), Bio (direct streak warp), and Library (warp + on-page wormhole choice). Sun click → `brain.html`. |
| `brain.html` | `/brain.html` | Starfield + floating manifesto blocks. Seal opens the index; Return → `index.html`. |
| `pure_systems.html` | `/pure_systems.html` | Green starfield + log copy. Seal opens the index; Return → `index.html`. |
| `gallery.html` | `/gallery.html` | Black starfield (Three.js warp only) + 2D photographic hangings with draft text plaques. Seal opens the gallery index; Return reverse-warps → `index.html`. Eleven solo bays; hangings alternate left/right on desktop. Last is The Prism in a polychrome Baroque frame. Seal item Physical Arts opens `physicalus.html`. Artificial Arts is this hall. Cartomancy, Musical Theatre, and Mineralogy do not navigate. |
| `physicalus.html` | `/physicalus.html` | Side hall of the gallery (Physical Arts). Same black starfield. Three workshop photographs of Damascus jewelry on cool steel plates (no art frames). Seal opens the same gallery index as `gallery.html`. Artificial Arts opens `gallery.html`. Return reverse-warps → `gallery.html`. |
| `bio.html` | `/bio.html` | Black starfield + scroll hall. Opening name plate, four CSS-framed portraits (`art/bio/`), Finnish draft plaques, a Verkko cabinet of outbound work links, closing plate. Seal opens the index; Return reverse-warps → `index.html`. Portraits are not under a `bio/` root folder. |
| `diy_realities.html` | `/diy_realities.html` | Khaeos Metalogs. Home nav label stays Library. Default wormhole timeout destination. DOM emblem and wordmark, seven smooth rings tracking the wordmark, fixed starfield, scroll hall. Odd folios are green System Log terminals (Multimieli, then Log Entry 2). Even folios stay gold/bone (Log Entry 1, then Log Entry 3). Seal opens the index; Return reverse-warps → `index.html`. |
| `gate_left.html` | `/gate_left.html` | Crimson vertical slit. Entered by left seal. Seal opens the index; Return reverse-warps → `index.html`. Title only. |
| `gate_right.html` | `/gate_right.html` | Fragmenta Apocrypha: gold/zinc starfield + scrollable nave of six unfinished folios. Entered by right seal. Seal opens the index; Return reverse-warps → `index.html`. |
| `netlify.toml` | n/a | Deployment contract: publish directory and HTTP headers. |

Each HTML file is a **layout wrapper for itself**: `<head>` (meta, import map, fail-open script, fonts, CSS) + `<body>` (chrome + `#canvas-container` + page content) + trailing `<script type="module">` (Three.js scene). There is no shared layout partial or middleware. The eight subpages share `seal-menu.css` and `seal-menu.js` for the logo index. The trigger is `art/seal-stone.png` (punched salmiakki, 132×181px, 104×142px under 768px); the page logo sits in the face, circle-cropped except the Khaeos emblem. `index.html` does not.

### Navigation graph

```
index.html  --nav "System Log"-->  pure_systems.html  --seal Return-->  index.html
index.html  --sun click/tap------->  brain.html         --seal Return-->  index.html
index.html  --nav "Gallery"------->  streak warp (boost → commit, no seals) → gallery.html
                 gallery seal Return ->  reverse-warp → index.html
                 gallery seal Physical Arts -> physicalus.html --seal Return--> gallery.html
                 gallery seal Artificial Arts -> gallery.html (current hall; closes and scrolls)
                 physicalus seal Artificial Arts -> gallery.html
index.html  --nav "Bio"---------->  streak warp (boost → commit, no seals) → bio.html
                 bio seal Return ---->  reverse-warp → index.html
index.html  --nav "Library"------>  warp boost → on-page choice hold (seals)
                 timeout 4.2s ----->  diy_realities.html --seal Return-->  index.html
                 left seal -------->  gate_left.html     --seal Return-->  index.html
                 right seal ------->  gate_right.html    --seal Return-->  index.html
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
| `isTransitioning` | `index.html` | Guards double-fire of sun → brain, Gallery → direct warp, Bio → direct warp, and DIY → warp navigation |
| `warpState` | `index.html` | Warp machine: `phase` `boost` / `choose` / `commit`, `destination` `forward`/`left`/`right`/`direct`, optional `directHref` (Gallery and Bio skip `choose` and seals). DIY choice is DOM `#wormhole-choice`, not a separate route. |
| `mode` (`enter` / `idle` / `exit`) | `gallery.html`, `physicalus.html`, `bio.html`, `diy_realities.html`, `gate_left.html`, `gate_right.html` | Warp-in, settled scene, reverse-warp home. Physicalus exit href is `gallery.html`; the others go to `index.html`. |
| `ARTWORKS` / `focusIndex` | `gallery.html` | Hardcoded stills + `FRAMES` overlay (`walnut` / `gilt` / `iron`). Hangings are DOM figures, not meshes. Mobile swipe advances `focusIndex` when more than one hanging exists. |
| `speedMultiplier` | `index.html` | `0.15` if `innerWidth < 768` at init; not recomputed on rotate-to-landscape unless reload |
| node clock interval | `index.html` | 1000 ms while the tab is visible; cleared on `document.hidden`; in-memory only |
| `window.__aivoinko3d` | All pages | `true` after module starts; `false` if WebGL constructor throws |
| `window.__aivoinkoReveal` | All pages | Fail-open UI if the module never sets `__aivoinko3d` |
| `window.__aivoinkoSealExit` | Eight subpages | Page module assigns its `exitAnimation`. Seal index Return calls it. Unset → `location.href = 'index.html'`. `physicalus.html` assigns an exit whose href is `gallery.html`. |

No `localStorage`, `sessionStorage`, cookies, or IndexedDB.

### Auth / session

**None.** No login, tokens, CSRF, RBAC, or session cookies. Outbound work links on `bio.html` are public `target="_blank"` anchors with `rel="noopener noreferrer"`.

### Shared runtime pattern (all nine pages)

1. **Fail-open UI:** Head script registers `error` / `unhandledrejection` and a 2500 ms timeout. If `window.__aivoinko3d` is still falsy, `html.ui-ready` is applied so chrome is not trapped behind a blank WebGL failure. `index.html` also removes `#loading`.
2. **WebGL try/catch:** Renderer construction failure sets `__aivoinko3d = false`, calls `__aivoinkoReveal`, rethrows.
3. **Loop control:** Prefer `renderer.setAnimationLoop`; fall back to `requestAnimationFrame`. Pause on `document.hidden`; resume on visible; reset `lastFrameTime` to avoid a huge delta spike.
4. **Delta time:** `dt = min(deltaMs, 50) / (1000/60)` so motion is frame-rate independent and hitch-capped.
5. **Pixel ratio:** `Math.min(devicePixelRatio, 2)`.
6. **Entry/exit:** Scene scale 0.001 → 1 (cubic out) on enter for index / brain / pure_systems; reverse cubic in then `location.href` on exit (brain / pure_systems Return; index sun → `brain.html`). **Gallery and Bio warps** are `#nav-gallery` and `#nav-bio` `preventDefault` → `boost` (~1500 ms teal/bronze streaks + FOV) → `commit` (~900 ms) → `gallery.html` or `bio.html`. Seals stay closed. **Library warp** stays on `index.html` until a destination is chosen: `#nav-diy` `preventDefault` → `boost` (~1500 ms streaks + FOV) → `choose` (~4200 ms hold, flash ~0.4, limen salon in `#wormhole-choice`: one stone lintel, Codex and Fragmenta cassetta wings with the logo in a punched well, inward plaques, non-click studies, and a non-click Khaeos emblem whose ring, scale, and label read `--choose`; prefetch of the three destinations) → `commit` (~900 ms). Timeout commits `forward` → `diy_realities.html`. Left/right seal (or arrow keys) yaw-shear commit → `gate_left.html` / `gate_right.html`. **Do not** insert a loading page for this beat. Gallery/DIY/gate pages start flash at opacity 0.5 and fade it in ~400 ms; gallery is a 2D photographic hanging over a black starfield; Bio is the same black starfield with a scroll of CSS-framed portraits and Finnish plaques; DIY is the Khaeos Metalogs hall: a DOM emblem and wordmark, seven smooth rings tracking the wordmark, a fixed starfield, and a scroll that alternates odd green System Log terminals with even gold/bone folios; left is a crimson vertical slit with stars from +X; right is a gold folio nave over a hex-ornament starfield with stars from −X. Seal click opens the shared index (`seal-menu.js`). Return calls `__aivoinkoSealExit`, which reverse-warps to `index.html`. Close Menu smooth-scrolls `#hall`, `#nave`, `.floating-container`, or `.terminal-container` to the top and folds the list. Physicalus href is `physicalus.html`; Return on that page reverse-warps to `gallery.html`. Artificialus, KIOMRA, Musica, and Mineralogy still have no href. `bfcache` `pageshow` resets warp/FOV/fog/camera pose, hides seals, and replays entry.

### `index.html` simulation specifics

- **Sun:** procedural Canvas texture + additive glow sprite + invisible collider (`radius * 0.9`) for picking. Logo JPEG is cropped to a circle and applied to a pulsing `THREE.Sprite`.
- **Planets:** 8 solar-system bodies + fictional `Astroteles Aivoinko II` (`type: 'synthetic'`). Saturn has a `RingGeometry`. Orbits are `EllipseCurve` line loops.
- **Desktop:** camera starts at `(0, 140, 280)` (3/4 view). `mousemove` updates NDC mouse; click on sun collider starts transition; hover raycast drives tooltip + cursor.
- **Mobile:** camera starts top-down at `(0, 250, 6)` so orbits read as circles; `touchstart` (passive) raycasts planets + sun; tap planet locks tooltip; tap empty space clears; tap sun transitions. Header nav is full-width with four centered labels (CSS `max-width: 768px` only); System Log wraps to two lines. Gallery, Library, and Bio are one word. Type is `0.64rem`.
- **Node rail:** `#node-rail` is a full-bleed HUD under the existing status footer. Copy is the site node (`Northern Europe, Sub-Tampere, RÄMSÖÖ` at `61.3413° N, 23.3017° E`) plus a live `Europe/Helsinki` clock and UTC offset. No geolocation. Mobile (`max-width: 899px`) CSS-marquee of two identical lines; desktop is static and centered. `prefers-reduced-motion: reduce` stops the marquee and lets the track scroll horizontally. A non-module inline script ticks the clock; it is not inside the Three.js module.
- **bfcache:** `pageshow` resets `isTransitioning`, camera pose, warp overlay, and replays entry animation.
- **Library choice:** `#wormhole-choice` during `choose`. Each frame sets `--choose` from `elapsed / CHOOSE_MS` (0–1). That variable fills the center orrery and scales `art/khaeos/khaeos-emblem.png`. The center is not a button. `#seal-left` and `#seal-right` are the cassetta wings (hanging, logo well, inward plaque). Studies are `pointer-events: none`. `showChoice` sets header, footer, and `#node-rail` opacity to 0. Below 768px the studies and the italic plaque line are hidden. `prefers-reduced-motion` stops the study drift; the ring still fills. Arrow keys, 4200 ms timeout, and the Gallery/Bio direct warps are unchanged. `gate_left.html` is still title chrome only.

### `gallery.html` hall specifics

- **2D hangings:** `#hall` is DOM. Eleven precomposed PNGs with transparent exteriors, last `art/hangings/13-prism-spectrum.png`. Elder's gilt black inner slip is punched so the starfield shows between gold and canvas. The Sigil well punches the still's black so the starfield streams through the emblem; `.hanging--void` keeps a small drop-shadow so the hole stays open. `FRAMES` keeps punched overlays under `art/frames/` including `victorian-gilt.png`, `layered-gilt.png`, and `spectrum-gilt.png`. Assets are not under `gallery/` so they do not collide with Netlify Pretty URL `/gallery` (`gallery.html`).
- **`ARTWORKS`:** `{ src, alt, frame }`. Fourth hanging is The Yantra (`cassetta`). Ninth is Super Victorian gilt (`The Sigil`). Tenth is nested gilt/velvet (`The Chorus`). Eleventh is polychrome Baroque (`The Prism`).
- **Layout:** `#hall` is a fixed, scrollable overlay (`overflow-y: auto`) on desktop and mobile. Eleven solo bays. Desktop: hanging plus a `.plaque` on the opposite side; odd works slightly left (`bay--left`), even slightly right (`bay--right`). Desktop heights: Nautilus / Altar / Axis `.hanging--large` ~86vh; other heroes ~76vh; Grove ~70vh. `#realm-title` sits after the last bay on desktop and is hidden on mobile. The seal is `position: absolute` on desktop (first-bay padding) and `position: relative` in-flow on mobile so it does not cover the first hanging. Click opens the seal index; it does not warp until Return. Starfield canvas stays pinned. Mobile: bays stack (hanging then plaque), native scroll; optional swipe scrolls to the next bay. Optional `?focus=N` scrolls to that bay.
- **Plaques:** hardcoded English drafts in each bay (`h2` + blockquote + two short paragraphs). Cormorant Garamond body, Orbitron title. Copy is a first pass; not final. Square corners have a thin gilt L-bracket and a 5px diamond via `.plaque-corners`.
- **Three.js:** starfield + enter/exit streaks only. No OrbitControls, no 3D rails. Scene clear is black (`#000`). When The Sigil bay is in the `#hall` viewport, a second well-frustum streak field (`VOID_COUNT` 1100) streams through the punched black; the hall starfield stays the slow idle points.
- **Fail-open:** `#hall` hangings remain in the HTML/CSS even if WebGL never starts (`html.ui-ready`).

### `physicalus.html` hall specifics

- **Plates:** `#hall` is DOM over the same black starfield as `gallery.html`. Three workshop JPEGs under `art/physicalus/`: `01-hundred.jpg` (984×1024), `02-pair.jpg` (768×1024), `03-ridge.jpg` (768×1024). Each sits on a cool steel card (bevel, 1px sight, glass sheen). No frame PNG and no gilt corners. Sources were already about 1000px on the long edge, so they were not upscaled.
- **Slips:** One English maker's note, on the first plate only (`#hundred`). Orbitron kicker and credit, Cormorant italic title. Credit is Riimu Takomo with Joni. The pendant is 100-layer Damascus. The note's last line links the three views of that same piece: held, set down, turned. Later plates have no second title. A `.thread` under each repeats "The Hundred" and scrolls `#hall` back to `#view-hand`.
- **Layout:** Three solo bays. The first pairs the plate with the note. The next two are the same pendant, plate plus thread, alternating left/right. `#realm-title` follows the last bay on desktop and is hidden on mobile. Seal is absolute on desktop and in-flow on mobile. Mobile stacks plate then note or thread; optional swipe scrolls to the next bay. Optional `?focus=N`. In-hall `#` links scroll `#hall`, not the document.
- **Three.js:** Same enter/idle/exit streak field as the gallery (2200 stars, flash 0.28 fading in ~350 ms). No void well, no OrbitControls. Seal Return assigns `__aivoinkoSealExit`, which reverse-warps to `gallery.html`. Fail-open keeps the plates readable.
- **Route:** The gallery index (this page and `gallery.html` only) lists Physical Arts → `physicalus.html`, Artificial Arts → `gallery.html`, then Cartomancy, Musical Theatre, and Mineralogy with no href. Other subpages list Section 1–4 and those items do not navigate. Assets stay under `art/physicalus/` so they do not collide with Netlify Pretty URL `/physicalus`.

### `bio.html` hall specifics

- **Hall:** `#hall` is DOM over a black starfield. Opening plate, four alternating bays, closing plate, then `#realm-title` (hidden on mobile). Copy is Finnish draft. The companion in `02-kaari.jpg` is unnamed.
- **Portraits:** `art/bio/01-tie.jpg`, `02-kaari.jpg`, `03-vesi.jpg`, `04-metsa.jpg`. Each is 768×1024. Display cap is 50vh (42vh under 768px), inside a CSS cassetta: bone mat, 8px charcoal list, brass hairline, 8px corner ticks. No generated frame PNG.
- **Plaques:** same corner language as the gallery (`.plaque-corners`). Cormorant Garamond body, Orbitron chapter labels.
- **Verkko:** `#verkko` sits after the forest bay and before the closing plate. One brass cabinet, five outbound rows (DeviantArt, Etsy Kiomra Trionfi, SoundCloud, LinkedIn, Trepo). Same corner diamonds as the plaques. No generated frame.
- **Three.js:** starfield + enter/exit streaks only. No OrbitControls, no void well, no swipe. Enter flash starts at 0.28 and fades in ~350 ms. Seal Return assigns `__aivoinkoSealExit`. Fail-open keeps the hall readable.
- **Route:** home `#nav-bio` calls `startWarpTransition('bio.html')` and skips the wormhole choice. Assets stay under `art/bio/` so they do not collide with Netlify Pretty URL `/bio`.

### `gate_right.html` nave specifics

- **Folios:** `#nave` is DOM, six hardcoded English drafts with Latin running heads. Gaps, rasurae, and an unfinished colophon are intentional. Cinzel titles, Cormorant body, Orbitron kicker. Copy is a first pass.
- **Layout:** Fixed scroll overlay like the gallery hall. Desktop bays alternate left/right. Gold frames omit one side (`.folio--gap-*`). Mobile stacks. Return logo is absolute on desktop and in-flow on mobile; click opens the seal index. `#realm-title` follows the last bay on desktop and is hidden on mobile.
- **Three.js:** Gold/zinc streaks on enter/exit from −X. Idle points plus a faint hex torus behind the nave (`opacity` 0.28). No OrbitControls. Fail-open keeps folios readable without WebGL.

---

## 5. External Services & Integrations

| Service | Use | Failure mode |
|---|---|---|
| **Netlify** | Static hosting, TLS, header injection | Site down if deploy/CDN fails |
| **unpkg.com** | Three.js ESM + addons | 3D fails; fail-open UI still reveals chrome after 2.5s / on error |
| **Google Fonts** | Orbitron, Rajdhani, Courier Prime, Cormorant Garamond, Cinzel | Fallback to `sans-serif` / `serif` / `monospace` |
| **DeviantArt** | `bio.html` outbound (`#verkko`) | Link only |
| **Etsy** | `bio.html` outbound (Kiomra Trionfi listing) | Link only |
| **SoundCloud** | `bio.html` outbound | Link only |
| **LinkedIn** | `bio.html` outbound | Link only |
| **Trepo (trepo.tuni.fi)** | `bio.html` outbound (thesis handle) | Link only |

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

- **One file = one route.** Page CSS and the Three.js module stay in the HTML they serve. Duplication of the Three.js bootstrap (renderer, loop, visibility pause, fail-open) is intentional. The seal index is the exception: `seal-menu.css` and `seal-menu.js` are shared by the eight subpages.
- **Pin Three.js in all nine import maps together.** Version drift between pages is a defect.
- **Hardcoded content.** Copy and planet stats are source, not CMS.
- **WebGL is optional for readability.** Subpage text and index chrome must remain reachable if WebGL/CDN fails (`__aivoinkoReveal`).
- **Performance caps:** DPR ≤ 2; mobile orbit speed × 0.15; pause loop when the tab is hidden; gas-giant texture turbulence uses a precomputed `xWave` array.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` + `aria-label`.
- **Local preview:** Serve over HTTP (`python -m http.server`, Live Server). `file://` can CORS-block the sun logo texture.

### Naming

- DOM ids: kebab-case (`canvas-container`, `planet-name`).
- JS locals: camelCase (`planetMeshes`, `startTransition`).
- CSS custom properties: `--glass-bg`, `--accent-color` (cyan `#00f3ff` on index/brain; green `#00ff00` on pure_systems; bronze `#c48c40` on gallery; steel `#b7c3d1` on physicalus; gold `#d9a441` + green `#2f6d3a` on diy_realities; crimson `#ff2d55` on gate_left; gold `#d4af37` on gate_right).
- Global flags: `window.__aivoinko3d`, `window.__aivoinkoReveal`, `window.__aivoinkoSealExit` (double-underscore prefix = cross-script contract between the head snippet, the seal index, and the module).

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
5. **Do not restyle `diy_realities.html` as the index solar system or the green System Log terminal.** The route is the Khaeos Metalogs hall: DOM images `art/khaeos/khaeos-emblem.png` and `art/khaeos/khaeos-metalogs.png`, seven smooth rings tracking the wordmark, and a scroll that alternates: odd folios reuse the System Log terminal frame (`Courier Prime`, `#00ff00`, `>>> SYSTEM_ROOT_ACCESS`, glitch), even folios stay gold/bone. The page itself is not the System Log. `pure_systems.html` stays the green terminal. Outbound work links live in the Bio Verkko cabinet. `khaeos-logo.png` and the other `art/khaeos/` planes are unused. The home nav label stays Library. If WebGL fails, the emblem, wordmark, and log text stay visible.
6. **Do not persist user state across pages** unless you add an explicit store; MPA navigations wipe memory.
7. **Do not raise `setPixelRatio` uncapped** or run the animation loop in background tabs — thermal/battery regressions on mobile.
8. **Do not load Three.js from a second CDN or a different major** without verifying import-map + OrbitControls paths.
9. **Do not cache-bust HTML via long `max-age` on `/*.html`** — `netlify.toml` currently forces revalidation for a reason.
10. **Do not claim MIT licensing in docs without a `LICENSE` file.** README asserts MIT; the file is absent.
11. **Do not turn the wormhole choice into a separate HTML loading page.** Seals live in `#wormhole-choice` on `index.html` during `warpState.phase === 'choose'`. `gate_left.html` / `gate_right.html` are destinations, not the interstitial.
12. **Do not route Gallery or Bio through the DIY seal hold.** `#nav-gallery` and `#nav-bio` use `warpState.directHref` and skip `choose`.

---

## 7. Known gaps (factual)

| Item | Status |
|---|---|
| Khaeos prose | Odd folios are green terminals: Finnish Multimieli (Entry 001.7, eight paragraphs; pipe-run sentences cut) then English Log Entry 2. Even folios are gold/bone Log Entries 1 and 3. `pure_systems.html` still holds the three English copies |
| `gate_left.html` copy | Title chrome only; narrative content not written yet |
| `gate_right.html` folios | Six English drafts with lacunae; not final |
| `taikoi-sun-portal.png` | Unreferenced binary |
| `LICENSE` | Missing despite README MIT claim |
| Shared CSS/JS modules | `seal-menu.css` / `seal-menu.js` on the eight subpages. Three.js bootstrap is still copied per page. |
| Seal index realms | Gallery index (`gallery.html`, `physicalus.html`): Physical Arts → `physicalus.html`, Artificial Arts → `gallery.html`. Cartomancy, Musical Theatre, Mineralogy do not navigate. Other six subpages list Section 1–4 and those items do not navigate |
| Gallery hangings | Eleven hangings on the hall (`01`–`04`, `06`, `08`–`13`). Unused stills `05-pact.jpg` and `07-window.jpg` remain under `art/` |
| i18n | Shell and other pages are English. `bio.html` body copy is Finnish. |
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
| 2026-10-17 | Hang The Window as a larger photo beside the miniatures | gallery.html, art/07-window.jpg, art/hangings/07-window-photo.png, art/frames/photo.png, architecture.md | User asked for a photograph-type hanging, larger, composed next to the cabinet pair | Thin black gallery frame. Salon: stacked miniatures 28vh + photo 62vh. Mobile swipe includes it. |
| 2026-10-17 | Hang The Visage in a fractal white-ivory frame | gallery.html, art/08-visage.jpg, art/hangings/08-visage-ivory.png, art/frames/fractal-ivory.png, architecture.md | User asked for magnificent fractal frames in white ivory | Solo 86vh bay after the salon. Black exterior punched so lace sits on the starfield. Mobile swipe includes it. |
| 2026-10-17 | Keep the return logo on the first gallery screen | gallery.html, architecture.md | `header` was `position: fixed`, so the home ball covered later hangings while scrolling | Logo is the first child of `#hall`, `position: absolute`. Exit fades `#hall` once (no stacked header fade). Mobile still shows the ball at the top. |
| 2026-10-17 | Reframe The Throne in gilt rococo | gallery.html, art/hangings/04-throne-rococo.png, art/frames/rococo.png, architecture.md | User rejected the bolted brutalist frame as ugly and asked for rococo | Louis XV gilt openwork, black exterior punched. Old `04-throne-brutalist.png` removed. Position and size unchanged. |
| 2026-10-17 | Reframe The Nautilus in carved walnut | gallery.html, art/hangings/02-nautilus-walnut.png, art/frames/walnut-carved.png, architecture.md | Titanium corner plates read as CGI; user asked for a more real, museum frame | Dark carved walnut + worn gilt sight. Old `02-nautilus-titanium.png` removed. Pair size unchanged. |
| 2026-10-17 | Quiet The Throne frame to dark ebonized wood | gallery.html, art/hangings/04-throne-dark.png, art/frames/ebonized.png, architecture.md | Gilt rococo was too loud; user asked for darker and more restrained | Simple black profile, thin bronze sight. Old `04-throne-rococo.png` removed. |
| 2026-10-17 | Warm The Visage frame toward the painting metals | gallery.html, art/hangings/08-visage-ivory.png, art/frames/fractal-ivory.png, architecture.md | Stark white ivory clashed with the gold/bronze still | Champagne-ivory grade on frame pixels only. Well and lace punch unchanged. |
| 2026-10-17 | Hang The Yantra alone as a square hero | gallery.html, art/06-yantra.jpg, art/hangings/06-yantra-cassetta.png, art/frames/cassetta.png, architecture.md | Salon of Pact + Yantra + Window did not work; user asked to keep only the beige plate, enlarge it, and give it worthy frames from the original still | Walnut outer + worn-gold inner cassetta. Pact and Window hangings removed from DOM/ARTWORKS. Sources `05-pact.jpg` and `07-window.jpg` kept unused. |
| 2026-10-17 | Hang The Axis as the ivory palace showpiece | gallery.html, art/09-axis.jpg, art/hangings/09-axis-ivory.png, art/frames/palace-ivory.png, architecture.md | User asked for megalomaniacal ivory frames on the new still and called it the draw | Gothic carved ivory + pierced lace, black exterior punched. Last 90vh bay after The Visage. Title moved with it. Mobile swipe includes it. |
| 2026-10-17 | Reframe The Visage in abstract bronze | gallery.html, art/hangings/08-visage-abstract.png, art/frames/abstract-bronze.png, architecture.md | Fractal ivory lace was too ornate; user asked for simpler abstract frames | Low-poly bronze/iridescent planes, rectangular silhouette. Old `08-visage-ivory.png` and `fractal-ivory.png` removed. Axis palace ivory unchanged. |
| 2026-10-17 | Hang The Grove in a modest carved-oak frame | gallery.html, art/10-grove.jpg, art/hangings/10-grove-oak.png, art/frames/grove-oak.png, architecture.md | User asked for proper frames on the new forest still, smaller than The Axis | Dark oak + antler relief, thin gilt sight. `.hanging--mid` 70vh after the 90vh Axis. Title moved with it. Mobile swipe includes it. |
| 2026-10-17 | Split the opening pair; add draft plaques on alternate sides | gallery.html, architecture.md | User asked for the first two hangings to be solo, slightly left/right on desktop, with a text slab on the other side | Eight solo bays. `bay--left` / `bay--right`. Plaque copy is draft. Mobile shows one bay (hanging + plaque). Cormorant added on gallery. Hangings unchanged. |
| 2026-10-17 | Enlarge Nautilus, Altar, and Axis on desktop | gallery.html, architecture.md | Generic `.hanging--hero` made most works the same size; user asked those three to read clearly larger | `.hanging--large` 86vh on those three only. Elder / Throne / Yantra / Visage stay 76vh; Grove 70vh. Mobile size rules unchanged. |
| 2026-10-17 | Add sharp gilt corner ornaments to plaques | gallery.html, architecture.md | User asked for minimalist pointed ornaments on the square plaque corners | L-brackets + small diamonds via `.plaque-corners`. Copy and layout unchanged. |
| 2026-10-17 | Make the mobile gallery a scroll hall | gallery.html, architecture.md | One-at-a-time swipe crammed hanging + plaque + logo + GALLERY into one phone screen; logo and title overlapped the work | Mobile `#hall` scrolls. All bays visible, stacked. `#realm-title` hidden. Logo in-flow. Swipe scrolls to the next bay. Desktop left/right plaques unchanged. |
| 2026-10-17 | Keep the gallery return logo circular on mobile | gallery.html, architecture.md | Mobile `max-width: 88px` left the 120px height attribute in place, so `border-radius: 50%` drew an oval | Header img is now square (`88×88` / `120×120`) with `aspect-ratio: 1`. |
| 2026-10-17 | Hang The Sigil in a Super Victorian gilt frame | gallery.html, art/11-sigil.jpg, art/hangings/11-sigil-victorian.png, art/frames/victorian-gilt.png, architecture.md | User added a gold emblem still and asked for a magnificent Super Victorian frame | Square gilt exhibition frame, black exterior punched. Solo bay after The Grove, draft plaque. |
| 2026-10-17 | Hang The Chorus in a multi-layer gilt frame | gallery.html, art/12-chorus.jpg, art/hangings/12-chorus-layered.png, art/frames/layered-gilt.png, architecture.md | User added stacked-face still and asked for frames that also step inward | Nested Victorian gilt + black velvet liner + inner gilt sight. Solo bay after The Sigil, draft plaque. |
| 2026-10-17 | Let stars stream through The Sigil well | gallery.html, art/hangings/11-sigil-victorian.png, architecture.md | User asked for the starfield to fly through the painting's black | Well black punched to alpha 0. `.hanging--void` uses a small shadow. Idle streaks while the bay is on screen. |
| 2026-10-17 | Restore gallery starfield after Sigil void patch | gallery.html, architecture.md | Extra `}` after the idle branch was a SyntaxError, so the Three.js module never started | Brace removed; void streaks wrapped in try/catch. Hangings were still visible via HTML fail-open. |
| 2026-10-17 | Hang The Prism in a polychrome Baroque frame | gallery.html, art/13-prism.jpg, art/hangings/13-prism-spectrum.png, art/frames/spectrum-gilt.png, architecture.md | User asked for the most excessive multi-hue frame on the new spectral corridor still | Iridescent gilt/oil-slick liner, exterior punched. Solo bay after The Chorus, draft plaque. |
| 2026-10-18 | Rename Pure Systems nav and title to System Log | index.html, pure_systems.html, architecture.md | The page is the log terminal; the old name did not say that | Home nav label and document title only. Route stays `pure_systems.html`. Log headings (Gamma Log, entries 2–3) unchanged. |
| 2026-10-18 | Add Northern Europe node telemetry rail under the home footer | index.html, architecture.md | Home needed a site-node / timezone readout; geolocation is blocked by Netlify headers | `#node-rail` is a fixed HUD. Mobile marquee, desktop static. Clock uses `Europe/Helsinki`. Fades with footer on entry/warp/sun. No API, no geolocation. |
| 2026-10-18 | Left wormhole seal is a tower eye with KIOMRA banner | index.html, architecture.md | Circular logo seal read as a sticker; left gate needed a Sauron-eye monument and an inspect label | `#seal-left` keeps the disc-sized hit box so the eye stays on the right seal's line. SVG tower + iris/pupil + Orbitron banner. Right seal and warp machine (`choose` / arrows / timeout) unchanged. |
| 2026-10-18 | Codex Operum / Fragmenta Apocrypha wormhole pair | index.html, gate_right.html, architecture.md | Left banner needed the codex name; right seal was still a plain logo and the gold gate was title-only | Left banner is CODEX / OPERUM. Right seal is a broken gold crypt-eye with FRAGMENTA / APOCRYPHA. `gate_right.html` is a six-folio nave. Route, timeout, and `gate_left.html` unchanged. |
| 2026-10-18 | Replace the left seal line-tower with a photoreal relic | index.html, art/codex-operum-monument.png, architecture.md | The SVG silhouette read as a diagram on a site of photographic frames | Monument is a punched PNG, centered on the oculus, bleeding off the left, top, and bottom. CODEX OPERUM sits on the hull tablet. Right seal unchanged. |
| 2026-10-18 | Rename home node rail to Sub-Tampere, Rämsöö | index.html, architecture.md | User replaced the Helsinki node label with the Tampere/Rämsöö site node | Copy is `Sub-Tampere, RÄMSÖÖ`. Coords now `61.3413° N, 23.3017° E` (MML/Finto). `Europe/Helsinki` clock unchanged. |
| 2026-10-18 | Rename DIY Realities nav and title to Library | index.html, diy_realities.html, architecture.md | The loom destination is the library gate | Home nav label and document title only. Route stays `diy_realities.html`. Warp, seals, and timeout unchanged. |
| 2026-10-18 | Seat Codex Operum on the relic plaque | index.html, architecture.md | The inscription sat on the carved band above the empty bronze plate | Banner offset tracks `--relic-w` so the two lines land in the plate. Relic image, eye, and right seal unchanged. |
| 2026-10-18 | Seal click opens a shared index on the six subpages | seal-menu.css, seal-menu.js, gallery.html, brain.html, pure_systems.html, diy_realities.html, gate_left.html, gate_right.html, architecture.md | The round logo was a direct home warp; the index needs one list under that button | Return still calls each page's `exitAnimation` via `__aivoinkoSealExit`. Realm names do not navigate. Close Menu scrolls `#hall` / `#nave` / the page scroller to the top. Index sun and home nav unchanged. |
| 2026-10-18 | Rebuild the Library room as the Khaeos temple | diy_realities.html, art/khaeos/, architecture.md | The magenta loom was a title placeholder; the destination is the Khaeos temple | Home nav stays Library. Route stays `diy_realities.html`. Warp-in, timeout, and seal Return unchanged. Planes sit at separate depths so stars pass between them. Fail-open still shows the header and the KHAEOΣ title if WebGL fails. |
| 2026-10-18 | Replace Library choice frames with one flat barge | index.html, architecture.md | The photoreal left relic and the right crypt read as two unrelated, heavy designs around the logo buttons | Both seals share one inline SVG hull: oval body, horned prow, side wings, stern cartouche. Left keeps the crimson slit over the logo. Right uses the same slit in brass. Names stay Codex Operum and Fragmenta Apocrypha. `art/codex-operum-monument.png` is unreferenced. Warp timing, routes, and hit targets (the discs) unchanged. |
| 2026-10-18 | Replace the Khaeos planes with the logo and seven rings | diy_realities.html, architecture.md | The wood, parchment, nebula, and sigil read as flat game sprites | Only `art/khaeos/khaeos-logo.png` is loaded. Seven solid tori orbit the word; stars pass between them. Other `art/khaeos/` files stay on disk unused. Warp, timeout, seal Return, and the Library nav label unchanged. DOM title is fail-open only. |
| 2026-10-18 | Turn Khaeos into a scroll hall with a sharp wordmark | diy_realities.html, art/khaeos/khaeos-metalogs.png, art/khaeos/khaeos-emblem.png, architecture.md | The Greek plane was grainy and filled the viewport; the room is a story hall | Document title is Khaeos Metalogs. Nav label stays Library. Emblem and Metalogs are DOM images; seven rings track `#metalogs`. The three System Log blocks are copied verbatim in gold/bone. `pure_systems.html` is unchanged. `khaeos-logo.png` is unused. Warp, timeout, and seal Return unchanged. WebGL failure still shows the images and the logs. |
| 2026-10-18 | Hook the Metalogs wordmark and replace the seal brain | diy_realities.html, art/khaeos/khaeos-metalogs.png, art/khaeos/khaeos-emblem.png, architecture.md | The gold word was a plain roman; the menu button still read as a brain | Wordmark is Goudy Old Style, upright, with hooked terminals. The seal is the hex star, not circle-cropped. Other pages still use the brain JPEG. |
| 2026-10-18 | Strip the Library choice back to two logo discs | index.html, art/codex-operum-monument.png, architecture.md | The barge frames, slits, and name plates around the logos were rejected | `#seal-left` and `#seal-right` are the circular logo only. Hull SVG, iris, pupil, and cartouche text are gone. Monument PNG removed. Warp timing and routes unchanged. |
| 2026-10-18 | Add Bio as a fourth home route and a portrait hall | index.html, bio.html, art/bio/01-tie.jpg, art/bio/02-kaari.jpg, art/bio/03-vesi.jpg, art/bio/04-metsa.jpg, architecture.md | Home needed a biography section for the four portraits | `#nav-bio` uses the Gallery direct warp (`boost` → `commit`, no seals). Hall is a name plate, four CSS cassetta portraits at 50vh (42vh mobile), Finnish draft plaques, and a closing plate. Sources were already 768×1024, so they were not upscaled. Seal realm list unchanged. System Log href and Library choice unchanged. |
| 2026-10-18 | Open Physicalus as the gallery's photo hall | physicalus.html, art/physicalus/01-hundred.jpg, art/physicalus/02-pair.jpg, art/physicalus/03-ridge.jpg, seal-menu.js, seal-menu.css, architecture.md | The seal realm needed a side gallery for the Damascus jewelry made with Joni at Riimu Takomo, without art frames | Seal item Physicalus goes to `physicalus.html`. Same black starfield as the gallery. Three steel plates, maker's slips. Return reverse-warps to `gallery.html`. Other realms still have no href. Sources were already ~1000px, so they were not upscaled. Gallery hangings and home nav unchanged. |
| 2026-10-18 | Replace the Library discs with a limen salon | index.html, art/limen/lintel.png, art/limen/codex-hanging.png, art/limen/fragment-hanging.png, art/limen/codex-study.png, art/limen/fragment-study.png, architecture.md | Two floating logos did not show the three fates of the hold | One split stone lintel. Codex and Fragmenta are the same gilt cassetta; the right stile is broken. Logo JPEG sits in a punched well. Inward plaques. Studies do not navigate. The Khaeos emblem, ring, and label read `--choose` and are not a button. Timeout, arrows, and Gallery/Bio direct warps unchanged. `gate_left.html` still has no folio copy. |
| 2026-10-18 | Add a Finnish Multimieli folio at the top of the Khaeos hall | diy_realities.html, architecture.md | The crypt needed a Richard Multimieli scroll above the copied System Log | First `#logs` folio is GAMMA LOG, Entry 001.7, eight Finnish paragraphs. The three English System Log folios follow. `pure_systems.html` is unchanged. |
| 2026-10-18 | Set the Multimieli folio in a book face | diy_realities.html, architecture.md | Orbitron plus the log measure made the Finnish scroll read as another terminal entry | `.folio.utterance` uses Cinzel for the kicker and EB Garamond for the lines. Sentence openings are capitalized, including Nietzche. The pipe-run sentence is gone. The three English folios stay Orbitron and Cormorant. |
| 2026-10-18 | Set the Multimieli folio in System Log green type | diy_realities.html, architecture.md | The book face read worse than the log it replaced | Courier Prime and `#00ff00`, plus the System Log `glitch` skew on each Finnish paragraph, staggered. No terminal frame, root banner, or social links. English folios stay gold/bone. |
| 2026-10-18 | Alternate Khaeos folios between terminal and gold | diy_realities.html, architecture.md | The green type sat loose; the gold logs read as the balanced package | Odd articles are `.folio--terminal`: System Log frame, badge, Orbitron, Courier Prime, `#00ff00`, 900px, glitch. Even articles stay the gold Cormorant folio at 38rem. Multimieli and Log Entry 2 are green; Entries 1 and 3 are gold. `pure_systems.html` unchanged. |
| 2026-10-18 | Keep one note for the three Damascus views | physicalus.html, architecture.md | The three plates are the same pendant, so the later bays were separate pieces on the page | The maker's note stays on the first plate. Its last line links held / set down / turned. The other plates keep a thread back to that note. Starfield, steel cards, and Return to the gallery unchanged. |
| 2026-10-18 | Cap the seal index with a manuscript scroll | seal-menu.css, seal-menu.js, art/seal-scroll-top.png, art/seal-scroll-bottom.png, architecture.md | The open list needed a medieval frame after the names had finished falling | Rollers and side rules arrive about 700 ms after open, via `.is-framed`. Black exteriors are punched. Names, Return, and Close Menu are unchanged. `prefers-reduced-motion` shows the frame at once. |
| 2026-10-18 | Move the outbound work links from System Log into the Bio hall | bio.html, pure_systems.html, architecture.md | The Etsy and other work links belonged with the biography, not the green terminal | `#verkko` is a brass cabinet after the forest bay: DeviantArt, Etsy (Kiomra Trionfi), SoundCloud, LinkedIn, Trepo. Same URLs and `rel="noopener noreferrer"`. System Log header is the logo only; terminal `padding-top` is 160px. Log copy unchanged. Seal CSS still names `.social-links`, which no header uses. |
| 2026-10-18 | Hold the Library salon one second longer and drop the Khaeos caption | index.html, architecture.md | The choice hold felt short, and the center word sat under the emblem | `CHOOSE_MS` is 4200. The center emblem and orrery stay. Codex and Fragmenta plaques, routes, and Gallery/Bio direct warps are unchanged. |
| 2026-10-18 | Split the seal index into a gallery list and unfinished sections | seal-menu.js, architecture.md | The gallery hall names were opening on every room | `gallery.html` and `physicalus.html` list Physical Arts → `physicalus.html`, Artificial Arts → `gallery.html`, then Cartomancy, Musical Theatre, Mineralogy with no href. The other six subpages list Section 1–4 with no href. Return and Close Menu unchanged. |
| 2026-10-18 | Replace the round seal with a diamond stone button | seal-menu.css, seal-menu.js, art/seal-stone.png, pure_systems.html, architecture.md | The circular logo did not read as a menu control | Trigger is a punched basalt diamond on all eight seal pages. Page logo stays in the face (Khaeos emblem is not circle-cropped). Press sinks the stone; the name-fall and scroll frame are unchanged. System Log terminal `padding-top` is 176px. Home nav unchanged. |
| 2026-10-18 | Tighten the Bio hall on desktop | bio.html, architecture.md | Each folio and bay was `min-height: 100vh` (close folio 72vh), so the name plate sat about a viewport away from the first portrait | Desktop sections size to their content. Name-to-first-image gap is about 7vh; bay-to-bay about 9vh. Portrait cap stays 50vh. Mobile (`max-width: 768px`) padding and `min-height: 0` unchanged. |
| 2026-10-18 | Stretch the seal stone into a tall salmiakki | seal-menu.css, art/seal-stone.png, gallery.html, physicalus.html, gate_right.html, brain.html, pure_systems.html, bio.html, architecture.md | The square diamond did not read as a salmiakki; the user asked for more height at the same width | Trigger is 132×181px (104×142px under 768px). Logo stays circular. Desktop clearances: hall and first folio 216px, brain and System Log 220px. Press and the scroll index are unchanged. |
