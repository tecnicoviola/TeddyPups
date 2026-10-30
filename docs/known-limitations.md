# Known Limitations and Implementation Scope

1. **Backend Database & Private APIs:**
   - The live target website runs on Next.js with Cloudflare edge caching. Form submissions in the original post to an internal contact endpoint.
   - In accordance with non-negotiable constraints, no private database, internal CRM, or email SMTP server is assumed or fabricated. The clone implements a robust, interactive frontend form handler that validates all inputs and provides responsive feedback.

2. **WhatsApp Links:**
   - External links to WhatsApp (`wa.me`) connect directly to the real verified phone number (+971 54 167 6733) with prefilled query parameters matching the original.

3. **External Social Media Embeds:**
   - External links to Instagram, Facebook, and TikTok open the live official TeddyPups social profiles.

