# AniLearn (Premium Streaming Experience)

A fully-realized, production-level Anime Streaming Platform UI built strictly using **Vanilla HTML, CSS, and JavaScript**. 
AniLearn merges a sophisticated frontend layout reminiscent of top-tier streaming services (like AnimeKai, Crunchyroll) with robust client-side Javascript.

## 🔥 Premium Features

- **Cinematic Architecture:** Full-width hero banners with glassmorphism blending, overlaying titles, and robust call-to-actions.
- **AnimeKai Design Palette:** 
  - Immersive deep navy environments (`#0b0f19`) paired with striking cyber-orange accents (`#ff7a18`).
  - Seamless light-theme transitioning mapping safely without breakage.
  - Beautiful CSS Grid systems, `backdrop-filter` glass navigation, and interactive hover-zooms across all card structures.
- **Complex UI Widgets:**
  - Mocked **Continue Watching** carousel featuring visual progress bars.
  - Mocked **Top Trending** sidebar utilizing Gold, Silver, and Bronze ordinal rank mapping.
  - Mocked **Airing Schedule** matrices sorted by weekday.
  - Triple-column bottom layout distinguishing New Releases, Upcoming, and Completed shows.
- **Higher-Order Framework-Less Logic:** The dynamic center grid injects real world data from the unauthenticated [Jikan API](https://api.jikan.moe) strictly using JS Higher-Order Functions (`.map()`, `.filter()`, `.sort()`, `.find()`). 
  - Search dynamically tracks keystrokes.
  - Complete control mapping over sorting algorithms and exact Title-String matching.

## 🚀 Setup & Launch

1. Open your terminal in the project directory.
2. Initialize a local web server (e.g. Python):
   ```bash
   python3 -m http.server 8000
   ```
   *(or alternatively launch straight from VS Code's "Live Server" extension).*
3. Open `http://localhost:8000` in your chosen web browser.

## 🧭 Navigation Instructions
- **Left Panel (Dynamic):** Use the dropdowns directly above the "Latest Updates" grid to manipulate Jikan data directly. 
- **Sticky Navbar:** Allows tracking via quick-search while scrolling, alongside profile hooks and theming. 
- **Heart Interactions:** The local favorites state memory works flawlessly in rendering individual state-dependent classes natively.
