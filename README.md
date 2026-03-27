# A Drum Kit for Oliver

> [!IMPORTANT]
> **This repository is no longer maintained.**  
> Development has moved to the canvas-based version for improved performance: [corenominal/drum-kit-canvas.philipnewborough.co.uk](https://github.com/corenominal/drum-kit-canvas.philipnewborough.co.uk).

![A Drum Kit for Oliver](public/img/og-image-1200x630.png)

A browser-based drum kit built with HTML, CSS, and JavaScript, made as a fun interactive toy for my grandson Oliver.

Live at [drum-kit.philipnewborough.co.uk](https://drum-kit.philipnewborough.co.uk)

## Features

- **6 drum instruments** — crash cymbal, hi-hat, tom, snare, bass drum, and floor tom
- **Touch and click support** — works on mobile, tablet, and desktop
- **Visual feedback** — sparkle burst (circle, diamond, triangle, and star shapes) and expanding ring animations on every hit
- **Animated backgrounds** — randomly cycles through four vibrant colour themes on each hit
- **Welcome splash screen** — animated intro with a bouncing bass drum graphic and firefly particles; links to a How to Play modal
- **Loop mode** — press and hold any instrument for half a second to start it looping automatically at its own musical tempo; hold again to stop. Instruments can be layered together to build a beat
- **Combo system** — three combo types, all disabled while a loop is running:
  - *3-in-a-row* — hit the same drum three times quickly to trigger a per-instrument solo
  - *Duo combo* — alternate between two drums in an A → B → A → B pattern to trigger a dynamically generated duo solo
  - *All-6 combo* — hit all six instruments at least once to trigger the classic drum solo
- **COMBO! animation** — a full-screen colour burst and animated flying letters celebrate every combo trigger
- **Intro solo** — a short drum solo plays automatically when the page first loads
- **Progressive Web App (PWA)** — installable and fully usable offline via a service worker, with automatic page reload when a new service worker update is available

## Tech Stack

- Vanilla HTML, CSS, and JavaScript
- [Howler.js](https://howlerjs.com/) for cross-browser audio playback
- Service Worker for asset pre-caching and offline support
- Web App Manifest for PWA installability

## Project Structure

```
public/
├── index.html
├── manifest.json
├── sw.js
├── audio/         # MP3 samples for each instrument
├── css/           # Styles (reset + main)
├── img/           # SVG instrument graphics and app icons
└── js/
    ├── main.js    # App logic
    └── vendor/    # Howler.js library
```

## Getting Started

No build step required. Serve the `public/` directory with any static file server, for example:

```bash
npx serve public
```

Then open `http://localhost:3000` in your browser.

## License

See [LICENSE](LICENSE).
