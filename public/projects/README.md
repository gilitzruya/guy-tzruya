# Project images

All assets live under `public/projects/<slug>/` where `<slug>` matches `PROJECT_SLUGS` in [`lib/projects.ts`](../../lib/projects.ts).

## Before / after (slider)

Use **viewport-specific** WebP files (recommended pixel ratios):

| File | Aspect | When shown |
|------|--------|------------|
| `before-desktop.webp` | 16:9 | Viewport ≥ 1024px wide |
| `before-mobile.webp` | 9:16 | Viewport &lt; 1024px |
| `after-desktop.webp` | 16:9 | Viewport ≥ 1024px wide |
| `after-mobile.webp` | 9:16 | Viewport &lt; 1024px |

Legacy fallback (optional): keep `before.webp` / `after.webp`. The slider and gallery try viewport-specific files first; if a request fails, they fall back to these legacy paths in the UI.

## Client portrait (listing card)

Optional — small round testimonial portrait:

- `client.webp` (~400×400). Registered per slug in `PROJECT_CLIENT_IMAGE` in `lib/projects.ts`.

## Gallery (full-screen dialog)

Numbered pairs per viewport:

- `gallery-01-desktop.webp`, `gallery-01-mobile.webp`
- `gallery-02-desktop.webp`, `gallery-02-mobile.webp`
- … use **two-digit** indices (`01`, `02`, …).

How many slides exist per project is defined by **`PROJECT_GALLERY_COUNT`** in [`lib/projects.ts`](../../lib/projects.ts). The app does not scan this folder at runtime.

Gallery images should match the same aspect intentions: **16:9** for `*-desktop.webp`, **9:16** for `*-mobile.webp`.
