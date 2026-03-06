# Page Builder Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all site pages from static per-page Antlers templates to a unified `landing-page.antlers.html` template driven by a Statamic replicator page builder with drag-and-drop section ordering.

**Architecture:** All pages store their content in a `scaffold` replicator field. A single `landing-page.antlers.html` template loops the scaffold and dispatches to partials in `partials/page_builder/` (data-driven) or `partials/components/` (hardcoded, builder-positioned) based on the set type. Seven set types cover all content patterns.

**Tech Stack:** Statamic v6, Antlers templating, YAML fieldsets/blueprints, Tailwind CSS v4

---

## Task 1: Create directory structure and relocate existing page builder partials

**Files:**
- Create dir: `resources/views/partials/page_builder/`
- Create dir: `resources/views/partials/components/`
- Move: `resources/views/partials/page-hero-dark.antlers.html` → `resources/views/partials/page_builder/hero.antlers.html`
- Move: `resources/views/partials/card-grid.antlers.html` → `resources/views/partials/page_builder/card-grid.antlers.html`
- Move: `resources/views/partials/card.antlers.html` → `resources/views/partials/page_builder/card.antlers.html`

**Step 1: Create the directories and move files**

```bash
mkdir -p resources/views/partials/page_builder
mkdir -p resources/views/partials/components
mv resources/views/partials/page-hero-dark.antlers.html resources/views/partials/page_builder/hero.antlers.html
mv resources/views/partials/card-grid.antlers.html resources/views/partials/page_builder/card-grid.antlers.html
mv resources/views/partials/card.antlers.html resources/views/partials/page_builder/card.antlers.html
```

**Step 2: Update card-grid partial to reference new card path**

In `resources/views/partials/page_builder/card-grid.antlers.html`, update:
```antlers
{{ partial:partials/page_builder/card }}
```
(was `partials/card`)

**Step 3: Commit**

```bash
git add resources/views/partials/
git commit -m "refactor: move page builder partials into page_builder subdirectory"
```

---

## Task 2: Create the landing-page template

**Files:**
- Create: `resources/views/pages/landing-page.antlers.html`

**Step 1: Create the template**

```antlers
{{ scaffold }}
  {{ if type == 'component' }}
    {{ partial :src="'partials/components/' + handle" }}
  {{ else }}
    {{ partial :src="'partials/page_builder/' + type" }}
  {{ /if }}
{{ /scaffold }}
```

**Step 2: Commit**

```bash
git add resources/views/pages/landing-page.antlers.html
git commit -m "feat: add landing-page template with dynamic scaffold dispatch"
```

---

## Task 3: Add new sets to page_builder.yaml

**Files:**
- Modify: `resources/fieldsets/page_builder.yaml`

**Step 1: Add text_section, two_col, callout, cta_dark, and component sets to the content group**

Replace the `content` group in `page_builder.yaml` with:

```yaml
        content:
          display: Content
          icon: paragraph-align-left
          sets:
            card_grid:
              display: 'Card Grid'
              icon: grid-4
              fields:
                -
                  handle: section_heading
                  field:
                    type: text
                    display: 'Section Heading'
                -
                  handle: section_body
                  field:
                    type: markdown
                    display: 'Section Body'
                -
                  handle: columns
                  field:
                    type: select
                    display: Columns
                    default: '2'
                    options:
                      '2': '2 Columns'
                      '3': '3 Columns'
                -
                  handle: cards
                  field:
                    type: replicator
                    display: Cards
                    button_label: 'Add Card'
                    sets:
                      cards:
                        display: Cards
                        sets:
                          card:
                            display: Card
                            fields:
                              -
                                import: card
            text_section:
              display: 'Text Section'
              icon: text
              fields:
                -
                  handle: eyebrow
                  field:
                    type: text
                    display: Eyebrow
                -
                  handle: heading
                  field:
                    type: text
                    display: Heading
                -
                  handle: body
                  field:
                    type: markdown
                    display: Body
                -
                  handle: items
                  field:
                    type: replicator
                    display: 'Bullet List'
                    button_label: 'Add Item'
                    sets:
                      items:
                        display: Items
                        sets:
                          item:
                            display: Item
                            fields:
                              -
                                handle: text
                                field:
                                  type: text
                                  display: Text
                -
                  handle: cta_label
                  field:
                    type: text
                    display: 'CTA Label'
                -
                  handle: cta_link
                  field:
                    type: link
                    display: 'CTA Link'
                    collections:
                      - pages
            two_col:
              display: 'Two Column'
              icon: layout-columns
              fields:
                -
                  handle: left_heading
                  field:
                    type: text
                    display: 'Left Heading'
                -
                  handle: left_body
                  field:
                    type: markdown
                    display: 'Left Body'
                -
                  handle: right_heading
                  field:
                    type: text
                    display: 'Right Heading'
                -
                  handle: right_body
                  field:
                    type: markdown
                    display: 'Right Body'
                -
                  handle: right_items
                  field:
                    type: replicator
                    display: 'Right Bullet List'
                    button_label: 'Add Item'
                    sets:
                      items:
                        display: Items
                        sets:
                          item:
                            display: Item
                            fields:
                              -
                                handle: text
                                field:
                                  type: text
                                  display: Text
                -
                  handle: right_style
                  field:
                    type: select
                    display: 'Right Column Style'
                    default: default
                    options:
                      default: Default
                      emerald: Emerald
            callout:
              display: Callout
              icon: alert-circle
              fields:
                -
                  handle: style
                  field:
                    type: select
                    display: Style
                    default: dark
                    options:
                      dark: Dark
                      light: Light
                -
                  handle: heading
                  field:
                    type: text
                    display: Heading
                -
                  handle: body
                  field:
                    type: markdown
                    display: Body
            cta_dark:
              display: 'CTA (Dark)'
              icon: cursor-click
              fields:
                -
                  handle: heading
                  field:
                    type: text
                    display: Heading
                -
                  handle: body
                  field:
                    type: markdown
                    display: Body
                -
                  handle: button_label
                  field:
                    type: text
                    display: 'Button Label'
                -
                  handle: button_link
                  field:
                    type: link
                    display: 'Button Link'
                    collections:
                      - pages
                -
                  handle: email_text
                  field:
                    type: text
                    display: 'Email Text'
                    instructions: 'e.g. hello@douggough.com'
            component:
              display: Component
              icon: code
              fields:
                -
                  handle: handle
                  field:
                    type: select
                    display: Component
                    options:
                      laravel-timeline: 'Laravel Timeline'
                      ai-comparison: 'AI vs Vibe Coding Comparison'
                      platform-comparison: 'Platform Comparison (Tabbed)'
                      pc-done: 'What Done Looks Like'
```

**Step 2: Commit**

```bash
git add resources/fieldsets/page_builder.yaml
git commit -m "feat: add text_section, two_col, callout, cta_dark, component sets to page builder"
```

---

## Task 4: Add icon field to card fieldset

**Files:**
- Modify: `resources/fieldsets/card.yaml`

**Step 1: Add icon field after the label field**

```yaml
  -
    handle: icon
    field:
      type: text
      display: Icon
      instructions: 'Emoji or short text icon displayed above the heading'
```

**Step 2: Update card partial to render icon**

In `resources/views/partials/page_builder/card.antlers.html`, add after the opening `<div>`:

```antlers
  {{ if icon }}
    <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">{{ icon }}</div>
  {{ /if }}
```

**Step 3: Commit**

```bash
git add resources/fieldsets/card.yaml resources/views/partials/page_builder/card.antlers.html
git commit -m "feat: add optional icon field to card fieldset and partial"
```

---

## Task 5: Create text-section partial

**Files:**
- Create: `resources/views/partials/page_builder/text-section.antlers.html`

**Step 1: Create the partial**

```antlers
<!-- Text Section -->
<section class="border-t border-slate-200/60">
  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
    <div class="max-w-3xl">
      {{ if eyebrow }}
        <p class="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">{{ eyebrow }}</p>
      {{ /if }}
      {{ if heading }}
        <h2 class="text-2xl font-semibold tracking-tight text-slate-900">{{ heading }}</h2>
      {{ /if }}
      {{ if body }}
        <div class="mt-3 text-slate-700">{{ body | markdown }}</div>
      {{ /if }}
      {{ if items }}
        <ul class="mt-5 space-y-3 text-slate-700">
          {{ items }}
            <li class="flex gap-3">
              <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-700"></span>
              {{ text }}
            </li>
          {{ /items }}
        </ul>
      {{ /if }}
      {{ if cta_label }}
        <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a href="{{ cta_link }}" class="inline-flex items-center justify-center rounded-xl bg-emerald-900 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950 ring-1 ring-black/5">{{ cta_label }}</a>
        </div>
      {{ /if }}
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add resources/views/partials/page_builder/text-section.antlers.html
git commit -m "feat: add text-section page builder partial"
```

---

## Task 6: Create two-col partial

**Files:**
- Create: `resources/views/partials/page_builder/two-col.antlers.html`

**Step 1: Create the partial**

```antlers
<!-- Two Column -->
<section class="border-t border-slate-200/60">
  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
    <div class="grid gap-10 md:grid-cols-12">
      <div class="md:col-span-7">
        {{ if left_heading }}
          <h2 class="text-2xl font-semibold tracking-tight text-slate-900">{{ left_heading }}</h2>
        {{ /if }}
        {{ if left_body }}
          <div class="mt-3 text-slate-700">{{ left_body | markdown }}</div>
        {{ /if }}
      </div>
      <div class="md:col-span-5">
        <div class="rounded-3xl border {{ if right_style == 'emerald' }}border-emerald-200/50 bg-emerald-50{{ else }}border-slate-200/60 bg-white{{ /if }} p-7">
          {{ if right_heading }}
            <h3 class="text-base font-semibold text-slate-900">{{ right_heading }}</h3>
          {{ /if }}
          {{ if right_body }}
            <div class="mt-2 text-sm text-slate-700">{{ right_body | markdown }}</div>
          {{ /if }}
          {{ if right_items }}
            <ul class="mt-4 space-y-3 text-sm text-slate-700">
              {{ right_items }}
                <li class="flex gap-3">
                  <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-700"></span>
                  {{ text }}
                </li>
              {{ /right_items }}
            </ul>
          {{ /if }}
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add resources/views/partials/page_builder/two-col.antlers.html
git commit -m "feat: add two-col page builder partial"
```

---

## Task 7: Create callout partial

**Files:**
- Create: `resources/views/partials/page_builder/callout.antlers.html`

**Step 1: Create the partial**

```antlers
<!-- Callout -->
<section class="border-t border-slate-200/60">
  <div class="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
    <div class="rounded-2xl {{ if style == 'dark' }}bg-emerald-950 text-white{{ else }}bg-emerald-50 border border-emerald-200/50{{ /if }} p-8 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle,rgba(16,185,129,0.3)_0%,transparent_70%)] pointer-events-none"></div>
      {{ if heading }}
        <p class="{{ if style == 'dark' }}text-white{{ else }}text-slate-900{{ /if }} font-semibold text-base leading-relaxed">
          <strong class="{{ if style == 'dark' }}text-white{{ else }}text-slate-900{{ /if }} font-semibold">{{ heading }}:</strong>
        </p>
      {{ /if }}
      <div class="{{ if style == 'dark' }}text-white/85{{ else }}text-slate-700{{ /if }} text-base leading-relaxed {{ if heading }}mt-1{{ /if }}">{{ body | markdown }}</div>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add resources/views/partials/page_builder/callout.antlers.html
git commit -m "feat: add callout page builder partial"
```

---

## Task 8: Create cta-dark partial

**Files:**
- Create: `resources/views/partials/page_builder/cta-dark.antlers.html`

**Step 1: Create the partial**

```antlers
<!-- CTA Dark -->
<section id="contact" class="border-t border-slate-300 bg-emerald-950 text-white">
  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
    <div class="grid gap-8 md:grid-cols-12 md:items-center">
      <div class="md:col-span-8">
        <h2 class="text-2xl font-semibold tracking-tight">{{ heading }}</h2>
        {{ if body }}
          <div class="mt-3 text-emerald-50/90">{{ body | markdown }}</div>
        {{ /if }}
      </div>
      <div class="md:col-span-4 md:text-right">
        {{ if button_label }}
          <a href="{{ button_link }}" class="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-50 md:w-auto">
            {{ button_label }}
          </a>
        {{ /if }}
        {{ if email_text }}
          <p class="mt-3 text-xs text-emerald-50/80">
            Or email: <span class="underline decoration-white/40 underline-offset-4">{{ email_text }}</span>
          </p>
        {{ /if }}
      </div>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add resources/views/partials/page_builder/cta-dark.antlers.html
git commit -m "feat: add cta-dark page builder partial"
```

---

## Task 9: Extract component partials

Extract bespoke sections from existing page templates into standalone partials in `resources/views/partials/components/`. These partials contain only the section HTML with no surrounding `<section>` wrapper — the wrapper comes from the template if needed, or is self-contained.

### 9a: laravel-timeline

**Files:**
- Create: `resources/views/partials/components/laravel-timeline.antlers.html`
- Source: `resources/views/pages/why-laravel-statamic.antlers.html` lines 17–103 (the `<section>` containing the `<ol>` timeline)

Copy the entire Laravel Timeline `<section>` block verbatim into the new partial.

### 9b: ai-comparison

**Files:**
- Create: `resources/views/partials/components/ai-comparison.antlers.html`
- Source: `resources/views/pages/ai-assisted-development.antlers.html` — the two comparison cards (`rounded-2xl border border-slate-200/60 border-t-4 border-t-red-500...` and `border-t-emerald-600...`) wrapped in the `<div class="mt-10 grid gap-4 md:grid-cols-2">` grid

Wrap extracted content in a `<section class="border-t border-slate-200/60">` with standard padding div.

### 9c: platform-comparison

**Files:**
- Create: `resources/views/partials/components/platform-comparison.antlers.html`
- Source: `resources/views/pages/ai-assisted-development.antlers.html` — the entire Platform Comparison `<section>` block (WordPress, Drupal, Laravel cards with Alpine.js tabs)

Copy the entire `<section>` block verbatim.

### 9d: pc-done

**Files:**
- Create: `resources/views/partials/components/pc-done.antlers.html`
- Source: `resources/views/pages/planning-center-integration.antlers.html` — the "What done looks like" `<section>` block (single wide card with inner 2-col bullet grid)

Copy the entire `<section>` block verbatim.

**Step: Commit all component partials**

```bash
git add resources/views/partials/components/
git commit -m "feat: extract bespoke sections into component partials"
```

---

## Task 10: Migrate Home page (doug-gough.md)

**Files:**
- Modify: `content/collections/pages/doug-gough.md`

**Step 1: Replace/extend the scaffold field**

The hero and card_grid sets already exist. Add the remaining sets. The full `scaffold` section should be:

```yaml
scaffold:
  -
    id: fV2jLJdI0Kevd6IWiqN7m
    type: hero
    enabled: true
    eyebrow: 'Web Development'
    heading: "If you're facing a major website rebuild, you have **more options** than you think."
    description: "Most organizations arrive at the same crossroads. Your current site is aging. A major upgrade is expensive and disruptive. And the obvious alternatives don't match your ambitions."
    button_group:
      -
        id: 2lW7kzlKotlJtb-JFaqYa
        type: button
        enabled: true
        button_label: 'Book a Meeting'
        button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
      -
        id: cz3LvyCikN2IUBEOQvH-b
        type: button
        enabled: true
        button_label: 'Why Laravel + Statamic'
        button_link: 'entry::2c8ddf0c-b4e3-4f7e-9953-4cefa9b80936'
  -
    id: kP9mQxRtNvLw3sBjEyHf
    type: card_grid
    enabled: true
    section_heading: 'Sound Familiar?'
    columns: '2'
    cards:
      -
        id: aT2nWdKqYpMv7cZxRjBs
        type: card
        enabled: true
        heading: 'Frustrated Editors'
        body: "The people who update your website dread using it. A system that's hard to use doesn't get used—and a site that doesn't get updated stops working for your organization."
      -
        id: bU3oXeLrZqNw8dAySkCt
        type: card
        enabled: true
        heading: 'Expensive Simple Changes'
        body: "Simple changes shouldn't require a specialist. When every update needs outside help, your website becomes a bottleneck instead of an asset."
      -
        id: cV4pYfMsArOx9eBzTlDu
        type: card
        enabled: true
        heading: 'Ambitions Beyond Content'
        body: "Membership management, online tools, partner portals—your next phase needs a platform that can grow with you."
      -
        id: dW5qZgNtBsPy0fCaUmEv
        type: card
        enabled: true
        heading: 'Upgrade Sticker Shock'
        body: "A major platform upgrade is a significant investment. Before you spend that kind of money, it's worth understanding exactly what you're buying and whether it solves the right problem."
  -
    id: hX6rAiNuCsQw1gDbUkFp
    type: text_section
    enabled: true
    heading: "I've Been Inside This Problem"
    body: "Over 25 years I've watched organizations make expensive platform decisions they later regretted—including:"
    items:
      -
        id: iY7sBjOvDtRx2hEcVlGq
        type: item
        enabled: true
        text: "A national organization that outgrew Drupal when it evolved into an enterprise platform they never needed"
      -
        id: jZ8tCkPwEuSy3iFdWmHr
        type: item
        enabled: true
        text: "A large franchise whose CMS couldn't grow with their ambitions, forcing them onto a second platform just to meet basic content needs"
      -
        id: kA9uDlQxFvTz4jGeXnIs
        type: item
        enabled: true
        text: "Organizations that chose WordPress for simplicity and eventually hit its ceiling at the worst possible time"
  -
    id: lB0vEmRyGwUa5kHfYoJt
    type: text_section
    enabled: true
    heading: 'The Full Story'
    body: |
      A decade ago I built a Drupal site for a national medical organization. It was the right choice at the time. Then Drupal evolved into an enterprise platform—more powerful, more complex, and more expensive to maintain. Organizations like theirs, who never needed that level of complexity, found themselves facing a difficult upgrade decision they didn't ask for.

      I've also seen what happens when a large, multi-location service franchise pushes a content management system past its limits. The editors found it difficult to use and eventually the organization built workarounds on a separate platform just to get their content needs met. When it came time to integrate online booking, we hit a wall. A content management system, no matter how powerful, isn't an application framework. The integration work that should have taken weeks took years.

      Both experiences pointed me toward the same conclusion. There's a class of organization that needs more than WordPress but doesn't need the full weight of an enterprise CMS—and they deserve a platform built for exactly where they are and where they're going.
  -
    id: mC1wFnSzHxVb6lIgZpKu
    type: two_col
    enabled: true
    left_heading: 'What I Bring'
    left_body: "That's why I build on Laravel and Statamic. And it's why the work starts with understanding your organization—before a line of code is written."
    right_style: emerald
    right_items:
      -
        id: nD2xGoTaIyWc7mJhAqLv
        type: item
        enabled: true
        text: '25 years of web development experience'
      -
        id: oE3yHpUbJzXd8nKiBrMw
        type: item
        enabled: true
        text: 'Specialization in information architecture and system design'
      -
        id: pF4zIqVcKaYe9oLjCsNx
        type: item
        enabled: true
        text: 'A small number of clients at a time'
      -
        id: qG5aJrWdLbZf0pMkDtOy
        type: item
        enabled: true
        text: 'Consistent support from someone who knows your system deeply'
    right_body: "I'm here for the project, and for where you're going next. When the build is finished you can count on me to provide help and guidance throughout the life of your website."
  -
    id: rH6bKsXeMcAg1qNlEuPz
    type: cta_dark
    enabled: true
    heading: 'Facing a Major Website Decision?'
    body: "A short conversation is usually enough to know whether this is the right fit—and if it's not, I'll point you in the right direction."
    button_label: 'Book a Meeting'
    button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
    email_text: 'hello@douggough.com'
```

**Step 2: Update template field**

Change `template: pages/douggough` to `template: pages/landing-page` in the front matter.

**Step 3: Clear stache and verify**

```bash
php artisan statamic:stache:clear
```

Visit `https://douggough.test/` and verify all sections render correctly.

**Step 4: Commit**

```bash
git add content/collections/pages/doug-gough.md
git commit -m "migrate: home page to landing-page template and page builder scaffold"
```

---

## Task 11: Migrate Why Laravel + Statamic

**Files:**
- Modify: locate the why-laravel-statamic entry in `content/collections/pages/` (find by checking slug in tree or filename)

**Step 1: Add scaffold data to the entry front matter**

```yaml
template: pages/landing-page
scaffold:
  -
    id: sI7cLtYfNdBh2rOmFvQa
    type: hero
    enabled: true
    eyebrow: 'Modern platform • ease of use • built to grow'
    heading: 'Why Laravel + Statamic'
    description: "You're here because something on your current site isn't working—editors who avoid the CMS, changes that require outside help, or a platform that's hit its ceiling. Those frustrations usually point to the same root cause: the wrong foundation. Here's why the foundation we build on is different."
  -
    id: tJ8dMuZgOeCi3sPnGwRb
    type: component
    enabled: true
    handle: laravel-timeline
  -
    id: uK9eNvAhPfDj4tQoHxSc
    type: card_grid
    enabled: true
    section_heading: 'Why Statamic?'
    columns: '2'
    cards:
      -
        id: vL0fOwBiQgEk5uRpIyTd
        type: card
        enabled: true
        heading: 'Built for Editors'
        body: "The control panel was designed with content editors in mind—clean, intuitive, and adaptable to your content structure. With 40+ field types, Statamic models the way your organization actually works, not the other way around."
      -
        id: wM1gPxCjRhFl6vSqJzUe
        type: card
        enabled: true
        heading: 'Built-In Where Others Use Plugins'
        body: "Statamic includes functionality that other CMS platforms require plugins for—multilingual support, content versioning, flexible content modeling, user permissions. Plugins have to be maintained, updated, and kept compatible. Statamic ships with it."
      -
        id: xN2hQyDkSiGm7wTrKaVf
        type: card
        enabled: true
        heading: 'Version 6. A Dedicated Team.'
        body: "Statamic is on version 6, under active development by a dedicated team of employees—not assembled from community contributions. Regular releases, strong documentation, and a roadmap with real accountability behind it."
      -
        id: yO3iRzElTjHn8xUsLbWg
        type: card
        enabled: true
        heading: 'Your Content Is Always Yours'
        body: "Content is stored in files, version-controlled alongside your code. That means no database breach risk, automatic revision history, and content that's never locked inside a proprietary system. If you ever need to move, you can."
      -
        id: zA4jSaFmUkIo9yVtMcXh
        type: card
        enabled: true
        full_width: true
        heading: 'Built on Laravel'
        body: "Statamic isn't a standalone CMS with its own framework underneath. It's a content management layer built directly on Laravel—which means any Laravel developer can work with it, and your site can grow into custom applications without ever changing platforms."
  -
    id: aB5kTbGnVlJp0zWuNdYi
    type: text_section
    enabled: true
    heading: "Built for Where You Are — and Where You're Going"
    body: "Organizations that build on Laravel and Statamic stop fighting their website and start using it. Here's what that looks like in practice."
    items:
      -
        id: bC6lUcHoWmKq1aXvOeZj
        type: item
        enabled: true
        text: "**Editors who dreaded your CMS will actually use this one.** Statamic's control panel is clean, intuitive, and built around your content structure—not the other way around. A site that gets updated works harder for your organization."
      -
        id: cD7mVdIpXnLr2bYwPfAk
        type: item
        enabled: true
        text: "**Simple changes stay simple.** Day-to-day updates don't require a developer or a support ticket. Your team stays in control without outside help for routine work."
      -
        id: dE8nWeJqYoMs3cZxQgBl
        type: item
        enabled: true
        text: "**Your platform grows with your ambitions.** Built on Laravel, your site can expand into membership tools, custom applications, and partner integrations—without rebuilding from scratch when you're ready for the next phase."
      -
        id: eF9oXfKrZpNt4dAyRhCm
        type: item
        enabled: true
        text: "**Your content is always secure and always yours.** No database to breach, automatic revision history built in, and content that's never locked inside a proprietary system."
      -
        id: fG0pYgLsAqOu5eBzSiDn
        type: item
        enabled: true
        text: "**One developer who knows your system deeply.** Not a ticket queue. Not a new contact every engagement. Consistent support from someone invested in your site for the long term."
  -
    id: gH1qZhMtBrPv6fCaTjEo
    type: cta_dark
    enabled: true
    heading: "Ready to stop fighting your website?"
    body: "A short conversation is usually enough to map out what a move would actually involve—and what it would cost."
    button_label: 'Book a Meeting'
    button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
    email_text: 'hello@douggough.com'
```

**Step 2: Clear stache and verify page**

```bash
php artisan statamic:stache:clear
```

Visit `https://douggough.test/why-laravel-statamic` and verify all sections render.

**Step 3: Commit**

```bash
git add content/collections/pages/
git commit -m "migrate: why-laravel-statamic page to landing-page template"
```

---

## Task 12: Migrate AI Knowledge Base

**Files:**
- Modify: `content/collections/pages/ai-knowledge-base.md` (find by slug)

**Step 1: Add scaffold data**

```yaml
template: pages/landing-page
scaffold:
  -
    id: hI2rAiNuCsQw1gDbUkFp
    type: hero
    enabled: true
    eyebrow: 'AI Knowledge Base'
    heading: "Your documentation shouldn't require a full-time curator."
    description: "If your organization runs on complex documentation—manuals, field guides, safety protocols, implementation references—your domain experts are probably spending too much time managing content and not enough time using it."
    button_group:
      -
        id: iJ3sBjOvDtRx2hEcVlGq
        type: button
        enabled: true
        button_label: 'Book a Meeting'
        button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
  -
    id: jK4tCkPwEuSy3iFdWmHr
    type: text_section
    enabled: true
    heading: 'The Problem With Large Documentation Sets'
    body: "Large documentation sets don't stay organized on their own. Someone has to sort, tag, update, and route people to the right information. That work usually falls on the people who understand the content best—which means your most valuable people are doing your most tedious work."
  -
    id: kL5uDlQxFvTz4jGeXnIs
    type: text_section
    enabled: true
    heading: 'A Different Approach'
    body: |
      An AI knowledge base doesn't just store your documentation. It learns from it—and makes it findable, queryable, and useful without requiring a full-time administrator to keep it current.

      You ask a question. It finds the answer. Across your entire documentation library, instantly.
  -
    id: lM6vEmRyGwUa5kHfYoJt
    type: two_col
    enabled: true
    left_heading: 'What I Do'
    left_body: |
      I implement and configure a knowledge base system built on proven technology, tailored to your documentation structure and your team's workflow. This isn't a generic AI tool you configure yourself. It's a working system, set up for how your organization actually operates.

      Implementation includes content ingestion, configuration, and onboarding your team.
    right_style: emerald
    right_heading: 'What We Can Work With'
    right_body: 'This system works with documentation that exists in standard, readable formats:'
    right_items:
      -
        id: mN7wFnSzHxVb6lIgZpKu
        type: item
        enabled: true
        text: 'PDF documents'
      -
        id: nO8xGoTaIyWc7mJhAqLv
        type: item
        enabled: true
        text: 'Word documents'
      -
        id: oP9yHpUbJzXd8nKiBrMw
        type: item
        enabled: true
        text: 'Excel spreadsheets'
      -
        id: pQ0zIqVcKaYe9oLjCsNx
        type: item
        enabled: true
        text: 'CSV files'
      -
        id: qR1aJrWdLbZf0pMkDtOy
        type: item
        enabled: true
        text: 'Plain text and markdown files'
  -
    id: rS2bKsXeMcAg1qNlEuPz
    type: cta_dark
    enabled: true
    heading: 'Worth a Conversation?'
    body: "If this sounds like a problem worth solving, a short conversation is usually enough to know whether it's a good fit."
    button_label: 'Book a Meeting'
    button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
    email_text: 'hello@douggough.com'
```

**Step 2: Clear stache and verify, then commit**

```bash
php artisan statamic:stache:clear
git add content/collections/pages/
git commit -m "migrate: ai-knowledge-base page to landing-page template"
```

---

## Task 13: Migrate AI-Assisted Development

**Files:**
- Modify: `content/collections/pages/ai-assisted-development.md`

**Step 1: Add scaffold data**

```yaml
template: pages/landing-page
scaffold:
  -
    id: sT3cLtYfNdBh2rOmFvQa
    type: hero
    enabled: true
    eyebrow: 'AI-Assisted Development'
    heading: "Custom Functionality Your Organization Can Actually **Afford**"
    description: "AI-assisted development is changing what's financially possible for mid-size organizations — but only when it's done with professional discipline and the right platform underneath it."
    button_group:
      -
        id: tU4dMuZgOeCi3sPnGwRb
        type: button
        enabled: true
        button_label: 'Book a Conversation'
        button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
  -
    id: uV5eNvAhPfDj4tQoHxSc
    type: text_section
    enabled: true
    eyebrow: 'The SaaS Trap'
    heading: "You're Paying Subscription Fees for Functionality You Could Own"
    body: |
      Most mid-size organizations have accumulated a stack of SaaS tools — each solving one narrow problem, each carrying a recurring monthly fee, and none of them talking to each other particularly well. You didn't choose this. You cobbled it together because custom development was too expensive to consider.

      That calculus is changing.
  -
    id: vW6fOwBiQgEk5uRpIyTd
    type: card_grid
    enabled: true
    columns: '3'
    cards:
      -
        id: wX7gPxCjRhFl6vSqJzUe
        type: card
        enabled: true
        icon: '💸'
        heading: 'Monthly Fees That Never End'
        body: "SaaS pricing scales with your organization. What starts at $49/month becomes $499/month as you grow — for functionality you'll never fully own."
      -
        id: xY8hQyDkSiGm7wTrKaVf
        type: card
        enabled: true
        icon: '🔗'
        heading: "Tools That Don't Fit and Don't Talk"
        body: "Generic SaaS tools are built for the median customer. You work around their limitations, accept \"close enough,\" and pay again each time you need two tools to share data."
      -
        id: yZ9iRzElTjHn8xUsLbWg
        type: card
        enabled: true
        icon: '📦'
        heading: 'Vendor Lock-In'
        body: "Your data lives in someone else's system, under their terms. When they raise prices or sunset features, leaving is harder than it looks — exports are incomplete, integrations break, and configuration knowledge rarely survives the move."
  -
    id: zA0jSaFmUkIo9yVtMcXh
    type: text_section
    enabled: true
    eyebrow: 'The Opportunity'
    heading: 'AI Has Shifted the Economics of Custom Development'
    body: |
      Custom development has always been the right answer for organizations with specific, non-generic needs. The problem was cost. A feature that would save your team ten hours a week could take a developer a hundred hours to build — the math rarely worked.

      AI-assisted development changes the math. Not by replacing professional developers, but by accelerating the work they already know how to do. Repetitive scaffolding, boilerplate code, routine patterns — the parts of development that consumed significant time can be generated quickly, leaving the developer's attention where it actually matters: architecture, edge cases, security, and your specific requirements.
  -
    id: aB1kTbGnVlJp0zWuNdYi
    type: callout
    enabled: true
    style: dark
    heading: 'The result'
    body: "Work that once consumed a developer's time on repetitive scaffolding and boilerplate can now move significantly faster. That changes what's possible for organizations who aren't enterprise-scale but aren't small anymore either."
  -
    id: bC2lUcHoWmKq1aXvOeZj
    type: text_section
    enabled: true
    eyebrow: 'An Important Distinction'
    heading: 'AI-Assisted Development Is Not Vibe Coding'
    body: "The phrase \"AI coding\" has become conflated with something that looks impressive in a demo and falls apart in production. It's worth being precise about the difference, because the difference matters enormously for organizations making real decisions about real systems."
  -
    id: cD3mVdIpXnLr2bYwPfAk
    type: component
    enabled: true
    handle: ai-comparison
  -
    id: dE4nWeJqYoMs3cZxQgBl
    type: callout
    enabled: true
    style: dark
    body: "The question to ask any developer who uses AI tools is whether they understand the code those tools produce — and whether the architecture existed before the prompting began."
  -
    id: eF5oXfKrZpNt4dAyRhCm
    type: component
    enabled: true
    handle: platform-comparison
  -
    id: fG6pYgLsAqOu5eBzSiDn
    type: text_section
    enabled: true
    eyebrow: 'What This Means in Practice'
    heading: 'Functionality You Own, at a Price That Makes Sense'
    body: "The economics of AI-assisted development on the right platform open up a category of solutions that didn't exist for mid-size organizations even three years ago — functionality built around how your organization actually operates, on a platform that grows with you, without the ongoing cost of tools you'll never fully own. If that sounds like what your organization needs, let's talk."
  -
    id: gH7qZhMtBrPv6fCaTjEo
    type: cta_dark
    enabled: true
    heading: "Let's Talk About What's Slowing You Down"
    body: "A 30-minute conversation is usually enough to understand where your current tools are failing you—and how AI-assisted development on Laravel can fix it at a price point that actually makes sense."
    button_label: 'Book a Meeting'
    button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
    email_text: 'hello@douggough.com'
```

**Step 2: Clear stache and verify, then commit**

```bash
php artisan statamic:stache:clear
git add content/collections/pages/
git commit -m "migrate: ai-assisted-development page to landing-page template"
```

---

## Task 14: Migrate Church Website Stewardship

**Files:**
- Modify: `content/collections/pages/church-website-stewardship.md`

**Step 1: Add scaffold data**

```yaml
template: pages/landing-page
scaffold:
  -
    id: hI8rAiNuCsQw1gDbUkFp
    type: hero
    enabled: true
    eyebrow: 'Long-term care • clear decisions • steady improvement'
    heading: 'Website Stewardship for Churches & Christian Organizations'
    description: "A church website should support ministry without becoming a source of stress, scrambling, or recurring expense. I provide long-term website care — stability, clear decisions, and steady improvement — so your site stays healthy and your team stays focused on what matters."
    button_group:
      -
        id: iJ9sBjOvDtRx2hEcVlGq
        type: button
        enabled: true
        button_label: 'Book a Meeting'
        button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
  -
    id: jK0tCkPwEuSy3iFdWmHr
    type: card_grid
    enabled: true
    section_heading: 'What Web Stewardship Includes'
    columns: '2'
    cards:
      -
        id: kL1uDlQxFvTz4jGeXnIs
        type: card
        enabled: true
        style: emerald
        heading: 'Stability & Maintenance'
        body: "Reliable hosting, updates, backups, and security handled responsibly—so problems don't pile up."
      -
        id: lM2vEmRyGwUa5kHfYoJt
        type: card
        enabled: true
        style: emerald
        heading: 'Clear Responsibility'
        body: "Defined ownership, plain-language documentation, and clear processes—so continuity doesn't depend on one person's memory."
      -
        id: mN3wFnSzHxVb6lIgZpKu
        type: card
        enabled: true
        style: emerald
        heading: 'Incremental Improvement'
        body: "Small, safe changes that solve real problems without unnecessary disruption or rebuild cycles."
      -
        id: nO4xGoTaIyWc7mJhAqLv
        type: card
        enabled: true
        style: emerald
        heading: 'Support for Your Team'
        body: "Practical training and clear handoffs that respect staff and volunteer capacity."
  -
    id: oP5yHpUbJzXd8nKiBrMw
    type: text_section
    enabled: true
    heading: 'When a New Build Makes Sense'
    body: "Most problems don't require a rebuild. But when the foundation is no longer safe or maintainable—or the church is growing significantly—a new build may be the most responsible next step. I'll tell you honestly which situation you're in."
  -
    id: pQ6zIqVcKaYe9oLjCsNx
    type: text_section
    enabled: true
    heading: 'How We Work Together'
    body: |
      We start with a short conversation to understand your situation. I gather access, stabilize anything urgent, and give you a clear recommended next step in plain language. Work moves forward with documented decisions, small safe changes, and predictable outcomes.

      I need one point of contact, clear access to your systems, and a simple written agreement that keeps scope and responsibilities clear.
  -
    id: qR7aJrWdLbZf0pMkDtOy
    type: cta_dark
    enabled: true
    heading: "Let's Talk About Your Church Website"
    body: "If your website has become a source of stress or uncertainty, let's talk. A short conversation is usually enough to identify the right next step."
    button_label: 'Book a Meeting'
    button_link: 'entry::b32ff7c7-bb6d-431d-aed3-d2f233b9b428'
    email_text: 'hello@douggough.com'
```

Note: The pricing section is intentionally omitted per design decision — it will be handled separately.

**Step 2: Clear stache and verify, then commit**

```bash
php artisan statamic:stache:clear
git add content/collections/pages/
git commit -m "migrate: church-website-stewardship page to landing-page template"
```

---

## Task 15: Migrate Planning Center Integration

**Files:**
- Modify: `content/collections/pages/planning-center-integration.md`

**Step 1: Add scaffold data**

```yaml
template: pages/landing-page
scaffold:
  -
    id: rS8bKsXeMcAg1qNlEuPz
    type: hero
    enabled: true
    eyebrow: 'Planning Center integration for church websites'
    heading: 'Planning Center + your website, integrated properly.'
    description: "Planning Center is powerful — Calendar, Services, People, Groups, Giving, Check-Ins. But once you want that functionality to show up on your website (reliably, securely, and without manual work), you're in custom integration territory."
  -
    id: sT9cLtYfNdBh2rOmFvQa
    type: two_col
    enabled: true
    left_heading: 'Why this is harder than it looks'
    left_body: |
      Planning Center provides a real developer platform with APIs, authentication, and webhooks. That's the good news. The hard part is designing an integration that matches your church's workflows, protects people data, survives edge cases, and stays maintainable as staff, vendors, and systems change.

      Most churches don't need "a plugin." They need an integration that's thoughtfully designed, carefully built, and owned with clarity.
    right_heading: 'What "expert-level" means here'
    right_items:
      -
        id: tU0dMuZgOeCi3sPnGwRb
        type: item
        enabled: true
        text: 'Secure integration patterns (not browser-leaked secrets)'
      -
        id: uV1eNvAhPfDj4tQoHxSc
        type: item
        enabled: true
        text: 'Permission-aware design and least-privilege access'
      -
        id: vW2fOwBiQgEk5uRpIyTd
        type: item
        enabled: true
        text: 'Reliable syncing and near real-time updates where needed'
      -
        id: wX3gPxCjRhFl6vSqJzUe
        type: item
        enabled: true
        text: 'Documentation and handoff for long-term stewardship'
  -
    id: xY4hQyDkSiGm7wTrKaVf
    type: card_grid
    enabled: true
    section_heading: 'Who this is for'
    columns: '2'
    cards:
      -
        id: yZ5iRzElTjHn8xUsLbWg
        type: card
        enabled: true
        heading: "A good fit if your church…"
        items:
          -
            id: zA6jSaFmUkIo9yVtMcXh
            type: item
            enabled: true
            text: 'Has staffed ministry operations and needs systems to "just work"'
          -
            id: aB7kTbGnVlJp0zWuNdYi
            type: item
            enabled: true
            text: 'Wants Planning Center data on the site without brittle manual steps'
          -
            id: bC8lUcHoWmKq1aXvOeZj
            type: item
            enabled: true
            text: 'Needs secure, documented integrations that can be maintained long-term'
          -
            id: cD9mVdIpXnLr2bYwPfAk
            type: item
            enabled: true
            text: 'Has budget for senior-level design + implementation'
      -
        id: dE0nWeJqYoMs3cZxQgBl
        type: card
        enabled: true
        heading: "Not a fit if you're hoping for…"
        items:
          -
            id: eF1oXfKrZpNt4dAyRhCm
            type: item
            enabled: true
            text: 'A quick plugin install and you're done'
          -
            id: fG2pYgLsAqOu5eBzSiDn
            type: item
            enabled: true
            text: 'A "best effort" build without testing, documentation, or operational clarity'
          -
            id: gH3qZhMtBrPv6fCaTjEo
            type: item
            enabled: true
            text: 'Putting private data at risk to save a week of development'
  -
    id: hI4rAiNuCsQw1gDbUkFp
    type: card_grid
    enabled: true
    section_heading: 'Common integration outcomes'
    section_body: 'These are examples of the kinds of Planning Center + website integration work that tends to deliver immediate operational value.'
    columns: '2'
    cards:
      -
        id: iJ5sBjOvDtRx2hEcVlGq
        type: card
        enabled: true
        heading: 'Calendar + events'
        body: "Publish events with consistent landing pages, filtering (campus/ministry/audience), and fewer manual steps for staff."
      -
        id: jK6tCkPwEuSy3iFdWmHr
        type: card
        enabled: true
        heading: 'Services + teams'
        body: "Create clean public-facing service info, and build role-aware \"team hub\" pages for volunteers and worship teams where appropriate."
      -
        id: kL7uDlQxFvTz4jGeXnIs
        type: card
        enabled: true
        heading: 'People + directories'
        body: "Curated staff/leader directories, ministry pages, and controlled public listings—designed with privacy and permissions in mind."
      -
        id: lM8vEmRyGwUa5kHfYoJt
        type: card
        enabled: true
        heading: 'Groups + next steps'
        body: "Publish approved group listings, improve \"join\" journeys, and reduce drift between the website experience and the reality inside Planning Center."
      -
        id: mN9wFnSzHxVb6lIgZpKu
        type: card
        enabled: true
        heading: 'Giving experiences'
        body: "Align website giving flows with Planning Center Giving and campaign needs, while reducing confusion and improving predictability for donors."
      -
        id: nO0xGoTaIyWc7mJhAqLv
        type: card
        enabled: true
        heading: 'Check-Ins support'
        body: "Build internal tools or admin-friendly pages that support children's ministry check-in workflows (typically behind authentication)."
  -
    id: oP1yHpUbJzXd8nKiBrMw
    type: card_grid
    enabled: true
    section_heading: 'How the work is approached'
    columns: '2'
    cards:
      -
        id: pQ2zIqVcKaYe9oLjCsNx
        type: card
        enabled: true
        heading: '1) Integration design (before code)'
        body: "Confirm workflows, define boundaries (public vs private), decide what belongs on the website, and design for failure modes like missing data, rate limits, and permission mistakes."
      -
        id: qR3aJrWdLbZf0pMkDtOy
        type: card
        enabled: true
        heading: '2) Authentication + permissions'
        body: "Implement the correct access model and keep secrets server-side. Least-privilege by default. Clear ownership of who can see what—and why."
      -
        id: rS4bKsXeMcAg1qNlEuPz
        type: card
        enabled: true
        heading: '3) Reliable data flow'
        body: "Use caching, background sync, and near real-time updates where it matters. The goal is a predictable website experience, not \"sometimes it loads.\""
      -
        id: sT5cLtYfNdBh2rOmFvQa
        type: card
        enabled: true
        heading: '4) Documentation + handoff'
        body: "Clear internal documentation for staff and technical notes for future developers—so the integration stays maintainable after the initial build."
  -
    id: tU6dMuZgOeCi3sPnGwRb
    type: component
    enabled: true
    handle: pc-done
  -
    id: uV7eNvAhPfDj4tQoHxSc
    type: card_grid
    enabled: true
    section_heading: 'Typical engagement shapes'
    columns: '3'
    cards:
      -
        id: vW8fOwBiQgEk5uRpIyTd
        type: card
        enabled: true
        heading: 'Integration audit'
        body: "Review what exists, identify risks, and produce a clear plan: what to keep, what to rebuild, and what to prioritize."
      -
        id: wX9gPxCjRhFl6vSqJzUe
        type: card
        enabled: true
        heading: 'Single-feature build'
        body: "One focused integration (events, groups, directory, etc.) with testing and a clean rollout."
      -
        id: xY0hQyDkSiGm7wTrKaVf
        type: card
        enabled: true
        heading: 'Platform build-out'
        body: "Multiple integrations built on shared infrastructure: caching, sync, monitoring, and documentation standards."
  -
    id: yZ1iRzElTjHn8xUsLbWg
    type: text_section
    enabled: true
    body: "This page is intentionally standalone: no menu, no outbound calls-to-action. It exists to clearly define what this service is (and isn't), and what \"quality\" means when Planning Center becomes part of your church's website infrastructure."
```

**Step 2: Clear stache, verify, commit**

```bash
php artisan statamic:stache:clear
git add content/collections/pages/
git commit -m "migrate: planning-center-integration page to landing-page template"
```

---

## Task 16: Migrate Common Website Risks

**Files:**
- Modify: `content/collections/pages/common-website-risks.md`

**Step 1: Add scaffold data**

```yaml
template: pages/landing-page
scaffold:
  -
    id: zA2jSaFmUkIo9yVtMcXh
    type: hero
    enabled: true
    eyebrow: 'Website stewardship • oversight • maintenance • risk'
    heading: 'Common Website Risks'
    description: "Website problems rarely happen all at once. Most build slowly — as people change, tools age, and small decisions accumulate. This page names the most common risks, regardless of platform, so decision-makers can make clearer, calmer choices about what to do next."
  -
    id: aB3kTbGnVlJp0zWuNdYi
    type: card_grid
    enabled: true
    section_heading: 'The Most Common Risks'
    section_body: "You don't need to fix everything at once. The first win is simply naming what's happening. Once the risks are visible, decisions get easier."
    columns: '2'
    cards:
      -
        id: bC4lUcHoWmKq1aXvOeZj
        type: card
        enabled: true
        heading: 'Unclear Responsibility'
        body: "No shared understanding of who decides what, who follows through, and what \"done\" actually means."
        items:
          -
            id: cD5mVdIpXnLr2bYwPfAk
            type: item
            enabled: true
            text: 'Small requests stall or bounce between people'
          -
            id: dE6nWeJqYoMs3cZxQgBl
            type: item
            enabled: true
            text: 'Decisions get revisited because the rationale was never recorded'
      -
        id: eF7oXfKrZpNt4dAyRhCm
        type: card
        enabled: true
        heading: 'Knowledge Loss'
        body: "A volunteer, staff member, or vendor \"just knows\" how things work—until they leave."
        items:
          -
            id: fG8pYgLsAqOu5eBzSiDn
            type: item
            enabled: true
            text: 'Login details, hosting context, and vendor history are scattered'
          -
            id: gH9qZhMtBrPv6fCaTjEo
            type: item
            enabled: true
            text: 'New helpers have to relearn everything from scratch'
      -
        id: hI0rAiNuCsQw1gDbUkFp
        type: card
        enabled: true
        heading: 'Hidden Fragility'
        body: "The site works—until an update, a plugin conflict, a certificate renewal, or a small change triggers a bigger problem."
        items:
          -
            id: iJ1sBjOvDtRx2hEcVlGq
            type: item
            enabled: true
            text: 'Updates feel risky, so they get deferred'
          -
            id: jK2tCkPwEuSy3iFdWmHr
            type: item
            enabled: true
            text: '"Temporary" fixes become permanent dependencies'
      -
        id: kL3uDlQxFvTz4jGeXnIs
        type: card
        enabled: true
        heading: 'Ad-hoc Change'
        body: "Changes happen in a hurry, without a clear plan, without documentation, and without a way to roll back safely."
        items:
          -
            id: lM4vEmRyGwUa5kHfYoJt
            type: item
            enabled: true
            text: 'Important changes are made directly on the live site'
          -
            id: mN5wFnSzHxVb6lIgZpKu
            type: item
            enabled: true
            text: 'The site becomes harder to maintain after each "quick fix"'
      -
        id: nO6xGoTaIyWc7mJhAqLv
        type: card
        enabled: true
        heading: 'Security by Assumption'
        body: "Everyone assumes backups, updates, and security are \"handled,\" but no one can say what's actually in place—or what happens when something goes wrong."
        items:
          -
            id: oP7yHpUbJzXd8nKiBrMw
            type: item
            enabled: true
            text: "No clear backup and recovery process that's been tested"
          -
            id: pQ8zIqVcKaYe9oLjCsNx
            type: item
            enabled: true
            text: 'Access control grows messy over time'
      -
        id: qR9aJrWdLbZf0pMkDtOy
        type: card
        enabled: true
        heading: 'Platform Lock-in'
        body: "Decisions that make future change harder than it needs to be—because the site depends on a maze of theme builders, plugins, or custom work no one wants to touch."
        items:
          -
            id: rS0bKsXeMcAg1qNlEuPz
            type: item
            enabled: true
            text: "You can't change vendors without fear"
          -
            id: sT1cLtYfNdBh2rOmFvQa
            type: item
            enabled: true
            text: 'The cost of small improvements keeps rising'
      -
        id: tU2dMuZgOeCi3sPnGwRb
        type: card
        enabled: true
        heading: 'Content Drift'
        body: "The website slowly becomes less accurate, less consistent, and harder to navigate—because content updates aren't guided by clear standards."
        items:
          -
            id: uV3eNvAhPfDj4tQoHxSc
            type: item
            enabled: true
            text: 'Old events, stale pages, and duplicated information accumulate'
          -
            id: vW4fOwBiQgEk5uRpIyTd
            type: item
            enabled: true
            text: "Visitors can't quickly find what they need"
      -
        id: wX5gPxCjRhFl6vSqJzUe
        type: card
        enabled: true
        heading: 'Inconsistent Support'
        body: "Help is intermittent. Each new helper needs context. Work gets repeated, and confidence erodes."
        items:
          -
            id: xY6hQyDkSiGm7wTrKaVf
            type: item
            enabled: true
            text: 'The same problems resurface every few months'
          -
            id: yZ7iRzElTjHn8xUsLbWg
            type: item
            enabled: true
            text: 'Decisions get delayed because no one wants to "break anything"'
  -
    id: zA8jSaFmUkIo9yVtMcXh
    type: card_grid
    enabled: true
    section_heading: 'What a Good Next Step Looks Like'
    section_body: "If a few of these risks feel familiar, the next step usually isn't a rebuild. It's clarity: what exists today, what's fragile, what's working, and what decisions need to be made next."
    columns: '3'
    cards:
      -
        id: aB9kTbGnVlJp0zWuNdYi
        type: card
        enabled: true
        style: borderless
        heading: 'Make the situation visible'
        body: "Gather the essentials: hosting, access, backups, update process, and vendor history."
      -
        id: bC0lUcHoWmKq1aXvOeZj
        type: card
        enabled: true
        style: borderless
        heading: "Strengthen what's fragile"
        body: "Reduce avoidable complexity and make updates safer and more predictable."
      -
        id: cD1mVdIpXnLr2bYwPfAk
        type: card
        enabled: true
        style: borderless
        heading: 'Change wisely'
        body: "Improve through deliberate steps that don't create new problems."
  -
    id: dE2nWeJqYoMs3cZxQgBl
    type: text_section
    enabled: true
    cta_label: 'Book a Meeting'
    cta_link: 'url::https://calendar.app.google/Y2kcf7HpbHWTspj7A'
```

**Step 2: Clear stache, verify, commit**

```bash
php artisan statamic:stache:clear
git add content/collections/pages/
git commit -m "migrate: common-website-risks page to landing-page template"
```

---

## Task 17: Delete old page-specific templates

Once all pages are verified, delete the now-unused static templates.

**Step 1: Delete old templates**

```bash
rm resources/views/pages/douggough.antlers.html
rm resources/views/pages/why-laravel-statamic.antlers.html
rm resources/views/pages/ai-knowledge-base.antlers.html
rm resources/views/pages/ai-assisted-development.antlers.html
rm resources/views/pages/church-website-stewardship.antlers.html
rm resources/views/pages/planning-center-integration.antlers.html
rm resources/views/pages/common-website-risks.antlers.html
```

**Step 2: Final stache clear and full site check**

```bash
php artisan statamic:stache:clear
```

Visit each page URL and confirm all content renders correctly:
- `https://douggough.test/`
- `https://douggough.test/why-laravel-statamic`
- `https://douggough.test/ai-knowledge-base`
- `https://douggough.test/ai-assisted-development`
- `https://douggough.test/church-website-stewardship`
- `https://douggough.test/planning-center-integration`
- `https://douggough.test/common-website-risks`

**Step 3: Final commit**

```bash
git add -A
git commit -m "refactor: remove static page templates now fully replaced by landing-page + page builder"
```
