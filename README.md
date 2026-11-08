# Roll the Night

A playful lottery-style ball machine web app designed for couples. Couples choose how many rounds they are up for, start the machine, and watch numbered balls swirl inside an air-driven glass sphere before dropping into a tray. Each drawn ball reveals a position from the app's own built-in database of 52 original entries — tapping a ball opens a beautiful reveal card with the position name, category, difficulty, and description.

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
- **Built-in Position Database**: 52 original positions across 10 categories (Classic, Face to Face, From Behind, Side by Side, Sitting, Standing, Kneeling, Edge & Furniture, Adventurous, Oral) with difficulty ratings from Easy to Expert.
- **Position Reveal Cards**: Tapping a drawn ball opens an accessible `<dialog>`-based card showing the position name, category badge, difficulty dots, and a full description.
- **Configurable Rounds**: Adjustable rounds stepper from 1 to 10 (default 3) with an active draw tracker (e.g. "Draw ball 2 of 3").
- **Repeat Prevention**: Guarantees no duplicate positions are drawn within the same game.
- **Age Verification Gate**: Mandatory 18+ verification checkbox required before starting the machine.
- **Glassmorphic Game-Show Aesthetic**: Vibrant stage-lighting radial gradients, tactile chunky 3D buttons, glossy sphere reflections, and drop animations.
- **Dark & Light Mode**: Seamless support for both dark (default midnight purple) and light (warm vanilla) system themes via CSS tokens.
- **Accessible & Responsive**: Keyboard navigable with 3px gold focus rings, `aria-live` status announcements, native dialog focus trapping, safe area insets, and full responsiveness down to 320px viewports.
- **Reduced Motion Support**: Respects `prefers-reduced-motion` preferences by disabling tray drop and card reveal animations.

## How Number Picking Works

When a ball is drawn, the app picks a random position from the built-in database that has not yet been drawn in the current game. Tapping a drawn ball opens a reveal card showing that position's details inline.

> **Note**: All position data is **original content** written for this app. No third-party content has been scraped, copied, cached, or stored from any external website.

## Changelog

### 2026-11-08 – v1.5 – One-time Age Gate & Spiciness levels
- **One-Time Age Gate** (`src/components/AgeGate.jsx`, `src/components/AgeGate.css`, `src/utils/storage.js`):
  - Moved the 18+ confirmation from an inline settings checkbox to an atmospheric full-screen entrance modal shown on first visit.
  - Persists confirmation state to `localStorage` under `roll_the_night_age_verified`, preventing it from ever reappearing on subsequent visits or refreshes.
  - Includes a safe exit option redirecting users under 18.
- **Spiciness Level Modes** (`src/constants/spiciness.js`):
  - Added 4 distinct couple intensity tiers to filter the 514-position catalog:
    - 🌶️ **Mild (Play It Safe)**: 210 comfortable, gentle positions with zero physical strain.
    - 🌶️🌶️ **Spicy (Daring & Fun)**: 394 positions balancing classic comfort with exciting new angles.
    - 🔥 **Wild (Adventurous)**: 304 daring, acrobatic, and athletic positions for fearless couples.
    - 🎲 **All In (Full Catalog)**: All 514 positions across every intensity tier.
  - Added an interactive segmented picker in `src/components/SettingsPanel.jsx` showing the active tier's description, badge, and live position count.
  - Automatically clamps rounds to the active pool size and dynamically draws only matching positions.
- Touched files: `src/components/AgeGate.jsx` (new), `src/components/AgeGate.css` (new), `src/constants/spiciness.js` (new), `src/utils/storage.js` (new), `src/components/SettingsPanel.jsx`, `src/components/index.js`, `src/App.jsx`, `src/App.css`, `README.md`.

### 2026-11-08 – v1.4 – Pokéball split reveal, holographic card flip, confetti & arcade sound effects
- Implemented **Floating Pokéball Reveal Flow** (`src/components/FloatingRevealBall.jsx` & `src/components/FloatingRevealBall.css`):
  - When picked, the ball floats to the center of the screen, scales up, and pulses with a radiant aura and sparkle glints.
  - Tapping the ball triggers a mechanical latch snap, splitting the ball horizontally into top and bottom domes like a Pokéball, emitting a bright energy beam from the core.
  - A collectible **Pokémon-style Holographic Secret Rare card** rises from the center, performing a 3D perspective flip from its branded card back to reveal the shimmering foil front with the position's name, illustration, type, level, difficulty stars, and description.
  - Tapping "Collect & Continue" animates the card folding back into the ball, the halves snapping shut with a satisfying click, and the ball floating down to settle smoothly into the tray.
- Built **Zero-Dependency Procedural Sound Engine** (`src/utils/sound.js`):
  - Synthesizes 6 distinct arcade audio effects via the Web Audio API: air mixing whoosh, ascending floating chime, mechanical ball split snap, celebratory major-triad triumph fanfare with harmonic shimmer bells, latch shut click, and soft tray drop thud.
  - Added sound mute/unmute toggle button in `src/components/Header.jsx`.
- Created **Canvas Confetti Particle System** (`src/utils/confetti.js`):
  - Launches 110 fluttering metallic confetti pieces across the viewport at the exact moment the card flips and reveals its face.
- Added accessibility support with reduced-motion overrides across all 3D card flips and ball split animations.
- Touched files: `src/components/FloatingRevealBall.jsx` (new), `src/components/FloatingRevealBall.css` (new), `src/utils/sound.js` (new), `src/utils/confetti.js` (new), `src/components/Header.jsx`, `src/components/index.js`, `src/App.jsx`, `src/App.css`, `README.md`.

### 2026-11-08 – v1.3 – Component modularization & 514 position catalog
- Modularized `src/App.jsx` by breaking UI sections into focused components under `src/components/`:
  - `Header.jsx`: Title and subtitle display.
  - `MachineStage.jsx`: Canvas sphere stage wrapper and exit chute.
  - `StatusLine.jsx`: `aria-live="polite"` status announcements.
  - `SettingsPanel.jsx`: Rounds stepper, catalog size indicator, 18+ verification checkbox, and primary action button.
  - `BallTray.jsx`: Drawn balls tray with interactive tap-to-reveal buttons.
  - `HintLine.jsx`: Post-game reveal prompt.
  - `index.js`: Clean barrel exports for all components.
- Added `src/utils/colors.js` for centralized ball color palette and dynamic darkening utilities.
- Integrated full 514-position catalog into `src/data/positions.js` with position illustrations stored in `public/images/positions/`.
- Updated `PositionCard.jsx` to render the actual position illustration images with safe fallback to category silhouette art, safety level indicators, style tags, and direct source link.
- Touched files: `src/App.jsx`, `src/components/Header.jsx` (new), `src/components/MachineStage.jsx` (new), `src/components/StatusLine.jsx` (new), `src/components/SettingsPanel.jsx` (new), `src/components/BallTray.jsx` (new), `src/components/HintLine.jsx` (new), `src/components/BallMachine.jsx`, `src/components/PositionCard.jsx`, `src/components/PositionCard.css`, `src/components/index.js` (new), `src/utils/colors.js` (new), `src/data/positions.js`, `README.md`.

### 2026-11-08 – v1.2 – Position card illustrations
- Added `src/PositionIllustration.jsx` with original inline SVG silhouette art for all 10 position categories (Classic, Face to Face, From Behind, Side by Side, Sitting, Standing, Kneeling, Edge & Furniture, Adventurous, Oral). Each illustration is a minimalist two-figure composition coloured to match the drawn ball.
- Updated `src/PositionCard.jsx` to display the category illustration at the top of the reveal card, above the ball badge.
- Updated `src/PositionCard.css` — added illustration area with radial glow background; repositioned the close button with glass-blur styling to overlay the illustration; added horizontal padding to text content; scoped the "Got it" button width with side margins.
- Updated `README.md` with this changelog entry.
- Touched files: `src/PositionIllustration.jsx` (new), `src/PositionCard.jsx`, `src/PositionCard.css`, `README.md`.

### 2026-11-08 – v1.1 – Built-in position database and reveal cards
- Added `src/data/positions.js` with 52 original positions across 10 categories, each with name, description, category, and difficulty (1–5).
- Added `src/PositionCard.jsx` and `src/PositionCard.css` — a `<dialog>`-based modal card that reveals position details when a drawn ball is tapped, with animated entrance, difficulty dots, category badge, and "Got it" dismiss button.
- Updated `src/App.jsx` to draw from the built-in database instead of generating blind external links. Removed the "Highest number" input (no longer needed). Tray balls now open the reveal card on tap instead of linking to an external site.
- Updated `src/App.css` — replaced highest-number input styles with a position count info line; updated tray ball links to button styling.
- Updated `README.md` with revised feature list, data sourcing note, and this changelog entry.
- Touched files: `src/data/positions.js` (new), `src/PositionCard.jsx` (new), `src/PositionCard.css` (new), `src/App.jsx`, `src/App.css`, `README.md`.

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
