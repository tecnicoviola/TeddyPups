# Page Transition Inventory: "Every Puppy is Family" Curtain Transition

## 1. Executive Summary & Mechanism Analysis

Reverse engineering of the original site (`https://puppy.instabizweb.com`) source code (`reference/js/177ya708_1zuj.js` and `reference/css/10jf32vdx50lp.css`) confirms the page transition is governed by a global component named **`RouteCurtain`** (`.tp-curtain`).

### The Global Transition Rule:
In the original website:
1. Every standard internal link (`<a>` tag pointing to internal routes under the same origin, e.g. `/`, `/puppies`, `/happy-families`, `/how-it-works`, `/faq`, `/contact`, `/gone-home`, `/puppies/[slug]`) intercepts click events globally via `addEventListener("click", y, true)` in `RouteCurtain`.
2. When the destination route differs from the current page (`d.pathname !== location.pathname || !d.hash && d.search === location.search`), `RouteCurtain` prevents default navigation, starts the `covering` animation (300ms cubic-bezier sliding up the blanket from bottom), transitions to `covered`, triggers router navigation, and upon arrival transitions to `lifting` (460ms cubic-bezier sliding the blanket up and off top), then resets to `idle`.
3. If an anchor tag has `target="_blank"`, `download`, `data-no-curtain`, or points to an external link (e.g. WhatsApp `wa.me`, Google Maps, phone, mailto), the curtain transition is **bypassed** (`return`).
4. Same-page hash navigation (e.g. `/how-it-works#delivery` while on `/how-it-works`) or in-page filter state updates without page change also bypass the curtain.
5. Popstate (browser back/forward button) triggers `snap` mode if the pathname changes.
6. Reduced motion (`prefers-reduced-motion: reduce`) completely disables the transition (`display: none !important;`).

---

## 2. Transition Inventory Matrix

| Source Page | Trigger Element | Destination Page | Transition Appears? | Observed Behavior & Notes |
|---|---|---|---|---|
| **Home** (`/`) | Header Logo | `/` | No (Same page) | URL path is identical; instant smooth reset without curtain overlay. |
| **Home** (`/`) | Header "Puppies" link | `/puppies` | **YES** | Global `RouteCurtain` covers from bottom with scallop edge, runner mascot walks with paw trail, "every puppy is family" note, lifts off. |
| **Home** (`/`) | Header "Happy Families" link | `/happy-families` | **YES** | Full branded curtain transition (`covering` -> `covered` -> `lifting` -> `idle`). |
| **Home** (`/`) | Header "How It Works" link | `/how-it-works` | **YES** | Full branded curtain transition. |
| **Home** (`/`) | Header "FAQ" link | `/faq` | **YES** | Full branded curtain transition. |
| **Home** (`/`) | Header "Contact" link | `/contact` | **YES** | Full branded curtain transition. |
| **Home** (`/`) | Header "Enquire on WhatsApp" | External `https://wa.me/...` | No | External link (`d.origin !== location.origin`), opens external WhatsApp without curtain. |
| **Home** (`/`) | Hero "View available puppies" button | `/puppies` | **YES** | Standard internal CTA link; triggers full branded curtain transition. |
| **Home** (`/`) | Hero "Enquire on WhatsApp" | External `https://wa.me/...` | No | External link; no curtain. |
| **Home** (`/`) | "Meet the pups" kennel door link | `/puppies/[slug]` | **YES** | Internal card link (`.tp-door__link`); triggers full branded curtain transition. |
| **Home** (`/`) | "Meet them all" kennel door link | `/puppies` | **YES** | Internal link (`.tp-door--all .tp-door__link`); triggers full branded curtain transition. |
| **Home** (`/`) | "Local pups" / "Imported pups" CTAs | `/puppies?origin=local` / `imported` | **YES** | Internal links navigating to puppies page with query parameters; triggers curtain transition. |
| **Home** (`/`) | "Read how we do it" CTA | `/how-it-works` | **YES** | Internal CTA link; triggers curtain transition. |
| **Home** (`/`) | "Explore happy families" CTA | `/happy-families` | **YES** | Internal CTA link; triggers curtain transition. |
| **Home** (`/`) | "Browse our FAQ" CTA | `/faq` | **YES** | Internal CTA link; triggers curtain transition. |
| **Home** (`/`) | Footer Links (All navigation items) | `/`, `/puppies`, `/happy-families`, etc. | **YES** (if route changes) | All footer internal `<a>` links trigger the curtain when changing pages. Same-page links do not. |
| **Puppies** (`/puppies`) | Header Logo | `/` | **YES** | Navigates from `/puppies` to `/`; triggers full branded curtain transition. |
| **Puppies** (`/puppies`) | Individual Puppy Card (`tp-sketch`) | `/puppies/[slug]` (e.g. `/puppies/maltipoo-max-male`) | **YES** | Clicking anywhere on the puppy card link triggers the curtain transition. |
| **Puppies** (`/puppies`) | "Filter by origin/breed" chips | `/puppies?origin=...` (in-page) | No | Handled as in-page filter state change on same route; does not trigger curtain. |
| **Puppies** (`/puppies`) | "Gone Home" archive button | `/gone-home` | **YES** | Internal CTA link; triggers full branded curtain transition. |
| **Puppy Detail** (`/puppies/[slug]`) | "Back to all puppies" link | `/puppies` | **YES** | Standard internal link; triggers full branded curtain transition. |
| **Puppy Detail** (`/puppies/[slug]`) | Related Puppy Cards | `/puppies/[slug]` | **YES** | Internal puppy link; triggers full branded curtain transition. |
| **Puppy Detail** (`/puppies/[slug]`) | WhatsApp CTA | External `https://wa.me/...` | No | External link; no curtain. |
| **Happy Families** (`/happy-families`) | Internal links & CTAs | Target routes | **YES** | Any route change triggers curtain. |
| **How It Works** (`/how-it-works`) | Section anchor links (e.g. `#delivery`) | `/how-it-works#delivery` | No | Same pathname with hash; bypasses curtain and performs smooth scroll. |
| **FAQ** (`/faq`) | Accordion toggles | Same page | No | In-page interactive toggles (`<details>` / `<button>`); no curtain. |
| **Contact** (`/contact`) | Google Maps CTA | External `maps.app.goo.gl` | No | External link; no curtain. |
| **Contact** (`/contact`) | Contact form submit | `/contact` | No | Form submission; does not trigger curtain. |
| **Any Page** | Browser Back / Forward (`popstate`) | Previous / Next Route | **YES** | Triggers `snap` transition state when `location.pathname` changes. |
| **Any Page** | External link / Tel / Mailto | External | No | Non-matching origin; standard native browser handling. |

---

## 3. Transition Design & Assets Specification

- **Blanket Background:**
  `repeating-linear-gradient(45deg, transparent 0 46px, #2a170e12 46px 48px), repeating-linear-gradient(-45deg, transparent 0 46px, #2a170e12 46px 48px), radial-gradient(circle at 50% 46%, var(--color-milk) 0, transparent 60%), var(--color-honey-soft)`
- **Edge Scallops (Top & Bottom):**
  40px height SVG scallop pattern (`#fbe3b4` fill, `#2a170e` 3px border, dashed internal line) along top and inverted along bottom.
- **Mascot (Runner Dog):**
  Authentic `TeddyRunner` SVG mascot running across `.tp-curtain__stage` with articulated animated legs (`tp-runner-leg-a`, `tp-runner-leg-b`), bobbing body, wagging tail, and perked ears.
- **Paw Trail Prints:**
  5 authentic paw prints placed at coordinates `[[18,6,-76],[27,-4,-84],[36,7,-72],[45,-3,-86],[54,6,-74]]`, animating sequentially (`tp-print-step`).
- **Typography:**
  "every puppy is family" rendered in `font-scrawl` (`Shantell Sans`), color `var(--color-toffee-ink)` (`#783c18`), centered below the runner stage.

