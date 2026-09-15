# Hadid Creatives media replacement guide

All temporary media references are centralized in `src/content/site.ts` under `mediaConfig`. Replace files in place to keep the current layouts, or update a path once in that configuration.

## Current placeholders

| Purpose | Current file | Recommended replacement |
| --- | --- | --- |
| Homepage hero/showreel poster | `public/media/hero/hero-production-placeholder.png` | 16:9 production showreel poster, ideally 2400px wide |
| Camera / filming BTS | `public/media/bts/camera-rig-placeholder.png` | 16:9 or 3:2 BTS still, no overlaid text |
| Editing / post-production BTS | `public/media/bts/editing-suite-placeholder.png` | 16:9 or 3:2 editing-room still |
| Official brand mark | `public/media/brand/hadid-mark-1.png` | Replace with the final transparent SVG or PNG when supplied |
| GM Furniture Cover | `public/media/work/cover-gm-furniture.jpg` | 16:9 luxury furniture studio photography |
| Worthy Homes Cover | `public/media/work/cover-worthy-homes.jpg` | 16:9 luxury modern architecture twilight still |
| Habesha Brothers Cover | `public/media/work/cover-habesha-brothers.jpg` | 16:9 luxury catering & culinary table styling |
| Daily Water Cover | `public/media/work/cover-daily-water.jpg` | 16:9 crisp beverage splash photography |

## Case Study Cover Images & Admin Uploads

Cover images are fully uploadable and manageable via the Admin dashboard:
- Navigate to `/admin/case-studies`
- Click **Edit** on any case study or click **Add New Work & Case Study**
- Use the **Upload** button to select an image from your device (automatically saved into `/public/uploads/`), or enter a custom media path/URL.
- Changes are instantly updated on the homepage case study grid, `/work` index, and individual `/work/[slug]` case study pages.

## Recommended future folders

- `public/media/work/gm-furniture/`
- `public/media/work/worthy-homes/`
- `public/media/work/habesha-brothers/`
- `public/media/work/daily-water/`
- `public/media/analytics/`
- `public/media/clients/`
- `public/media/video/`

For every case study, prepare:

1. One 16:9 hero poster.
2. Two to six campaign stills or short muted MP4/WebM clips.
3. One or two analytics screenshots with private information removed.
4. One BTS image or clip.
5. A clean SVG or transparent PNG client logo.

## Adding real case-study media

Case-study copy and metrics live in `src/content/site.ts` in the `caseStudies` array. Add media paths to each case object when the archive is ready, then pass those paths into the reusable case-study page at `src/app/work/[slug]/page.tsx`.

Do not place text inside poster images. Keep labels, metrics, and accessibility text in the page markup.

## Generated placeholder provenance

The three project placeholder images were generated with the built-in image generation tool for this site. Prompts intentionally excluded faces, logos, client branding, readable analytics, and fake campaign claims.

- Hero: abstract cinematic production lens, studio light panels, editing geometry, and analytic arcs in the Hadid palette.
- Camera BTS: anonymous hands adjusting a professional camera rig, with faces fully outside the frame.
- Editing BTS: anonymous hands at a post-production workstation with no readable interface data.
