# Changelog

- Centered all content using a shared container and renamed design tokens to new theme variables.
- Expanded the home page with process, proof, case studies, and FAQ sections for clearer flow and added a final CTA block.
- Replaced the floating CTA with a fixed bottom contact dock to keep contact options accessible without covering content.
- Introduced Sogomatic-inspired tokens and typography, added gradient CTA in the header and hero, and increased section spacing for breathing room.
- Removed `any` types and direct `<a>` usage in the error boundary to satisfy lint rules.
- Introduced theme tokens for colors, spacing, radius, shadow and gradient text; revamped navigation pill, hero CTA, card grids, footer and contact dock for consistent spacing, contrast and focus states.
- globals.css: prevent horizontal scroll and ensure RTL layout.
- page.tsx: fix hero gradient text and polish CTA pills and dual CTAs with accessible focus states.
- components/layout/navigation.tsx: add focus rings and hover states to navigation links and header pill.
- components/layout/contact-dock.tsx: rebuild fixed dock with centered cards, spacing and focus rings.
