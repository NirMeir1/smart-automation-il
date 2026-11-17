# SEO_LIVE_AUDIT — what posiblo.com serves today (read-only, 2026-11-17)

Nothing on the site was changed. This complements `WEBSITE_AUDIT.md` (source-code view). Everything below was fetched from the live site today. Recheck on **2026-12-17**; changes in search and AI answers take at least a month to show.

## 1. What is working (live)

| Check | Result |
|---|---|
| Indexing allowed | **Yes.** All 9 public pages serve `robots: index, follow` and a canonical URL. The earlier risk (indexing switched off) did not materialise |
| robots.txt | 200. Allows all crawlers except `/admin`, `/api/`, `/thanks`; blocks GPTBot, Google-Extended, ClaudeBot and CCBot; lists the sitemap |
| sitemap.xml | 200, lists the 9 pages (no last-modified dates) |
| HTTPS and redirects | `http` and `www` both redirect (308) to `https://posiblo.com` |
| Content without JavaScript | **Yes.** The headings, FAQ (6 questions) and body text are in the raw HTML |
| Titles, descriptions, H1, canonical | Present and unique on every page; one H1 per page |
| Social tags | Open Graph title, description, URL, locale; `twitter:card` is "summary" |
| Legal pages | `noindex` (intended) |
| Security headers | CSP, HSTS, X-Frame-Options, nosniff all present |
| 404 page | Returns a real 404 status |

**AI crawler stance matches your decision.** Training crawlers are blocked. Search and answer crawlers (for example PerplexityBot, OAI-SearchBot, Claude-SearchBot) are **not named, so the wildcard rule allows them**. No change needed there; section 4 makes it explicit. *(robots.txt is a request, not a wall.)*

## 2. Gaps (live), ranked by impact

| # | Pri | Finding | Fix | Effort |
|---|---|---|---|---|
| 1 | High | **No visible search or AI presence yet.** Two test searches (a brand query and a plain question: "who helps a small Israeli business connect systems and cut manual work") returned nothing about Posiblo. One run of one search tool, not a ranking; it only shows direction. You also have no Search Console, so you cannot see index status | Create a free Google Search Console property for `posiblo.com` (DNS TXT or meta-tag verification; **you do this**, I only give you the record), submit the sitemap, request indexing for the home page | 20 min |
| 2 | High | **No structured data** (no JSON-LD on any page). Machines must guess the business facts | Add the `ProfessionalService` block in section 4 to the home page (and an `FAQPage` block for the 6 FAQ items) | 1 hour, developer |
| 3 | High | **Contact facts are missing on the site itself.** Your Facebook page shows phone, email and website, but the site shows no phone. Name, phone and email should match everywhere | Add phone 052-251-8189 and the email to the footer and contact page (already in `WEBSITE_CHANGE_SPEC.md` #2) | 1 hour, developer |
| 4 | Medium | **No `llms.txt`** (returns 404). It is a young convention, not a standard, but costs twenty minutes | Publish the file in section 4 at `/llms.txt` | 20 min, developer |
| 5 | Medium | **No Open Graph image**, `twitter:card` is "summary". Shared links look bare | Add a 1200×630 image (logo, headline) and set `twitter:card` to "summary_large_image" (`WEBSITE_CHANGE_SPEC.md` #9, #20) | 1 hour |
| 6 | Medium | **No Google Business Profile** found | Create one as a service-area business with the address hidden (verify Google's current rules). Use the same name, phone and site | 30 min, you |
| 7 | Low | Home meta description is long (178 characters in source); sitemap has no `lastmod` | Shorten to about 150 characters; add `lastmod` | 20 min |
| 8 | Low | Home title is long (59 characters in source, fine) but starts with the brand name; consider leading with the service | Optional wording test | — |

**Not a problem:** no images means no missing alt text; Hebrew-only means no `hreflang` is needed; legal pages being `noindex` is deliberate.

## 3. The assistant test (what actually happened)

| Question asked (via web search) | Result |
|---|---|
| "Posiblo פוסיבלו פתרונות טכנולוגיים אוטומציה לעסקים posiblo.com" | No result about Posiblo. Results were unrelated articles and another Israeli automation firm |
| "Who helps a small Israeli business connect systems and cut manual work" | No consultants listed at all; generic articles about no-code tools |

These are two runs, they vary, and they are not a score. Repeat the same questions monthly and record what changes.

## 4. Ready-to-use files (drafts for a developer; facts taken only from your site and approved answers)

**robots.txt (explicit version, same intent as today)**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /thanks

# AI search and answer crawlers: allowed
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Claude-SearchBot
Allow: /

# Model-training crawlers: blocked (owner decision)
User-agent: GPTBot
User-agent: Google-Extended
User-agent: ClaudeBot
User-agent: CCBot
Disallow: /

Sitemap: https://posiblo.com/sitemap.xml
```
*(Check each crawler name in the provider's documentation before publishing; names change.)*

**llms.txt**
```
# Posiblo (פוסיבלו)

> סטודיו טכנולוגי עצמאי בישראל. עוזר לעסקים קטנים ולאנשים פרטיים לצמצם עבודה ידנית, לחבר בין מערכות ולבנות כלים בהתאמה אישית. מתחילים בהבנת הבעיה ורק אחר כך בוחרים את הפתרון.

## מה אנחנו עושים
- אוטומציה עסקית
- חיבור בין מערכות ואינטגרציות API
- מערכות ותוכנה בהתאמה אישית, אפליקציות ו-MVP, אתרים
- שילוב AI רק היכן שהוא מוסיף ערך

## איך מתחילים
פגישת היכרות ראשונה אינה בתשלום, אונליין או פנים אל פנים בתיאום. אין צורך להכין אפיון.

## צור קשר
ניר מאיר, Posiblo
אימייל: posiblo.contact@gmail.com
טלפון/וואטסאפ: 052-251-8189
אתר: https://posiblo.com

## עמודים
- https://posiblo.com/solutions
- https://posiblo.com/business
- https://posiblo.com/individuals
- https://posiblo.com/process
- https://posiblo.com/solutions/business-automation
- https://posiblo.com/solutions/systems-integration
```
*(No prices, years of experience, client names, or ratings are stated, because none are published or verified.)*

**JSON-LD for the home page**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Posiblo",
  "alternateName": "פוסיבלו",
  "url": "https://posiblo.com",
  "description": "סטודיו טכנולוגי עצמאי: אוטומציה עסקית, חיבור בין מערכות ופיתוח מותאם לעסקים קטנים ולאנשים פרטיים בישראל.",
  "email": "posiblo.contact@gmail.com",
  "telephone": "+972-52-251-8189",
  "areaServed": { "@type": "Country", "name": "Israel" },
  "inLanguage": "he",
  "founder": { "@type": "Person", "name": "ניר מאיר" }
}
```
*(No address, price range, ratings or reviews: none are public or verified. Add them only when true.)*

## 5. Actions, in order
1. **You (20 min):** Search Console (verify, submit sitemap). If you want the exact DNS record, tell me and I'll give it to you step by step; I never change DNS.
2. **You (30 min):** Google Business Profile.
3. **Developer pass:** phone/email on the site, JSON-LD, `llms.txt`, social image, robots.txt wording (all in `WEBSITE_CHANGE_SPEC.md` plus section 4 above). I haven't touched code.
4. **Recheck on 2026-12-17:** same two questions, plus the Search Console index report.

*What this audit does not do: it doesn't rank you, predict traffic, or influence what any assistant recommends. It only makes sure the site can be reached, read, and quoted correctly.*

---

## Correction and update (2026-11-17, later the same day)
- **Google already indexes posiblo.com.** A Google search for "Posiblo" in Nir's Chrome showed posiblo.com as the first regular result, with the Hebrew title and a snippet from the home page, and the Facebook page as the next result. My earlier test searches (section 3) used a search tool that does not reflect what Google shows, so "no visible presence" (gap #1) was wrong. The Search Console steps were still worthwhile (index reports, sitemap, change of address).
- **Google Business Profile exists** ("Posiblo", category "Software company", phone 052-251-8189, opening hours shown, website link). Google shows: "Google requires additional info to verify that you manage this business. Your edits will be visible after you're verified." and a note that reviews are paused to prevent policy violations. Verification is pending. See the chat summary for the cautions on service-area rules.

## Google Business Profile review (read-only, 2026-11-17)
Seen in Business Profile Manager: name "Posiblo"; category "Software company"; Hebrew description (no unsupported claims); phone 052-251-8189; chat link wa.me/972522518189; website https://posiblo.com/; social profiles empty; opening date empty; stored business location is a street address in Kfar Saba (visible only to the owner in the manager); service area "Israel"; hours Sun-Thu 09:00-19:00, Fri 09:00-16:00, Sat closed; status "Verification required" (0% verified); Google card says reviews are paused. Not seen: services, photos, posts. Google's rules (support.google.com/business/answer/3038177): eligibility requires a location customers can visit or travel to customers; service-area businesses should hide their address; no virtual offices or unstaffed shared spaces; service areas about 2 hours' driving; hours = regular customer-facing hours. Verification video for service-area businesses must show neighbourhood landmarks, work tools and proof of management (e.g. an invoice or permit in the profile's name). Decision pending with Nir: whether Posiblo truthfully qualifies and whether the stored address is his home or a cafe.

### Google Business Profile edits made on 2026-11-17 (by Claude in Nir's Chrome, at Nir's request)
Done: "Show business address to customers" turned OFF (profile now "No location; deliveries and home services only"; the stored street address was removed from the profile); service area changed from "Israel" to Kfar Saba, Ra'anana, Hod HaSharon, Netanya, Herzliya, Petah Tikva, Tel Aviv-Yafo; hours set to "Open with no main hours"; social profiles added (Facebook, Instagram); secondary category "Computer consultant" added (primary stays "Software company"); services added: Application development, Software consulting, Software development, "אוטומציה עסקית", "חיבור בין מערכות ואינטגרציות API". Not changed: name, description, phone, chat link, website. Not done: verification (Nir), opening date, photos, posts, LinkedIn link, service descriptions. Google shows edits only after verification; the public card still showed the old hours when checked. The "Reviews are paused" card's View details only opened a general Google policies page.
- Later on 2026-11-17 (Nir's request): opening date set to November 2026 (no day, since Nir said "about two weeks ago"); a two-sentence Hebrew description added to each of the 5 services (no prices, no claims). LinkedIn link intentionally not added.
