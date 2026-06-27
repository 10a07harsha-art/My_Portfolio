# Harsha P Portfolio 3D

Premium cinematic portfolio for Harsha P, built with Vite, Three.js, GSAP, ScrollTrigger, and Lenis.

## Live Deploy

GitHub Pages URL:

https://10a07harsha-art.github.io/My_Portfolio/

## Run locally

```bash
npm install
npm run dev
```

## Notes

- The Three.js scene is procedural, so no external 3D assets are required.
- GitHub repositories are loaded from the public GitHub API.
- The resume download is generated client-side as a text file so the site works without a backend.
- The app is configured for GitHub Pages under `/My_Portfolio/`.
- If you want to swap in a real resume PDF or actual certification records, update `src/data.js` and the download handler in `src/main.js`.

## Structure

- `src/main.js` wires the app together.
- `src/threeScene.js` owns the Three.js scene, bloom, hotspots, and scroll-driven motion.
- `src/components/*` contains the DOM sections and modal shell.
- `src/style.css` handles the cinematic visual system and responsive layout.
