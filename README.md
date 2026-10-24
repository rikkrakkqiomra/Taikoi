# Aivoinko

A public artistic site. The home page is an interactive 3D solar system. The other routes are narrative halls. There is no build step: each route is one HTML file, and Netlify publishes the repository root.

## Routes

| File | What it is |
|---|---|
| `index.html` | Home. Three.js solar system. Services is a normal link. Gallery and Bio warp directly. Library holds, then offers Codex Operum, Fragmenta Apocrypha, or Khaeos Metalogs. Click or tap the sun for The Opening of Reality. |
| `brain.html` | The Opening of Reality. Manifesto. Sun and the clipped keyboard link only. |
| `services.html` | Services. Same starfield and opening text as the sun page. Seal lists Branding, Business Strategy, Pricing, and Contact. |
| `branding.html` | Branding. Starfield page. Return goes to Services. |
| `business_strategy.html` | Business Strategy. Starfield page. Return goes to Services. |
| `pricing.html` | Pricing. Starfield page. Return goes to Services. |
| `contact.html` | Contact. Starfield page. Return goes to Services. |
| `gallery.html` | Sixteen framed hangings on a black starfield. |
| `physicalus.html` | Side hall of the gallery. Workshop photographs. |
| `cartomancy.html` | Cartomancy. The suit of Beliefs: thirteen cards, from Imagination to Freedom. |
| `bio.html` | Biography hall. Finnish copy, and outbound work links. |
| `diy_realities.html` | Khaeos Metalogs. The Library destination. |
| `gate_left.html` | Left Aperture. Entered from the left seal. |
| `gate_right.html` | Fragmenta Apocrypha. Entered from the right seal. |

The subpages share `seal-menu.css` and `seal-menu.js`. The seal opens an index. Return reverse-warps home. From Physicalus and Cartomancy, Return reverse-warps to the gallery. From Branding, Business Strategy, Pricing, and Contact, Return reverse-warps to Services.

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
