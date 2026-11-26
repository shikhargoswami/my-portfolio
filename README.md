# Shikhar Goswami — Portfolio

**Live site: https://shikhargoswami.github.io/my-portfolio/**

Product Manager portfolio: selected work, the products I've built from zero, how I work, and how to reach me.

## How it's built

Plain HTML, CSS and JavaScript, with no frameworks, build step or third-party scripts.

| File | What it holds |
|---|---|
| `index.html` | The whole page, written as semantic HTML that works with JavaScript turned off |
| `assets/css/site.css` | Design tokens (light and dark via `light-dark()`), layout, and the illustrated product mock-ups |
| `assets/js/site.js` | Progressive enhancement: theme toggle, mobile menu, scroll reveal, count-up stats, click-to-load videos, copy email, résumé fallback |

Details:

- **Performance:** system fonts, and YouTube loads only when a video is clicked.
- **Accessibility:** skip link, visible focus, `aria-current` in the nav, and respect for reduced-motion settings.
- **Résumé:** add `assets/Shikhar_Goswami_Resume__PM.pdf` and the "Download résumé" button starts working. Until then it becomes "Request résumé" (email).

Pushing to `main` deploys to GitHub Pages through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.
