# Interaction Matrix

| Element / Action | Starting State | User Action | Resulting Visual & Navigation State | Observable Network / URL Changes |
|---|---|---|---|---|
| **Header Desktop Nav Links** | Static text links with hover underline / color shift | Click "Puppies", "How It Works", etc. | Navigates to target route; updates active link indicator | Client-side pushState, URL changes to `/puppies`, `/how-it-works`, etc. |
| **Mobile Menu Button** | Hamburger button labeled "Menu" with dialog icon | Tap / Click button | Opens dialog overlay menu with animation, locks body scroll | Updates `aria-expanded="true"`, reveals backdrop and drawer |
| **Mobile Menu Close Button** | Overlay open | Tap "Close" button or backdrop | Closes drawer with smooth fade-out transition, restores body scroll | `aria-expanded="false"`, modal dismissed |
| **Puppy Card Click** | Default card state | Click image, name, or "View Details" button | Navigates to `/puppies/<slug>` | Client-side pushState to puppy permalink |
| **WhatsApp Buttons** | Green or cocoa pill button with WhatsApp icon | Click CTA | Opens WhatsApp web or mobile app with prefilled message | Navigation to `https://wa.me/971541676733?text=...` in new tab |
| **Phone Link** | Phone number link in header/footer | Click link | Triggers device dialer | `tel:+971541676733` |
| **Contact Form Submit** | Form empty or filled | Click "Send Enquiry" | Client-side validation; displays success confirmation toast | Submits inquiry state; displays "Thank you! Our concierge will contact you shortly." |
| **FAQ Accordion Items** | Collapsed by default | Click question header | Expands answer accordion; rotates chevron indicator | Local component state toggle |
| **Social Links** | Icons in footer | Click icon | Opens Instagram, Facebook, TikTok in external tabs | External navigation |

