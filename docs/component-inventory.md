# Component Inventory

## Global Shared Components

### 1. Site Header (`Header.tsx`)
- **Structure:** Sticky or top navigation bar with cream background (`bg-milk`), bordered with subtle cocoa tint.
- **Brand Identity:** Logo image (`/brand/logo.png`) linking to `/`.
- **Navigation Links:**
  - `Puppies` (`/puppies`)
  - `How It Works` (`/how-it-works`)
  - `Happy Families` (`/happy-families`)
  - `Gone Home` (`/gone-home`)
  - `FAQ` (`/faq`)
  - `Contact` (`/contact`)
- **Action Buttons:**
  - WhatsApp Concierge CTA: Rounded pill button linking to `https://wa.me/971541676733`.
  - Mobile Menu Trigger: Visible on `< lg` viewports (`inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden`).
- **Mobile Menu Dialog:** Full-screen or slide-down drawer with navigation links, contact info, and close button (`h-11 rounded-full bg-cocoa px-5 font-semibold text-milk`).

### 2. Site Footer (`Footer.tsx`)
- **Brand Info:** TeddyPups logo, tagline ("Ethical luxury puppy concierge based in Dubai, connecting loving families with vetted Korean & European puppies").
- **Navigation Columns:** Quick Links (Puppies, How It Works, Happy Families, Gone Home, FAQ, Contact).
- **Contact Details:**
  - Phone: `+971 54 167 6733`
  - WhatsApp: `+971 54 167 6733`
  - Location: Dubai, United Arab Emirates
- **Social Media Links:**
  - Instagram: `https://www.instagram.com/teddypups.worldwide/`
  - Facebook: `https://www.facebook.com/profile.php?id=61567496944539`
  - TikTok: `https://www.tiktok.com/@teddypupsuae`
- **Copyright:** "© TeddyPups. All rights reserved."

---

## Page-Specific Components

### 3. Puppy Listing Card (`PuppyCard.tsx`)
- Container: Rounded-3xl card with border (`border-2 border-cocoa`), background (`bg-milk`), subtle elevation.
- Image Aspect Ratio: Square / 4:3 rounded thumbnail with zoom effect on hover.
- Badges: Gender badge (Boy / Girl), Status badge (Available, Reserved).
- Content:
  - Puppy Name & Breed
  - Age (e.g. "3 months")
  - Color / Coat
  - Price (Displayed in AED, e.g. "AED 14,000")
  - CTA Button: "View Puppy" / "Ask about this puppy"

### 4. Puppy Detail Component (`PuppyDetailView.tsx`)
- Breadcrumb: Home > Puppies > [Puppy Name]
- Media Gallery: Main high-resolution image + thumbnail selector.
- Specification Table:
  - Breed
  - Gender
  - Age
  - Color
  - Expected Adult Weight
  - Microchip & Passport Status
  - Vaccination History
  - Origin / Inspection
- Trust Feature List: "What comes with this puppy"
  - Microchipped with international pet passport
  - Full vaccination cycle & deworming
  - Full vet health check & health guarantee
  - Doorstep white-glove delivery in Dubai & UAE
- Direct Actions:
  - "Inquire on WhatsApp" (pre-filled with puppy name)
  - Quick Inquiry Contact Form

### 5. Contact Form (`ContactForm.tsx`)
- Fields:
  - Full Name
  - Phone Number (+971 format)
  - Email (Optional)
  - Preferred Area (e.g. Dubai Marina)
  - Message Textarea
- Submit Button: "Send Message" with interactive toast/confirmation state.

### 6. FAQ Accordion (`FAQAccordion.tsx`)
- Collapsible cards with smooth expand/collapse transitions.
- Question title in `Fraunces` serif, answer in `Figtree` sans-serif.

