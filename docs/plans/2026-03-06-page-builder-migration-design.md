# Page Builder Migration Design

## Overview

Transform all site pages from static Antlers templates into a fully page-builder-driven system using Statamic's replicator fieldset. All pages will use a single `landing-page.antlers.html` template that dispatches to partials based on the scaffold set type, enabling drag-and-drop section reordering in the Control Panel.

---

## Set Types (7 total)

| Set | Fields | Purpose |
|---|---|---|
| `hero` | eyebrow, heading, description, button_group | Page heroes |
| `card_grid` | section_heading, section_body, columns, cards (imports `card` fieldset) | Card layouts |
| `text_section` | eyebrow, heading, body (markdown), items (bullet list), cta_label, cta_link | All prose sections |
| `two_col` | left_heading, left_body; right_heading, right_body, right_items, right_style | Sidebar/split layouts |
| `callout` | style (dark/light), heading, body | Highlight boxes |
| `cta_dark` | heading, body, button_label, button_link, email_text | Final CTA bar |
| `component` | handle (select of available hardcoded partials) | Bespoke sections positioned by builder |

---

## Directory Structure

### Page builder partials (data-driven)
`resources/views/partials/page_builder/`
- `hero.antlers.html`
- `card-grid.antlers.html`
- `card.antlers.html`
- `text-section.antlers.html`
- `two-col.antlers.html`
- `callout.antlers.html`
- `cta-dark.antlers.html`

### Component partials (hardcoded, builder-positioned)
`resources/views/partials/components/`
- `laravel-timeline.antlers.html`
- `ai-comparison.antlers.html`
- `platform-comparison.antlers.html`
- `pc-done.antlers.html`

---

## Template

Single `resources/views/pages/landing-page.antlers.html`:

```antlers
{{ scaffold }}
  {{ if type == 'component' }}
    {{ partial :src="'partials/components/' + handle" }}
  {{ else }}
    {{ partial :src="'partials/page_builder/' + type" }}
  {{ /if }}
{{ /scaffold }}
```

All pages set `template: pages/landing-page` and store all content in their `scaffold` field.

---

## Page Migration Map

### Home (doug-gough.md)
1. `hero`
2. `card_grid` — Sound Familiar? (2-col, existing)
3. `text_section` — I've Been Inside This Problem (with bullet list)
4. `text_section` — The Full Story
5. `two_col` — What I Bring
6. `cta_dark`

### Why Laravel + Statamic
1. `hero`
2. `component: laravel-timeline`
3. `card_grid` — Why Statamic (2-col + wide)
4. `text_section` — Built for Where You Are (with bullet list)
5. `cta_dark`

### AI Knowledge Base
1. `hero`
2. `text_section` — The Problem
3. `text_section` — A Different Approach
4. `two_col` — What I Do
5. `cta_dark`

### AI-Assisted Development
1. `hero`
2. `text_section` — The SaaS Trap intro
3. `card_grid` — SaaS Trap cards (3-col, with emoji icon field)
4. `text_section` — The Opportunity
5. `callout` — Opportunity highlight
6. `text_section` — AI vs Vibe Coding intro
7. `component: ai-comparison`
8. `callout` — Vibe coding highlight
9. `component: platform-comparison`
10. `text_section` — What This Means
11. `cta_dark`

### Church Website Stewardship
1. `hero`
2. `card_grid` — What Stewardship Includes (emerald style)
3. `text_section` — When a New Build Makes Sense
4. `text_section` — How We Work Together
5. *(pricing — handled separately)*
6. `cta_dark`

### Planning Center Integration
1. `hero`
2. `two_col` — Why This Is Harder
3. `card_grid` — Who It's For (2-col)
4. `card_grid` — Common Integration Outcomes (2-col)
5. `card_grid` — How the Work Is Approached (2-col)
6. `component: pc-done` — What Done Looks Like
7. `card_grid` — Typical Engagement Shapes (3-col)
8. `text_section` — Footer Note

### Common Website Risks
1. `hero`
2. `card_grid` — Most Common Risks (2-col, with bullet items)
3. `card_grid` — What a Good Next Step (3-col, borderless)
4. `text_section` — CTA link

---

## Card Fieldset Addition

Add `icon` (text) field to `card.yaml` to support emoji icons used in the SaaS Trap section.

---

## Existing Work to Migrate

The following already exist and will be moved/renamed to fit the new structure:

- `partials/page-hero-dark.antlers.html` → `partials/page_builder/hero.antlers.html`
- `partials/card-grid.antlers.html` → `partials/page_builder/card-grid.antlers.html`
- `partials/card.antlers.html` → `partials/page_builder/card.antlers.html`
- `douggough.antlers.html` hero + card_grid scaffold data stays in `doug-gough.md`