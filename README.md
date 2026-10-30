<div align="center">

# 🐶🐾TeddyPups

**A handcrafted React recreation of TeddyPups, featuring illustrated mascots, scroll-driven storytelling, and a filterable puppy gallery.**

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
- [Features](#features)
- [Screenshots](#screenshots)
- [Mascot Gallery](#mascot-gallery)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Testing and Build](#testing-and-build)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)

---

## Overview

TeddyPups is an ethical luxury puppy concierge based in Dubai, connecting families with vetted Korean and European puppies. This repository is a **recreation, not a redesign**: the original website is the reference for visual identity, layout, content hierarchy, and interactions, and the goal is to reproduce them as closely as can be verified.

The recreation is deployed on Netlify at [teddypupps.netlify.app](https://teddypupps.netlify.app/).

## Features

### Homepage
- Hero section with puppy illustration
- Puppy discovery and imported-puppy content
- Ways to meet a puppy
- Puppy journey and delivery explanation with a scroll-linked airplane
- Puppy passport content
- Happy Families section
- Final door and welcome-home scene, with the dog's approach synchronised to the door animation

### Available Puppies
- Filter panel with **Where** (Everywhere, Imported, Korean Teacup), **Breed** (Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu) and **Gender** (Boys, Girls)
- Live result count and a clear/reset control
- Puppy cards with individual imagery
- "Already gone home" section

### Puppy Detail Pages
- Puppy-specific details with WhatsApp and Send Enquiry actions
- Image and video gallery with previous/next controls, counter, synced thumbnails, and video playback
- "What comes with this puppy", health and care information, and "The way home" steps
- Puppy-specific enquiry form

### Illustration and Interaction
- Illustrated dog mascots with walking, tail movement, changing expressions, and contextual speech bubbles
- Mascot reactions on the FAQ, Contact, and Happy Families pages
- Paw-shaped custom cursor with a transparent background
- Scroll-triggered animations and transitions
- Shared header, footer, and navigation across pages

### Other Pages
- Happy Families, FAQ, and Contact

## Screenshots

> Placeholders. Replace each with a real capture, saved under `docs/screenshots/`.

<table>
  <tr>
    <td align="center" width="50%">
      <b>Homepage</b><br><br>
      <!-- <img src="docs/screenshots/home.png" alt="Homepage" width="100%"> -->
      <img width="2532" height="1594" alt="image" src="https://github.com/user-attachments/assets/f0735030-4b3f-401f-8f93-843d34edd783" />
    </td>
    <td align="center" width="50%">
      <b>Available Puppies</b><br><br>
      <img width="2539" height="1599" alt="image" src="https://github.com/user-attachments/assets/49706ec7-2edc-49a4-8a66-db0958c3920b" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Puppy Detail &amp; Gallery</b><br><br>
      <img width="2525" height="1599" alt="image" src="https://github.com/user-attachments/assets/2e6b2b6b-b3a9-4298-9c84-a744c25fedd7" />
    </td>
    <td align="center">
      <b>Enquiry Form</b><br><br>
      <img width="2532" height="1599" alt="image" src="https://github.com/user-attachments/assets/11377f09-d2c7-44a7-8e64-5d8e375a71c9" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Mascot &amp; Door Scene</b><br><br>
      <img width="2532" height="1599" alt="image" src="https://github.com/user-attachments/assets/071ec077-ca91-44b6-9aae-ec23962a1127" />
    </td>
    <td align="center">
      <b>Mobile Layout</b><br><br>
      <img width="1688" height="1044" alt="image" src="https://github.com/user-attachments/assets/483c9123-f439-4b5f-ab97-bf615452338d" />
    </td>
  </tr>
</table>

To enable a placeholder, save your image to the path in its comment and uncomment the `<img>` line.


## Mascot Gallery

> Placeholders. Replace each with a real capture, saved under `docs/screenshots/`.

<table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <!-- 1. Contact Mascot -->
    <td align="center" valign="top" width="50%">
      <b>Contact Mascot</b><br><br>
      <img width="300" alt="Contact Mascot"
        src="https://github.com/user-attachments/assets/34398132-3be6-4211-bebd-b18428f76834" />
    </td>
    <!-- 2. FAQ Mascot Speaking -->
    <td align="center" valign="top" width="50%">
      <b>FAQ Mascot Speaking</b><br><br>
      <table cellspacing="0" cellpadding="2">
        <tr>
          <td align="center">
            <img width="160" alt="FAQ mascot speaking 1"
              src="https://github.com/user-attachments/assets/8d2cace6-5a1f-4f98-8c3a-74dcb83ae4f4" />
          </td>
          <td align="center">
            <img width="160" alt="FAQ mascot speaking 3"
              src="https://github.com/user-attachments/assets/373fa6e1-cfb3-4f2f-95eb-8818aa624174" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <img width="160" alt="FAQ mascot speaking 2"
              src="https://github.com/user-attachments/assets/128fa97f-ef1b-4876-a325-63d2fb06b8c1" />
          </td>
          <td align="center">
            <img width="160" alt="FAQ mascot speaking 4"
              src="https://github.com/user-attachments/assets/d952b7dd-f70a-4309-8371-1af831d77b5d" />
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <!-- 3. Footer States -->
    <td align="center" valign="top" width="50%">
      <b>Footer States</b><br><br>
      <table cellspacing="0" cellpadding="2">
        <tr>
          <td align="center">
            <img width="160" alt="Footer state 1"
              src="https://github.com/user-attachments/assets/1fc6288c-f16f-4536-94d3-fee19a8a9f93" />
          </td>
          <td align="center">
            <img width="160" alt="Footer state 3"
              src="https://github.com/user-attachments/assets/5f431af2-4444-49fc-84a5-ffaec5e75df6" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <img width="160" alt="Footer state 2"
              src="https://github.com/user-attachments/assets/688f0f66-20a5-4d36-be7e-36b89962850e" />
          </td>
          <td align="center">
            <img width="160" alt="Footer state 4"
              src="https://github.com/user-attachments/assets/4e6fb8f6-6f01-436c-9173-02c709fd46c3" />
          </td>
        </tr>
      </table>
    </td>
    <!-- 4. FAQ Initial State -->
    <td align="center" valign="top" width="50%">
      <b>FAQ Initial State</b><br><br>
      <img width="300" alt="FAQ Initial State"
        src="https://github.com/user-attachments/assets/eb894cfe-99f6-47bd-9501-6f390e1fa775" />
    </td>
  </tr>
</table>



## Tech Stack

<table>
<tr>
<td valign="top" width="100%">

**Application**

| Area | Technology |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript 5.7 |
| Routing | React Router 7 |
| Icons | `lucide-react` |

</td>
<td valign="top" width="50%">

**Tooling and Hosting**

| Area | Technology |
| --- | --- |
| Build / dev server | Vite 6 with `@vitejs/plugin-react` |
| Class utilities | `clsx`, `tailwind-merge` |
| Hosting | Netlify |
| Module format | ES modules |

</td>
</tr>
</table>

There is no backend, test framework, or linter in the project.

## Project Structure

```
TeddyPups/
├── docs/                 # Documentation
├── public/               # Static assets served as-is (brand, fonts, images)
├── scripts/              # Project scripts
├── src/                  # Application source (entry: src/main.tsx)
├── index.html            # Vite HTML entry
├── package.json
├── tsconfig.json
└── vite.config.ts
```

`index.html` mounts the app on `#root`, loads `/src/main.tsx`, and preloads `/brand/logo.png` and the web fonts from `/fonts/`. The `@` import alias resolves to `./src`.

## Getting Started

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

Open http://localhost:3000. The dev server binds to all network interfaces (`host: true`), so you can also test on a phone over your local network.

### Requirements and scripts

<table width="100%">
<tr>
<td width="100%" valign="top">

<strong>Requirement</strong>
<table width="100%">
<tr><th>Requirement</th><th>Detail</th></tr>
<tr><td>Node.js</td><td>18 or newer</td></tr>
<tr><td>Package manager</td><td>npm</td></tr>
<tr><td>Environment variables</td><td>None needed</td></tr>
</table>

</td>
<td width="50%" valign="top">

<strong>Commands</strong>
<table width="100%">
<tr><th>Command</th><th>Description</th></tr>
<tr><td><code>npm run dev</code></td><td>Start the dev server on port 3000</td></tr>
<tr><td><code>npm run build</code></td><td>Create a production build</td></tr>
<tr><td><code>npm run preview</code></td><td>Serve the production build locally</td></tr>
</table>

</td>
</tr>
</table>

## Architecture

This is a single-page application: `index.html` loads `src/main.tsx`, and client-side routing is handled by `react-router-dom`. Routes cover Home, Available Puppies, individual puppy detail pages, Happy Families, FAQ, and Contact.

### Dev image proxy

`vite.config.ts` includes a dev-server-only plugin, `next-image-proxy`. Requests to `/_next/image?url=...` are served from `public/` (falling back to `public/images/<filename>`) with the correct content type, so image paths copied from the original Next.js site resolve locally. It does not apply to production builds.

## Testing and Build

To verify changes locally:

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

**Known outstanding corrections**

- [ ] **Homepage speech bubbles:** the dog's `hm?` bubble appears too often. Replace it with a contextual, scroll-synchronised timeline that matches the original, with no overlapping bubbles.
- [ ] **Dog in the bucket:** the dog sits too low. Raise its face and paws so the head clears the rim, with the rim layered in front.

**Planned improvements**

- [ ] Add curated screenshots to the README
- [ ] Add a test setup and lint configuration
- [ ] Verify responsive layouts on desktop and mobile
- [ ] Add `.env.example` if environment variables are introduced

## Acknowledgements

Visual design, content, and interaction patterns are based on the original TeddyPups website at https://puppy.instabizweb.com/. This repository is an independent recreation for learning and reference.

---

<div align="center">

Made by [tecnicoviola](https://github.com/tecnicoviola)

</div>
