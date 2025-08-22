# Changelog

## [2025-08-22] - RTL layout refinements

### Changed
- **Button Component**: use logical margin (`ms-2`) for spinner spacing in RTL contexts and updated tests.
- **Home Page**: reversed hero CTA icon order and enforced 3/2/1 responsive grids for solution and case-study cards.
- **Contact Dock**: icons now appear after text with `flex-row-reverse` for proper RTL alignment.

## [2024-08-22] - Theme System Implementation

### Added
- **Central Theme System**: Created `src/lib/theme.ts` with centralized design tokens
  - Colors: navy (#0E2A47), ink (#1C2B3A), muted (#F6F7FB), card (#FFFFFF), outline (#E6EAF2)
  - Accent gradient: #6C4CE3 → #FF4E86
  - Typography: H1 (56px/700), H2 (40px/700), H3 (22px/600), body (16px/400), line-height 1.5
  - Border radius: 24px (standard), 20px (small)
  - Shadow: 0 10px 30px rgba(16,24,40,0.08)

### Changed
- **Button Component**: Replaced hardcoded Tailwind colors with CSS variables
  - Primary buttons now use accent gradient background
  - Secondary, outline, and ghost variants use theme colors
  - Focus states use accent color instead of hardcoded blue
  - Border radius uses theme variable (--radius-sm)

- **Input Component**: Updated styling to use theme variables
  - Labels use navy color from theme
  - Borders use outline color from theme
  - Focus states use accent color
  - Helper text uses ink color with opacity
  - Border radius uses theme variable

- **Modal Component**: Migrated to theme-based styling
  - Background uses card color from theme
  - Headers use navy color for text
  - Borders use outline color
  - Shadow uses theme shadow variable
  - Border radius uses theme variable (--radius)

- **Toast Component**: Updated notification styling
  - Background uses card color
  - Shadow uses theme shadow variable
  - Border radius uses theme variable (--radius-sm)
  - Close button hover states use muted color

- **Navigation Component**: Replaced hardcoded colors with theme variables
  - Background uses card color
  - Text colors use ink color for inactive states
  - Border uses outline color
  - Shadow uses theme shadow variable
  - Mobile menu styling updated to match theme

### Technical Details
- All components now read from CSS variables defined in `globals.css`
- Maintained existing functionality while improving design consistency
- No breaking changes to component APIs
- Build and development server tested successfully

## Previous Changes

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
