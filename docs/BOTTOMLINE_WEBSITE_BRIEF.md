# BOTTOMLINE_WEBSITE_BRIEF

> **Document role:** Primary implementation brief for `frontend-app-builder`.
> **Source:** `deep-research-report (6).md`, especially Part J (verbatim customer-facing copy), plus implementation-relevant findings in Parts A, D–F, H–K and M.
> **Status:** Research-recommended specification, **not** confirmation that unresolved commercial, technical or legal decisions have been approved.
> **Priority rule:** Reproduce Part J customer-facing wording exactly; apply the implementation requirements below where they do not contradict that copy. If a proposed behavior needs infrastructure or approval, mark it `TBD`, not operational. The implementer must inspect the existing codebase separately.

## 1. Project Overview

- **Mandatory:** Build a Hebrew-first, RTL website for Bottomline, a proposed independent technology problem-solving studio serving **both businesses (B2B) and individuals/entrepreneurs (B2C)**.
- **Positioning:** **Problem first. Technology second.** Lead with customer situations, then explain possible technical capabilities.
- **Core site promise:** Understand the problem → choose the right approach → build and test when appropriate. Sometimes a smaller change or no new software is the right recommendation.
- **Main conversion:** A first **פגישת היכרות ומיפוי** / discovery/fit meeting. Research recommends 20–30 minutes, free, online by default; in-person by prior arrangement. Treat the operational availability and meeting rules as requiring business confirmation (`TBD`).
- **Brand warning:** “Bottomline” is **provisional** pending trademark/name/domain clearance; do not silently treat the name as legally cleared.
- **Delivery model represented by the research:** Direct relationship with an individual operator, with specialist collaborators only when needed. Verify operator facts before publication.
- **Scope:** Shared site shell, seven publication-copy pages, conversion/contact workflow, trust and legal links. The research does **not** establish the application framework, deployment architecture, exact routes (except existing `/contact` observed in the audit), vendor services, or brand visual system.

## 2. Business Positioning and Messaging

| Dimension | Implementation direction | Status |
|---|---|---|
| Category | Independent technology problem-solving studio; **not** primarily an AI/automation agency, web shop, or generic IT help desk | Mandatory positioning |
| Value proposition | Learn what is slowing someone down; recommend/build the right-sized technological solution | Mandatory positioning |
| Decision order | Customer problem → understanding → suitable solution → capability details | Mandatory |
| Capability breadth | Automation, AI and intelligent agents, custom software/systems, websites, apps/MVPs, APIs/integrations, CRM/lead flows, data/reporting | Mandatory to represent, **not** promise all capabilities are equally available |
| Differentiation | Consultative discovery, technology independence, direct personal accountability, clear scope and costs | Recommended and reflected in Part J |
| Voice | Clear, practical, human Hebrew; professional, direct, restrained, non-hype; do not require visitors to diagnose technology | Mandatory |
| Trust message | “Not everything needs AI or development”; prefer fit, clarity and verifiable evidence over inflated numbers | Mandatory |
| Boundaries | Serious software/digital problems; **do not** imply laptop repair, general help desk, consumer electronics repair or every technology service | Mandatory exclusion |

**Copy precedence / alternative headlines:** Part J's homepage H1 is the default. Earlier research also suggested “יש משהו שלוקח יותר מדי זמן, כסף או אנרגיה? בואו נפתור אותו.” and “הבעיה קודם. הטכנולוגיה אחר כך.” as headline directions; these are **unselected alternatives**, not instructions to replace the Part J H1. The second phrase is already the approved proposed hero eyebrow in Part J. Use Part J CTA labels in their page-specific contexts rather than homogenizing or rewriting them.

## 3. Target Audiences

| Audience | Needs represented | Entry path |
|---|---|---|
| **B2B**: Israeli self-employed, micro/small/medium businesses and teams | Repeated manual work, missed leads, disconnected tools, fragile processes, inefficient internal systems, new digital products | Home → לעסקים → contact / meeting; Home → פתרונות → contact |
| **B2C**: Individuals and entrepreneurs with meaningful digital needs | App/product/MVP idea, personal-purpose tool, recurrent personal workflow, unmet need not addressed by existing software | Home → לפרטיים וליזמים → contact / meeting; Home → פתרונות → contact |

- **Mandatory:** Equal prominence and legitimacy for both audience journeys. Do not convert the website into B2B-only or imply B2C means generic household IT support.
- Visitors may know their problem but not what to build; service-aware visitors may explore the capabilities layer.
- B2C demand is described as a strategic hypothesis, **not** an established market-size or conversion claim.

## 4. Website Goals and Conversion Strategy

1. Immediately demonstrate recognition of the visitor's problem and remove the need to select a technology.
2. Explain the discovery-led method and differentiate technology capability from a forced product sale.
3. Present clear **לעסקים** and **לפרטיים וליזמים** journeys.
4. Make the discovery meeting the dominant conversion goal; offer an understandable problem-description form as an alternate route.
5. Build confidence through real operator identity (when verified), transparent process and boundaries, and honest trust copy.

**Conversion hierarchy:** Primary sitewide CTA **לקביעת פגישת היכרות** (with contextual **לקביעת פגישה** in footer). Secondary CTAs are **ספרו לי מה מעכב אתכם**, **בואו נדבר על הרעיון**, and contextually WhatsApp **שלחו לי את הבעיה בוואטסאפ** (only once a verified destination exists; it is *not* included as an established Part J on-page control). Page-specific CTAs appear verbatim in Section 7 and take precedence over generic examples.

**Recommended home journey:** Problem recognition → philosophy and capabilities → B2B/B2C choice → process → trust → FAQ → conversion. **Important source-order distinction:** this sequence is conceptual funnel guidance from Part I; the **exact section order in Section 7, copied from Part J, takes precedence for implementation**.

**Analytics:** Measure qualified enquiries, discovery booking, and B2B/B2C source when responsibly implementable; analytics provider, event schema, legal basis, cookie handling and tracking pipeline are all `TBD`. Do not add invisible tracking or claim measurements exist.

## 5. Sitemap and Navigation

**Required seven customer-facing pages; paths other than the observed existing `/contact` are `TBD` until codebase/router inspection and approval.** Labels and ordering derive from Part J.

| Nav order | Page | Exact navigation label | Route | Primary outcome |
|---|---|---|---|---|
| 1 | Home | דף הבית | `TBD` | Recognize problem → meeting / describe issue |
| 2 | Solutions | פתרונות | `TBD` | Explore situations/capabilities → meeting |
| 3 | Business | לעסקים | `TBD` | B2B self-identification → problem enquiry |
| 4 | Individuals & entrepreneurs | לפרטיים וליזמים | `TBD` | B2C self-identification → idea enquiry |
| 5 | Process | איך עובדים יחד | `TBD` | Understand discovery and delivery → meeting |
| 6 | About | אודות | `TBD` | Credibility / who one works with → contact |
| 7 | Contact | בואו נכיר | Existing website audit observes `/contact`; confirm in codebase | Submit actual enquiry / begin scheduling |

- **Navigation:** Persistent, accessible desktop navigation; mobile equivalent. Highlight a distinct CTA **לקביעת פגישת היכרות** as the primary navigation action.
- **Internal links:** Home B2B/B2C cards → their dedicated pages; Home process CTA → Process; solution/context CTAs → an appropriate functioning contact/discovery entry; About and final CTAs → contact/discovery; all footer legal links → actual reviewed legal pages or visibly `TBD` until provided.
- **Scheduling destination ambiguity:** Source wants a booked meeting as the main conversion **but Part J specifies a contact form, not a verified booking tool/URL**. Do not invent a calendar. Until confirmed, route meeting CTAs to the functioning contact entry and make no promise of instantaneous booking. Any booking integration remains proposed and `TBD`.
- **Footer:** Bottomline identifier, tagline, capability list, enquiry prompt, booking CTA, privacy / terms / accessibility links, copyright. Exact copy is preserved verbatim in Section 7. Legal-page *content* is not supplied/approved by the source; do not invent it.

## 6. Global UX and Design Requirements

- **Mandatory:** Hebrew-first, complete right-to-left experience; problem-led navigation, understandable page hierarchy, readable copy, restrained professional tone and clear discovery-focused conversion.
- **Mandatory:** Distinguish B2B and B2C clearly without forcing a technology choice.
- **Mandatory:** Consistent visibility/placement logic for CTAs across pages; maintain the exact context-specific wording in Part J.
- **Mandatory:** Present “AI is a tool, not a starting point” clearly; avoid aggressive future-of-AI framing.
- **Mandatory:** Use genuine signals of trust only. No invented customer logos, references, case studies, percentages, staff, credentials or photographs.
- **Recommended:** Strong visual hierarchy, generous legibility, low cognitive load, problem/example cards on Home, clear process stages, scannable FAQ, capability lists below problem examples.
- **Recommended:** Make the first meeting prominent and explain its purpose as understanding/fit rather than sales pressure.
- **Creative freedom:** Color palette, fonts, imagery treatment, motion, spacing, component library, breakpoints and exact visual layouts are **not established by the research**. Select them during design rather than claiming they came from research. Prioritize accessibility and RTL.
- **Technical boundaries:** Do not prescribe framework, repository, API shape, hosting, external products or tracking stack; inspect existing codebase first.

## 7. Complete Page-by-Page Specifications and Hebrew Copy

**Verbatim-copy contract:** Below are the eight complete blocks from Part J (global shell + seven pages), retained as original Markdown and in original sequence. **Do not paraphrase, retranslate, shorten, drop paragraphs, remove placeholders, or turn draft claims into verified claims.** Editorial English labels (e.g. “Intro”, “CTA”, “Meta title”) are source annotations, *not user-facing text*. Heading levels and quote markers are source Markdown formatting; use the quoted Hebrew as the literal UI string. Square-bracket placeholders in About are unresolved fields, not approved identity facts.

**Page implementation map and caveats:**

| Page | Audience; purpose | Sections in source order | Important interactions/restrictions |
|---|---|---|---|
| Global shell | Both; navigation, trust, outbound paths | Navigation → nav button → footer | Valid internal links; legal link destinations `TBD`; name clearance pending |
| Home | Both; recognition, credibility, routing, conversion | Hero → נשמע מוכר? → אז מה Bottomline עושה? → לעסקים וגם לאנשים → איך זה עובד → לא כל דבר צריך AI → FAQ → final CTA | Problem/meeting CTAs; audience cards; FAQ accessible disclosure if collapsed; no quantitative claims |
| Solutions | Both; problem-to-capability explanations | Hero → לעבוד פחות ידנית → לחבר מערכות → לבנות כלי → להפוך רעיון → לשפר חוויית לקוחות → AI → capabilities → CTA | Service examples are possibilities, not promises or portfolio proof |
| Business | B2B; qualify process problems | Hero → מתי כדאי לדבר? → מה אפשר לשפר? → לא מחליפים מערכת → איך מתחילים? → CTA | Leads to enquiry; avoid assuming all projects require new tools |
| Individuals/entrepreneurs | B2C; legitimize product/personal needs | Hero → רעיון לאפליקציה → MVP → כלי אישי → אוטומציה אישית → לא כל רעיון צריך אפליקציה → CTA | No general device/IT support implication |
| Process | Both; explain first conversation and delivery | Hero → פגישת ההיכרות → מה לא צריך להכין → אחרי הפגישה (2 branches) → בזמן הפרויקט → בסוף → CTA | Price/availability of paid mapping subject to business approval |
| About | Both; real operator and ownership | Hero → positioning/body → למה לעבוד ישירות? → במה אני מאמין → factual block → CTA | Placeholder facts must be confirmed before launch; no stock stand-in represented as operator |
| Contact | Both; capture understandable enquiry | Hero → form → consent → submit/success → reassurance | Submission backend `TBD`; do not fake sent/success; explicit privacy consent with accurate policy |

**Page routes:** all `TBD` except the `/contact` address observed in the old site; use/reconcile actual routes after inspection. **SEO:** each individual page block below includes its exact Part J `Meta title` and `Meta description`. The source does not give these for the global shell.

### 7.1–7.8 Original Part J blocks (verbatim)

### Global navigation and footer

**Navigation**

> דף הבית  
> פתרונות  
> לעסקים  
> לפרטיים וליזמים  
> איך עובדים יחד  
> אודות  
> בואו נכיר

Button:

> **לקביעת פגישת היכרות**

**Footer copy**

> **Bottomline**  
> פתרונות טכנולוגיים שמתחילים בבעיה האמיתית — לא בכלי.
>
> אוטומציה | AI | מערכות מותאמות | אפליקציות | אתרים | אינטגרציות
>
> **רוצים לדבר על משהו שמעכב אתכם?**  
> ספרו לי מה קורה היום, ונבדוק יחד מה הדרך הנכונה לשפר אותו.
>
> **לקביעת פגישה**
>
> מדיניות פרטיות | תנאי שימוש | הצהרת נגישות
>
> © Bottomline. כל הזכויות שמורות.

### Home page — דף הבית

**Meta title**

> Bottomline | פתרונות טכנולוגיים לעסקים ולאנשים — מהבעיה לפתרון

**Meta description**

> יש תהליך שגוזל זמן, מערכת שלא עובדת כמו שצריך או רעיון שרוצים להפוך למציאות? מתחילים בהבנת הבעיה ובונים את הפתרון המתאים — אוטומציה, AI, אתר, אפליקציה, אינטגרציה או מערכת מותאמת.

**Hero eyebrow**

> **הבעיה קודם. הטכנולוגיה אחר כך.**

**H1**

> **לא צריך לדעת איזו טכנולוגיה אתם צריכים.  
> צריך לדעת מה מפריע לכם להתקדם.**

**Hero body**

> יש משהו שלוקח יותר מדי זמן? תהליך שמלא בעבודה ידנית? מערכות שלא מדברות אחת עם השנייה? רעיון שאתם לא יודעים איך להפוך למוצר?
>
> ב-Bottomline מתחילים בשיחה. מבינים איך הדברים עובדים היום, איפה הבעיה ומה באמת צריך להשתנות — ורק אחר כך בוחרים את הפתרון הנכון.
>
> אוטומציה, AI, אתר, אפליקציה, מערכת מותאמת, אינטגרציה — או לפעמים משהו הרבה יותר פשוט.

**Primary CTA**

> **לקביעת פגישת היכרות**

**Secondary CTA**

> **ספרו לי מה מעכב אתכם**

**Trust microcopy**

> אפשר להיפגש אונליין או פנים אל פנים, בתיאום מראש.  
> לא צריך להגיע עם אפיון ולא צריך לדעת מה הפתרון.

#### Section: נשמע מוכר?

> **לפעמים הבעיה ברורה. הפתרון פחות.**

Card:

> **יותר מדי עבודה ידנית**  
> מעתיקים מידע, מעדכנים טבלאות, שולחים שוב את אותן הודעות ועושים פעולות שאולי לא צריכות ידיים בכלל.

Card:

> **מערכות שלא מדברות**  
> המידע נמצא במייל, ב-WhatsApp, ב-CRM, ב-Sheets ובעוד כמה מקומות — ואף אחד מהם לא באמת מחובר.

Card:

> **דברים נופלים בין הכיסאות**  
> ליד שלא חזרו אליו, משימה שנשכחה, מסמך שלא נשלח או לקוח שלא קיבל עדכון.

Card:

> **כלי קיים שלא מתאים לעבודה**  
> מערכת שאמורה לעזור, אבל בפועל גורמת לעוד עבודה, עוד מעקפים ועוד תסכול.

Card:

> **רעיון שצריך להפוך למשהו אמיתי**  
> אפליקציה, אתר, מערכת או כלי דיגיטלי שאתם יודעים למה הוא צריך להתקיים — אבל לא בהכרח איך לבנות אותו.

Closing:

> **לא חייבים לדעת איך קוראים לפתרון. בשביל זה נפגשים.**

CTA:

> **בואו נדבר על מה שקורה אצלכם**

#### Section: אז מה Bottomline עושה?

> **פותרים את הבעיה — עם הטכנולוגיה שמתאימה לה.**

> אין כאן פתרון אחד שמנסים למכור לכל אחד.  
> אחרי שמבינים את התהליך, המטרה והאילוצים, בוחרים את הדרך המתאימה ביותר.

**אוטומציה**

> להפוך פעולות ידניות וחוזרות לתהליכים שקורים לבד — בצורה מבוקרת וברורה.

**AI**

> לשלב בינה מלאכותית במקומות שבהם היא באמת מוסיפה ערך: טיפול במידע, טקסט, שירות, תהליכים, ידע או קבלת החלטות.

**מערכות ותוכנה בהתאמה אישית**

> כשפתרונות מדף פשוט לא מתאימים לאופן שבו אתם עובדים.

**אפליקציות ו-MVP**

> להפוך רעיון למוצר שאפשר להשתמש בו, לבדוק אותו ולפתח ממנו הלאה.

**אתרים וכלים דיגיטליים**

> לבנות נוכחות או כלי שבאמת משרתים את התהליך ולא רק נראים טוב.

**אינטגרציות ו-API**

> לגרום למערכות שכבר יש לכם לעבוד יחד במקום שאתם תעבירו מידע ביניהן.

Closing:

> **לא בטוחים מה מתוך זה אתם צריכים? מצוין. אתם לא אמורים לדעת לפני שנדבר.**

#### Section: לעסקים וגם לאנשים

**לעסקים**

> אם העסק גדל אבל התהליכים לא גדלו איתו, אם יותר מדי דברים תלויים בכם אישית, או אם אתם מרגישים שהכלים הקיימים יוצרים יותר עבודה ממה שהם חוסכים — אפשר לעשות סדר.
>
> מתאים לעצמאים, עסקים קטנים ובינוניים וצוותים שרוצים לעבוד בצורה פשוטה, מחוברת ויעילה יותר.

CTA:

> **פתרונות לעסקים**

**לפרטיים וליזמים**

> יש לכם רעיון לאפליקציה? כלי שהייתם רוצים שיתקיים? תהליך אישי שחוזר על עצמו? או בעיה שלא מצאתם לה פתרון מדף מתאים?
>
> אפשר להתחיל מהרעיון, להבין אם וכיצד נכון לבנות אותו, ולהתקדם בצורה מסודרת.

CTA:

> **פתרונות לפרטיים וליזמים**

#### Section: איך זה עובד

> **קודם מבינים. אחר כך בונים.**

**מכירים**

> מתחילים בפגישת היכרות. אתם מספרים על העסק, הרעיון או התהליך ומה מפריע לכם היום.

**ממפים**

> מבינים מה באמת קורה, איפה הבעיה, מי מעורב, באילו מערכות משתמשים ומה התוצאה שרוצים להגיע אליה.

**בוחרים דרך**

> רק עכשיו מחליטים מה נכון: אוטומציה, פיתוח, AI, אינטגרציה, אתר, אפליקציה — או פתרון פשוט יותר.

**בונים ובודקים**

> מפתחים, מחברים ובודקים את הפתרון מול התהליך האמיתי.

**משיקים ומשפרים**

> מעבירים לשימוש, בודקים שהפתרון עושה את מה שהוא אמור לעשות ומחליטים אם צריך תמיכה או שיפור נוסף.

CTA:

> **איך נראית פגישת ההיכרות?**

#### Section: לא כל דבר צריך AI

> **טכנולוגיה היא אמצעי, לא המטרה.**
>
> AI יכול להיות מצוין. אוטומציה יכולה לחסוך המון עבודה. מערכת מותאמת יכולה לפתור משהו שאף כלי מדף לא פותר.
>
> אבל לא כל בעיה צריכה אותם.
>
> אם אפשר לפתור משהו בצורה פשוטה, יציבה וזולה יותר — זה פתרון טוב יותר.
>
> המטרה היא לא לבנות את הדבר הכי מתוחכם.  
> **המטרה היא לפתור את הבעיה בצורה הנכונה.**

#### Home FAQ

**אני צריך לדעת מראש מה אני צריך?**

> לא. למעשה, הרבה פעמים עדיף להגיע בלי החלטה טכנולוגית מראש. תספרו מה קורה היום ומה הייתם רוצים לשנות, ומשם נבדוק את האפשרויות.

**אתם עושים רק אוטומציות ו-AI?**

> לא. בהתאם לצורך אפשר לבנות גם מערכות בהתאמה אישית, אפליקציות, אתרים, אינטגרציות וכלים דיגיטליים נוספים.

**אפשר להגיע גם עם רעיון ולא עם בעיה בעסק?**

> כן. אפשר להגיע עם רעיון למוצר, אפליקציה, מערכת או כלי ולבדוק יחד מה הדרך הנכונה להפוך אותו למשהו עובד.

**פגישת ההיכרות עולה כסף?**

> פגישת ההיכרות הראשונית אינה בתשלום. המטרה שלה היא להבין את הצורך ולבדוק התאמה. בפרויקטים מורכבים שדורשים אפיון או בדיקת היתכנות מעמיקה, ייתכן שיומלץ על שלב אפיון נפרד בתשלום לפני הפיתוח.

**אפשר להיפגש פנים אל פנים?**

> כן. אפשר להיפגש אונליין או פנים אל פנים בתיאום מראש.

**כמה פרויקט כזה עולה?**

> המחיר תלוי בבעיה, בהיקף, במערכות המעורבות ובמורכבות הפתרון. אחרי שנבין את הצורך, תקבלו הצעה ברורה שמפרטת מה כלול ומהן עלויות צד שלישי, אם קיימות.

**Final CTA**

> **יש משהו שיושב לכם בראש כבר יותר מדי זמן?**
>
> לא צריך להכין מצגת, מסמך אפיון או רשימת טכנולוגיות.  
> פשוט תספרו לי מה קורה.
>
> **לקביעת פגישת היכרות**

### Solutions page — פתרונות

**Meta title**

> פתרונות טכנולוגיים בהתאמה אישית | Bottomline

**Meta description**

> מאוטומציה ו-AI ועד אפליקציות, מערכות, אתרים ואינטגרציות. מתחילים מהבעיה ורק אחר כך בוחרים את הטכנולוגיה המתאימה.

**H1**

> **לא מתחילים מרשימת שירותים. מתחילים ממה שצריך לפתור.**

Intro:

> לפעמים הפתרון הוא אוטומציה של שעה. לפעמים צריך לבנות מערכת. לפעמים מספיק לחבר בין שני כלים שכבר קיימים. ולפעמים הרעיון שנראה כמו "AI" בכלל לא צריך AI.
>
> הנה סוגי הבעיות שבהן Bottomline יכולה לעזור.

#### לעבוד פחות ידנית

> אם אתם עושים שוב ושוב את אותן פעולות — מעתיקים מידע, שולחים הודעות, מעדכנים סטטוסים, מכינים מסמכים, מתאמים פגישות או רודפים אחרי דברים — כדאי לבדוק מה אפשר להעביר למערכת.
>
> הפתרון יכול לכלול אוטומציות, חיבורים בין מערכות, טריגרים, תזכורות, תהליכי אישור או AI במקומות שבהם נדרשת הבנה של מידע לא מובנה.

CTA:

> **יש משימה שחוזרת על עצמה? דברו איתי**

#### לחבר מערכות שלא מדברות

> הרבה עסקים כבר משתמשים בכלים טובים. הבעיה מתחילה כשהמידע לא עובר ביניהם.
>
> אפשר לחבר CRM, טפסים, WhatsApp, מערכות חשבוניות, יומנים, שירותי תשלום, Sheets, מערכות פנימיות וכלים נוספים באמצעות אינטגרציות ו-API.

#### לבנות כלי שלא קיים

> לפעמים התהליך שלכם ייחודי מדי לפתרון מדף.
>
> במקרה כזה אפשר לבנות מערכת פנימית, פורטל, dashboard, כלי ניהול, שירות web או תוכנה מותאמת סביב הדרך שבה אתם באמת עובדים — במקום לעקם את העבודה סביב תוכנה שלא מתאימה.

#### להפוך רעיון למוצר

> יש לכם רעיון לאפליקציה, שירות דיגיטלי או מוצר?
>
> מתחילים בהבנת הבעיה שהמוצר אמור לפתור, מי ישתמש בו ומה באמת צריך להיכנס לגרסה הראשונה.
>
> משם אפשר להתקדם ל-MVP, אפליקציית web, מובייל או פתרון אחר שמתאים למטרה.

#### לשפר את החוויה מול לקוחות

> תהליך לקוח יכול להיתקע עוד לפני שהלקוח יודע שמשהו השתבש.
>
> אפשר לשפר קליטת לידים, מענה ראשוני, תיאום, תזכורות, מעקב, איסוף מידע, שירות עצמי והעברת מידע בין הלקוח לצוות.

#### להשתמש ב-AI במקום הנכון

> AI יכול לעזור בקריאת טקסט ומסמכים, סיווג פניות, חיפוש בידע, יצירת תוכן, סיכום, ניתוח מידע, תמיכה וקבלת החלטות בתוך תהליך.
>
> אבל משלבים אותו רק כשיש לכך סיבה טובה.
>
> **AI הוא כלי בארגז — לא נקודת ההתחלה.**

#### Technical capability block

> **הכלים שאפשר לעבוד איתם**
>
> אוטומציות • AI • סוכנים חכמים • פיתוח Web • אפליקציות • APIs • אינטגרציות • מערכות פנימיות • אתרים • CRM • מסדי נתונים • dashboards • פתרונות ענן
>
> **לא צריך לבחור. בואו קודם נבין את הבעיה.**

CTA:

> **לקביעת פגישת היכרות**

### Business page — לעסקים

**Meta title**

> פתרונות טכנולוגיים לעסקים קטנים ובינוניים | Bottomline

**Meta description**

> אוטומציה, AI, מערכות, אינטגרציות ופיתוח מותאם לעסקים שרוצים לצמצם עבודה ידנית, לחבר תהליכים ולעבוד בצורה פשוטה ויעילה יותר.

**H1**

> **העסק לא צריך עוד כלי. הוא צריך שתהליכים יעבדו טוב יותר.**

Intro:

> כשהעסק קטן או בינוני, כמעט כל חוסר יעילות מורגש ישירות.
>
> בעל העסק הופך למערכת התזכורות. העובדים מעבירים מידע ידנית. לידים נמצאים בכמה מקומות. פעולה שאמורה לקחת דקה הופכת לעשר.
>
> Bottomline עוזרת לזהות איפה התהליך נשבר ולבנות את הפתרון שמתאים לעסק — בלי להתחייב מראש לטכנולוגיה מסוימת.

#### מתי כדאי לדבר?

> כשאותה עבודה חוזרת כל יום או כל שבוע.
>
> כשיותר מדי דברים תלויים באדם אחד.
>
> כשמידע עובר ידנית בין מערכות.
>
> כשלא ברור מה קרה עם ליד, לקוח, משימה או מסמך.
>
> כשיש מערכת — אבל כולם עובדים מסביבה במקום בתוכה.
>
> כשאתם יודעים שמשהו בעסק לא יעיל, אבל לא יודעים איך לפתור אותו.

#### מה אפשר לשפר?

> תהליכי לידים ומכירה  
> שירות ותיאום מול לקוחות  
> עבודה פנימית וניהול משימות  
> מסמכים ומידע  
> חיבור בין מערכות  
> דיווחים ונתונים  
> תהליכים אדמיניסטרטיביים  
> אתרים וכלים פנימיים  
> פתרונות AI במקומות שבהם הם באמת עוזרים

#### לא מחליפים מערכת רק כי אפשר

> לפעמים יש סיבה מצוינת להחליף מערכת.
>
> ולפעמים המערכת שכבר יש לכם בסדר גמור — פשוט צריך לחבר אותה נכון, לשנות תהליך או להוסיף שכבה קטנה שחסרה.
>
> לכן לפני שמציעים פתרון, מבינים מה כבר עובד ומה לא.

#### איך מתחילים?

> בפגישת היכרות קצרה.
>
> אתם מספרים איך העסק עובד היום, איפה הכאב ומה הייתם רוצים שיקרה אחרת.
>
> אני שואל שאלות, ממפה את התהליך ומנסה להבין את התמונה לפני שמדברים על פתרון.
>
> אם יש התאמה והצעד הבא ברור — מתקדמים להצעה.  
> אם צריך מחקר או אפיון מעמיק יותר — מגדירים שלב כזה בנפרד.

CTA:

> **ספרו לי מה מעכב את העסק**

### Individuals and entrepreneurs page — לפרטיים וליזמים

**Meta title**

> פיתוח פתרונות, אפליקציות ו-MVP לפרטיים וליזמים | Bottomline

**Meta description**

> יש לכם רעיון לאפליקציה, מערכת או כלי דיגיטלי? מתחילים בהבנת הצורך ובודקים מה הדרך הפשוטה והנכונה להפוך אותו לפתרון עובד.

**H1**

> **יש לכם רעיון או בעיה שפתרון מדף לא פותר? בואו נבדוק מה אפשר לבנות.**

Intro:

> לא צריך חברה גדולה כדי להזדקק לפתרון טכנולוגי טוב.
>
> אולי יש לכם רעיון לאפליקציה. אולי אתם רוצים לבדוק מוצר לפני שמשקיעים בו יותר. אולי אתם צריכים כלי אישי שאף שירות קיים לא עושה בדיוק כמו שאתם צריכים.
>
> אפשר להתחיל מהרעיון עצמו — ולבדוק יחד מה הדרך הנכונה להפוך אותו למשהו עובד.

#### רעיון לאפליקציה או מוצר

> נבדוק למי המוצר מיועד, איזו בעיה הוא פותר, מה באמת צריך להיות בגרסה הראשונה ומה אפשר להשאיר להמשך.

#### MVP

> במקום לנסות לבנות הכול ביום הראשון, אפשר לבנות גרסה ממוקדת שמאפשרת לבדוק את הרעיון, לקבל תגובות וללמוד מה באמת חשוב.

#### כלי אישי או מערכת מותאמת

> אם אתם עושים משהו שוב ושוב ולא מצאתם כלי שמתאים בדיוק לצורך שלכם, ייתכן שאפשר לבנות פתרון ייעודי.

#### אוטומציה אישית

> במקרים שבהם כמה שירותים או פעולות חוזרות על עצמם, אפשר לבדוק האם אפשר לחבר ביניהם או להפוך חלק מהתהליך לאוטומטי.

#### לא כל רעיון צריך אפליקציה

> לפעמים אפליקציה היא הפתרון.
>
> לפעמים אתר קטן, כלי Web, אוטומציה או אפילו שימוש נכון בשירות קיים יגיעו לתוצאה מהר ופשוט יותר.
>
> **המטרה היא לא למכור פיתוח. המטרה היא למצוא את הדרך הנכונה.**

CTA:

> **בואו נדבר על הרעיון**

### Process page — איך עובדים יחד

**Meta title**

> איך עובדים יחד | פגישת היכרות, אפיון ופיתוח | Bottomline

**Meta description**

> מתחילים בשיחה ובהבנת הבעיה, ממשיכים לאפיון הפתרון הנכון, ורק אז בונים. אפשר להיפגש אונליין או פנים אל פנים.

**H1**

> **לפני שמדברים על פתרון, אני רוצה להבין את הסיפור.**

Intro:

> הטכנולוגיה היא בדרך כלל החלק הקל להסביר.
>
> החלק החשוב יותר הוא להבין למה צריך אותה בכלל.
>
> לכן העבודה ב-Bottomline מתחילה בהיכרות אמיתית עם העסק, האדם, הרעיון והתהליך.

#### פגישת ההיכרות

> הפגישה הראשונה היא לא דמו של AI ולא ניסיון לגרום לכם לבחור חבילה.
>
> היא נועדה להבין:
>
> מה אתם עושים היום.  
> מה עובד.  
> מה לא עובד.  
> איפה נוצר עומס.  
> מי מעורב.  
> באילו כלים משתמשים.  
> ומה הייתם רוצים שיקרה אחרת.
>
> אפשר להיפגש אונליין או פנים אל פנים, בתיאום מראש.

#### מה לא צריך להכין

> לא צריך אפיון.  
> לא צריך מצגת.  
> לא צריך לדעת איזו טכנולוגיה מתאימה.  
> ולא צריך לדעת להסביר את הבעיה "טכנית".
>
> פשוט ספרו איך הדברים עובדים היום.

#### אחרי הפגישה

**אם הבעיה והפתרון ברורים**

> תקבלו הצעה שמגדירה מה בונים, מה כלול, מה לא כלול ומה נדרש כדי להתקדם.

**אם יש עוד שאלות שצריך לפתור**

> נציע שלב מיפוי ואפיון נפרד לפני שמתחייבים לפיתוח. המטרה היא להקטין אי-ודאות ולא לנחש מחיר או פתרון.

#### בזמן הפרויקט

> עובדים בשלבים ברורים, משתפים בהתקדמות ובודקים את הפתרון מול השימוש האמיתי.
>
> בפרויקט שדורש מומחיות נוספת ניתן לצרף אנשי מקצוע מתאימים, תוך שמירה על כתובת אחת שמרכזת את העבודה.

#### בסוף

> המטרה היא שלא תישארו עם "פרויקט טכנולוגי".
>
> המטרה היא שתישארו עם פתרון שאתם מבינים, יכולים להשתמש בו ויודעים מה נדרש כדי לתחזק או להמשיך לפתח אותו.

CTA:

> **לקביעת פגישת היכרות**

### About page — אודות

**Meta title**

> אודות Bottomline | קודם מבינים את הבעיה

**Meta description**

> Bottomline היא סטודיו טכנולוגי עצמאי שמתחיל מהבעיה ורק אחר כך בוחר את הפתרון — אוטומציה, AI, תוכנה, אתר, אפליקציה או אינטגרציה.

**H1**

> **טכנולוגיה טובה מתחילה בהבנה טובה של הבעיה.**

Body:

> מאחורי Bottomline עומד **[שם מלא — נדרש להשלמה]**, מפתח תוכנה שעובד ישירות עם עסקים, יזמים ואנשים שרוצים לפתור בעיה אמיתית בעזרת טכנולוגיה.
>
> הרעיון מאחורי Bottomline פשוט:
>
> יותר מדי פרויקטים מתחילים במשפט כמו "אנחנו צריכים AI", "אנחנו צריכים אפליקציה" או "אנחנו צריכים אוטומציה".
>
> אבל אלה פתרונות. לא בעיות.
>
> לפני שבוחרים טכנולוגיה, צריך להבין מה קורה היום, למה זה לא עובד מספיק טוב ומה התוצאה שבאמת מחפשים.

#### למה לעבוד ישירות?

> העבודה מולי ישירות — משלב ההיכרות והחשיבה ועד הפיתוח והיישום.
>
> אין מעבר בין איש מכירות למנהל לקוח ואז למישהו שמעולם לא שמע את השיחה הראשונה.
>
> כשפרויקט דורש התמחות נוספת או יותר קיבולת, אני עובד עם אנשי מקצוע מתאימים ומרכז את העבודה מולם, כך שנשארת לכם כתובת אחת ברורה.

#### במה אני מאמין

> **להבין לפני שבונים.**
>
> **להסביר דברים טכנולוגיים בשפה ברורה.**
>
> **לא להשתמש ב-AI רק כי אפשר.**
>
> **לא לבנות מערכת גדולה כשפתרון קטן מספיק.**
>
> **להיות שקוף לגבי היקף, עלויות ומגבלות.**
>
> **לבנות פתרון סביב הבעיה — לא לעקם את הבעיה סביב הכלי.**

#### The factual block to complete before publication

> **[נדרש להשלמה ואימות לפני פרסום:]**  
> שם מלא  
> תמונה מקצועית  
> ניסיון מקצועי רלוונטי  
> טכנולוגיות/תחומי מומחיות שחשוב להציג  
> LinkedIn / GitHub / פרופיל מקצועי, אם רלוונטי  
> מיקום / אזורי פגישות פיזיות, אם רוצים לפרסם

Do **not** insert invented experience years, client counts or project statistics to fill this space.

CTA:

> **בואו נכיר**

### Contact page — בואו נכיר

**Meta title**

> קביעת פגישת היכרות | Bottomline

**Meta description**

> ספרו מה מעכב את העסק, מה הייתם רוצים לשפר או איזה רעיון אתם רוצים לבנות. לא צריך לדעת מה הפתרון הטכנולוגי — מתחילים בשיחה.

**H1**

> **ספרו לי מה אתם מנסים לפתור.**

Intro:

> אתם לא צריכים להגיע עם אפיון או לבחור שירות.
>
> ספרו לי מה קורה היום, מה לא עובד כמו שהייתם רוצים ומה הייתם שמחים לשנות.
>
> משם נתחיל.

#### Form

**שם מלא \***

> איך לפנות אליכם?

**טלפון או אימייל \***

> איפה הכי נוח לחזור אליכם?

**אני פונה בתור \***

> עסק  
> עצמאי/ת  
> יזם/ת  
> אדם פרטי  
> אחר

**מה הייתם רוצים לפתור? \***

Placeholder:

> ספרו לי במילים שלכם. מה קורה היום? מה מעכב, מתסכל או פשוט לוקח יותר מדי זמן?

**אם רלוונטי — באילו כלים או מערכות אתם משתמשים היום?**

Placeholder:

> לדוגמה: WhatsApp, Gmail, Sheets, CRM, מערכת חשבוניות, אתר...

**יש טווח השקעה משוער שחשוב לדעת?**

> לא חובה. גם "עדיין לא יודע/ת" זו תשובה מצוינת.

**איך תרצו להיפגש?**

> אונליין  
> פנים אל פנים  
> אין העדפה

**Privacy checkbox**

> אני מאשר/ת שימוש בפרטים שמסרתי לצורך טיפול בפנייה וחזרה אליי, בהתאם למדיניות הפרטיות.

Do **not** bundle marketing-newsletter consent into this service-enquiry checkbox. Promotional messaging has separate legal considerations under Israeli communications law. citeturn22search2turn22search26

**Submit**

> **שליחת הפנייה**

Confirmation:

> **תודה. קיבלתי את הפנייה.**  
> אעבור על מה שכתבתם ונוכל להבין יחד מה הצעד הבא המתאים.

Do not promise a specific response time until you know you can consistently meet it.

#### Final reassurance

> **לא יודעים אם זה בכלל משהו שאני יכול לעזור בו?**
>
> זה בסדר.  
> תספרו מה הבעיה — ונבין משם.

## 8. Functional Requirements

| Function | Behavior expected | Requirement status / dependencies |
|---|---|---|
| Navigation | All seven entries navigate to their corresponding page; current location and focus are understandable | **Mandatory**; final routes `TBD` |
| Primary CTAs | Direct visitor to a genuine first-meeting/contact flow, from header, footer, page sections | **Mandatory** functioning destination; confirmed booking calendar `TBD` |
| Secondary CTAs | Route relevant B2B/B2C/prob​​lem/idea enquiries to contact flow or specified internal pages | **Mandatory** functioning links; destination mapping based on purpose |
| Contact form | Display all fields, options, exact labels, placeholders and the privacy checkbox in Part J | **Mandatory**; see field specification below |
| Validation | Prevent empty submissions for `שם מלא`, `טלפון או אימייל`, `אני פונה בתור`, `מה הייתם רוצים לפתור?`; require privacy acknowledgment before submission if legally appropriate. Validate phone **or** email in a way consistent with selected input UX; show accessible field-specific errors | **Recommended implementation behavior** inferred from Part J asterisks; exact validation/messaging `TBD` |
| Optional fields | Systems/tools; estimated investment; meeting preference; no forced budget selection | **Mandatory** optionality from Part J; no invented price ranges |
| Form submission | Send request to *verified* configured recipient/back end; prevent accidental duplicate sends; show pending, failure and success feedback. **Only show exact Part J thank-you after actual success** | **Mandatory integrity**; recipient, backend, retention, anti-spam approach `TBD` |
| Meeting booking | Ideally offer 20–30 minute discovery slots online, with face-to-face by arrangement | **Recommended**, *not implemented/confirmed*; vendor, URL, availability, timezone, scheduling behavior `TBD` |
| WhatsApp | Optional link with prefilled problem enquiry only when real business number and consent/data-flow design are approved | **Proposed**; phone/deep link `TBD`, not a required Part J control |
| FAQ | All six Home FAQ question-and-answer pairs exist and are readable; expandable disclosure may be used with accessible controls | **Mandatory** content; accordion styling **recommended** |
| Responsive menu | Full keyboard/touch access, explicit open/close, focus visibility and sane focus return | **Mandatory** |
| Legal links | Navigate to current approved Privacy, Terms, Accessibility content; no faux policy placeholders published as authoritative | **Mandatory before public launch**; documents/paths/approvals `TBD` |
| SEO | Use source meta title/description for all seven pages; one coherent page H1; semantic sections | **Mandatory**; canonical/domain/indexing `TBD` |
| Analytics | If enabled, distinguish leads and B2B/B2C paths without unlawful or undocumented data collection | **Recommended**; implementation and consent `TBD` |

**Contact form field contract — exact wording remains in Section 7 (Contact block):**

| Field | Required in proposed copy? | Format/behavior |
|---|---|---|
| `שם מלא` | Yes (`*`) | Text; exact placeholder in Part J |
| `טלפון או אימייל` | Yes (`*`) | One contact route; accepted formats and whether split input is needed `TBD` (do **not** silently change published wording) |
| `אני פונה בתור` | Yes (`*`) | Five source options: עסק; עצמאי/ת; יזם/ת; אדם פרטי; אחר |
| `מה הייתם רוצים לפתור?` | Yes (`*`) | Multi-line, problem-led prompt |
| `אם רלוונטי — באילו כלים או מערכות אתם משתמשים היום?` | No | Free text |
| `יש טווח השקעה משוער שחשוב לדעת?` | No | Optional free-text or an approved, uncoercive control; **do not invent price bands** |
| `איך תרצו להיפגש?` | No (no asterisk in source) | אונליין; פנים אל פנים; אין העדפה |
| Privacy consent | Source checkbox displayed | Explicit, unbundled acknowledgement referencing accurate privacy policy; legal mandatory state and log/retention rules `TBD` |

**Errors/edge cases:** Part J supplies **only the success confirmation**, not failure/validation/loading message copy. Any new user-facing strings needed to implement these states are `TBD` pending approval; do not present fabricated messages as source-approved text. Forms must not pretend to submit if the receiver is absent. No unsupported response-time promise.

## 9. Responsive, RTL, and Accessibility Requirements

- **Mandatory:** `lang="he"`, `dir="rtl"` at the appropriate document/root level; verify logical property usage, directional icons, keyboard flows, focus ordering and bidirectional mixed-script strings (AI, API, CRM, WhatsApp, Sheets, MVP, Web).
- **Mandatory:** Mobile-first usable navigation, form, cards, CTAs, long headlines and FAQ; no horizontal overflow or concealed Hebrew content.
- **Mandatory:** Semantic landmarks and headings; correctly associated labels; required-field indications; keyboard-operable menu, disclosures, buttons and forms; visible focus; accessible error and status announcements; readable contrast; touch usability; meaningful alternative text for *verified* images.
- **Mandatory:** Do not rely on an accessibility widget instead of accessible implementation; test real interaction pathways.
- **Recommended implementation benchmark:** Follow applicable current WCAG guidance and verify Israeli legal scope with a competent reviewer. **Compliance certification, statutory applicability, exemptions and exact conformance level are `TBD`**; the research does not establish that compliance is already achieved.
- **Recommended:** Reduced-motion respect if motion is introduced; no arbitrary animation mandate.

## 10. Existing Website: Keep / Improve / Replace / Remove / Add

*Research audit findings, not a fresh inspection of the current repository or live site. Recheck implementation independently.*

| Action | What the research found | Implementation instruction |
|---|---|---|
| **KEEP** | Asking visitors to describe a repetitive/slow/problematic process | Preserve problem-description entry, broaden beyond automation |
| **KEEP** | Diagnosis → specification → implementation → improvement | Retain logic; make discovery personal, technology-neutral |
| **KEEP** | Real-world integration examples | Place in capabilities layer rather than positioning headline |
| **KEEP** | Hebrew-first communication | Continue with thorough RTL handling |
| **IMPROVE** | Automation/time-savings hero | Replace with Part J problem-first hero |
| **IMPROVE** | Narrow service coverage | Represent software, apps, MVP, sites, integrations and AI as potential solutions |
| **IMPROVE** | Small/secondary process presentation | Elevate discovery and give Process a dedicated page |
| **IMPROVE** | Technically framed form | Use Part J problem-led form and audience options |
| **IMPROVE** | Impersonal About | Add verified real operator identity and direct-contact model |
| **REPLACE** | “AI is the reality here and now” pressure | Use source's technology-agnostic positioning |
| **REPLACE** | Generic “we/agency” identity implying a fixed large team | Use authentic operator-led narrative consistent with Part J |
| **REPLACE** | Mixed identities: “Sogomatic”, “אוטומציה חכמה”, “Bottomline” | Decide cleared identity and remove inconsistencies |
| **REMOVE** pending evidence | “Up to 50%”, “up to 90%”, “50+ businesses”, “5 years” and similar figures | Do not republish absent proof, contextual accuracy and permission |
| **REMOVE** pending evidence | Unverified testimonials/customer outcomes | No fake reviews or anonymized purported cases |
| **ADD** | Clear B2B audience path | Dedicated Business page |
| **ADD** | Clear B2C audience path | Dedicated Individuals/Entrepreneurs page |
| **ADD** | Problem-led, capability-underneath information architecture | Dedicated Solutions page |
| **ADD** | Discovery explanation | Process page and meeting-centred CTAs |
| **ADD** pending facts | Real operator photo/name/background/contact | Only authenticated, authorized material |
| **ADD** | Explicit “not everything needs AI” proof of approach | Part J Home trust section |
| **ADD** pending proof | Verified case studies | Only real, permitted work; not invented for launch |
| **ADD** pending legal review | Updated privacy, terms, accessibility content | Correct identity and actual data processing |
| **IMPROVE** | Legacy `/contact` reportedly showed essentially footer to crawler | Create substantive, functional Contact page and inspect crawlability |
| **REPLACE** pending decisions | Legacy `vercel.app` / `bottomline-ai` project address | Choose owned domain **after** brand clearance; no guessed domain |

## 11. Content, Trust, and Legal Restrictions

1. **Brand clearance:** The research reports a major existing international software company named Bottomline, including Israeli presence. This is a clearance **risk, not a legal conclusion**. Confirm trademark/company-name/domain/search conflicts before major public brand launch; final display name and URL `TBD`.
2. **Verifiability:** No invented or reused unsupported years of experience, client totals, savings percentages, revenue/ROI metrics, testimonials, logos, case studies, biographies, certifications or endorsements. Only publish with evidence and permission. Generic examples must not masquerade as real client results.
3. **Operator transparency:** Do not suggest a permanent team exists. Verify name, portrait, experience, professional profiles, collaboration and actual services; About factual block deliberately contains placeholders.
4. **Privacy:** Research says legacy policy was dated **December 2024**, used previous-brand names, an `smart-automation.co.il` contact and `050-1234567` requiring verification. It notes Israeli Privacy Protection Law **Amendment 13** effective **14 August 2025**. Do **not** reuse stale/legal filler. Have a qualified Israeli reviewer assess the actual production data flows: forms, scheduling, hosting, analytics/cookies, email, CRM, WhatsApp, AI processing, processors, retention, access and notices.
5. **Consent:** Contact-about-enquiry consent must not include optional promotional subscription. Promotional email/SMS obligations and unsubscribe handling need separate legal review if marketing is ever added. Do not introduce newsletter opt-in as a default.
6. **Accessibility:** Confirm applicable Israeli website obligations, exemptions and an accurate statement. Accessible development and testing are required; do not claim reviewed compliance before verification.
7. **Consumer law:** B2C distance-selling, disclosure, cancellation, price and contract consequences require legal review **if relevant** to the actual transaction model. No unsupported legal promise or boilerplate.
8. **Terms:** Legacy terms reportedly reflected automation-only services and a December 2024 update. Replace/review for actual scope, operator identity, project boundaries, intellectual property, third-party costs, support, change control and consumer rules; legal text `TBD`.
9. **Commercial language:** Source recommends free first meeting and potentially paid deeper specification. Confirm these offers and any in-person geography/availability prior to launch. Do not promise guaranteed outcomes, timelines or instant replies.
10. **SEO/measurement:** Source lists potential keyword themes but explicitly lacks verified traffic/volume rankings. Do not create shallow article inventory or claim search performance. SEO metadata **in Part J** is the approved proposed copy, not validated search results.

## 12. Missing Information and Required Decisions

| Decision / missing fact | Blocking impact | Status |
|---|---|---|
| Legal/name/domain clearance; final brand and owned domain | Public brand launch, site identity, canonical URLs | **TBD — high priority** |
| Real full name, approved portrait, bio, experience, professional links, relevant location | About factual block and genuine trust indicators | **TBD — high priority** |
| Actual email, phone, enquiry recipient, WhatsApp number and approved public contact details | Contact methods, routing, privacy, anti-spam | **TBD — high priority** |
| Lead form receiving/storage mechanism, validation specifics, security, retention, failure feedback | Genuine working enquiries and lawful handling | **TBD — high priority** |
| Calendar/booking mechanism and URL; real time slots; meeting channel and location rules | “לקביעת פגישת היכרות” can mean real booked time or enquiry request | **TBD — high priority** |
| Confirmation of free 20–30 min fit meeting, in-person option and paid scoping model | Accuracy of process and FAQ claims | **TBD — high priority** |
| Current valid privacy policy, terms and accessibility statement, legal applicability/reviews | Safe/legal launch and footer link destinations | **TBD — high priority** |
| Final page routes, redirects from existing pages, live deployment settings | Working sitemap, navigation, SEO | **TBD after repository audit** |
| Exact handling of mixed contact input (phone **or** email), optional budget data, consent record | Accessible, precise form behavior | **TBD** |
| Approved error/loading/validation text, and server-side delivery failure process | No fabricated approval-language or false success | **TBD** |
| Verified case studies, logos, specific claims, photos and usage permission | Optional trust expansion; **not needed** to invent for v1 | **TBD / omit pending proof** |
| Analytics/cookies/tool providers, lawful basis and consent mechanisms | Optional instrumentation | **TBD** |
| Color, type, layouts, motion, design tokens, framework | Design/build choices, **not research-established** | **Leave to skill + existing codebase** |

**Source tensions to preserve (not silently settle):**

- Part I lists a conceptual home funnel with a somewhat different sequence from Part J; **Part J exact content order governs page building**, while earlier funnel remains background rationale.
- Earlier CTA examples include **לקביעת פגישה** and **שלחו לי את הבעיה בוואטסאפ**; Part J uses **לקביעת פגישת היכרות** in the primary header and most pages, **לקביעת פגישה** in footer. Keep those context-specific wordings; WhatsApp is conditional, not part of the final provided page-copy block.
- Discovery meeting is presented as **free** in public copy, while full specification may be **paid**; do not conflate the two. Business/operational confirmation is outstanding.
- Primary conversion = **meeting booked**, but only a **contact request** is defined in full. No calendar system or scheduling URL is verified. A working request flow is an interim path, **not** a fabricated completed booking.
- The proposed name **Bottomline** appears throughout the source's ready-to-publish copy even though clearance is outstanding. Preserve draft wording, then update everywhere consistently **only after an actual approved brand decision**.
- The research includes optional future blog/case-study ideas but no complete approved article/case-study copy: **not** required launch pages and must not be invented.

## 13. Implementation Acceptance Criteria

- [ ] Seven required pages plus the shared shell exist, in Part J's **exact** ordered section structure; only final route mapping may differ after codebase inspection.
- [ ] **Every** Part J customer-facing Hebrew string is rendered in the correct context without inadvertent rewriting, including Home's six FAQ answers, form labels/placeholders/option values, consent, success text, CTA labels, meta titles/descriptions and footer.
- [ ] Both B2B and B2C routes are equally discoverable from Home/navigation and lead to working conversion flows.
- [ ] Problem-first hero, technology-neutral philosophy and transparent discovery narrative are intact; service capabilities appear beneath problem recognition.
- [ ] All CTA and internal links lead to real, intended destinations; nothing points to invented URLs or dead routes. If booking is not integrated, user is taken to a working contact request rather than being shown fictitious appointment confirmation.
- [ ] Contact required fields validate; optional fields remain optional; service-enquiry consent is clear and separate from marketing. Errors are accessible and do not claim success.
- [ ] The exact Part J success confirmation appears **only after** verified successful submission; missing backend blocks production-ready form claims.
- [ ] Site is usable on mobile/desktop; RTL, mixed Hebrew/Latin, keyboard access, focus states, form semantics, responsive nav and FAQ are verified.
- [ ] All exact Part J page metadata is present; only verified domain and approved canonical/indexing configuration are used.
- [ ] No fabricated statistics, reviews, projects, staff credentials, operator identities, legal notices, booking endpoints, contact details or analytics claims.
- [ ] Existing brand/legal/contact issues are resolved before public launch; approved privacy, terms and accessibility links are functional and accurate, or launch remains blocked.
- [ ] Site architecture and styling are selected from actual codebase constraints and design judgment, not attributed falsely to the research.
- [ ] Every `TBD` is either resolved by a documented owner decision or explicitly flagged as a launch blocker/nonimplemented optional enhancement. No placeholder identity/legal form copy is silently published as verified truth.

**Copy QA method used to produce this brief:** Part J's block beginning at `### Global navigation and footer` and ending immediately before `## Legal/regulatory priorities and implementation roadmap` is reproduced below Section 7 verbatim, with page-level implementation guidance stored separately. No approved page copy has been rewritten to condense the document.

