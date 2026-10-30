# How It Works Page — Final Acceptance & Validation Report

**Tested URL:** http://localhost:3000/how-it-works  
**Original Live Reference:** https://puppy.instabizweb.com/how-it-works  
**Reference Videos:** `pup4.mp4`, `pup5.mp4`, `pup6.mp4`

---

## 1. Sections Inspected & Validated

1. **How it works (Hero Header & On-Page Navigation)**:
   - Full plush header, lede paragraph, sky gradient styling.
   - All 4 section chips verified: `1 Two ways home`, `2 Our premium puppy promise`, `3 Delivery & collection`, `4 Why choose us`.
2. **Two ways home (`#two-ways`)**:
   - Tab switch selector (`.tp-switch`) with animated thumb pill and accessible ARIA attributes.
   - Verified active tab toggling between `In Dubai` (`panel-local`) and `Imported` (`panel-imported`).
   - 4-step local journey cards with Downtown Dubai postcard.
   - 4-step imported journey cards with Europe · Korea curved route postcard.
3. **Our premium puppy promise (`#promise`)**:
   - Angled parchment paper container (`.tp-paper`).
   - 3 authentic stamps: `Hand-selected breeders` (circular, `#a24a1a`), `Full transparency` (ticket, `#1f6b45`), `Safe, stress-free delivery` (oval, `#5a3a28`).
   - Stamped ink texture, inset dashed border, and mix-blend multiply styling.
4. **Delivery & collection (`#delivery`)**:
   - 4 benefit feature items.
   - Illustrated city skyline backdrop with Bézier flight route from Korea to Dubai.
5. **Why choose us (`#why`)**:
   - 3 value proposition items: `International cargo`, `Support 24/7`, `Health guarantee`.
6. **Lower Promotional Panel: Unique and high quality puppies (`#care-title`)**:
   - Responsive bordered card container with WhatsApp CTA and "See available puppies" buttons.
   - Illustrated cartoon dog mascot positioned on the right facing left.

---

## 2. Navigation Controls & Behavior

- **Same-Page Anchor Scrolling**:
  - Each chip (`#two-ways`, `#promise`, `#delivery`, `#why`) scrolls smoothly to the destination section.
  - Sticky header compensation: target offset adjusted by 90px (`window.pageYOffset - 90`), preventing headings from getting hidden under the sticky header.
  - URL hash history is updated cleanly via `window.history.pushState(null, '', '#section-id')`.
  - **No accidental global page transitions**: internal anchor navigation does **not** trigger the `RouteCurtain` transition.

---

## 3. Mascot Interactions (Two Ways Home & Lower Promotional Panel)

- **Independent Tail Wagging**:
  - Controlled via `TeddyPuppet` and `PupBuddy` SVG animation loop (`requestAnimationFrame`).
  - Tail transform rotates independently around base pivot `(84, 150)` with smooth sinusoidal oscillation.
  - Verified across multiple CDP test frames:
    - Frame 1: `rotate(18.01 84 150)`
    - Frame 2: `rotate(20.93 84 150)`
  - Head, body, and legs remain stable during tail wagging.
- **Pupil / Eye Tracking**:
  - Mascot tracks paw cursor position via passive `pointermove` listener.
  - Dynamic transform on `g[data-p="eyes"]` (`translate(-3.29 -0.54)`).
  - Smoothly lerps back to neutral resting gaze when cursor leaves the interaction area.
- **Lower Promotional Mascot**:
  - Sits on the right of the panel, horizontally flipped (`data-facing="left"`).
  - Independent tail wagging (`rotate(24.8 84 150)`) and gaze tracking verified.

---

## 4. Scroll-Linked Animation Parity

### A. Delivery Airplane Flight
- Path: `d="M40 250 C 170 40, 470 20, 620 168"` (Korea to Dubai).
- **Scroll-Down**:
  - As user scrolls into `#delivery`, plane travels from left to right along the tangent of the Bézier curve.
  - Approaching position: `translate(89.4 186.8) rotate(-45.7)` with `opacity: 0.707`.
  - Centered position: `translate(350.5 72.5) rotate(-2.7)` with `opacity: 1.0`.
- **Scroll-Up (Reversibility)**:
  - Scrolling back up returns plane precisely to its previous position along the curve: `translate(89.4 186.8) rotate(-45.7)`.
  - Fully deterministic and reversible without jumping or resetting.

### B. Premium Puppy Promise Stamps
- Stamps scale and rotate into position with overshoot physics (scale `1.7` → `0.93` → `1.03` → `1.0`, rotation `var(--tilt) - 16deg` → `var(--tilt)`).
- Reverses smoothly when scrolling upward.

---

## 5. Responsive & Layout Verification

- Tested mobile viewport (`375 x 667` @ 2x DPR).
- Verified `scrollWidth <= clientWidth` (`375px` / `375px`), confirming zero horizontal overflow.
- Postcards, selector tabs, and step grids adjust responsively across mobile, tablet, and desktop viewports.

---

## 6. Generated Visual Artifacts

1. **Two Ways Home Section**: `how_it_works_two_ways.png`
2. **Delivery & Collection Airplane Flight**: `how_it_works_delivery_plane.png`
3. **Lower Promotional Panel & Mascot**: `how_it_works_lower_promo.png`
4. **Mobile Responsive Viewport**: `how_it_works_mobile.png`

---

## 7. Conclusion

All 21 inspection and reproduction requirements from the master task specification have been successfully implemented, verified with headless Chrome automation, and confirmed with zero production build regressions.

