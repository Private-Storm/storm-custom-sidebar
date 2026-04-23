# Storm Custom Sidebar

> A highly customizable, animated sidebar navigation card for [Home Assistant](https://www.home-assistant.io/) Lovelace dashboards.

![Version](https://img.shields.io/badge/version-1.1.0-blueviolet?style=flat-square)
![HA](https://img.shields.io/badge/Home%20Assistant-compatible-41BDF5?style=flat-square&logo=home-assistant)
![License](https://img.shields.io/badge/license-GPL-green?style=flat-square)

---

## ✨ Features

- **Collapsed / Expanded** states with smooth animated transitions
- **Animated selection bar** that tracks hover and active page
- **Active item highlighting** — automatically detects the current URL
- **Inline section separators** — just use `name: "---"` in your button list
- **Badge support** — display live entity states next to any navigation item, with optional sonar-ping animation
- **Fully configurable** via YAML — colors, sizes, spacing, radii, transitions
- **Custom scrollbar** styling (Webkit + Firefox)
- **Collapsible footer** with user avatar, name, subtitle and expandable content
- **SVG icon support** — use custom SVG files instead of MDI icons, per navigation item

---

## 📦 Installation

### Manual

1. Download `storm-custom-sidebar-card.js`
2. Copy it to your `config/www/community/storm/` folder
3. Add it as a resource in your dashboard:

```yaml
url: /local/community/storm-custom-sidebar-card.js
type: module
```

---

## 🚀 Quick Start

```yaml
type: custom:storm-custom-sidebar-card
name: My Home
buttons:
  - name: Living Room
    icon: mdi:sofa
    path: /lovelace/living-room
  - name: Kitchen
    icon: mdi:fridge
    path: /lovelace/kitchen
  - name: "---"
  - name: Settings
    icon: mdi:cog
    path: /lovelace/settings
```

---

## 🗺️ Grid Layout Integration

The sidebar is designed to work seamlessly with CSS Grid layouts. Use `view_layout` to place it in a named grid area:

```yaml
type: custom:storm-custom-sidebar-card
view_layout:
  grid-area: sidebar
name: My Home
```

---

## ⚙️ Full Configuration Example

```yaml
type: custom:storm-custom-sidebar-card
view_layout:
  grid-area: sidebar
name: My Home
debug_log: false

styles:
  width: 260px
  width-min: 70px
  background: "#1b1b1c"
  border-radius: 16px
  border-width: 0px
  border-color: transparent
  header-height: 80px
  title-font-size: 1.5rem
  title-font-weight: bold
  title-color: "#ffffff"
  font-size: 1rem
  icon-size: 21px
  icon-color: "#cccccc"
  icon-color-hover: "#000000"
  icon-color-active: "rgba(0,0,0,0.7)"
  highlight-color: "#e7dcf4"
  separator-color: "rgba(49,50,53,0.7)"
  selection-radius: 14px
  scrollbar-color: "#e7dcf4"
  hover-transition: 0.4s
  footer-background: "#2b2c30"
  footer-margin: 8px
  footer-border-radius: 16px
  footer-height: 54px
  footer-title-font-size: 0.9rem
  footer-subtitle-font-size: 0.7rem
  avatar-size: 36px

footer:
  subtitle: Admin
  content: If you want a guarantee, buy a toaster.
  avatar_path: /lovelace/profile

buttons:
  - name: Living Room
    icon: mdi:sofa
    path: /lovelace/living-room

  - name: Kitchen
    icon: mdi:fridge
    path: /lovelace/kitchen

  - name: Bedroom
    icon: mdi:bed-empty
    path: /lovelace/bedroom
    badge:
      entity: switch.bedroom_lamp
      color: "rgba(255,255,0,0.6)"
      text-color: "rgba(255,255,255,1)"
      border-color: "rgba(255,255,0,0.9)"
      animation: true
      animation-color: "rgba(255,255,0,1)"

  - name: Bathroom
    icon: mdi:bathtub
    path: /lovelace/bathroom
    badge:
      entity: sensor.active_lights_count
      color: "rgba(255,0,0,0.6)"
      text-color: "rgba(255,255,255,1)"
      border-color: "rgba(255,0,0,0.9)"
      animation: false
      animation-color: "rgba(255,0,0,1)"

  - name: Garage
    icon: mdi:garage
    path: /lovelace/garage

  - name: "---"

  - name: Multimedia
    icon: mdi:headphones
    path: /lovelace/multimedia

  - name: Automations
    icon: mdi:home-automation
    path: /lovelace/automations

  - name: "---"

  - name: Book Server
    icon: mdi:bookshelf
    path: /lovelace/books

  - name: Music Server
    icon: mdi:music
    path: /lovelace/music
```

---

## 📐 Style Properties

### Sidebar

| Property        | Default       | Description                  |
| --------------- | ------------- | ---------------------------- |
| `width`         | `260px`       | Width when expanded          |
| `width-min`     | `70px`        | Width when collapsed         |
| `background`    | `#1a1a1a`     | Background color             |
| `color`         | `#f5f6fa`     | General text color           |
| `border-radius` | `16px`        | Corner radius of the sidebar |
| `border-width`  | `0px`         | Border width                 |
| `border-color`  | `transparent` | Border color                 |

### Spacing

| Property         | Default | Description          |
| ---------------- | ------- | -------------------- |
| `margin-top`     | `0px`   | Outer margin top     |
| `margin-right`   | `0px`   | Outer margin right   |
| `margin-bottom`  | `0px`   | Outer margin bottom  |
| `margin-left`    | `0px`   | Outer margin left    |
| `padding-top`    | `0px`   | Inner padding top    |
| `padding-right`  | `0px`   | Inner padding right  |
| `padding-bottom` | `0px`   | Inner padding bottom |
| `padding-left`   | `0px`   | Inner padding left   |

### Header

| Property            | Default  | Description               |
| ------------------- | -------- | ------------------------- |
| `header-height`     | `80px`   | Height of the header area |
| `title-color`       | `#fff`   | Title text color          |
| `title-font-size`   | `1.5rem` | Title font size           |
| `title-font-weight` | `bold`   | Title font weight         |

### Navigation Items

| Property            | Default   | Description                           |
| ------------------- | --------- | ------------------------------------- |
| `item-height`       | `54`      | Height of each item in px (no unit!)  |
| `font-size`         | `1rem`    | Label font size                       |
| `icon-size`         | `24px`    | Icon size                             |
| `icon-color`        | `#8392a5` | Icon & text color (default state)     |
| `icon-color-hover`  | `#ffffff` | Icon & text color on hover            |
| `icon-color-active` | `#ffffff` | Icon & text color for active item     |
| `hover-transition`  | `0.25s`   | Duration of color transition on hover |

### Selection Bar

| Property           | Default   | Description                                        |
| ------------------ | --------- | -------------------------------------------------- |
| `highlight-color`  | `#9c88ff` | Background color of the selection bar              |
| `selection-radius` | `16px`    | Corner radius of the selection bar (all 4 corners) |

### Scrollbar

| Property          | Default                 | Description                                                            |
| ----------------- | ----------------------- | ---------------------------------------------------------------------- |
| `scrollbar-color` | _(= `highlight-color`)_ | Color of the scrollbar thumb. Defaults to `highlight-color` if not set |

### Separator

| Property          | Default                 | Description                                |
| ----------------- | ----------------------- | ------------------------------------------ |
| `separator-color` | `rgba(255,255,255,0.1)` | Color of all separators (fixed and inline) |

### Footer

| Property                    | Default           | Description                                         |
| --------------------------- | ----------------- | --------------------------------------------------- |
| `footer-background`         | `rgba(0,0,0,0.2)` | Footer background color                             |
| `footer-margin`             | `8px`             | Margin around the footer                            |
| `footer-border-radius`      | `16px`            | Corner radius of the footer                         |
| `footer-height`             | `54px`            | Height of the footer heading row                    |
| `footer-title-font-size`    | `0.9rem`          | Font size of the username                           |
| `footer-subtitle-font-size` | `0.7rem`          | Font size of the subtitle                           |
| `avatar-size`               | `36px`            | Size of the avatar image                            |
| `avatar-bg`                 | `#444`            | Fallback background if no avatar image is available |

---

## 🔘 Button Properties

| Property | Required | Description                                                                                         |
| -------- | -------- | --------------------------------------------------------------------------------------------------- |
| `name`   | ✅        | Display label. Use `"---"` to render a separator line                                               |
| `icon`   | —        | MDI icon string, e.g. `mdi:sofa`                                                                    |
| `svg`    | —        | Path to a custom SVG file, e.g. `/local/icons/home.svg`. Takes priority over `icon` if both are set |
| `path`   | —        | Navigation path, e.g. `/lovelace/my-view`                                                           |
| `badge`  | —        | Optional badge object (see below)                                                                   |

---

## 🖼️ SVG Icons

In addition to MDI icons, the card supports custom SVG files per navigation item. When `svg` is set, it takes priority over `icon`.

```yaml
buttons:
  - name: Living Room
    icon: mdi:sofa # fallback if svg is not set
    svg: /local/sidebar_icons/living-room.svg
    path: /lovelace/living-room

  - name: Kitchen
    svg: /local/sidebar_icons/kitchen.svg
    path: /lovelace/kitchen

  - name: Bedroom
    icon: mdi:bed-empty # used as fallback
    path: /lovelace/bedroom
```

SVG files are loaded from your Home Assistant `www/` folder. Place your files there and reference them as `/local/your-file.svg`.

> **Important:** For SVG icons to respond correctly to `icon-color`, `icon-color-hover` and `icon-color-active`, the SVG file must use `currentColor` for its fill or stroke values instead of hardcoded colors.
> 
> Example of a correctly prepared SVG:
> 
> ```xml
> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
>   <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
> </svg>
> ```

---

## 🔴 Badge Properties

Badges display a live entity value as a small pill overlay on the navigation item. They are perfect for showing counts, states or alerts at a glance.

| Property          | Required | Description                                     |
| ----------------- | -------- | ----------------------------------------------- |
| `entity`          | ✅        | The HA entity whose state is displayed          |
| `color`           | —        | Background color of the badge                   |
| `text-color`      | —        | Text color of the badge label                   |
| `border-color`    | —        | Border color of the badge                       |
| `animation`       | —        | `true` / `false` — enables sonar ping animation |
| `animation-color` | —        | Color of the sonar ping animation ring          |

### Badge Example

```yaml
- name: Bedroom
  icon: mdi:bed-empty
  path: /lovelace/bedroom
  badge:
    entity: switch.bedroom_lamp
    color: "rgba(255,255,0,0.6)"
    text-color: "rgba(255,255,255,1)"
    border-color: "rgba(255,255,0,0.9)"
    animation: true
    animation-color: "rgba(255,255,0,1)"
```

The badge shows the current state of `switch.bedroom_lamp` (e.g. `on` / `off`) with a pulsing sonar animation in yellow.

---

## ➖ Inline Separators

You can divide your navigation into sections by inserting a separator anywhere in your button list. Simply add an entry with `name: "---"`:

```yaml
buttons:
  - name: Living Room
    icon: mdi:sofa
    path: /lovelace/living-room
  - name: Kitchen
    icon: mdi:fridge
    path: /lovelace/kitchen
  - name: "---"
  - name: Automations
    icon: mdi:home-automation
    path: /lovelace/automations
```

> **Note:** The separator item does not trigger hover highlighting. Hovering over it keeps the selection bar hidden.

---

## 👤 Footer

The footer automatically displays the currently logged-in Home Assistant user, including their profile picture if one is set.

```yaml
footer:
  subtitle: Admin # shown below the username
  avatar_path: /lovelace/profile # clicking the avatar navigates here (optional)
  content: Some text here # shown when footer is expanded (optional)
```

Clicking the name/subtitle area expands a collapsible content section with a smooth animation.

---

## 💡 Tips & Quirks

**Hex values in YAML**
Home Assistant sometimes escapes quotes around color values. The card handles all of these correctly:

```yaml
background: "#1a1a1a"   # ✓ double quotes
background: '#1a1a1a'   # ✓ single quotes
background: "#1a1a1a"   # ✓ HA escaped variant
```

**`item-height` has no unit**
Unlike most other size properties, `item-height` is a plain number without `px`:

```yaml
item-height: 54    # ✓ correct
item-height: 54px  # ✗ will not work
```

**`scrollbar-color` defaults to `highlight-color`**
If you do not set `scrollbar-color`, it automatically inherits the value of `highlight-color`. You only need to set it if you want a different color for the scrollbar.

**Active item detection**
The card uses `window.location.pathname.startsWith(path)` to determine the active item. For best results, use unique path prefixes for each view. Avoid using `/lovelace` alone as a path if you have multiple views under that prefix.

**Collapsed state**
In collapsed mode, item labels and the title fade out smoothly. The selection bar becomes a square centered behind the icon. Badges remain visible.

**Debug logging**
Set `debug_log: true` to output card internals to the browser console — useful when troubleshooting height calculations or configuration issues.

---

## 🧩 Part of the Storm Dashboard Card Collection

This card is part of a growing collection of custom Home Assistant cards built for a clean, consistent, and highly customizable dashboard experience.

---

## 📄 License

GPL — feel free to use, modify and share.
