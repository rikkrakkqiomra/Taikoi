# Aivoinko

A public artistic site. The home page is an interactive 3D solar system. Services and the sun open the Services landing. The other public routes are narrative halls. There is no build step: each route is one HTML file, and Netlify publishes the repository root.

## Routes

| File | What it is |
|---|---|
| `index.html` | Home. Three.js solar system. Services and the sun collapse into Services. Gallery and Bio warp directly. Library holds, then offers Codex Operum, Fragmenta Apocrypha, or Khaeos Metalogs. |
| `services.html` | Services landing. Four room links on the same starfield. Seal lists The Work, Business Strategy, Pricing, and Contact. |
| `vault/opening.html` | The Opening of Reality manifesto. Vaulted. Netlify serves 404 for `/brain` and `/vault/*`. |
| `branding.html` | The Work brochure. Four service sands on the starfield. Return goes to Services. |
| `business_strategy.html` | Business Strategy. Centered scroll: vision and four instruments. Return goes to Services. |
| `pricing.html` | Pricing. Four engagements and their durations. Return goes to Services. |
| `contact.html` | Contact. LinkedIn. Return goes to Services. |
| `gallery.html` | Sixteen framed hangings on a black starfield. |
| `physicalus.html` | Side hall of the gallery. Workshop photographs. |
| `cartomancy.html` | Cartomancy. The suit of Beliefs: thirteen cards, from Imagination to Freedom. |
| `bio.html` | Multimieli. Finnish copy, portraits, and outbound work links. |
| `cv.html` | CV. English vita. Return goes to Bio. |
| `diy_realities.html` | Khaeos Metalogs. The Library destination. |
| `gate_left.html` | Left Aperture. Entered from the left seal. |
| `gate_right.html` | Fragmenta Apocrypha. Entered from the right seal. |

The subpages share `seal-menu.css` and `seal-menu.js`. The seal opens an index. Return reverse-warps home. From Physicalus and Cartomancy, Return reverse-warps to the gallery. From The Work, Business Strategy, Pricing, and Contact, Return reverse-warps to Services. From CV, Return reverse-warps to Bio.

Artwork stills, frames, and hangings live under `art/`. The live logo, favicon, and sun sprite are `AiiAold.8dde82cb.jpg`.

## Stack

- HTML, CSS, and vanilla JavaScript (ES modules). No bundler and no `package.json`.
- Three.js `0.160.0` from unpkg, pinned in every page import map. OrbitControls is used on the home page only.
- Google Fonts: Orbitron, Rajdhani, Cormorant Garamond, Courier Prime, and Cinzel.

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/rikkrakkqiomra/Taikoi.git
   ```

2. Serve the folder over HTTP, then open the site root. A local server is required so the browser can load the sun logo and the ES modules. Examples: VS Code Live Server, or `python -m http.server`.

Opening `index.html` as a `file://` URL can fail the logo texture on a cross-origin check.

## License

MIT. See `LICENSE`.
