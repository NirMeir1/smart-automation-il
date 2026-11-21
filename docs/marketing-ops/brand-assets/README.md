# brand-assets — Posiblo logo files

| File | What it is | Use for |
|---|---|---|
| `posiblo-logo.webp` | The original file Nir supplied: 1254×1254 px, white background, raster | Archive only |
| `posiblo-logo-transparent.png` | Full logo (mark + dark green wordmark), transparent background, 1254×1254 | Light backgrounds: documents, website header (until an SVG exists), presentations |
| `posiblo-logo-white-wordmark.png` | Mark + white wordmark, transparent | Dark backgrounds |
| `posiblo-mark-avatar-1080.png` | The "P" mark alone, centred with margin on white, 1080×1080 | Profile pictures (Instagram, Facebook, LinkedIn, TikTok); safe inside a circle crop |
| `posiblo-mark-transparent.png` | The "P" mark alone, transparent, 1080×1080 | Overlays, video end cards |
| `preview-sheet.png` | Contact sheet to check the versions | Review only |

**How these were made:** by script from the supplied 1254 px image (background removed, wordmark recoloured white, mark cropped). They are **raster derivatives, not redrawn vectors.** Edges are clean at the supplied size; do not enlarge beyond 1254 px (blurry) and do not use for print or signage. A proper vector (SVG) must come from the logo's original source.

## Vector redraw (SVG) — approximation, needs Nir's approval
| File | Use |
|---|---|
| `posiblo-logo.svg` | Full logo, navy wordmark, for light backgrounds |
| `posiblo-logo-white-wordmark.svg` | Full logo, white wordmark, for dark backgrounds |
| `posiblo-mark.svg` | The "P" mark alone |

**How it was made:** with no source file, I traced the outlines of the supplied image into vector paths (the "P" is one shape, the letters are 12 paths) and rebuilt the gradient with two overlapping linear gradients, using colours sampled from the image. I compared the render with the original side by side: the shapes and colours are very close. **It is a redraw, not the designer's original file.** Edges are made of short straight segments (about 0.35 px tolerance at 1254 px), so very large enlargements may show slight facets, and the gradient is an approximation (at most slightly different tones in the middle of the mark). A designer should replace it with a clean redraw before any print or signage use. For the website, social images and documents it is suitable once Nir approves it.

**Status: the SVG redraw was approved by Nir on 17 Nov 2026 for web, social and document use.** Print and large-format use still needs a designer's redraw.

## Green recolour (21 Nov 2026)
The brand colour changed from blue to light green (see `BRAND_GUIDELINES.md` section 9). The three SVGs were recoloured: each blue gradient stop was mapped to a green of matching brightness, and the navy wordmark became the ink colour `#12301f`. The PNG files (`posiblo-logo-transparent.png`, `posiblo-logo-white-wordmark.png`, `posiblo-mark-avatar-1080.png`, `posiblo-mark-transparent.png`, `preview-sheet.png`) were **re-rendered from these SVGs**, at the same sizes and framing, and `og-image-1200x630.png` is a copy of the website's share image. `posiblo-logo.webp` is unchanged: it is the archive of the original blue file.

Because the PNGs now come from the traced SVG and not the original image, viewing them at full size shows slightly faceted curves and a faint hairline where two shapes of the "P" meet. Neither is visible at normal display sizes (profile pictures, website header, email). A designer's clean redraw would remove both.
