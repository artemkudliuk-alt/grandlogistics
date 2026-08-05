---
name: web-performance-audit
description: Run comprehensive Web Performance Audit (Lighthouse, Core Web Vitals, Bundle analysis, DOM depth, RAM memory leaks). Use when the user asks to run an audit, analyze site speed, or check performance.
---

# Web Performance Audit Protocol

When invoked via `/audit`, `perf-audit`, or when asked to analyze site speed:

## 1. Bundle & Asset Size Audit
Execute build analysis command:
```bash
npm run build
```
Verify chunk sizes in `dist/assets/`:
- `index.js` target: < 800 KB
- `index.css` target: < 150 KB
- `public/videos/` total: < 30 MB

## 2. Video Stream & Codec Check
Run `ffprobe` or file inspection on active MP4/WebM files:
- Ensure `-movflags +faststart` is enabled (moov atom at byte 0).
- Ensure mobile WebM/MP4 sizes are < 2 MB per file.
- Verify `poster` attributes are set on all `<video>` tags.

## 3. DOM & GPU Layer Composition
Inspect `index.css` and React components for:
- Excess GPU layer creation (`transform: translateZ(0)` on generic text selectors).
- Blurry backdrop filters over playing HTML5 videos.
- Proper `-webkit-font-smoothing: antialiased` enforcement.

## 4. Output Summary
Generate a clear markdown performance report with metrics, findings, and concrete optimization recommendations.
