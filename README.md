<div align="center">

# 🐾 TeddyPups

**A hand-crafted React recreation of the TeddyPups puppy concierge website — illustrated mascots, scroll-driven storytelling, and a filterable puppy gallery.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-teddypupps.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://teddypupps.netlify.app/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)

[Live Demo](https://teddypupps.netlify.app/) · [Reference Site](https://puppy.instabizweb.com/) · [Report an Issue](https://github.com/tecnicoviola/TeddyPups/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages and Architecture](#pages-and-architecture)
- [Design and Animation](#design-and-animation)
- [Testing and Build](#testing-and-build)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)

---

## Overview

TeddyPups is an ethical luxury puppy concierge based in Dubai, connecting families with vetted Korean and European puppies. This repository is a **recreation project, not a redesign**. The original website is the reference for visual identity, layout, content hierarchy, and interactions, and the goal is to reproduce them as closely as can be verified.

| | |
| --- | --- |
| **Live demo** | https://teddypupps.netlify.app/ |
| **Reference website** | https://puppy.instabizweb.com/ |
| **Source code** | https://github.com/tecnicoviola/TeddyPups |

## Live Demo

The recreation is deployed on Netlify: **https://teddypupps.netlify.app/**

## Features

> The list below describes the intended scope of the recreation. See the [Roadmap](#roadmap) for known outstanding work.

<!-- TODO: confirm each feature against src/ and mark it implemented or in progress. -->

### 🏠 Homepage
- Hero section with puppy illustration
- Puppy discovery and imported-puppy content
- Ways to meet a puppy
- Puppy journey and delivery explanation with a scroll-linked airplane
- Puppy passport content
- Happy Families section
- Final door / welcome-home scene and footer

### 🐶 Available Puppies
- Filter panel with **Where** (Everywhere, Imported, Korean Teacup), **Breed** (Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu) and **Gender** (Boys, Girls)
- Live result count and a clear/reset control
- Puppy cards with individual imagery
- "Already gone home" section

### 📄 Puppy Detail Pages
- Puppy-specific details with WhatsApp and Send Enquiry actions
- Image and video gallery: previous/next controls, counter, synced thumbnails, video playback
- "What comes with this puppy", health and care information, and "The way home" steps
- Puppy-specific enquiry form

### ✨ Illustrations and Interaction
- Illustrated dog mascots with movement, expressions, and contextual speech bubbles
- Paw-shaped custom cursor
- Scroll-triggered animations and transitions
- Shared header, footer, and navigation across pages

### 📬 Other Pages
- Happy Families, FAQ, and Contact

## Screenshots

> Placeholders — replace each with a real capture. Suggested location: `docs/screenshots/`.

<table>
  <tr>
    <td align="center" width="50%">
      <b>Homepage</b><br><br>
      <!-- <img src="docs/screenshots/home.png" alt="Homepage" width="100%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
    <td align="center" width="50%">
      <b>Available Puppies</b><br><br>
      <!-- <img src="docs/screenshots/puppies.png" alt="Available Puppies" width="100%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Puppy Detail &amp; Gallery</b><br><br>
      <!-- <img src="docs/screenshots/puppy-detail.png" alt="Puppy detail page" width="100%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
    <td align="center">
      <b>Enquiry Form</b><br><br>
      <!-- <img src="docs/screenshots/enquiry.png" alt="Enquiry form" width="100%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Mascot &amp; Door Scene</b><br><br>
      <!-- <img src="docs/screenshots/mascot-door.png" alt="Mascot and door scene" width="100%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
    <td align="center">
      <b>Mobile Layout</b><br><br>
      <!-- <img src="docs/screenshots/mobile.png" alt="Mobile layout" width="40%"> -->
      <i>📷 Screenshot placeholder</i>
    </td>
  </tr>
</table>

<details>
<summary><b>Mascot reference captures (currently in the repository root)</b></summary>

<br>

| Contact mascot | FAQ |
| --- | --- |
| ![Contact mascot wagging its tail](contact_mascot_tail_wagging.png) | ![FAQ initial state](faq_initial_q.png) |
| ![FAQ mascot speaking](faq_mascot_speaking.png) | ![FAQ note opened](faq_note_opened_exclamation.png) |

</details>

To enable a placeholder, save your image to the path in its comment and uncomment the `<img>` line.

## Tech Stack

Verified from `package.json` and `vite.config.ts`:

| Area | Technology |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript 5.7 |
| Build tool / dev server | Vite 6 with `@vitejs/plugin-react` |
| Routing | React Router (`react-router-dom` 7) |
| Icons | `lucide-react` |
| Class utilities | `clsx`, `tailwind-merge` |
| Hosting | Netlify |

The project is a private ES module package (`"type": "module"`). `package.json` lists no backend, test framework, or linter.

<!-- TODO: confirm how styling is implemented (index.html uses classes such as bg-milk / text-cocoa, but no tailwindcss dependency is listed in package.json). -->

## Project Structure

```
TeddyPups/
├── docs/                 # Documentation
├── public/               # Static assets served as-is (brand, fonts, images)
├── scripts/              # Project scripts
├── src/                  # Application source (entry: src/main.tsx)
├── index.html            # Vite HTML entry
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── *.png                 # Mascot reference captures (Contact, FAQ)
```

- `index.html` mounts the app on `#root`, loads `/src/main.tsx`, and preloads `/brand/logo.png` and web fonts from `/fonts/`.
- The `@` import alias resolves to `./src`.

<!-- TODO: expand src/ (routes, pages, components, data) and describe docs/ and scripts/. -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (required by Vite 6)
- npm (a `package-lock.json` is committed)

### Installation

```bash
git clone https://github.com/tecnicoviola/TeddyPups.git
cd TeddyPups
npm install
```

### Run locally

```bash
npm run dev
```

Open http://localhost:3000. The dev server also binds to all network interfaces (`host: true`), so you can test on a phone over your local network.

## Environment Variables

No environment variables or `.env.example` file were found, and none are referenced in `package.json` or `vite.config.ts`. The project runs without a `.env` file.

<!-- TODO: if src/ reads import.meta.env values, list their names here. Never commit real secrets. -->

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Create a production build (`vite build`) |
| `npm run preview` | Serve the production build locally (`vite preview`) |

No `test` or `lint` scripts are defined.

## Pages and Architecture

This is a single-page application: `index.html` loads `src/main.tsx`, and client-side routing is handled by `react-router-dom`. The intended routes are Home, Available Puppies, individual puppy detail pages, Happy Families, FAQ, and Contact.

<!-- TODO: replace with the actual route table and key components/data modules from src/. -->

### Dev image proxy

`vite.config.ts` includes a dev-server-only plugin, `next-image-proxy`. Requests to `/_next/image?url=...` are served from `public/` (falling back to `public/images/<filename>`) with the correct image content type, so image paths copied from the original Next.js site resolve locally. It does not apply to production builds.

## Design and Animation

The recreation relies on illustrated mascots and scroll-linked effects rather than static images. Targeted behaviour includes:

- Dog mascot walking, tail movement, changing expressions, and contextual speech bubbles
- A scroll-linked airplane in the delivery section
- A door animation synchronised with the dog's approach on the homepage
- Mascot reactions on the FAQ, Contact, and Happy Families pages
- A paw-shaped custom cursor with a transparent background

<!-- TODO: document how these are implemented (components, scroll-progress hooks) once src/ is reviewed. -->

## Testing and Build

No automated tests or linter are configured. To verify changes locally:

```bash
npm run build      # confirm the production build succeeds
npm run preview    # serve the build and check it in the browser
```

Then check manually:

- Affected routes, filters, forms, and gallery controls
- Browser console and terminal for errors
- Scroll animations in both directions, at slow and fast speeds
- Desktop and mobile layouts, compared against the [reference site](https://puppy.instabizweb.com/) at matching viewport sizes

## Development Notes

- The dev server's file watcher ignores `**/.chrome*/**`, `**/reference/**`, `**/*.png`, `**/*.jpg`, and `**/*.webp`. After adding or replacing images you may need to reload the page manually.
- `npm run build` runs `vite build` only and does not type-check.
- Use the correct individual images and videos for each puppy; do not substitute placeholders.
- Keep spam prevention on the enquiry form, and never expose honeypot fields as normal inputs.
- Do not claim exact parity with the original for details that cannot be inspected.

## Roadmap

**Known outstanding corrections** (from the project summary):

- [ ] **Homepage speech bubbles** — the dog's `hm?` bubble appears too often. Replace it with a contextual, scroll-synchronised timeline that matches the original, with no overlapping bubbles.
- [ ] **Dog in the bucket** — the dog sits too low. Raise its face and paws so the head clears the rim, with the rim layered in front.

**Planned improvements:**

- [ ] Add curated screenshots to the README
- [ ] Add a test setup and lint configuration
- [ ] Verify responsive layouts on desktop and mobile
- [ ] Add `.env.example` if environment variables are introduced

## Acknowledgements

Visual design, content, and interaction patterns are based on the original TeddyPups website at https://puppy.instabizweb.com/. This repository is an independent recreation for learning and reference.

---

<div align="center">

Made with 🐾 by [tecnicoviola](https://github.com/tecnicoviola)

</div>
