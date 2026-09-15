# Hadid Creatives website — project handoff

This folder contains the complete, production-ready website for **Hadid Creatives**. It is designed to be moved to another computer and continued without rebuilding the project from scratch.

## Start here on the new device

Requirements:

- Node.js 20 or newer
- pnpm 10 or newer

From the project folder, run:

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Before publishing or handing off changes, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The `node_modules`, `.next`, `.qa`, `tmp`, and TypeScript build-cache folders are intentionally excluded from the transfer ZIP. They are machine-specific and will be recreated by the commands above.

## Current implementation status

The website is fully implemented, not a wireframe. It includes:

- Cinematic multi-page agency website
- Responsive desktop, tablet, and mobile layouts
- Dark and light themes with saved preference
- Reduced-motion accessibility support
- Motion and reveal interactions
- Four reusable case-study pages
- Generated placeholder media system
- Centralized editable content
- Working WhatsApp conversion flow
- Working Instagram, LinkedIn, and TikTok links
- SEO metadata, sitemap, robots file, and custom 404 page
- Production build verified successfully

Routes:

- `/`
- `/work`
- `/work/gm-furniture`
- `/work/worthy-homes`
- `/work/habesha-brothers`
- `/work/daily-water`
- `/services`
- `/behind-the-work`
- `/about`
- `/contact`

## Important brand context

The correct company name is **Hadid Creatives**. Never use “Hadid Digitals”; that name appears in an older proposal by mistake.

Hadid Creatives works with established companies that want to strengthen their digital presence. Previous sectors include real estate, medical, furniture, food and beverage, and other established businesses.

Hadid was founded in 2024 by five friends working across digital marketing disciplines. The brand should be presented as one collective identity rather than five individual personalities. Do not highlight individual team members or make the business dependent on specific faces. The long-term brand model is scalable and able to outsource or expand production while Hadid remains the central identity.

The website is English-only.

Primary services:

1. Professional content creation using high-end filming equipment
2. Social media management
3. Paid social and boosting
4. Website design
5. Consultancy and social media training

Do not add pricing, fake testimonials, invented client claims, or services outside this agreed scope.

## Verified public results

These figures are approved for public display:

- GM Furniture: 3K to 30.8K followers, over ETB 8M revenue, six months
- Worthy Homes: 16.7K to 23.2K followers, approximately four homes sold
- Habesha Brothers Catering: 19K to 108K TikTok followers, nine months
- Daily Water: zero to approximately 2K followers

Client names, logos, screenshots, and verified figures may be displayed publicly.

## Contact and conversion details

Primary conversion: WhatsApp

- Display number: `+251 94 802 7407`
- WhatsApp number: `251948027407`
- Placeholder email: `hello@hadidcreatives.com`

Social accounts:

- LinkedIn: `https://www.linkedin.com/in/hadid-creatives-683406363/`
- Instagram: `https://www.instagram.com/hadidcreatives/`
- TikTok: `https://www.tiktok.com/@hadid.creatives`

## Visual system

Core palette:

- Cyan: `#00AEF0`
- Lime: `#A3E635`
- Navy: `#003566`
- Near black: `#221F1F`
- White: `#FFFFFF`

Typography:

- Hanken Grotesk for headings
- Inter for body copy
- IBM Plex Mono for labels and technical details

The visual direction is cinematic, editorial, confident, and production-led. It should feel like a serious creative agency with measurable business results, not a generic marketing template.

## Where to edit the website

Most business content is centralized in:

- `src/content/site.ts`

This file contains the navigation, services, case studies, verified metrics, social links, WhatsApp details, process steps, and media paths.

Important implementation files:

- `src/app/page.tsx` — homepage
- `src/app/globals.css` — complete design and responsive system
- `src/app/work/[slug]/page.tsx` — reusable case-study template
- `src/components/SiteHeader.tsx` — navigation, theme, mobile menu
- `src/components/ContactForm.tsx` — WhatsApp project brief flow
- `MEDIA_REPLACEMENT.md` — instructions for replacing placeholder media

## Media workflow

Current placeholder assets:

- `public/media/hero/hero-production-placeholder.png`
- `public/media/bts/camera-rig-placeholder.png`
- `public/media/bts/editing-suite-placeholder.png`
- `public/media/brand/hadid-mark-1.png`

The first three are generated cinematic placeholders. The brand mark was extracted from the supplied branding PDF. Replace files in place to retain the existing layouts, or update paths once in `mediaConfig` inside `src/content/site.ts`.

Read `MEDIA_REPLACEMENT.md` before connecting final client videos, analytics screenshots, BTS footage, equipment photographs, or logos.

## Reference documents

The `references` folder contains:

- `HADID LOGO USEAGE.pdf` — original branding reference
- `HADID PROPOSAL final.pdf` — older client proposal; use it for company context only and ignore the incorrect company name inside it
- `MASTER_PROMPT.txt` — the full original implementation brief

## Verification already completed

The current version passed:

- TypeScript type-check
- ESLint with no warnings
- Peer dependency validation
- Next.js production build
- All public routes and the custom 404
- Desktop, tablet, and 390px mobile browser checks
- Horizontal-overflow checks
- Theme persistence and theme toggle
- Mobile navigation
- Reduced-motion behavior
- WhatsApp links and contact-form message composition
- Social-link validation
- Image and media-path checks
- Console and hydration-error checks

## Context prompt for Codex on another device

Paste the following into a new Codex task after opening this project folder:

> Continue the existing Hadid Creatives website implementation in this folder. First read `PROJECT_HANDOFF.md`, `references/MASTER_PROMPT.txt`, `MEDIA_REPLACEMENT.md`, and `src/content/site.ts`. Treat the current implementation as the production baseline; do not reinitialize or replace it with a template. Preserve the correct name Hadid Creatives, the approved metrics, collective brand positioning, English-only content, current service scope, WhatsApp conversion flow, responsive behavior, accessibility, and centralized content structure. Before completing any change, run `pnpm typecheck`, `pnpm lint`, and `pnpm build`, then visually verify the affected routes on desktop and mobile.

