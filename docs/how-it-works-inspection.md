# How It Works Page — Reverse Engineering & Inspection Report

**Target URL:** https://puppy.instabizweb.com/how-it-works  
**Evidence Sources:**
- `pup4.mp4` — Two ways home, section navigation, and delivery airplane animation
- `pup5.mp4` — Our premium puppy promise scroll animations
- `pup6.mp4` — Lower-page mascot animation and promotional section
- Reverse-engineered Next.js chunks: `0te0tivnjcmcm.js`, `1llon2cx5n3pm.js`, `177ya708_1zuj.js`
- Live DOM and stylesheet inspection (`main.css`, `base.css`)

---

## 1. Discovered Page Structure & Sections

The "How It Works" page consists of the following sequential sections:

1. **Hero Header & On-Page Navigation (`#main`)**:
   - Sky gradient background (`--sky-top: #fffbf3; --sky-bottom: #f6cc85`).
   - Title: "How it works" in plush font (`font-plush text-giant`).
   - Intro lede: "Whether you choose to visit us locally or order a premium breed from overseas...".
   - Four numbered navigation chips in `<nav aria-label="On this page">`:
     - `1 Two ways home` (`href="#two-ways"`)
     - `2 Our premium puppy promise` (`href="#promise"`)
     - `3 Delivery & collection` (`href="#delivery"`)
     - `4 Why choose us` (`href="#why"`)
2. **Two Ways Home (`#two-ways`)**:
   - Section heading with kicker: `choose your way` / `Two ways home`.
   - Dual-tab toggle control (`.tp-switch` with `--at: 0` or `--at: 1`):
     - `In Dubai` (hint: `meet in person`) → controls `#panel-local`
     - `Imported` (hint: `order upon request`) → controls `#panel-imported`
   - Animated Teddy dog mascot (`.tp-journeys__teddy` facing right, `pose="sit"`).
   - Local panel (`#panel-local`):
     - Title: `Meet your puppy in person`.
     - Downtown Dubai skyline postcard illustration (`.tp-postcard` with sun and Burj Khalifa silhouette).
     - 4 sequential steps (Explore, Choose, Meet before you choose, Pick-up or delivery) with custom rounded icon badges (`--tint: #fbe3b4, #fde6de, #e3f0fb, #e6f2df`).
   - Imported panel (`#panel-imported`):
     - Title: `Order upon request`.
     - Europe · Korea to Dubai curved flight postcard (`.tp-postcard--sky`).
     - 4 sequential steps (Reserve, Personalized consultation, Import and arrival, Welcome home).
3. **Our Premium Puppy Promise (`#promise`)**:
   - Tilted stamped passport paper container (`.tp-paper -rotate-[0.6deg]`).
   - Heading: `puppy passport` / `Our premium puppy promise`.
   - 3 authentic ink stamp cards:
     - 1. `Hand-selected breeders` (`.tp-stamp--round`, `--ink-stamp: #a24a1a`, `--tilt: -8deg`, `--i: 0`).
     - 2. `Full transparency` (`.tp-stamp--ticket`, `--ink-stamp: #1f6b45`, `--tilt: 5deg`, `--i: 1`).
     - 3. `Safe, stress-free delivery` (`.tp-stamp--oval`, `--ink-stamp: #5a3a28`, `--tilt: -4deg`, `--i: 2`).
   - Scroll-linked stamp animation: stamps enter with scale, rotation, and opacity slam, and reverse on scroll-up.
4. **Delivery & Collection (`#delivery`)**:
   - 2-column layout:
     - Left: Descriptive list (Same day home, Delivery within Dubai, Safe cargo, Worldwide delivery).
     - Right: Illustrated cityscape skyline with flight route overlay (`.tp-flight`).
   - Svg flight trajectory `d="M40 250 C 170 40, 470 20, 620 168"` from Korea `(40, 250)` to Dubai `(620, 168)`.
   - Interactive airplane animated along the path directly tied to viewport scroll progress.
5. **Why Choose Us (`#why`)**:
   - Section heading: `Why choose us`.
   - 3 highlighted benefit cards with custom icons:
     - `International cargo` (airplane badge)
     - `Support 24/7` (message badge)
     - `Health guarantee` (heart with ECG line badge)
6. **Promotional Panel: Unique and High Quality Puppies (`#care-title`)**:
   - Padded card container (`.tp-board md:!p-12`).
   - Content: Heading, description, WhatsApp CTA, and "See available puppies" ghost button.
   - Interactive cartoon dog mascot on the right (`.pup-buddy` facing left, `pose="sit"`).
7. **Global Footer**: Standard TeddyPups footer with newsletter, navigation links, and copyright.

---

## 2. Navigation Behavior & Scroll Offsets

- **Anchor Navigation**:
  - Clicking any of the 4 chips (`#two-ways`, `#promise`, `#delivery`, `#why`) must scroll smoothly to that section.
  - Sticky header compensation: The sticky header is `var(--header-h, 5.5rem)` (~88px). Scroll targets must offset by this height so titles are not clipped or obscured.
  - Crucial: Internal anchor clicks (`#two-ways`, etc.) must **not** trigger the global page curtain transition screen (`RouteCurtain`).
  - Hash updates: Updates window hash/history cleanly without full page reloads.

---

## 3. Two Ways Home Section & Mascot Mechanics

### A. Tab Switching
- Tab list has sliding pill background (`.tp-switch__thumb`) animated via CSS transform `translateX(calc(var(--at) * 100%))`.
- Switching between "In Dubai" (`0`) and "Imported" (`1`):
  - Updates `--at` on `.tp-switch`.
  - Sets `aria-selected="true"` and `tabIndex="0"` on the active tab button.
  - Hides inactive panel (`hidden` attribute or display none) and renders active panel.
  - Steps animate in with staggered entrance (`animation: tp-step-in 0.55s var(--ease-pounce)` with delay `calc(var(--i) * 90ms)`).

### B. Mascot Interaction (Teddy)
- **Tail Wagging**:
  - The tail group (`g[data-p="tail"]`) oscillates continuously using smooth sinusoidal rotation around pivot `(84, 150)`.
  - Natural wagging frequency ~`0.6` to `1.0` cycles/sec with angle sweep approximately `±18deg`.
  - The tail moves independently while body, head, and haunches remain anchored.
- **Pupil / Eye Tracking**:
  - Global `pointermove` listener computes cursor position relative to the mascot's head pivot.
  - Gaze vector `(gazeX, gazeY)` moves the eye pupils (`g[data-p="eyes"]`) smoothly within the eye sockets.
  - Returns smoothly to neutral resting gaze when the pointer stops or leaves.
- **Head Tilt & Blinking**:
  - Periodic subtle head tilting (`cock` angle `±10deg` to `14deg`).
  - Occasional natural eye blink cycle (`nextBlink` every 1.5–3.5 seconds).

---

## 4. Premium Puppy Promise Scroll Animation Mechanics

### A. Visual Treatment
- 3 stamps on parchment background:
  - 1: Circular stamp (`#a24a1a`, `--tilt: -8deg`).
  - 2: Ticket stamp with scalloped edges (`#1f6b45`, `--tilt: 5deg`).
  - 3: Oval stamp (`#5a3a28`, `--tilt: -4deg`).
- Stamped ink texture with dashed border inset and multiply mix-blend-mode.

### B. Scroll-Driven Physics (From CSS & Video Inspection)
- When scrolling down into the section:
  - Stamps scale down from `1.7` to `1.0` while rotating from `calc(var(--tilt) - 16deg)` into `var(--tilt)`.
  - Slight squash-and-stretch overshoot: scale `1.7` → `0.93` → `1.03` → `1.0`.
  - Opacity ramps from `0` to `0.9`.
  - Staggered timing across the 3 items using `var(--i)`.
- When scrolling back up:
  - The animation is strictly reversible—the stamps lift off the page and rotate back out.
  - Supported via CSS scroll-driven `animation-timeline: view()` and progressive fallback to scroll observer in browsers where `animation-timeline` is unsupported.

---

## 5. Delivery & Collection Airplane Flight Mechanics

From `reference/js/0te0tivnjcmcm.js` (`Flight` component):
- **Path**: Cubic Bézier SVG trajectory:
  ```
  d="M40 250 C 170 40, 470 20, 620 168"
  ```
- **Viewport Scroll Range**:
  - Starts when the flight container reaches `95%` of the viewport.
  - Finishes when the flight container reaches `25%` of the viewport.
  - Normalized progress `progress ∈ [0, 1]`.
- **Airplane Position & Tangent Calculation**:
  ```js
  const totalLength = pathElement.getTotalLength();
  const currentLen = Math.min(totalLength, Math.max(0, progress * totalLength));
  const pt = pathElement.getPointAtLength(currentLen);
  const pNext = pathElement.getPointAtLength(Math.min(totalLength, currentLen + 1));
  const pPrev = pathElement.getPointAtLength(Math.max(0, currentLen - 1));
  const angle = (180 * Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x)) / Math.PI;

  airplaneGroup.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
  airplaneGroup.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.11) / 0.06)));
  ```
- **Reversibility**:
  - Scrolling down: Plane travels left to right along the arc from Korea (bottom left) to Dubai (middle right).
  - Scrolling up: Plane reverses along the trajectory right to left.

---

## 6. Lower Promotional Mascot & Panel

- Located in `#care-title` ("Unique and high quality puppies").
- Positioned on the right side of the promotional board:
  - Sitting cartoon mascot (`pose="sit"`, facing left `data-facing="left"`).
  - SVG mirrored horizontally via `transform="translate(300 0) scale(-1 1)"`.
  - Active continuous tail-wagging animation.
  - Active cursor gaze tracking.
  - CTA button to WhatsApp opens in a new tab with pre-filled message.
  - CTA button "See available puppies" navigates to `/puppies`.

---

## 7. Implementation Plan

1. **Create Interactive Mascot Component**:
   - `src/components/pup/PupBuddy.tsx`: Lightweight, high-performance mascot wrapper that connects SVG elements to continuous tail wagging (`requestAnimationFrame`), eye gaze tracking (`pointermove`), and idle blink/tilt cycles without re-rendering the entire React tree.
2. **Create Airplane Flight Animation Component**:
   - `src/components/how/FlightAnimation.tsx`: Pure SVG scroll-linked flight path with mathematical Bézier tangent tracking and bidirectional scroll reactivity.
3. **Refactor How It Works Page (`src/pages/HowItWorksPage.tsx`)**:
   - Implement interactive React tab state (`activeJourney`: `'local' | 'imported'`).
   - Add smooth anchor scroll handler with sticky header offset (`window.scrollTo({ top: targetTop - 90, behavior: 'smooth' })`).
   - Mount interactive `PupBuddy` in Two Ways Home.
   - Mount interactive `FlightAnimation` in Delivery & Collection.
   - Mount interactive `PupBuddy` in the lower promotional card.
   - Implement scroll-linked stamp animations with forward and reverse responsiveness.
4. **Verify Responsive Layout & Automated Validation**:
   - Run CDP test suite verifying all 4 navigation jumps, tab toggling, mascot tail and eye movement, scroll-linked airplane positioning, and promise stamps.

