# Homepage Design — douggough.com

**Date:** 2026-03-02
**File:** `/Users/douglasgough/douggough.pen`
**Approach:** Dark Hero, Light Body (Approach A)

---

## Design Decisions

### Color Palette
Drawn directly from the existing site (ai-assisted-development.antlers.html):
- Background hero/CTA: `#022c22` (emerald-950)
- Section label / accent text: `#15803d` (emerald-700)
- Primary button: `#16a34a` (emerald-600)
- Icon backgrounds (service cards): `#022c22` with `#34d399` (emerald-400) icons
- Feature card icon backgrounds: `#dcfce7` (emerald-100) with `#16a34a` icons
- Body text: `#475569` (slate-600)
- Headings: `#0f172a` (slate-900)
- Section backgrounds alternate: white → slate-50 → white → emerald-950

### Typography
- Inter throughout (matching site conventions)
- H1: 52px / 600 weight / center-aligned in hero
- H2 sections: 32px / 600 weight
- Section labels: 11px / 700 / uppercase / 2px letter-spacing / emerald-700
- Body: 14–16px / 1.6–1.7 line height

### Page Structure (top → bottom)
1. **Hero** — dark emerald-950, radial gradient glow, pill badge, centered H1 + subhead, two CTAs
2. **Current Projects** — white, 3 horizontal cards with AI-generated abstract images
3. **How I Work** — slate-50, intro paragraph + 2 feature cards with lucide icons
4. **What I Build** — white, 3 service cards in a grid with dark icon blocks
5. **CTA Footer** — dark emerald-950, 2-column "Let's Talk" with Book a Meeting button

### Image Treatment
Abstract/generative AI images per project, each with distinct mood:
- **Mara and Peacekeeper One** — deep space grid, geometric blueprint, emerald glow
- **Sermon AI** — audio waveform frequency visualization, teal/dark
- **Deep Field Sound** — nebula/cosmos, purple + emerald tones

### UI Elements
- Flowbite-inspired amber badge for "In Development" status (amber-50 bg, amber border, amber-700 dot)
- Lucide icons: `layers` (vision), `zap` (capability), `globe` (web dev), `cpu` (apps), `link` (integrations)
- Radial gradient glows on both hero and CTA sections
- Cards: 16px corner radius, subtle inside stroke borders

### Layout Width
- Page: 1440px wide
- Content max-width: 1152px (matching site's max-w-6xl), with 144px horizontal padding per side

---

## Source Content
All copy sourced directly from `docs/wireframe.txt` and `resources/views/pages/douggough.antlers.html`.
