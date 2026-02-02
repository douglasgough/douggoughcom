# Antlers View Structure

This directory contains the Antlers-based view structure for the Statamic/Laravel project, created alongside the existing static HTML site.

## Directory Structure

```
resources/views/
├── layout.antlers.html            # Main layout with <head>, header, footer includes
├── layouts/
│   └── base.antlers.html          # Legacy layout (no longer in use)
├── partials/
│   ├── header.antlers.html        # Site header navigation
│   └── footer.antlers.html        # Site footer
└── pages/
    ├── home.antlers.html          # Homepage (index.html)
    ├── about.antlers.html         # About page
    ├── contact.antlers.html       # Contact page
    ├── solutions.antlers.html     # Solutions page
    ├── how-i-work.antlers.html    # How I Work page
    ├── schedule.antlers.html      # Schedule page
    ├── church-wordpress-support.antlers.html  # WordPress support page
    └── new-church-website.antlers.html        # New website page
```

## How It Works

### Main Layout
The `layout.antlers.html` file contains:
- Document structure (html, head, body)
- Meta tags and fonts (Inter and Lora)
- Vite asset includes for CSS and JS
- Google Analytics tracking
- Skip to content accessibility link
- Header partial include: `{{ partial:header }}`
- Footer partial include: `{{ partial:footer }}`
- Template content slot: `{{ template_content }}`

### Page Templates
Each page template in `pages/` includes:
- Front matter with page title: `title: "Page Title"`
- Main content sections (everything between header and footer)
- No layout wrapper (handled by Statamic routing)

### Partials
- **header.antlers.html**: Contains the site navigation. Currently includes static HTML but can be enhanced later with active state logic.
- **footer.antlers.html**: Contains the footer content with copyright and links.

## Usage in Statamic

### Setting Up Routes
In your Statamic routes or collection configuration, you'll reference these templates:

```yaml
# Example in a collection or route
template: pages/home
layout: layout
```

### Page Title Variable
Each page template sets a title in the front matter that the base layout uses:
```antlers
---
title: "Contact | Doug Gough"
---
```

The main layout renders it as:
```antlers
<title>{{ title ?? 'DougGough.com — Church Website Support' }}</title>
```

## Assets
The templates use Vite for asset bundling:
- `resources/css/site.css` - Tailwind CSS
- `resources/js/site.js` - Alpine.js and site JavaScript

The layout also includes Google Analytics tracking with anonymized IP.

## Forms
Forms in the templates currently have `action="#"` and are non-functional mockups. To make them work:
1. Wire them to a Statamic form handler
2. Add form tags: `{{ form:create }}`
3. Add CSRF protection
4. Configure form submissions in Statamic control panel

## Next Steps for Dynamic Content

This is a **static-first implementation**. To gradually make it dynamic:

1. **Navigation**: Update header partial to use Statamic navigation
2. **Collections**: Create collections for reusable content sections
3. **Forms**: Wire up contact forms to Statamic form handlers
4. **Blueprints**: Define content fields for each page type
5. **Replicator Sets**: Convert card sections to replicator fields
6. **Globals**: Move site-wide content (footer links, contact info) to globals

## Coexistence with Static Site

These Antlers templates coexist safely with your static HTML files because:
- They're in a separate `resources/views/` directory
- The static HTML files remain in the root directory
- No static files have been modified or deleted
- Both can run simultaneously during migration

## Testing

To test these templates:
1. Set up Statamic routing to point to these templates
2. Create corresponding entries or routes
3. Verify all assets load correctly (CSS, JS)
4. Test forms (though they'll need handlers first)
