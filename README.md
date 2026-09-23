# CineBlack — Modern Cinematic Movie Streaming Platform

A modern, high-contrast movie streaming web application built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

## ✨ Design Concept: The Black & White OLED Cinema

- **Monochrome UI**: Jet-black (`#050505`), frosted glass (`backdrop-blur-md bg-black/85`), crisp pure white typography, and silver monochrome controls.
- **Vibrant Posters & Backdrops**: Movie artwork and backdrops retain their full, vivid colors, making them pop like a marquee sign in a dark theater.
- **Responsive Architecture**: Fluid navigation optimized across mobile, tablet, and ultra-wide desktop displays.

---

## 🎬 Movie Categories

- **Hindi Cinema (Bollywood)**: *Jawan*, *Dangal*, *Pathaan*, *3 Idiots*, *Brahmāstra*, *Stree 2*
- **English Cinema (Hollywood)**: *Inception*, *Interstellar*, *The Dark Knight*, *Oppenheimer*, *Dune: Part Two*, *Avatar: The Way of Water*
- **Bangla Cinema (Dhallywood)**: *Hawa*, *Aynabaji*, *Pather Panchali*, *Toofan*, *Monpura*, *Surongo*
- **Hindi Dubbed Pan-India**: *RRR*, *K.G.F: Chapter 2*, *Baahubali 2*, *Kantara*, *Pushpa: The Rise*, *Salaar*

---

## 🚀 Key Pages & Features

1. **Home (`/`)**
   - Full-bleed hero spotlight banner with trailer/preview mode and slide carousel
   - Dynamic **"Continue Watching"** row showing active progress bars and remaining time
   - Curated rails: *Trending Now*, *Popular*, *Latest Releases*, *Hindi*, *English*, *Bangla*, and *Hindi Dubbed*
2. **Movies Catalog (`/movies`)**
   - Interactive filtering by category (`?category=hindi`, `english`, `bangla`, `hindi-dubbed`)
   - Genre filter chips (*Action, Sci-Fi, Drama, Thriller, Crime, Comedy, etc.*)
   - Real-time catalog search and multi-option sorting (*Rating, Newest, Title A-Z, Popular*)
3. **Movie Details (`/movie/[id]`)**
   - Immersive hero backdrop with cinematic vignette
   - Detailed metadata badges (*4K UHD, IMDb rating, release year, duration, language*)
   - Synopsis, director, and full star cast
   - "Watch Now", "Add to Watchlist", and "Share" actions
   - "More Like This" similar titles recommendation rail
4. **Watch / Player (`/watch/[id]`)**
   - Custom HTML5 cinematic video player (no unstyled native browser controls)
   - **Controls**: Play/Pause, Seek ±10 seconds, scrubbable progress bar with hover time preview
   - **Audio**: Volume slider with quick mute/unmute
   - **Display**: Fullscreen toggle and Theater mode toggle
   - **Preferences**: Playback speed (0.5x to 2x), Video quality selector (4K UHD, 1080p, 720p, Auto)
   - **Accessibility**: Subtitles / Closed Captions (CC) toggle with dialogue track
   - **Keyboard Shortcuts**: `Space` (Play/Pause), `←`/`→` (±10s seek), `↑`/`↓` (Volume), `M` (Mute), `F` (Fullscreen), `T` (Theater mode)
   - **Auto-Sync**: Automatically records and updates playback percentage in "Continue Watching"
5. **Search (`/search`)**
   - Instant search query filtering across titles, actors, directors, and genres
   - Quick suggestion tags and empty-state recommendations
6. **Watchlist (`/watchlist`)**
   - Personal library saved locally via browser `localStorage`
   - One-click "Watch" and "Remove" controls
7. **Member Profile (`/profile`)**
   - Profile summary with VIP tier badge
   - Watch statistics (*In Progress, Watchlist count, Titles Watched*)
   - Quick continue watching & watch history management with reset options

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Language**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom OLED dark utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Persistence**: Browser `localStorage` via React Context (`MovieContext`)

---

## 📦 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
