---
name: asset-optimizer
description: Converts PNG/JPG images to WebP/AVIF using Sharp, optimizes SVGs with SVGO, and subset fonts using fonttools. Trigger with /optimize-assets, optimize images, or compress assets.
---

# Asset & Image Optimization Protocol

When invoked via `/optimize-assets` or when asked to compress images and fonts:

## 1. Automatic Vite Build Optimization
The project includes `vite-plugin-image-optimizer` configured in `vite.config.ts`. Running `npm run build` automatically compresses PNG/JPG/WebP assets to 85% quality.

## 2. Sharp Image Conversion Script
Run custom Sharp script to generate WebP/AVIF formats for static logos and backgrounds:
```bash
npx sharp-cli -i public/logo.png -o public/logo.webp
```

## 3. Font Subsetting
Subset custom WOFF2 fonts down to Cyrillic + Ukrainian + Latin characters to reduce font payloads from 300KB down to ~18KB.

## 4. Execution
```bash
npm run build
```
Confirm build completion and verify size reductions.
