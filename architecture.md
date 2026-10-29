# Taikoi / Aivoinko — Architecture

Authoritative description of the live repository as of 2026-10-29. This file is the source of truth for structure, data flow, integrations, and engineering constraints. Update it whenever those change.

---

## 1. Executive Overview & Purpose

**Product identity:** Aivoinko (stylized “Machine Metaphysics”) is a public artistic website: an interactive 3D solar-system simulator plus narrative subpages. `README.md` describes that multi-page site. Live document titles are `Aivoinko Machine Metaphysics` (`index.html`), `The Opening of Reality` (`brain.html`), `Services` (`services.html`), `Branding` (`branding.html`), `Business Strategy` (`business_strategy.html`), `Pricing` (`pricing.html`), `Contact` (`contact.html`), `Gallery` (`gallery.html`), `Physicalus` (`physicalus.html`), `Cartomancy` (`cartomancy.html`), `Bio` (`bio.html`), `Khaeos Metalogs` (`diy_realities.html`), `Left Aperture` (`gate_left.html`), and `Fragmenta Apocrypha` (`gate_right.html`). Canonical and Open Graph URLs use `https://taikoi.netlify.app`.

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
| Fonts | Google Fonts | `Orbitron` + `Rajdhani` + `Cormorant Garamond` 500/italic 500 (index; Cormorant is the Library limen plaques and the Khaeos label); `Orbitron` + `Rajdhani` (brain, services, branding, business_strategy, pricing, contact); `Orbitron` + `Cormorant Garamond` (gallery, physicalus, cartomancy, bio, gate_left, gate_right). Seal index uses Cormorant italic 500 + Orbitron on all thirteen seal pages. `Cinzel` on gate_right folios. On the Khaeos Metalogs hall (`diy_realities.html`): odd `#logs` articles (`.folio--terminal`) use the System Log block — `Orbitron` headings, `Courier Prime` body, `#00ff00`, frame, `>>> SYSTEM_ROOT_ACCESS`, and the `glitch` skew. Even articles stay `Orbitron` + `Cormorant Garamond` in gold/bone. There is no separate System Log page. |
| Database / ORM | None | All content is hardcoded in HTML/JS. |
| Build tools | None | No Vite, Webpack, Turbopack, or bundler. Netlify publishes the repo root as-is. |
| Runtime | Browser (WebGL) | Static files on Netlify CDN. No Node.js app runtime, no edge functions, no serverless functions. |
| Hosting | Netlify | `publish = "."` in `netlify.toml`. Remote: `https://github.com/rikkrakkqiomra/Taikoi`. |

### Core dependency breakdown

| Dependency | Role | How loaded |
|---|---|---|
| `three@0.160.0` (`three.module.js`) | Scene graph, WebGL renderer, geometries, materials, lights, raycaster, sprites | Import map → `https://unpkg.com/three@0.160.0/build/three.module.js`. Each page also carries a `preconnect` to `unpkg.com` and a `modulepreload` of this exact URL (`index.html` additionally preloads `OrbitControls.js`) so the engine fetch starts during head parse. |
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
├── brain.html                 # Manifesto page (“The Opening of Reality”). Sun and the clipped keyboard link only
├── services.html              # Same starfield and opening text as brain.html. Home nav “Services”
├── branding.html              # Services section. Starfield title plate. Return → services.html
├── business_strategy.html     # Services section. Starfield title plate. Return → services.html
├── pricing.html               # Services section. Starfield title plate. Return → services.html
├── contact.html               # Services section. Starfield title plate. Return → services.html
├── gallery.html               # Black starfield + 2D hangings; header reverse-warp home
├── physicalus.html            # Gallery side hall: same starfield, steel photo plates; Return → gallery.html
├── cartomancy.html            # Beliefs, Changes, Powers, and Relations suit guides. Thirteen cards each. Return → gallery.html
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
│   ├── 10-grove.jpg           # Unused still (The Grove hanging removed 2026-10-18)
│   ├── 11-sigil.jpg           # Source still
│   ├── 21-totem.jpg           # Source still (stacked shamanic faces). 894×894, not upscaled
│   ├── 13-prism.jpg           # Unused still (The Prism hanging removed 2026-10-18)
│   ├── 14-threshold.jpg       # Unused still (The Threshold hanging removed 2026-10-18)
│   ├── 15-phaeton.jpg         # Source still (futuristic noir automobile)
│   ├── 16-spore.jpg           # Source still (1970s pulp sci-fi mushroom)
│   ├── 17-spire.jpg           # Unused still (The Spire hanging replaced 2026-10-29)
│   ├── 24-potential.jpg       # Source still (seated keeper with unspent orb among skulls). 682×1024, not upscaled
│   ├── 18-valkyrie.jpg        # Source still (horned silver warrior queen)
│   ├── 19-conclave.jpg        # Unused still (The Conclave hanging replaced 2026-10-29)
│   ├── 23-futility.jpg        # Source still (harp and pale figure in a moss forest). 682×1024, not upscaled
│   ├── 20-signal.jpg          # Source still (column of light over a gold field). 682×1024, not upscaled
│   ├── 22-reliquary.jpg       # Source still (Giger biomechanical skull in a shrine). 682×1024, not upscaled
│   ├── seal-scroll-top.png    # Seal index roller. Black exterior punched
│   ├── seal-scroll-bottom.png # Matching lower roller
│   ├── seal-stone.png         # Tall obsidian salmiakki menu button. Black exterior punched. Rainbow sheen in the glass. Page logo sits in the well
│   ├── physicalus/            # Workshop photographs on physicalus.html (no art frames)
│   │   ├── 01-hundred.jpg     # 100-layer Damascus pendant in the palm
│   │   ├── 02-pair.jpg        # Brushed blank beside the etched pendant
│   │   └── 03-ridge.jpg       # Faceted hold of the same pendant
│   ├── cartomancy/            # cartomancy.html Beliefs (01–13), changes/, powers/, and relations/. Frame baked in; white exterior punched to transparency, feathered. 613×1024 RGBA PNG
│   │   ├── 01-imagination.png # I · Root — Imagination
│   │   ├── 02-bias.png        # II · Bias
│   │   ├── 03-dogma.png       # III · Dogma
│   │   ├── 04-doubt.png       # IV · Doubt
│   │   ├── 05-interpretation.png # V · Interpretation
│   │   ├── 06-dream.png       # VI · Dream
│   │   ├── 07-reverence.png   # VII · Reverence
│   │   ├── 08-assumption.png  # VIII · Assumption
│   │   ├── 09-story.png       # IX · Story
│   │   ├── 10-trust.png       # X · Trust
│   │   ├── 11-openness.png    # XI · Seeker — Openness
│   │   ├── 12-self.png        # XII · Keeper — Self
│   │   └── 13-freedom.png     # XIII · Master — Freedom
│   ├── hangings/
│   │   ├── 01-elder-gilt.png        # Precomposed 2D hanging (still + photoreal gilt frame, transparent exterior)
│   │   ├── 02-nautilus-walnut.png   # Precomposed 2D hanging (still + carved walnut frame, transparent exterior)
│   │   ├── 03-altar-bronze.png      # Hero hanging (still + winged bronze frame, transparent exterior)
│   │   ├── 04-throne-dark.png       # Finale hanging (still + ebonized frame, transparent exterior)
│   │   ├── 06-yantra-cassetta.png   # Hero hanging (still + walnut/gold cassetta frame, transparent exterior)
│   │   ├── 08-visage-baroque.png    # Hero hanging (still + baroque bronze frame, transparent exterior)
│   │   ├── 09-axis-ivory.png        # Showpiece hanging (still + palace ivory frame, transparent exterior)
│   │   ├── 11-sigil-victorian.png   # Hero hanging (gilt frame + gold emblem; well black punched for stars)
│   │   ├── 21-totem-wood.png        # Fourth hanging, monument (still + carved cedar shaman frame, transparent exterior). Larger than the other desktop hangings
│   │   ├── 15-phaeton-gilt.png      # Square hanging (still + antique Louis gilt frame, transparent exterior)
│   │   ├── 16-spore-nouveau.png     # Large hanging (still + Art-Nouveau gold/red-cabochon frame, transparent exterior)
│   │   ├── 24-potential-stone.png   # Large hanging (still + weathered limestone classical frame, transparent exterior)
│   │   ├── 18-valkyrie-iron.png     # Hero hanging (still + blackened-iron horn/bone frame, transparent exterior)
│   │   ├── 23-futility-oak.png      # Hero hanging (still + bog-oak/verdigris antler-vine frame, transparent exterior)
│   │   ├── 20-signal-obsidian.png   # Tenth hanging (still + black obsidian frame, transparent exterior)
│   │   └── 22-reliquary-pewter.png  # Sixteenth hanging (still + pewter Louis rococo frame, transparent exterior)
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
│       ├── baroque-bronze.png  # Heavy Italian baroque, bronze/iridescent (The Visage)
│       ├── victorian-gilt.png
│       ├── wood-totem.png     # Carved cedar shaman frame, ochre and turquoise in the cuts (The Totem)
│       ├── gilt-phaeton.png   # Aged gold leaf, acanthus corners, walnut liner (The Phaeton)
│       ├── nouveau-spore.png  # Art-Nouveau gold + red cabochons (The Spore)
│       ├── stone-spire.png    # Weathered limestone classical (The Potential)
│       ├── iron-valkyrie.png  # Blackened iron horn/bone (The Valkyrie)
│       ├── oak-conclave.png   # Bog-oak + verdigris antler/vine (Futility)
│       ├── obsidian-signal.png # Black obsidian, violet/teal/gold fractures (The Signal)
│       └── pewter-reliquary.png # Pewter / gunmetal Louis XV rococo, openwork punched (The Reliquary)
│   ├── bio/                   # bio.html portraits (CSS cassetta, not precomposed hangings)
│   │   ├── 01-tie.jpg
│   │   ├── 02-kaari.jpg
│   │   ├── 03-vesi.jpg
│   │   └── 04-metsa.jpg
│   ├── limen/                 # index.html Library choose salon (the two portal gates)
│   │   ├── codex-portal.png   # Live left gate. Sealed crimson/bronze arch door; alpha keyed from luminance so black lets stars through; edges feathered (inner side most)
│   │   ├── fragment-portal.png # Live right gate. Broken gold apocrypha arch; same luminance alpha + feathered edges
│   │   ├── codex-portal.jpg   # Source still for codex-portal.png (opaque, vignetted to black)
│   │   ├── fragment-portal.jpg # Source still for fragment-portal.png
│   │   ├── lintel.png         # Unused. Split limestone entablature; transparent ground
│   │   ├── codex-hanging.png  # Unused. Closed gilt cassetta; circular well punched
│   │   ├── fragment-hanging.png # Unused. Same cassetta; right stile broken; well punched
│   │   ├── codex-study.png    # Unused. Sealed scroll; transparent ground
│   │   └── fragment-study.png # Unused. Torn cipher scrap; transparent ground
│   └── khaeos/                # diy_realities.html shows the emblem, the wordmark, and khaeos-well.jpg
│       ├── khaeos-emblem.png  # Hex star sigil. Hall oculus and seal face, and the Library choose vanishing point. Not a circle crop
│       ├── khaeos-metalogs.png # Two-line gold wordmark, Goudy Old Style, transparent
│       ├── khaeos-well.jpg    # Painted hyperspace well, 1024². Black ground, screen-blended behind the oculus
│       ├── khaeos-logo.png    # Unused. Earlier Greek KHAEOΣ plane texture
│       ├── chlos.png          # Unused. Black ΧΛΟΣ
│       ├── hexxacro.png       # Unused. Green hexagram
│       ├── wood-arch.png      # Unused. Wood wall with a punched oculus
│       ├── wood-wall.jpg      # Unused uncut wood source
│       ├── wood-beam.jpg      # Unused lintel strip
│       ├── parchment-left.jpg # Unused
│       ├── parchment-right.jpg # Unused
│       └── nebula.jpg         # Unused night window
├── diy_realities.html         # Khaeos Metalogs: oculus over a painted well, seven rings, coasting tunnel, staggered scroll
├── gate_left.html             # Crimson left aperture; content TBD
├── gate_right.html            # Fragmenta Apocrypha; gold starfield + unfinished folio nave
├── seal-menu.css              # Shared seal-index styles (thirteen subpages). Trigger is the diamond stone button
├── seal-menu.js               # Builds the seal index. Gallery halls on gallery/physicalus/cartomancy; Library rooms on diy_realities/gate_left/gate_right; Branding, Business Strategy, Pricing, Contact on the five Services pages; Section 1–4 on brain and bio. Return calls __aivoinkoSealExit
├── AiiAold.8dde82cb.jpg       # Favicon, preload, sun-portal sprite, header logos, wormhole seals, apple-touch icon
├── taikoi-sun-portal.png      # Tracked asset; not referenced by any HTML (unused)
├── robots.txt                 # Allow all crawlers; points at sitemap.xml
├── sitemap.xml                # Fourteen public routes. Origin https://taikoi.netlify.app
├── 404.html                   # Netlify not-found page. Static chrome only; no Three.js; noindex
├── LICENSE                    # MIT. Copyright 2026 Riku Korpiaho
├── netlify.toml               # Publish root + security + cache headers
├── README.md                  # Human-facing project description
└── architecture.md            # This file
```

No `.gitignore` in the current tree (removed in `85d5131`).

### Entry points

| Path | URL (Netlify static) | Role |
|---|---|---|
| `index.html` | `/` | Primary 3D solar system. Nav to Services (href), Gallery (direct streak warp), Bio (direct streak warp), and Library (warp + on-page wormhole choice). Sun click → `brain.html`. |
| `brain.html` | `/brain.html` | Starfield + floating manifesto blocks. Seal lists Section 1–4 (no href). Return → `index.html`. Reached by the sun and the clipped `#enter-opening` link. |
| `services.html` | `/services.html` | Same starfield and the same five manifesto blocks as `brain.html`. Seal lists Branding, Business Strategy, Pricing, and Contact. Return → `index.html`. |
| `branding.html` | `/branding.html` | Same starfield. Title plate only. Seal lists the four Services rooms. Return → `services.html`. |
| `business_strategy.html` | `/business_strategy.html` | Same starfield. Title plate only. Seal lists the four Services rooms. Return → `services.html`. |
| `pricing.html` | `/pricing.html` | Same starfield. Title plate only. Seal lists the four Services rooms. Return → `services.html`. |
| `contact.html` | `/contact.html` | Same starfield. Title plate only. Seal lists the four Services rooms. Return → `services.html`. |
| `gallery.html` | `/gallery.html` | Black starfield (Three.js warp only) + 2D photographic hangings with draft text plaques. Seal opens the gallery index; Return reverse-warps → `index.html`. Sixteen solo bays; hangings alternate left/right on desktop. Fourth is The Totem in a carved cedar frame. Last is The Reliquary in a pewter rococo frame. After the last bay, Gallery then an obsidian return stone reverse-warps home. Seal item Physical Arts opens `physicalus.html`. Artificial Arts is this hall. Cartomancy opens `cartomancy.html`. Musical Theatre and Mineralogy do not navigate. |
| `physicalus.html` | `/physicalus.html` | Side hall of the gallery (Physical Arts). Same black starfield. Three workshop photographs of Damascus jewelry on cool steel plates (no art frames). Seal opens the same gallery index as `gallery.html`. Artificial Arts opens `gallery.html`. Return reverse-warps → `gallery.html`. |
| `cartomancy.html` | `/cartomancy.html` | Beliefs, Changes, Powers, and Relations suits of the tarot fork. Black starfield, land dropdown, thirteen cards with English readings under each image. Seal opens the gallery index. Return reverse-warps → `gallery.html`. All four lands are open. |
| `bio.html` | `/bio.html` | Black starfield + scroll hall. Opening name plate, four CSS-framed portraits (`art/bio/`), Finnish draft plaques, a sand tray (`#minusta`) under the first portrait, a Verkko cabinet of outbound work links, closing plate. Seal opens the index; Return reverse-warps → `index.html`. Portraits are not under a `bio/` root folder. |
| `diy_realities.html` | `/diy_realities.html` | Khaeos Metalogs. Home nav label stays Library. Default wormhole timeout destination. DOM emblem and wordmark over `art/khaeos/khaeos-well.jpg`, seven smooth rings tracking the wordmark, coasting warp streaks after arrival, scroll hall with plates staggered off a center axis. Odd folios are green System Log terminals (Multimieli, then Log Entry 2). Even folios stay gold/bone (Log Entry 1, then Log Entry 3). Seal opens the index; Return reverse-warps → `index.html`. |
| `gate_left.html` | `/gate_left.html` | Crimson vertical slit. Entered by left seal. Seal opens the index; Return reverse-warps → `index.html`. Title only. |
| `gate_right.html` | `/gate_right.html` | Fragmenta Apocrypha: gold/zinc starfield + scrollable nave of six unfinished folios. Entered by right seal. Seal opens the index; Return reverse-warps → `index.html`. |
| `404.html` | any unknown path | Netlify not-found. Static chrome, no import map, no WebGL, `noindex`. Link returns to `index.html`. |
| `robots.txt` | `/robots.txt` | Allows all crawlers and names `sitemap.xml`. |
| `sitemap.xml` | `/sitemap.xml` | The fourteen public routes. Not `404.html`. |
| `netlify.toml` | n/a | Deployment contract: publish directory and HTTP headers. |

Each of the fourteen scene pages is a **layout wrapper for itself**: `<head>` (meta, import map, fail-open script, fonts, CSS) + `<body>` (chrome + `#canvas-container` + page content) + trailing `<script type="module">` (Three.js scene). `404.html` is static chrome only. There is no shared layout partial or middleware. The thirteen subpages share `seal-menu.css` and `seal-menu.js` for the logo index. The trigger is `art/seal-stone.png` (punched obsidian salmiakki, 132×216px, 104×170px under 768px); the page logo sits in the well, circle-cropped except the Khaeos emblem. `index.html` does not.

### Navigation graph

```
index.html  --nav "Services"---->  services.html       --seal Return-->  index.html
                 services seal Branding ----------> branding.html          --seal Return--> services.html
                 services seal Business Strategy -> business_strategy.html --seal Return--> services.html
                 services seal Pricing -----------> pricing.html           --seal Return--> services.html
                 services seal Contact -----------> contact.html           --seal Return--> services.html
index.html  --sun click/tap------->  brain.html         --seal Return-->  index.html
index.html  --nav "Gallery"------->  streak warp (boost → commit, no seals) → gallery.html
                 gallery seal Return ->  reverse-warp → index.html
                 gallery seal Physical Arts -> physicalus.html --seal Return--> gallery.html
                 gallery seal Artificial Arts -> gallery.html (current hall; closes and scrolls)
                 gallery seal Cartomancy -> cartomancy.html --seal Return--> gallery.html
                 physicalus seal Artificial Arts -> gallery.html
                 physicalus seal Cartomancy -> cartomancy.html
                 cartomancy seal Physical Arts -> physicalus.html
                 cartomancy seal Artificial Arts -> gallery.html
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
| `mode` (`enter` / `idle` / `exit`) | `gallery.html`, `physicalus.html`, `cartomancy.html`, `bio.html`, `diy_realities.html`, `gate_left.html`, `gate_right.html` | Warp-in, settled scene, reverse-warp home. Physicalus and Cartomancy exit href is `gallery.html`; the others go to `index.html`. |
| `ARTWORKS` / `focusIndex` | `gallery.html` | Hardcoded stills + `FRAMES` overlay (`walnut` / `gilt` / `iron`). Hangings are DOM figures, not meshes. `focusIndex` is read from `?focus=N` and scrolls `#hall` once after enter. Native scroll does not advance it. `physicalus.html` uses the same query on its three plates. |
| `speedMultiplier` | `index.html` | `0.15` if `innerWidth < 768` at init; not recomputed on rotate-to-landscape unless reload |
| node clock interval | `index.html` | 1000 ms while the tab is visible; cleared on `document.hidden`; in-memory only |
| `window.__aivoinko3d` | All pages | `true` after module starts; `false` if WebGL constructor throws |
| `window.__aivoinkoReveal` | All pages | Fail-open UI if the module never sets `__aivoinko3d` |
| `window.__aivoinkoSealExit` | Thirteen subpages | Page module assigns its `exitAnimation`. Seal index Return calls it. Unset → `location.href = 'index.html'`. `physicalus.html` and `cartomancy.html` assign an exit whose href is `gallery.html`. `branding.html`, `business_strategy.html`, `pricing.html`, and `contact.html` assign an exit whose href is `services.html`. |

No `localStorage`, `sessionStorage`, cookies, or IndexedDB.

### Auth / session

**None.** No login, tokens, CSRF, RBAC, or session cookies. Outbound work links on `bio.html` are public `target="_blank"` anchors with `rel="noopener noreferrer"`.

### Shared runtime pattern (all fourteen pages)

1. **Fail-open UI:** Head script registers `error` / `unhandledrejection` and a 2500 ms timeout. If `window.__aivoinko3d` is still falsy, `html.ui-ready` is applied so chrome is not trapped behind a blank WebGL failure. `index.html` also removes `#loading`.
2. **WebGL try/catch:** Renderer construction failure sets `__aivoinko3d = false`, calls `__aivoinkoReveal`, rethrows.
3. **Loop control:** Prefer `renderer.setAnimationLoop`; fall back to `requestAnimationFrame`. Pause on `document.hidden`; resume on visible; reset `lastFrameTime` to avoid a huge delta spike.
4. **Delta time:** `dt = min(deltaMs, 50) / (1000/60)` so motion is frame-rate independent and hitch-capped.
5. **Pixel ratio:** `Math.min(devicePixelRatio, 2)`.
6. **Entry/exit:** Scene scale 0.001 → 1 (cubic out) on enter for index / brain / services and the four service sections; reverse cubic in then `location.href` on exit (brain and services Return → `index.html`; Branding, Business Strategy, Pricing, and Contact Return → `services.html`; index sun → `brain.html`). **Gallery and Bio warps** are `#nav-gallery` and `#nav-bio` `preventDefault` → `boost` (~1500 ms teal/bronze streaks + FOV) → `commit` (~900 ms) → `gallery.html` or `bio.html`. Seals stay closed. **Library warp** stays on `index.html` until a destination is chosen: `#nav-diy` `preventDefault` → `boost` (~1500 ms streaks + FOV) → `choose` (~4200 ms hold, flash ~0.4, limen salon in `#wormhole-choice`: two full-height portal gates — a sealed crimson Codex door (`art/limen/codex-portal.png`) on the left and a broken gold Fragmenta arch (`art/limen/fragment-portal.png`) on the right — alpha-keyed PNGs so the warp streaks fly through their black and all edges feather into the starfield — each a `.gate` button with an inward plaque and an outward-pulsing chevron; a non-click Khaeos emblem vortex in the center whose ring and scale read `--choose`; prefetch of the three destinations) → `commit` (~900 ms). Timeout commits `forward` → `diy_realities.html`. Left/right seal (or arrow keys) yaw-shear commit → `gate_left.html` / `gate_right.html`. **Do not** insert a loading page for this beat. Gallery/DIY/gate pages start flash at opacity 0.5 and fade it in ~400 ms; gallery is a 2D photographic hanging over a black starfield; Bio is the same black starfield with a scroll of CSS-framed portraits and Finnish plaques; DIY is the Khaeos Metalogs hall: a DOM emblem and wordmark over a painted well, seven smooth rings tracking the wordmark, coasting warp streaks after arrival, and a scroll that alternates odd green System Log terminals with even gold/bone folios, staggered off a center axis; left is a crimson vertical slit with stars from +X; right is a gold folio nave over a hex-ornament starfield with stars from −X. Seal click opens the shared index (`seal-menu.js`). Return calls `__aivoinkoSealExit`, which reverse-warps to `index.html`. Close Menu smooth-scrolls `#hall`, `#nave`, `.floating-container`, or `.terminal-container` to the top and folds the list. Physicalus href is `physicalus.html`; Return on that page reverse-warps to `gallery.html`. Cartomancy href is `cartomancy.html`; Return on that page reverse-warps to `gallery.html`. Musical Theatre and Mineralogy still have no href. `bfcache` `pageshow` resets warp/FOV/fog/camera pose, hides seals, and replays entry.

### `index.html` simulation specifics

- **Sun:** procedural Canvas texture + additive glow sprite + invisible collider (`radius * 0.9`) for picking. Logo JPEG is cropped to a circle and applied to a pulsing `THREE.Sprite`.
- **Planets:** 8 solar-system bodies + fictional `Astroteles Aivoinko II` (`type: 'synthetic'`). Saturn has a `RingGeometry`. Orbits are `EllipseCurve` line loops.
- **Desktop:** camera starts at `(0, 140, 280)` (3/4 view). `mousemove` updates NDC mouse; click on sun collider starts transition; hover raycast drives tooltip + cursor. A clipped link `#enter-opening` (“Enter The Opening of Reality”) calls the same `startTransition()`. Its `href` stays `brain.html` when JavaScript does not run. Nothing in that link is painted on screen.
- **Mobile:** camera starts top-down at `(0, 250, 6)` so orbits read as circles; `touchstart` (passive) raycasts planets + sun; tap planet locks tooltip; tap empty space clears; tap sun transitions. Header nav is full-width with four centered labels (CSS `max-width: 768px` only): Services, Gallery, Library, and Bio. Type is `0.64rem`.
- **Node rail:** `#node-rail` is a full-bleed HUD under the existing status footer. Copy is the site node (`Northern Europe, Sub-Tampere, RÄMSÖÖ` at `61.3413° N, 23.3017° E`) plus a live `Europe/Helsinki` clock and UTC offset. No geolocation. Mobile (`max-width: 899px`) CSS-marquee of two identical lines; desktop is static and centered. `prefers-reduced-motion: reduce` stops the marquee and lets the track scroll horizontally. A non-module inline script ticks the clock; it is not inside the Three.js module. The rail is `aria-hidden`, so the once-per-second clock is not announced. Pinch-zoom is allowed (`viewport` has no `maximum-scale` or `user-scalable=no`).
- **bfcache:** `pageshow` resets `isTransitioning`, camera pose, warp overlay, and replays entry animation.
- **Library choice:** `#wormhole-choice` during `choose`. Each frame sets `--choose` from `elapsed / CHOOSE_MS` (0–1). That variable fills the center orrery and scales `art/khaeos/khaeos-emblem.png`. The center is not a button. `#seal-left` (`.gate--codex`) and `#seal-right` (`.gate--fragment`) are full-height portal buttons: an alpha-keyed portal PNG (`pointer-events: none`; black is transparent so the warp streaks pass through and all edges feather into the starfield), an absolutely-positioned `.plaque`, and an animated `.chevron` pointing outward toward that gate. Hover/focus brightens and scales the portal, glows the plaque, and dims the other gate via `:has()`. `showChoice` sets header, footer, and `#node-rail` opacity to 0. Below 768px the gates widen to 50vw, the portal shrinks, and the italic plaque line is hidden. `prefers-reduced-motion` stops the chevron nudge and portal transform; the ring still fills. Arrow keys, 4200 ms timeout, and the Gallery/Bio direct warps are unchanged. `gate_left.html` is still title chrome only.

### `gallery.html` hall specifics

- **2D hangings:** `#hall` is DOM. Sixteen precomposed PNGs with transparent exteriors, last `art/hangings/22-reliquary-pewter.png`. Fourth is `art/hangings/21-totem-wood.png`. Tenth is `art/hangings/20-signal-obsidian.png`. Thirteenth is `art/hangings/24-potential-stone.png`. Fifteenth is `art/hangings/23-futility-oak.png`. Elder's gilt black inner slip is punched so the starfield shows between gold and canvas. The Sigil well punches the still's black so the starfield streams through the emblem; `.hanging--void` keeps a small drop-shadow so the hole stays open. `FRAMES` keeps punched overlays under `art/frames/` including `victorian-gilt.png`, the bespoke frames `gilt-phaeton.png`, `nouveau-spore.png`, `stone-spire.png`, `iron-valkyrie.png`, `oak-conclave.png`, `obsidian-signal.png`, `wood-totem.png`, `pewter-reliquary.png`, and `baroque-bronze.png`. The Chorus hanging, its layered-gilt frame, and `art/12-chorus.jpg` were removed. Assets are not under `gallery/` so they do not collide with Netlify Pretty URL `/gallery` (`gallery.html`).
- **`ARTWORKS`:** `{ src, alt, frame }`. Fourth hanging is The Totem (`woodTotem`), the desktop monument. Sixth is The Yantra (`cassetta`). Seventh is The Visage (`baroqueBronze`). Ninth is Super Victorian gilt (`The Sigil`). Tenth is The Signal (`obsidianSignal`). The last six are The Phaeton (`giltPhaeton`), The Spore (`nouveauSpore`), The Potential (`stoneSpire`), The Valkyrie (`ironValkyrie`), Futility (`oakConclave`), and The Reliquary (`pewterReliquary`). The `ARTWORKS`/`FRAMES` block is vestigial: it only runs when `#hall` has no `.hanging`, which never happens because the bays are hardcoded in the DOM.
- **Layout:** On desktop `#hall` is a fixed, scrollable overlay (`overflow-y: auto`). On mobile (`max-width: 768px`) the document scrolls and `#hall` is in normal flow, because a fixed inner scroller under the Safari toolbar hid the plaques. Sixteen solo bays. Desktop: hanging plus a `.plaque` on the opposite side; odd works slightly left (`bay--left`), even slightly right (`bay--right`). Desktop heights: Nautilus / Altar / Axis / Spore / Potential / Reliquary `.hanging--large` ~86vh; other heroes ~76vh; Phaeton `.hanging--square`. The Totem is `.hanging--monument` at `min(94vh, 56vw)`, larger than the other desktop hangings; on mobile it uses the same cap as the rest. Per-piece glow filters: `.hanging--phaeton` (quiet gilt), `.hanging--spore`, `.hanging--stone`, `.hanging--iron`, `.hanging--oak`, `.hanging--obsidian` (The Signal), `.hanging--totem`, `.hanging--pewter` (The Reliquary), `.hanging--baroque` (The Visage). `#realm-title` is a closer after the last bay, in normal flow (not a fixed footer): the word Gallery, then `#hall-return`, an obsidian salmiakki (`art/seal-stone.png`) with the page logo in the well, same size and press language as the header seal. Click calls `__aivoinkoSealExit` (reverse-warp to `index.html`). Desktop closer is a centered column (`min-height` 72vh, padding-top 6vh). Mobile stacks the word then the stone (104×170px) in a 70svh closer with padding-top 4vh; bottom padding includes the safe-area inset. The seal is `position: absolute` on desktop (first-bay padding) and `position: relative` in-flow on mobile so it does not cover the first hanging. Click opens the seal index; it does not warp until Return. Starfield canvas stays pinned (`position: fixed` on mobile). Mobile: bays stack (hanging then plaque). Hangings fade in without the desktop drift transform. Each still has `width`/`height` so a lazy image reserves its box and does not push the plaque off screen. Mobile stills cap at `min(94vw, 62svh)` with image `max-height: 62svh`, and `#hall` side padding is `3vw`. Optional `?focus=N` scrolls `#hall` on desktop and the window on mobile.
- **Plaques:** hardcoded English drafts in each bay (`h2` + blockquote + two short paragraphs). Cormorant Garamond body, Orbitron title. Copy is a first pass; not final. Square corners have a thin gilt L-bracket and a 5px diamond via `.plaque-corners`.
- **Three.js:** starfield + enter/exit streaks only. No OrbitControls, no 3D rails. Scene clear is black (`#000`). When The Sigil bay is in the `#hall` viewport, a second well-frustum streak field (`VOID_COUNT` 1100) streams through the punched black; the hall starfield stays the slow idle points.
- **Fail-open:** `#hall` hangings remain in the HTML/CSS even if WebGL never starts (`html.ui-ready`).

### `physicalus.html` hall specifics

- **Plates:** `#hall` is DOM over the same black starfield as `gallery.html`. Three workshop JPEGs under `art/physicalus/`: `01-hundred.jpg` (984×1024), `02-pair.jpg` (768×1024), `03-ridge.jpg` (768×1024). Each sits on a cool steel card (bevel, 1px sight, glass sheen). No frame PNG and no gilt corners. Sources were already about 1000px on the long edge, so they were not upscaled.
- **Slips:** One English maker's note, on the first plate only (`#hundred`). Orbitron kicker and credit, Cormorant italic title. Credit is Riimu Takomo with Joni. The pendant is 100-layer Damascus. The note's last line links the three views of that same piece: held, set down, turned. Later plates have no second title. A `.thread` under each repeats "The Hundred" and scrolls `#hall` back to `#view-hand`.
- **Layout:** Three solo bays. The first pairs the plate with the note. The next two are the same pendant, plate plus thread, alternating left/right. `#realm-title` follows the last bay on desktop and is hidden on mobile. Seal is absolute on desktop and in-flow on mobile. Mobile stacks plate then note or thread and scrolls natively. Optional `?focus=N`. In-hall `#` links scroll `#hall`, not the document.
- **Three.js:** Same enter/idle/exit streak field as the gallery (2200 stars, flash 0.28 fading in ~350 ms). No void well, no OrbitControls. Seal Return assigns `__aivoinkoSealExit`, which reverse-warps to `gallery.html`. Fail-open keeps the plates readable.
- **Route:** The gallery index (`gallery.html`, `physicalus.html`, and `cartomancy.html`) lists Physical Arts → `physicalus.html`, Artificial Arts → `gallery.html`, Cartomancy → `cartomancy.html`, then Musical Theatre and Mineralogy with no href. The Library index (`diy_realities.html`, `gate_left.html`, `gate_right.html`) lists Liber / Ready → `gate_left.html`, Manuscript / Foul Papers → `gate_right.html`, and Metalog → `diy_realities.html`. The Services index (`services.html`, `branding.html`, `business_strategy.html`, `pricing.html`, `contact.html`) lists Branding → `branding.html`, Business Strategy → `business_strategy.html`, Pricing → `pricing.html`, and Contact → `contact.html`. `brain.html` and `bio.html` list Section 1–4 and those items do not navigate. Assets stay under `art/physicalus/` so they do not collide with Netlify Pretty URL `/physicalus`.

### `cartomancy.html` hall specifics

- **Deck:** `#hall` is DOM over a black starfield. Four suits of thirteen RGBA PNGs, each 613×1024, with the card frame baked into the still. Beliefs lives at `art/cartomancy/01-imagination.png` … `13-freedom.png`. Changes lives at `art/cartomancy/changes/01-time.png` … `13-adaptation.png`. Powers lives at `art/cartomancy/powers/01-potential.png` … `13-focus.png`. Relations lives at `art/cartomancy/relations/01-fate.png` … `13-unity.png`. The pure-white exterior that originally boxed each rounded card was punched to transparency (PIL border flood-fill, sum-of-channel `thresh=26`, so the bone frame is never touched), then eroded ~5px (`MinFilter(11)`) and Gaussian-feathered (`GaussianBlur(3.2)`) so the edge and the baked gray shadow ring dissolve into the starfield rather than reading as a white halo. `.card img` carries a soft symmetric drop-shadow plus a faint amethyst glow (no hard offset), so stars pass the rounded corners. Beliefs rank order: I Imagination (Root), II Bias, III Dogma, IV Doubt, V Interpretation, VI Dream, VII Reverence, VIII Assumption, IX Story, X Trust, XI Openness (Seeker), XII Self (Keeper), XIII Freedom (Master). Changes rank order: I Time (Root), II Fear, III Attachment, IV Opportunity, V Manifestation, VI Inspiration, VII Futility, VIII Sacrifice, IX Renewal, X Adjustment, XI Curiosity (Seeker), XII Vision (Keeper), XIII Adaptation (Master). Powers rank order: I Potential (Root), II Avoidance, III Pain, IV Failure, V Struggle, VI Play, VII Swiftness, VIII Pleasure, IX Control, X Courage, XI Clarity (Seeker), XII Resilience (Keeper), XIII Focus (Master). Relations rank order: I Fate (Root), II Duality, III Tension, IV Authenticity, V Exploration, VI Reflection, VII Language, VIII Celebration, IX Solitude, X Equilibrium, XI Acceptance (Seeker), XII Love (Keeper), XIII Unity (Master). The first image of the selected land is eager; the rest use `loading="lazy"`. Sources were already 613×1024, so they were not upscaled.
- **Land select:** `#land-select` is a native dropdown labeled Maa / Land. Value `beliefs` shows `#suit-intro`, `#index-beliefs`, and `#deck-beliefs`. Value `changes` shows `#suit-intro-changes`, `#index-changes`, and `#deck-changes`. Value `powers` shows `#suit-intro-powers`, `#index-powers`, and `#deck-powers`. Value `relations` shows `#suit-intro-relations`, `#index-relations`, and `#deck-relations`. The sealed option is gone; `#deck-sealed` remains in the DOM and shows only if the select value is not one of the four lands. `?land=beliefs`, `?land=changes`, `?land=powers`, or `?land=relations` selects that land on load.
- **Readings:** English draft under each card. Orbitron rank, Cormorant italic title and epigram, two short paragraphs, and an “In a reading” line. Court cards (XI–XIII) use a gilt reading border. In-hall `#` links scroll `#hall`, not the document. `?focus=N` is 1-based (1–13) and scrolls to that card of the selected land after enter.
- **Three.js:** Same enter/idle/exit streak field as the gallery (2200 stars, flash 0.28 fading in ~350 ms). Idle points lean amethyst (`#d4b0ea`) rather than the gallery warm gold. No void well, no OrbitControls. Seal Return assigns `__aivoinkoSealExit`, which reverse-warps to `gallery.html`. Fail-open keeps the cards readable (`html.ui-ready`).
- **Route:** Reached from the gallery seal index. Accent is amethyst `#c9a6e0`. Assets stay under `art/cartomancy/` so they do not collide with Netlify Pretty URL `/cartomancy`.

### `bio.html` hall specifics

- **Hall:** `#hall` is DOM over a black starfield. Opening plate, four alternating bays, closing plate, then `#realm-title` (hidden on mobile). The first bay (`#tie`) also holds the sand tray. Copy is Finnish draft. The companion in `02-kaari.jpg` is unnamed.
- **Portraits:** `art/bio/01-tie.jpg`, `02-kaari.jpg`, `03-vesi.jpg`, `04-metsa.jpg`. Each is 768×1024. Display cap is 50vh (42vh under 768px), inside a CSS cassetta: bone mat, 8px charcoal list, brass hairline, 8px corner ticks. No generated frame PNG.
- **Plaques:** same corner language as the gallery (`.plaque-corners`). Cormorant Garamond body, Orbitron chapter labels.
- **Minusta:** `#minusta` is a full-width sand tray under the first portrait and its Tie plaque. Pale sand, 12px walnut rail, four corner pegs, brass `MINUSTA` plate, ink body, rake rule, coda “Saaga jatkuu.” Cormorant Garamond on sand; Orbitron only on the plate. Not a `.plaque`.
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

- **One file = one route.** Page CSS and the Three.js module stay in the HTML they serve. Duplication of the Three.js bootstrap (renderer, loop, visibility pause, fail-open) is intentional. The seal index is the exception: `seal-menu.css` and `seal-menu.js` are shared by the thirteen subpages.
- **Pin Three.js in all fourteen import maps together.** Version drift between pages is a defect.
- **Hardcoded content.** Copy and planet stats are source, not CMS.
- **WebGL is optional for readability.** Subpage text and index chrome must remain reachable if WebGL/CDN fails (`__aivoinkoReveal`).
- **Performance caps:** DPR ≤ 2; mobile orbit speed × 0.15; pause loop when the tab is hidden; gas-giant texture turbulence uses a precomputed `xWave` array.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` + `aria-label`.
- **Local preview:** Serve over HTTP (`python -m http.server`, Live Server). `file://` can CORS-block the sun logo texture.

### Naming

- DOM ids: kebab-case (`canvas-container`, `planet-name`).
- JS locals: camelCase (`planetMeshes`, `startTransition`).
- CSS custom properties: `--glass-bg`, `--accent-color` (cyan `#00f3ff` on index, brain, and the five Services pages; bronze `#c48c40` on gallery; steel `#b7c3d1` on physicalus; gold `#d9a441` + green `#2f6d3a` on diy_realities; crimson `#ff2d55` on gate_left; gold `#d4af37` on gate_right; amethyst `#c9a6e0` on cartomancy).
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
5. **Do not restyle `diy_realities.html` as the index solar system or the green System Log terminal.** The route is the Khaeos Metalogs hall: DOM images `art/khaeos/khaeos-emblem.png`, `art/khaeos/khaeos-metalogs.png`, and `art/khaeos/khaeos-well.jpg`, seven smooth rings tracking the wordmark, a coasting tunnel, and a scroll that alternates: odd folios reuse the System Log terminal frame (`Courier Prime`, `#00ff00`, `>>> SYSTEM_ROOT_ACCESS`, glitch), even folios stay gold/bone, set to either side of a center axis. The page itself is not a separate System Log route. The green terminal lives only in this hall. Outbound work links live in the Bio Verkko cabinet. `khaeos-logo.png` and the other `art/khaeos/` planes are unused. The home nav label stays Library. If WebGL fails, the emblem, wordmark, and log text stay visible.
6. **Do not persist user state across pages** unless you add an explicit store; MPA navigations wipe memory.
7. **Do not raise `setPixelRatio` uncapped** or run the animation loop in background tabs — thermal/battery regressions on mobile.
8. **Do not load Three.js from a second CDN or a different major** without verifying import-map + OrbitControls paths.
9. **Do not cache-bust HTML via long `max-age` on `/*.html`** — `netlify.toml` currently forces revalidation for a reason.
10. **Do not claim MIT licensing in docs without a `LICENSE` file.** `LICENSE` is MIT, copyright 2026 Riku Korpiaho. README points at that file.
11. **Do not turn the wormhole choice into a separate HTML loading page.** Seals live in `#wormhole-choice` on `index.html` during `warpState.phase === 'choose'`. `gate_left.html` / `gate_right.html` are destinations, not the interstitial.
12. **Do not route Gallery or Bio through the DIY seal hold.** `#nav-gallery` and `#nav-bio` use `warpState.directHref` and skip `choose`.

---

## 7. Known gaps (factual)

| Item | Status |
|---|---|
| Khaeos prose | Odd folios are green terminals: Finnish Multimieli (Entry 001.7, eight paragraphs; pipe-run sentences cut) then English Log Entry 2. The Finnish article is `lang="fi"`; its English signature is `lang="en"`. Even folios are gold/bone Log Entries 1 and 3. Those folios are the only remaining System Log text |
| `gate_left.html` copy | Title chrome only; narrative content not written yet |
| `gate_right.html` folios | Six English drafts with lacunae; not final |
| `taikoi-sun-portal.png` | Unreferenced binary |
| Canonical origin | `robots.txt`, `sitemap.xml`, and every page canonical / Open Graph URL assume `https://taikoi.netlify.app`. A custom domain must change those strings together |
| Shared CSS/JS modules | `seal-menu.css` / `seal-menu.js` on the thirteen subpages. Three.js bootstrap is still copied per page. |
| Seal index realms | Gallery index (`gallery.html`, `physicalus.html`, `cartomancy.html`): Physical Arts → `physicalus.html`, Artificial Arts → `gallery.html`, Cartomancy → `cartomancy.html`. Musical Theatre and Mineralogy do not navigate. Library index (`diy_realities.html`, `gate_left.html`, `gate_right.html`): Liber / Ready → `gate_left.html`; Manuscript / Foul Papers → `gate_right.html`; Metalog → `diy_realities.html`. Services index (`services.html`, `branding.html`, `business_strategy.html`, `pricing.html`, `contact.html`): Branding, Business Strategy, Pricing, Contact. `brain.html` and `bio.html` list Section 1–4 and those items do not navigate |
| Gallery hangings | Sixteen hangings on the hall (`01`–`04`, `06`, `08`–`09`, `11`, `15`–`16`, `18`, `20`–`24`). The Totem (`21`) is the fourth bay. The Signal (`20`) is the tenth bay, after The Sigil. The Potential (`24`) is the thirteenth bay, in the old Spire slot. Futility (`23`) is the fifteenth bay, in the old Conclave slot. The Reliquary (`22`) is the last bay. The Totem replaced The Chorus. The Chorus hanging, `layered-gilt.png`, and `art/12-chorus.jpg` were deleted | The Prism (`13`), The Grove (`10`), The Threshold (`14`), The Conclave hanging, and The Spire hanging were removed. Unused stills `05-pact.jpg`, `07-window.jpg`, `10-grove.jpg`, `13-prism.jpg`, `14-threshold.jpg`, `17-spire.jpg`, and `19-conclave.jpg` remain under `art/`; the `13-prism-spectrum.png` hanging and `spectrum-gilt.png` frame were deleted; the `10-grove-oak.png` hanging and `grove-oak.png` frame were deleted; the self-framed `14-threshold-baroque.png` hanging was deleted; `19-conclave-oak.png` and `17-spire-stone.png` were deleted |
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
| 2026-10-18 | Drop the bay swipe on Gallery and Physicalus | gallery.html, physicalus.html, architecture.md | A fast vertical flick often drifted past 48px sideways, and the stale `focusIndex` then smooth-scrolled back to an old bay while momentum was still running | `touchstart` / `touchend` and `setFocus` are gone. `#hall` native scroll and `?focus=N` remain. In-hall Physicalus links still scroll `#hall`. Bio, Khaeos, and the gates never had the swipe. Desktop plaques unchanged. |
| 2026-10-18 | Remove The Prism and add six new framed gallery hangings | gallery.html, art/hangings/14..19, art/frames/{deco-amber,nouveau-spore,stone-spire,iron-valkyrie,oak-conclave}.png, art/14..19 source stills, deleted art/hangings/13-prism-spectrum.png + art/frames/spectrum-gilt.png, architecture.md | User asked to drop the Prism (judged weak) and add six supplied artworks with frames tailored to each image | New bays after The Chorus, alternating left/right: Threshold (self-framed gilt Baroque), Phaeton (deco-amber), Spore (nouveau-spore), Spire (stone-spire), Valkyrie (iron-valkyrie), Conclave (oak-conclave). Five bespoke frames were AI-generated with a chroma-key panel (green inner / magenta exterior) then composited with PIL; the window insets were measured from alpha. The Threshold image already shipped framed, so only its black exterior was punched. Five new glow classes (`--deco/--spore/--stone/--iron/--oak`) plus reused `--spectrum`. `ARTWORKS`/`FRAMES` registry updated for parity but stays dead code. Verify: hall shows 16 bays; mobile stacks them; `?focus=N` still scrolls. Pitfall: long temp filenames exceeded Windows MAX_PATH during compositing (copied to short names). Index/Physicalus/Bio routes unchanged. |
| 2026-10-18 | Add a Minusta sand tray under the first Bio portrait | bio.html, architecture.md | The biography needed its own well, separate from the portrait plaques | `#minusta` sits in `#tie`, full width under the Tie plaque. Sand field, walnut rail, corner pegs, brass plate. Finnish first-person draft. Kaari, Vesi, Metsä, and Verkko plaques unchanged. No new font or asset. |
| 2026-10-18 | Lengthen the seal into rainbow obsidian | seal-menu.css, art/seal-stone.png, gallery.html, physicalus.html, gate_right.html, brain.html, pure_systems.html, bio.html, architecture.md | The basalt salmiakki needed a little more height and a glass that can sit in the starfield | Trigger is 132×216px (104×170px under 768px). Body is black obsidian; violet, teal, and gold stay in the bevel and fractures. Logo stays circular in the well. Desktop clearances: hall and first folio 256px, brain and System Log 260px. Press and the scroll index are unchanged. |
| 2026-10-18 | Open the Khaeos hall into a coasting hyperspace corridor | diy_realities.html, art/khaeos/khaeos-well.jpg, architecture.md | The arrival was a centered column and the tunnel stopped as soon as the title appeared | Hero is a full viewport: painted well, emblem, wordmark. Seven rings still track `#metalogs`. Idle keeps slow warp streaks; scroll speeds them. Plates stagger off a center axis. Odd/even folio faces, copy, seal, and Return are unchanged. `prefers-reduced-motion` uses the slow point field and flat plates. |
| 2026-10-18 | SEO metadata, keyboard sun path, and project files | index.html, brain.html, pure_systems.html, gallery.html, physicalus.html, bio.html, diy_realities.html, gate_left.html, gate_right.html, robots.txt, sitemap.xml, 404.html, LICENSE, README.md, architecture.md | Pages had no description, Open Graph, Twitter, canonical, or theme-color tags. Home blocked pinch-zoom and announced the node clock every second. The sun path had no keyboard route. README claimed MIT with no LICENSE file | Visuals, narrative copy, and Three.js 0.160.0 are unchanged. Canonical origin is `https://taikoi.netlify.app`. `#enter-opening` is clipped off screen and calls `startTransition()`. `#node-rail` is `aria-hidden`. Finnish Khaeos folio is `lang="fi"`. Gallery entry-point count corrected to sixteen bays. No Content-Security-Policy was added. `seal-menu.js` had no content diff. Verify a shared link shows the logo card, pinch-zoom works on the home page, and activating the clipped link still plays the sun transition. |
| 2026-10-18 | Make the seal scroll field more opaque | seal-menu.css, architecture.md | The open list sat at 80% opacity, so the hanging behind it read through the names | Framed field is `rgba(18, 12, 6, 0.97)`; the fall-in field is `0.94`. Edge mask, rollers, and the name timing are unchanged. |
| 2026-10-18 | Lazy-load off-screen hall images; warm the Three.js CDN | gallery.html, bio.html, physicalus.html, index.html, brain.html, pure_systems.html, diy_realities.html, gate_left.html, gate_right.html, architecture.md | The gallery shipped all sixteen hanging PNGs (~37 MB) on load, and no page preconnected to unpkg although it gates the whole 3D scene | Added `loading="lazy"` to every off-screen image (gallery hangings 2–16, bio portraits 2–4, physicalus plates 2–3); the first hanging/portrait/plate and the Khaeos arrival hero stay eager. Added `<link rel="preconnect" href="https://unpkg.com" crossorigin>` and `<link rel="modulepreload" .../three.module.js>` to all nine pages (index also modulepreloads OrbitControls). No visual, frame, plaque, warp, or seal change. Same pinned 0.160.0 URL, so no double-fetch. Verify: first paint needs only the logo + first image; later bays fetch on scroll; DevTools shows the Three.js module requested during head parse. |
| 2026-10-18 | Punch The Chorus velvet liner so stars pass the inner gilt | art/hangings/12-chorus-layered.png, art/frames/layered-gilt.png, architecture.md | The black mat between the outer gilt and the inner sight was opaque, so the idle starfield stopped on the frame. Elder’s matching slip was already open. | Dark non-gold liner set to alpha 0 on the hanging and the overlay (~60px band). Gold rails and the stacked-face still stay. Hero drop-shadow unchanged; the gap still reads stars through the 18px blur. Other hangings unchanged. |
| 2026-10-18 | Remove The Grove from the gallery hall | gallery.html, deleted art/hangings/10-grove-oak.png, deleted art/frames/grove-oak.png, architecture.md | User judged the forest still a wrong and unnecessary work between The Axis and The Sigil | Bay, plaque, `.hanging--mid`, and `groveOak` removed. Later bays flipped so left/right alternation continues (Axis stays left, Sigil is right, Conclave is left). Source `art/10-grove.jpg` kept unused, same as Pact, Window, and Prism. Fifteen bays. Sigil void streaks, other plaques, and `?focus=N` unchanged. |
| 2026-10-18 | Open Cartomancy as the Beliefs suit guide | cartomancy.html, art/cartomancy/01-imagination.jpg … 13-freedom.jpg, seal-menu.js, sitemap.xml, README.md, architecture.md | The gallery seal listed Cartomancy with no href; the first land of the tarot fork is the thirteen-card suit of Beliefs | Seal item Cartomancy opens `cartomancy.html` from gallery, physicalus, and cartomancy. `#land-select` shows Beliefs; lands II–IV stay sealed. English draft readings sit under each card. Return reverse-warps to `gallery.html`. Musical Theatre and Mineralogy still have no href. Cards are 613×1024 and were not upscaled. Three.js stays 0.160.0. Home nav unchanged. Verify: Cartomancy shows Imagination through Freedom; a sealed land replaces the deck with the unopened plate; Return warps to the gallery. |
| 2026-10-18 | Punch the white card borders so the starfield passes | cartomancy.html, art/cartomancy/*.png (replaced the 13 .jpg), architecture.md | The pure-white rectangle boxing each rounded card read as unprofessional and blocked the starfield | Each card is now a 613×1024 RGBA PNG: border-connected white flood-filled to transparent (PIL, sum `thresh=26`), eroded ~5px (`MinFilter(11)`), Gaussian-feathered (`GaussianBlur(3.2)`) so the white halo and baked gray shadow ring dissolve into the stars. `.card img` drop-shadow softened to a symmetric shadow + faint amethyst glow (no hard offset). Image `src` switched `.jpg`→`.png`; old JPEGs removed. `/art/*` must-revalidate already covers PNG. Verify: no white box around any card; corners show stars; the bone frame and titles stay intact; mobile stacking and `?focus=N` unchanged. |
| 2026-10-18 | Keep gallery plaques readable while scrolling on a phone | gallery.html, architecture.md | Mobile `#hall` was a fixed inner scroller (`overflow-x: hidden`) under `body { overflow: hidden }`, and every hanging kept an infinite `transform` plus stacked drop-shadows. iOS paints that scrollport under the toolbar and drops the untransformed plaque text. Lazy images also had no `width`/`height`, so each still opened at 0px and then shoved its plaque below the visual viewport | Below 768px the document scrolls, the canvas stays `position: fixed`, and hangings only fade (`hangFade`, no drift transform). Plaques sit above the still (`z-index: 2`) at `min-height: min-content`. Stills carry intrinsic `width`/`height` and cap at `52svh`. Desktop `#hall` scroll, drift, frames, and copy are unchanged. `?focus=N` uses `window.scrollTo` on mobile. Verify: on a phone, scroll past The Elder and the next plaque’s title and paragraphs stay on screen; a later bay does not jump when its image arrives. |
| 2026-10-18 | Remove The Threshold from the gallery hall | gallery.html, deleted art/hangings/14-threshold-baroque.png, architecture.md | User judged the iridescent corridor an unnecessary work between The Chorus and The Phaeton | Bay, plaque, and `.hanging--spectrum` removed. Later bays flipped so left/right alternation continues (Chorus stays left, Phaeton is right, Conclave is right). Source `art/14-threshold.jpg` kept unused. The hanging was self-framed, so no overlay file. Fourteen bays. Sigil void streaks, other plaques, and `?focus=N` unchanged. Page description count is fourteen. |
| 2026-10-18 | Scale every gallery hanging larger on a phone | gallery.html, architecture.md | Mobile stills were capped at `min(84vw, 52svh)`, so portrait frames sat in a wide black margin | Below 768px every `.hanging` is `min(94vw, 62svh)` and each image `max-height` is `62svh`. `#hall` side padding is `3vw`. The same rule covers hero, large, square, and the glow variants. Desktop heights, drift, plaques, and frames are unchanged. |
| 2026-10-18 | Melt the Library portals into the star rain | index.html, art/limen/codex-portal.png, art/limen/fragment-portal.png, architecture.md | The opaque portal JPEGs showed hard rectangular img edges and blocked the warp streaks | Portals are now alpha-keyed PNGs built from the JPEG sources with PIL: alpha from the max channel (black → transparent so streaks fly through), Gaussian-softened, then an asymmetric edge feather (inner side ~30%, outer ~6%, top/bottom ~10%) with smoothstep. The CSS `-webkit-mask`/`mask` linear fades were removed; portal `filter` brightness is 0.96. The `.jpg` sources stay on disk. Layout, plaques, chevrons, hover, routes, and timeout unchanged. |
| 2026-10-18 | Show the Gallery word at the end of the mobile hall | gallery.html, architecture.md | Below 768px `#realm-title` was `display: none`, so the closing word never appeared after The Conclave | Mobile keeps the same in-flow `#realm-title` after the last bay. Hall bottom padding moved onto that title, with the safe-area inset. Desktop title, plaques, and hangings unchanged. Verify: on a phone, scroll to the end; GALLERY is the last line, not a sticky footer. |
| 2026-10-18 | Open land II as the Changes suit | cartomancy.html, art/cartomancy/changes/01-time.png … 13-adaptation.png, architecture.md | The land dropdown listed II as sealed; the second suit of the fork is the thirteen-card land of Changes | `#land-select` value `changes` shows its own intro, index, and `#deck-changes`. Lands III–IV stay sealed. Same border punch as Beliefs (flood-fill `thresh=26`, `MinFilter(11)`, `GaussianBlur(3.2)`). `?land=changes` selects the suit; `?focus=N` scrolls inside the selected land. Beliefs markup and the seal index are unchanged. Verify: II · Changes lists Time through Adaptation; a sealed land still shows the unopened plate; Beliefs remains the default. |
| 2026-10-18 | Open land III as the Powers suit | cartomancy.html, art/cartomancy/powers/01-potential.png … 13-focus.png, architecture.md | The land dropdown listed III as sealed; the third suit of the fork is the thirteen-card land of Powers | `#land-select` value `powers` shows its own intro, index, and `#deck-powers`. Land IV stays sealed. Same border punch as the earlier suits. `?land=powers` selects the suit; `?focus=N` scrolls inside the selected land. Beliefs, Changes, and the seal index are unchanged. Verify: III · Powers lists Potential through Focus; IV still shows the unopened plate; Beliefs remains the default. |
| 2026-10-18 | Open land IV as the Relations suit | cartomancy.html, art/cartomancy/relations/01-fate.png … 13-unity.png, architecture.md | The land dropdown listed IV as sealed; the fourth suit of the fork is the thirteen-card land of Relations | `#land-select` value `relations` shows its own intro, index, and `#deck-relations`. The sealed option is removed; all four lands are open. A second Solitude export in the attachment was not used. Same border punch as the earlier suits. `?land=relations` selects the suit. Beliefs, Changes, Powers, and the seal index are unchanged. Verify: IV · Relations lists Fate through Unity; the dropdown has no sealed entry; Beliefs remains the default. |
| 2026-10-19 | Add The Signal as the fourth gallery hanging | gallery.html, art/20-signal.jpg, art/hangings/20-signal-obsidian.png, art/frames/obsidian-signal.png, architecture.md | The supplied column-of-light still needed an obsidian frame and a place after The Altar | Frame generated with a magenta exterior and a green window, then composited in PIL. Exterior punched; the green rim was stepped back four pixels so no chroma line remains. Source is 682×1024 and was not upscaled. Later bays flipped so left/right alternation continues (Signal is right, Throne is left, Conclave is left). Fifteen bays. `?focus=N` unchanged. |
| 2026-10-19 | Replace The Chorus with The Totem | gallery.html, art/21-totem.jpg, art/hangings/21-totem-wood.png, art/frames/wood-totem.png, deleted art/12-chorus.jpg, deleted art/hangings/12-chorus-layered.png, deleted art/frames/layered-gilt.png, architecture.md | The stacked-face still was judged a masterpiece and needed a shamanic wood frame in the Chorus bay; Chorus itself had to leave entirely | Cedar frame generated with a magenta exterior and a green window, then composited in PIL. Exterior punched; the green rim was stepped back three pixels. Source is 894×894 and was not upscaled. Desktop height is `min(94vh, 56vw)`, above the 86vh large hangings. Mobile uses the shared cap. The bay stays right, so later left/right sides are unchanged. Fifteen bays. |
| 2026-10-20 | Reframe The Phaeton in antique gilt | gallery.html, art/hangings/15-phaeton-gilt.png, art/frames/gilt-phaeton.png, deleted art/hangings/15-phaeton-deco.png, deleted art/frames/deco-amber.png, architecture.md | The black neon Art-Deco frame read as cheap against the winter street | Louis gilt with acanthus corners and a walnut liner. Magenta exterior punched; green rim stepped back three pixels. Source `art/15-phaeton.jpg` (894×894) was not upscaled. Bay, plaque, and square layout stay. Glow is quiet gold, not amber/cyan. |
| 2026-10-21 | Swap The Signal and The Totem | gallery.html, architecture.md | The two hangings needed to trade hall slots | Totem is now fourth, after The Altar. Signal is now tenth, after The Sigil. Both stay `bay--right`. Frames, plaques, sizes, and the other thirteen bays are unchanged. |
| 2026-10-21 | Name the Library seal rooms | seal-menu.js, seal-menu.css, architecture.md | The Library scroll still listed Section 1–4 | `diy_realities.html`, `gate_left.html`, and `gate_right.html` share `LIBRARY_REALMS`: Section 1 (no href), Liber / Ready → `gate_left.html`, Manuscript / Foul Papers → `gate_right.html`, Metalog → `diy_realities.html`. Realm labels may wrap. Gallery index and other Section 1–4 pages unchanged. |
| 2026-10-21 | Drop Section 1 from the Library seal | seal-menu.js, architecture.md | The Library scroll should have only the three named rooms | `LIBRARY_REALMS` is Liber / Ready, Manuscript / Foul Papers, Metalog. Gallery index and other Section 1–4 pages unchanged. |
| 2026-10-23 | Replace System Log with Services and four starfield rooms | index.html, deleted pure_systems.html, services.html, branding.html, business_strategy.html, pricing.html, contact.html, seal-menu.js, sitemap.xml, README.md, architecture.md | The green terminal was a leftover; the log already lives in the Library hall. The home tab needed a Services route, and that route needed its own rooms | Home nav “Services” is a normal href, same slot as the old System Log link. `services.html` copies the sun page’s five blocks. Brain copy, sun path, and `#enter-opening` are unchanged. Branding, Business Strategy, Pricing, and Contact are title plates on the same starfield; their seal Return goes to `services.html`. Services Return goes to `index.html`. Khaeos folios are unchanged. `pure_systems.html` is deleted. Verify: home shows Services; the seal on Services lists the four rooms; each room opens a starfield; brain still lists Section 1–4. |
| 2026-10-28 | Hang The Reliquary in pewter rococo | gallery.html, art/22-reliquary.jpg, art/hangings/22-reliquary-pewter.png, art/frames/pewter-reliquary.png, architecture.md | The supplied Giger shrine-skull still needed a gray-metallic rococo frame on the main gallery hall | Pewter Louis XV openwork generated with a magenta exterior and a green window, then composited in PIL. Exterior and pierced holes punched; green/magenta rims dilated off the metal so no chroma line remains. Source is 682×1024 and was not upscaled; hanging is 864×1152. Last bay after The Conclave, `bay--right`, `.hanging--large`. Sixteen bays. `?focus=N` unchanged. |
| 2026-10-28 | Obsidian return stone after Gallery | gallery.html, architecture.md | The lone Gallery word sat under the last hanging and read as leftover chrome | `#hall-return` reuses `art/seal-stone.png` and the logo well. Click calls `__aivoinkoSealExit` (same reverse-warp as seal Return). Header seal still opens the index. Desktop and mobile closers are a full-viewport centered column so Gallery and the stone do not sit under Reliquary. Mobile stone is 104×170px with safe-area padding. Verify: scroll past Reliquary; stone sits under Gallery; press reverse-warps home; top seal still opens the menu. |
| 2026-10-28 | Pull Gallery closer toward the last hanging | gallery.html, architecture.md | The closer was a full extra viewport, so Gallery started too far after Reliquary | Desktop `#realm-title` is 72vh with padding-top 6vh. Mobile is 70svh with padding-top 4vh. Stone, Return warp, and header seal are unchanged. |
| 2026-10-29 | Reframe The Visage in baroque bronze | gallery.html, art/hangings/08-visage-baroque.png, art/frames/baroque-bronze.png, deleted art/hangings/08-visage-abstract.png, deleted art/frames/abstract-bronze.png, architecture.md | The low-poly abstract frame was too modern for the still; user asked for baroque while keeping the bronze/iridescent grade | Heavy Italian baroque bronze with oil-slick highlights. Magenta exterior punched; green rim dilated off the metal. Source `art/08-visage.jpg` (682×1024) was not upscaled; hanging stays 1350×1800. Bay, plaque, and `.hanging--hero` size unchanged. Glow class is `.hanging--baroque`. |
| 2026-10-29 | Replace The Conclave with Futility | gallery.html, art/23-futility.jpg, art/hangings/23-futility-oak.png, deleted art/hangings/19-conclave-oak.png, architecture.md | User replaced the Conclave still with a forest harp figure and named it Futility | Same bog-oak vine overlay (`oak-conclave.png`). Source is 682×1024 and was not upscaled; hanging is 864×1152. Bay stays left, fifteenth, `.hanging--oak`. English plaque follows the supplied copy. Source `art/19-conclave.jpg` kept unused. Reliquary remains last. |
| 2026-10-29 | Replace The Spire with The Potential | gallery.html, art/24-potential.jpg, art/hangings/24-potential-stone.png, deleted art/hangings/17-spire-stone.png, architecture.md | User replaced the Spire still with a seated keeper holding an unspent orb; plaque copy is about potential | Same weathered limestone overlay (`stone-spire.png`). Source is 682×1024 and was not upscaled; hanging is 864×1152. Bay stays left, thirteenth, `.hanging--large` / `.hanging--stone`. Source `art/17-spire.jpg` kept unused. Valkyrie and later bays unchanged. |
| 2026-10-29 | Fill Futility inner window; remove top black bar | art/hangings/23-futility-oak.png, architecture.md | The first composite used a tight rectangle (art from y=203) while the vine hole opens at y=172, so ~30px of empty inner window read as a black stripe on desktop and mobile | Still now cover-fills the full inner alpha hole of `oak-conclave.png` (bbox 57,172–807,1088). Empty inner pixels 0. Slight scale to 750×916 so the canopy meets the liner. Plaque, bay, and frame overlay unchanged. |
