# Roll the Night

A playful lottery-style ball machine web app designed for couples. Couples choose how many rounds they are up for, start the machine, and watch numbered balls swirl inside an air-driven glass sphere before dropping into a tray. Each drawn ball links to a position on [sexpositions.club](https://sexpositions.club), giving couples an exciting and randomized way to discover new positions together.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open the provided local URL (typically `http://localhost:5173`) in your web browser.
4. To create a production build:
   ```bash
   npm run build
   ```

## Features

- **Lottery Ball Machine Simulation**: Canvas-based 60fps physics simulation with 20 swirling numbered balls inside a glass sphere with realistic collision detection, gravity, air turbulence, and specular highlights.
- **Configurable Rounds**: Adjustable rounds stepper from 1 to 10 (default 3) with an active draw tracker (e.g. "Draw ball 2 of 3").
- **Customizable Range**: Configurable highest position number (default 294, clamped between 10 and 9999) to support the full catalog.
- **Repeat Prevention**: Guarantees no duplicate position numbers are drawn within the same game.
- **Age Verification Gate**: Mandatory 18+ verification checkbox required before starting the machine.
- **Glassmorphic Game-Show Aesthetic**: Vibrant stage-lighting radial gradients, tactile chunky 3D buttons, glossy sphere reflections, and drop animations.
- **Dark & Light Mode**: Seamless support for both dark (default midnight purple) and light (warm vanilla) system themes via CSS tokens.
- **Accessible & Responsive**: Keyboard navigable with 3px gold focus rings, `aria-live` status announcements, safe area insets, and full responsiveness down to 320px viewports.
- **Reduced Motion Support**: Respects `prefers-reduced-motion` preferences by disabling tray drop animations.

## How Number Picking & External Links Work

When a ball is drawn, the app picks a cryptographically random integer between `1` and the configured highest number that has not yet been selected in the active session. The app then generates a link to `https://sexpositions.club/positions/{number}.html` with `target="_blank"` and `rel="noopener noreferrer"`.

> **Note**: This application does **NOT** scrape, copy, cache, or store any third-party content, images, descriptions, or data from sexpositions.club. The app exclusively generates random numbers and opens the public URL corresponding to the selected number in a new browser tab.

## Changelog

### 2026-11-07 – v1.0 – Initial build
- Created the "Roll the Night" couple's lottery ball machine application.
- Added 680x680 canvas ball physics with air agitation, damping, circular boundary bounce, ball-to-ball elastic collisions, and glass sphere rendering.
- Implemented state machine flow: Idle, Mixing (3.2s), Announcing (1.5s), Ball Drawn, and Finished ("Play again").
- Built rounds stepper (1–10), highest-number setting with clamping (10–9999), 18+ verification checkbox, and chunky primary action button.
- Added animated tray balls with radial specular highlights and external link captions.
- Implemented Google Fonts (Bungee and Figtree) with robust system fallbacks.
- Integrated full dark and light mode styling with CSS custom properties.
- Ensured keyboard accessibility (`aria-live`, stepper labels, canvas label) and responsive layout down to 320px.
- Touched files: `index.html`, `src/App.jsx`, `src/BallMachine.jsx`, `src/App.css`, `src/index.css`, `README.md`.
