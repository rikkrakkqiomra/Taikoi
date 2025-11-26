# Aivoinko Aurinko Reality Simulator

A stunning, interactive 3D simulation of the Solar System, built with **Three.js** and **HTML5 Canvas**. This project features procedural texture generation, realistic orbital mechanics, and a premium Sci-Fi aesthetic.

![Aivoinko Aurinko](https://github.com/rikkrakkqiomra/Taikoi/raw/main/AiiAold.jpg)

## 🌌 Features

### 🔭 Interactive 3D Simulation
- **Full Solar System**: Includes the Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn (with rings), Uranus, and Neptune.
- **Realistic Orbits**: Planets orbit at relative speeds and distances.
- **Procedural Textures**: All planet textures are generated programmatically using the HTML5 Canvas API—no external image assets required for planets.
- **"Eye of the Brain" Sun**: A unique, glowing sun visualization featuring a custom "Eye" texture with a procedural fallback.

### 🎮 Interactive Experience
- **Desktop**: Hover over planets to reveal detailed scientific data (Mass, Diameter, Temperature) via Sci-Fi tooltips.
- **Mobile**: Optimized "Tap-to-Show" interaction. Tap a planet to lock the tooltip; tap empty space to dismiss.
- **Controls**: Zoom, pan, and rotate the camera freely around the solar system.

### 🎨 Visuals & UI
- **Glassmorphism UI**: Sleek, modern header and footer with frosted glass effects.
- **Cinematic Lighting**: Dynamic point lighting from the Sun and ambient starlight.
- **Starfield Background**: A procedurally generated 3D starfield adds depth and immersion.
- **Responsive Design**: Seamlessly adapts to desktop and mobile screens.

## 🛠️ Technologies

- **Three.js**: For 3D rendering and scene management.
- **HTML5 Canvas API**: For procedural texture generation.
- **Vanilla JavaScript**: Core logic and interaction handling.
- **CSS3**: For the Glassmorphism UI and animations.
- **Google Fonts**: 'Orbitron' and 'Rajdhani' for typography.

## 🚀 Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/rikkrakkqiomra/Taikoi.git
    ```
2.  Open `index.html` in your web browser.
    - *Note*: For the best experience (and to avoid CORS issues with the local Sun image), run it via a local server (e.g., VS Code Live Server or `python -m http.server`).

## 📱 Mobile Optimization

The simulation is fully optimized for mobile devices:
- **Performance**: Rendering resolution is capped to prevent overheating.
- **Interaction**: Touch-friendly "Tap-to-Show" tooltips.
- **Speed**: Planet orbits are slowed down on mobile for easier interaction.

## 📄 License

This project is open-source and available under the MIT License.