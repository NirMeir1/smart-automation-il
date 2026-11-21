# BRAND_GUIDELINES — Posiblo (as found in the codebase)

Descriptive, not prescriptive: this records the identity that **exists**, plus gaps and a few recommendations. No official brand book was found; everything is derived from `src/app/globals.css`, `src/app/icon.svg`, `src/lib/brand.ts`, layout components, `docs/Typography_Implementation.md`, `src/app/fonts/`, and the copy in `src/content/pages.json`.

## 1. Name and wordmark

- **Name:** Posiblo (Latin script, capital P). In Hebrew running text the name stays in Latin letters, and the renderer wraps Latin runs in `<bdi dir="ltr">` (`src/components/copy-page.tsx`).
- **Wordmark:** text "Posiblo" followed by a period in green. Header and footer, weight 850, letter-spacing −1.6px, 30px (`.wordmark` in `globals.css`). A recent commit changed the underscore to a period; `README.md` still says "Posiblo_" and is outdated.
- **Update (17 Nov 2026):** the Facebook page shows a blue/cyan "P" logo with the word "Posiblo", so a social logo exists; it differs in colour from the website's green identity. See `SOCIAL_FIXES.md`. The notes below describe the website only.
- **Logo/icon (website):** none approved. The favicon is a white "P" on a dark green rounded square with a light-green underline; the file comment says "Provisional P favicon; not an approved final logo."
- **Meaning of the name:** not documented. (Hebrew-speakers may read it as a play on "possible"; **I do not know** the intended meaning. Asked in `OPEN_QUESTIONS.md`.)
- **Pronunciation/Hebrew transliteration:** not documented.

## 2. Colour (from CSS variables and rules)

| Role | Hex | Where |
|---|---|---|
| Paper / page background | `#f8f7f2` | `--paper` |
| Ink (text, dark sections, favicon bg) | `#182d2c` | `--ink` |
| Muted text | `#435955` | `--muted-ink` |
| Primary green (buttons, wordmark period, accents) | `#235c48` | `--green` |
| Button hover / deep green | `#194635` | `.action:hover` |
| Section tint (hero, footer) | `#eaf0e8` | `.page-hero`, `.site-footer` |
| Card / alt section | `#fffefa` | `.copy-card` |
| Lines/borders | `#d6ddd5` | `--line` |
| Light green on dark | `#b5d1b1` | section index on dark, favicon underline |
| Pale green button on dark | `#d9e7cc` | `.closing-section .action` |
| Focus ring | `#977328` (ochre) | `:focus-visible` |
| Error | `#9f241c` / bg `#fff0eb` | form errors |

**[OBSERVATION]** A restrained, earthy palette: warm off-white, deep forest-green ink, one green accent. It looks calm and trustworthy, quite unlike the typical blue/purple "AI agency" look. The old purple→pink gradient in `CHANGELOG.md` and `src/app/globals.css` legacy variables (`--accent-from/to` were remapped to green) is **not** part of the current identity.

## 3. Typography

- **Heebo** (variable, 100–900), bundled locally, SIL OFL licence (`src/app/fonts/OFL.txt`). Single typeface for everything.
- H1 clamps 36–64px, weight 750, tight tracking (−0.04em); home H1 up to 58px. H2 28–42px. H3 24px. Body 16–19px, line-height 1.8.
- Hebrew RTL throughout; English technical terms stay LTR inline.

## 4. Visual language

- Flat, bordered cards (6px radius), 4px-radius rectangular buttons with an arrow (↖, appropriate for RTL), generous whitespace, thin rules between sections, numbered-index feel on diagrams.
- One decorative element: a slightly rotated "problem diagram" on the home hero (scattered tags → core → result) with a hard offset shadow.
- Dark ink-green blocks for the "principle" and "closing" sections.
- **No photography or illustration.** The only media is a vertical founder intro video (`public/videos/founder-introduction*.mp4`, 720×1280) with a poster. The site serves a blurred version; the original is also in the repo.
- Social media visuals, templates, icons, patterns: none.

## 5. Voice and tone (as practised in the copy)

Derived from `pages.json`; consistent with the brief's rules in `docs/POSIBLO_WEBSITE_BRIEF.md` §2 ("clear, practical, human Hebrew; professional, direct, restrained, non-hype").

**What the voice does**
- Starts with the reader's situation, in short sentences and questions ("יש תהליך שלוקח יותר מדי זמן?").
- First person singular from the founder on home/about/business/individuals ("אני ניר מאיר… אני שואל שאלות, ממפה"), and "we"/imperative on process and service pages ("נבחן", "מגדירים").
- Reassures about effort ("לא צריך להגיע עם אפיון", "לא צריך לדעת מה הפתרון").
- States limits openly ("אין הבטחה…", "לא כל חיבור אפשרי").
- Short punchy emphasis lines ("הטכנולוגיה היא אמצעי, לא המטרה").
- Prefers plain Hebrew terms but keeps English tool names (CRM, API, MVP, WhatsApp, Sheets).

**What the voice avoids:** hype, urgency, "revolution/AI is the future" framing, percentages and guarantees, jargon-first explanations, emojis (none appear on the site).

**Inconsistencies to settle**
1. "אני" (I) vs a studio "we/נבדוק": pick a rule. Recommended given the one-person reality and the "direct work" promise: first person on marketing content, plural verbs only in process descriptions.
2. The hyphen "-" in the home H1 where the rest of the site uses "—".
3. Gender: forms and copy address the reader in plural/neutral ("תספרו", "אתם") and use slash forms ("יזם/ת", "מאשר/ת"). Keep this; avoid masculine-only address.
4. The meeting is called "פגישת היכרות" (site), "פגישת היכרות ומיפוי" (brief), "בואו נכיר" (contact nav label and video title). Pick one primary name.

## 6. Writing guidelines to follow (derived from the site + `CLAUDE.local.md`)

1. Hebrew first; natural Israeli Hebrew; no machine-translation phrasing.
2. Start from the customer's problem, then the outcome, then (briefly) the mechanism.
3. Never use unverifiable numbers, "up to X%", client counts, or testimonials. Hypothetical examples must be labelled as hypothetical, exactly as the site does.
4. No guarantees (including of delivery times, results, or AI accuracy). Mirror the site's limits language for AI and integrations.
5. No exaggerated claims about AI, and no "AI-sounding" filler ("בעידן הדיגיטלי של היום…", "פתרון מקיף ומתקדם").
6. One CTA per piece; use the site's existing CTA vocabulary ("ספרו לי מה אתם מנסים לפתור", "לקביעת פגישת היכרות").
7. Avoid emojis. Keep English tool names in LTR.
8. Don't promise a booked meeting: the form is a contact request. Say "השאירו פרטים ואחזור אליכם", not "קבעו פגישה עכשיו".
9. Do not describe the studio as a team or agency. It is one operator, with specialists brought in when needed.
10. Don't reuse employer-related details (names, clients, internal results) from the founder's background without explicit permission.

## 7. Gaps and recommendations (for your decision)

| Gap | Why it matters | Recommendation |
|---|---|---|
| No approved logo / only a provisional P | Needed for social avatars, covers, documents | Decide whether the wordmark alone is the logo; if so, produce a clean SVG lockup and an avatar |
| No social templates or photography | All social content needs a visual system | Build a small template set from the existing palette/Heebo once you approve the direction |
| No founder photo | Trust for a one-person studio | Professional photo (or a still from the video) |
| No brand story / name meaning | Memorability | One-sentence name story, if there is one |
| Brand is text-heavy and quiet | Social feeds reward visual clarity | Keep the palette but add a simple diagram/illustration style (the home "problem diagram" is a starting point) |
| Name clearance not documented | A new, unclear brand name can be hard to find and risky | Verify trademark/domain/handle availability; reserve handles on Instagram, LinkedIn, Facebook, YouTube, TikTok (ownership and availability are **UNKNOWN**) |

---

## 8. DECISION (17 Nov 2026): the official logo
Nir supplied the logo: a rounded, flowing "P" mark in a blue-to-cyan gradient above the word **"Posiblo"** in bold navy sans-serif. Saved as `brand-assets/posiblo-logo.webp` (1254×1254, white background). **This is now the single brand identity; the earlier provisional green favicon and the green palette in section 2 are superseded** (the website still uses them until the change in `WEBSITE_CHANGE_SPEC.md` #19 is done).

**Colours sampled from the image (approximate, taken from a compressed WebP; confirm against the original design file):**
| Role | Hex (approx.) |
|---|---|
| Navy (wordmark, headings, dark sections) | `#032756` |
| Brand blue (primary buttons, links) | `#0060fc` |
| Mid blue (gradient) | `#008ef9` |
| Cyan (gradient, accents, graphics) | `#02b6fd` |
| Light cyan (gradient tip, highlights) | `#1ef6fa` |
| Background | white / very light grey |

**Usage rules (best practice):**
- Use the full logo (mark + wordmark) on light backgrounds. For small sizes (avatars, favicon) use the "P" mark alone.
- Keep clear space around it of about the height of the "o" in the wordmark. Don't stretch, recolour or add effects.
- **Never use cyan or light cyan for text on white**; the contrast is too low. Use navy for text and the brand blue for buttons and links (white on `#0060fc` is roughly 5:1 by my calculation; verify with a contrast tool).
- For dark backgrounds, ask for a white-wordmark version of the logo (not supplied yet).
- Typography: the wordmark looks like a geometric sans. The website uses Heebo for Hebrew text, which pairs well; keep Heebo.
- The logo has no Hebrew version. Use the Latin wordmark in Hebrew text, as the site does.

**Files:** transparent, white-wordmark and avatar versions were generated from the supplied image and saved in `brand-assets/` (see its README). The original vector file does not exist (Nir has no source file), so SVG versions were **redrawn from the image** (see the README in `brand-assets/`): `posiblo-logo.svg`, `posiblo-logo-white-wordmark.svg`, `posiblo-mark.svg`. They are close approximations pending Nir's approval, not designer-made originals.

---

## 9. DECISION (21 Nov 2026): the brand colour is light green
Nir changed the brand colour from blue to light green. **This supersedes the blue palette in section 8.** The logo shape is unchanged; only its colours changed. The website, the logo files, the favicon, the confirmation-email logo, the share image and the files in `brand-assets/` all use the green palette.

| Role | Hex | Website token |
|---|---|---|
| Ink (text, wordmark, dark sections) | `#12301f` | `--ink-900` |
| Secondary text | `#3d5246` | `--sage-700` |
| Light green (buttons and badges, dark ink text on top) | `#8ddc92` | `--green-400` |
| Light green, hover | `#74cf7b` | `--green-450` |
| Deep green (links, icons, accent text on white) | `#1d7a3e` | `--green-700` |
| Deep green, hover | `#17652f` | `--green-800` |
| Light green on dark backgrounds | `#9fe6a5` | `--green-300` |
| Pale green surfaces | `#f6fbf6` / `#edf8ee` | `--green-25` / `--green-50` |
| Logo gradient | `#1d7a3e` → `#a8ec9a` | in the SVG files |

**Usage rules:**
- **Never put white text on light green;** the contrast is too low. Use the ink colour on light green buttons (about 8.7:1).
- **Never use light green for text on white.** Use the deep green for links and accent text (about 5.4:1) and the ink colour for body text (about 14:1).
- On dark (ink) backgrounds, use white or the light green `#9fe6a5` for text.
- Contrast figures were calculated with the WCAG formula; all text pairs listed pass WCAG AA.
