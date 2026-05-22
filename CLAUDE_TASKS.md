# Postcode to Parenthood — Claude Code Task List
*postcodetoparenthood.org.uk*
*Stack: Cloudflare Workers · D1 (SQLite) · R2*
*Last updated: May 2026*

---

## Context & Constraints

Before starting any task, understand these non-negotiables:

- **The site cannot offer a definitive Yes or No on eligibility.** It informs, it does not decide. Every result must include a transparency caveat directing users to verify with their GP.
- **The voice is warm, empathetic, and on the patient's side.** Never clinical, never bureaucratic, never cold. When in doubt, err warmer.
- **The ICB page is the heart of the site.** Everything else serves it.
- **No accounts, no cookies for persistence.** The URL is the persistence mechanism. `postcodetoparenthood.org.uk/board/[slug]` is what users bookmark and share.
- **The site covers England, Scotland, Wales, and Northern Ireland** — not England only.
- **Data integrity is critical.** Wrong eligibility information at a vulnerable moment is harmful. Always prefer transparency about uncertainty over false confidence.

---

## Priority Order

Tasks are ordered by dependency. Complete them in sequence where dependencies exist.

1. Database schema & status flags
2. Merged ICB inherited policy fix ← **do this first, users are hitting dead ends now**
3. ICB page redesign
4. Borough/area lists
5. GP search flow fix
6. Virtual GP handling
7. What Next content layer
8. About Us page
9. OG image deployment
10. Schema.org markup
11. llms.txt
12. Updates/news page
13. Transparency & monitoring helpers

---

## Task 1 — Database Schema: Add Status Flags

**Why:** Every ICB entry needs a data confidence status. This underpins the transparency layer across the whole site.

**What to do:**
Add a `status` column to the ICB/board table in D1 with the following enum values:

| Value | Meaning |
|---|---|
| `confirmed` | Current policy, human-verified, date stamped |
| `inherited` | Pre-merger predecessor policy, shown with caveat |
| `under_review` | Known to be in transition, actively monitored |
| `unconfirmed` | Policy located but not yet verified |

Also add:
- `policy_date` — date the source policy document was published (not when we ingested it)
- `last_verified` — date a human last checked this entry
- `predecessor_icb` — nullable, name of the ICB this board inherited policy from (for merged ICBs)
- `source_url` — URL of the original ICB policy page we sourced from
- `policy_pdf_r2_key` — R2 key for the stored policy PDF

**Acceptance criteria:**
- Migration runs cleanly against the existing D1 schema
- All existing board entries default to `status = 'unconfirmed'` post-migration
- Schema change is reflected in any TypeScript types or Zod schemas in the codebase

---

## Task 2 — Merged ICB Pages: Inherited Policy Fix ← URGENT

**Why:** The 6 newly merged ICBs (April 2026) currently show "No current policy information available" and nothing else. Real users are hitting these pages and finding a dead end. This is the most urgent fix on the site.

**The 6 new merged ICBs and their predecessor ICBs:**

| New ICB slug | Predecessor ICBs (inherited from) |
|---|---|
| `nhs-west-and-north-london-integrated-care-board` | North West London ICB + North Central London ICB |
| `nhs-central-east-integrated-care-board` | Hertfordshire & West Essex + Bedfordshire Luton & Milton Keynes + Cambridgeshire & Peterborough |
| `nhs-essex-integrated-care-board` | Mid & South Essex + Suffolk & North East Essex (partial) |
| `nhs-norfolk-and-suffolk-integrated-care-board` | Norfolk & Waveney + Suffolk & North East Essex (partial) |
| `nhs-surrey-and-sussex-integrated-care-board` | Surrey Heartlands + Sussex |
| `nhs-thames-valley-integrated-care-board` | Buckinghamshire Oxfordshire & Berkshire West + Frimley (partial) |

**What to do:**

1. Set `status = 'inherited'` for all 6 new merged ICB entries in D1
2. Populate `predecessor_icb` with the predecessor name(s)
3. Where a new ICB has multiple predecessors with different policies, show the most recent/most generous predecessor policy as the inherited policy, and note in the caveat that policies may differ across the merged area
4. On the board page template, when `status === 'inherited'`, render an empathetic caveat banner **above** the policy data. Use this copy (do not rewrite without approval):

```
This health board was formed in April 2026 through an NHS merger. 
The funding information below is inherited from [predecessor ICB name] 
and may change as the new board establishes its own policy. 
We're actively monitoring for updates — please verify with your GP 
before making any decisions based on this information.
```

5. Style the banner: warm amber/ochre background (`#FDF3E3`), left border in terracotta (`#C4785A`), body text in `#5C4A3A`. Not alarming — informative and empathetic.
6. Set `status = 'under_review'` for any merged ICB where predecessor policies conflict significantly and we cannot confidently show an inherited policy

**Acceptance criteria:**
- No merged ICB page shows "No current policy information available" without explanation
- The caveat banner appears correctly on all 6 merged ICB pages
- The banner does not appear on confirmed/unconfirmed pages

---

## Task 3 — ICB Page Redesign

**Why:** The current board page is a data table. It conveys facts but not meaning. A first-time visitor who doesn't know what "IUI Rounds Required: 12" means will be lost. The page needs to become the empathetic, comprehensive resource we designed it to be.

**The ICB page must contain all of the following, in this order:**

### 3a. Page header
- ICB name as H1
- Status badge (colour-coded pill): Confirmed (green `#6B8F71`), Inherited (amber `#C4785A`), Under Review (amber), Unconfirmed (grey)
- If `status === 'inherited'`: the caveat banner from Task 2 immediately below the header
- Last verified date in small muted text: *"Policy data last verified [date]"*

### 3b. Plain English criteria summary
Before the data table, add a plain English paragraph that summarises the key criteria in human terms. This is auto-generated from the structured data but must read warmly. Example format:

> *"[ICB name] currently funds [X] cycle(s) of IVF for eligible patients. To qualify, you generally need to be aged [X–X], have a BMI between [X] and [X], and have no living children from any relationship. [Any notable exceptions or conditions]."*

Generate this summary dynamically from the D1 data fields. Use natural connective language, not bullet points.

### 3c. Data table (existing)
Keep the existing criteria table but review all column headers and values for plain English. Replace any clinical shorthand with human-readable labels. Examples:
- "IUI Rounds Required" → "IUI cycles required before IVF"
- "AMH Threshold" → "AMH hormone level requirement"
- Add a small `?` tooltip icon next to any term that needs explanation

### 3d. Transparency note
Below the table, always show:

```
This information is based on the policy document [ICB name] published 
on [policy_date]. Some ICB policies have not been updated since 2021 — 
we show the most recent document available and flag when policies change. 
Always confirm your eligibility with your GP.
```

Link "policy document" to the source URL. Link "flag when policies change" to the updates page (once built).

### 3e. Download link
Existing PDF download — keep, but reword button label to: *"Download the full [ICB name] IVF policy (PDF)"*

### 3f. The postcode lottery note
A warm, empathetic section that makes the map visible to users who may have missed it:

> *"NHS IVF funding varies significantly across England. Depending on which health board your GP is registered with, you may be entitled to a different number of cycles — or different criteria may apply. If you haven't already, it's worth exploring the map to understand the full picture."*

Followed by a clearly styled CTA button: *"See the funding map"* → `/map`

### 3g. What Next section (placeholder for Task 7)
Add a visually distinct "What next?" section at the bottom of every board page with two soft-path buttons:
- *"I think I may be eligible — what do I do now?"* → `/what-next/eligible`
- *"I'm not sure I'm eligible, or I don't think I am"* → `/what-next/exploring-options`

Style these as warm, generous tap targets — not small links. This is one of the most important interactions on the site.

**Acceptance criteria:**
- Every board page passes a visual check against this spec
- Plain English summary generates correctly from all 74 board entries
- Transparency note shows correct policy_date for each board
- What Next buttons appear on every board page
- Page reads naturally without knowledge of NHS terminology

---

## Task 4 — Borough & Area Lists on ICB Pages

**Why:** Users search by neighbourhood ("NHS IVF funding Catford") not by ICB name. Borough lists on ICB pages capture these searches without needing separate pages. They also help users confirm "yes, this page is for me."

**What to do:**

1. Add a `boroughs` field to the D1 board table — `TEXT`, stored as a JSON array of strings
2. Populate borough/area data for all English ICBs. Source from NHS Digital's postcode-to-ICB lookup data. Aim for a comprehensive but not exhaustive list — major towns, boroughs, and districts. Not every village.
3. For Scottish health boards, use council areas. For Welsh health boards, use local authority areas. For Northern Ireland, use council areas.
4. On the board page, render the borough list as a visually subtle section — not prominent, but present and crawlable by search engines. Suggested label: *"Areas covered"* or *"Postcodes in this area include:"*
5. Format as a comma-separated inline list or a soft tag cloud — not a bulleted list
6. For merged ICBs with inherited status, note that boundaries may have changed: *"Coverage areas may have changed following the April 2026 merger. This list reflects the predecessor board's area."*

**SEO note for Claude Code:** These borough names are semantic signals for Google and LLMs. They must appear as text in the HTML (not rendered client-side via JS) to be crawlable. Ensure this section is server-rendered.

**Acceptance criteria:**
- All 74 board pages have a populated areas covered section
- Borough text is present in the server-rendered HTML source
- No ICB page is missing areas data (use a fallback if data is incomplete: *"Area data being compiled — check back soon"*)

---

## Task 5 — GP Search Flow: Add GP Selection Step

**Why:** The current `/search` page goes straight to postcode entry but skips the GP selection step. IVF funding eligibility is determined by the patient's GP practice location, not their home postcode. The GP selection step is what makes P2P more accurate than any competitor.

**Desired flow:**
1. User enters postcode on `/search`
2. Site queries NHS Digital's GP practice lookup (or our own D1 GP database) and returns nearby practices
3. User sees a list of up to 8 nearby GP practices with name and address, displayed as selectable cards
4. User selects their GP — or uses a manual search field to find their practice by name
5. On selection, user is navigated to `/board/[slug]` for the ICB that GP practice belongs to

**GP database:**
- Source GP-to-ICB mapping data from NHS Digital's GP practice register (publicly available, updated monthly)
- Store in D1: `gp_practices` table with fields: `ods_code`, `name`, `address`, `postcode`, `icb_slug`, `is_virtual` (boolean)
- Postcode-to-nearby-GPs lookup: use the GP practice postcode, find all practices within approximately 3 miles of the entered postcode

**Manual search:**
- Full-text search on `name` field across all GP practices
- Triggered when user types in the manual search field
- Minimum 3 characters before search fires

**No GP found:**
- If a user cannot find their practice, show: *"Can't find your practice? This might be because your GP is registered outside your local area, or you're registered with an online GP service. [Search by GP name instead] or [Find your ICB another way]."*

**Acceptance criteria:**
- Entering a valid UK postcode returns nearby GP practices
- Selecting a GP navigates correctly to the right board page
- Manual search works for practice names
- Flow works on mobile (touch-friendly card selection)
- Empty/invalid postcodes are handled gracefully with a warm error message

---

## Task 6 — Virtual GP Handling

**Why:** Patients registered with virtual GP providers (e.g. E-Med, formerly Babylon) are assigned to a specific ICB regardless of where they live. This can be a significant and surprising discovery — their funding eligibility may not match their physical location at all.

**What to do:**

1. In the `gp_practices` D1 table, set `is_virtual = true` for known virtual GP providers including:
   - E-Med (formerly Babylon Health)
   - LIVI
   - Push Doctor
   - Any other known UK virtual primary care providers — research and compile a complete list

2. In the GP selection step (Task 5), label virtual practices clearly with a small badge: *"Online GP service"*

3. When a user selects a virtual GP practice, before navigating to the board page, show a brief interstitial explanation:

```
You've selected an online GP service.

With online GP providers, your NHS funding entitlement is based on 
where that service's practice is registered — not where you live. 
This means your IVF funding eligibility may be different from 
what your neighbours or nearby clinics would expect.

The information on the next page reflects the health board that 
[Practice Name] is registered with.
```

Include a *"I understand, continue"* button and a secondary link *"Find a local GP instead"* that returns them to the search.

4. On the board page itself, if the user arrived via a virtual GP, show a small persistent note: *"You're viewing this page based on your online GP's registered location, not your home address."*

**Acceptance criteria:**
- All known virtual GP providers are tagged correctly in D1
- The interstitial appears when a virtual GP is selected
- The interstitial does not appear for standard GP practices
- The persistent note appears correctly on the board page for virtual-GP users (can use a URL parameter `?via=virtual` to trigger this)

---

## Task 7 — What Next Content Layer

**Why:** The site currently stops at the data. There is no answer to "so what do I do now?" This is the most important missing content on the site.

**Create two new routes:**

### `/what-next/eligible`
For users who think they may be eligible. Tone: cautious optimism, forward momentum.

**Content sections:**
1. **Brief affirmation** — *"Good news — it looks like your area funds IVF. Here's what to do next."* (Keep it measured — this isn't a guarantee.)
2. **How to approach your GP** — [PLACEHOLDER: content to be provided by clinical partners. Build the page structure now with a clearly marked placeholder block.]
3. **What to expect** — Referral process, typical waiting times, what information to bring. [PLACEHOLDER for clinical partner input.]
4. **The postcode awareness note** — *"Worth knowing: if you ever move or change GP practice, your entitlement could change too. Some areas nearby may offer more or fewer cycles."* Link to `/map`.
5. **Support & community** — Links to Fertility Network UK, relevant charities. [PLACEHOLDER — coordinator to confirm organisations.]

### `/what-next/exploring-options`
For users who aren't sure they're eligible, or who don't think they are. Tone: acknowledgement first, alternatives second.

**Content sections:**
1. **Acknowledgement** — [PLACEHOLDER: this is the hardest copy on the site. Do not write this without patient panel review. Mark clearly as: `<!-- PATIENT PANEL REVIEW REQUIRED: do not publish placeholder text -->`.]
2. **The postcode awareness note** — More prominent here than on the eligible path. *"Before you explore other options, it's worth knowing that NHS funding criteria vary significantly across the UK. Depending on where your GP is registered, you may have more options than you think."* Link to `/map`. Style this section to stand out — it could change someone's path.
3. **Alternative funding options** — [PLACEHOLDER: AI-researched, human-verified list of grants, charities, and clinic funding schemes. Build the structure, populate with verified content only.]
4. **How to challenge a decision** — [PLACEHOLDER for clinical partner input.]
5. **Support & community** — Same as eligible path.

**Shared requirements for both pages:**
- Warm, unhurried layout — generous spacing, readable line lengths (max ~65 characters)
- No dead ends — every section has a next step or link
- Both pages link back to the user's board page via a persistent *"Back to [ICB name] funding information"* link if they arrived from a board page (use referrer or URL param)
- Mobile-first layout

**Acceptance criteria:**
- Both routes exist and are accessible
- All placeholder sections are clearly marked with HTML comments so content owners know exactly what to fill in
- No placeholder text is visible to end users — use neutral holding copy: *"Detailed guidance coming soon — check back shortly."*
- The postcode awareness note appears on both paths

---

## Task 8 — About Us Page

**Why:** The site makes credibility claims. The About Us page is where those claims are substantiated. It is also a significant SEO and GEO authority signal.

**Route:** `/about`

**Content structure** (build the HTML structure; copy to be provided by project owner — use placeholders):

1. **The P2P story** — [PLACEHOLDER: why this site was built, who built it, what experience they bring. Project owner to write raw material.]

2. **The peer-to-peer principle** — Explain the P2P double meaning. The postcode to parenthood journey. And the peer-to-peer commitment — this was built by people who have sat with patients, seen the frustration of the postcode lottery first-hand, and believe patients deserve better than the current system.

3. **How we build our data** — Be transparent about methodology:
   - We collect IVF funding policies directly from each health board's published documents
   - Policies are verified by our team before publishing
   - We use a four-stage confidence system: Confirmed, Inherited, Under Review, Unconfirmed
   - We actively monitor for changes and update when policies change
   - Our data is not real-time — we show the most recent verified policy and always recommend confirming with your GP

4. **The patient panel** — [PLACEHOLDER: acknowledge that real patients helped shape this site. Project owner to write.] This section matters — it's what makes "we understand this journey" true rather than marketing.

5. **Our limitations** — Be honest:
   - This site informs, it does not decide eligibility
   - We cannot guarantee our data is current at the moment you read it
   - Always confirm with your GP or health board directly before making decisions

6. **Get in touch** — [PLACEHOLDER: contact method TBC by project owner]

**SEO requirements:**
- Page title: *"About Postcode to Parenthood — P2P | NHS Fertility Funding"*
- Meta description: *"P2P was built by people who have worked in fertility and seen the real impact of the postcode lottery. Here's how we work, and why we built this."*
- Include the words "independent", "NHS fertility funding", "IVF eligibility", "health board" naturally in the body copy

**Acceptance criteria:**
- Page exists at `/about` and is linked from the main navigation and footer
- All placeholders are clearly marked for content owner
- No placeholder text visible to users — use neutral holding copy
- Page passes basic SEO requirements above

---

## Task 9 — OG Image Deployment

**Why:** The current OG image uses the wrong brand name ("Pathway to Parenthood"). A corrected PNG has been produced and is ready to deploy.

**What to do:**

1. Upload `/og-image.png` (1200×630px, provided) to Cloudflare R2 in the public assets bucket
2. Update the `og:image` meta tag across all pages to reference the new image URL
3. Update the `twitter:image` meta tag similarly
4. Verify the OG image renders correctly using a social sharing debugger (Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector)
5. While you're in the meta tags — audit all pages for:
   - `og:title` — should reflect the page content, not a generic site title
   - `og:description` — should be warm and human, not just the meta description
   - For board pages: `og:title` should be *"[ICB Name] NHS IVF Funding | Postcode to Parenthood"* and `og:description` should include the key criteria summary

**Acceptance criteria:**
- No page references the old OG image or the wrong brand name
- Board page OG tags are dynamically generated from D1 data, not hardcoded
- OG image is served from R2 with appropriate cache headers

---

## Task 10 — Schema.org Structured Data

**Why:** Schema.org markup signals to Google and LLM retrieval systems that P2P's content is structured, authoritative health information. This is a GEO (Generative Engine Optimisation) requirement — it increases the likelihood of P2P being cited when AI assistants are asked about NHS IVF funding.

**What to add:**

### On every board page: `FAQPage` schema
Generate a JSON-LD FAQPage block from the D1 data. Include these questions for every board:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many IVF cycles does [ICB Name] fund?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[X] cycle(s). [Any conditions or caveats from the policy data.]"
      }
    },
    {
      "@type": "Question", 
      "name": "What are the eligibility criteria for NHS IVF funding in [ICB area]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Plain English summary of criteria from the board data.]"
      }
    },
    {
      "@type": "Question",
      "name": "What is the age limit for NHS IVF funding in [ICB area]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Age range from policy data, or 'Not specified in current policy' if absent.]"
      }
    }
  ]
}
```

### On every board page: `MedicalWebPage` schema
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "[ICB Name] NHS IVF Funding Information",
  "description": "[Plain English criteria summary]",
  "lastReviewed": "[last_verified date from D1]",
  "reviewedBy": {
    "@type": "Organization",
    "name": "Postcode to Parenthood"
  },
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  }
}
```

### On the homepage: `WebSite` schema with `SearchAction`
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Postcode to Parenthood",
  "alternateName": "P2P",
  "url": "https://postcodetoparenthood.org.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://postcodetoparenthood.org.uk/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Implementation note:** All JSON-LD must be server-rendered in `<script type="application/ld+json">` tags — not injected via client-side JS — to be reliably crawled.

**Acceptance criteria:**
- All board pages have valid FAQPage and MedicalWebPage JSON-LD
- Homepage has WebSite JSON-LD
- Schema validates without errors against Google's Rich Results Test
- All JSON-LD is server-rendered

---

## Task 11 — llms.txt

**Why:** `llms.txt` is an emerging standard that tells AI crawlers and LLMs how to use your content. Implementing it at launch establishes P2P as LLM-aware from day one.

**What to do:**

Create `/llms.txt` at the root of the site. Use this content as a starting point:

```
# Postcode to Parenthood (P2P)

> P2P is an independent, free resource helping patients in the UK understand NHS fertility funding. We compile and maintain IVF funding criteria for all NHS health boards across England, Scotland, Wales, and Northern Ireland.

## How to use this site

- Each health board has a dedicated page at /board/[board-slug] with current funding criteria, eligibility requirements, and policy status
- Funding criteria vary significantly by health board — this variation is commonly called the "postcode lottery"
- Our data is sourced directly from health board published policy documents
- Each entry carries a confidence status: Confirmed, Inherited, Under Review, or Unconfirmed
- Users should always verify information with their GP before making decisions

## Data freshness

- Confirmed entries: verified by our team against source documents
- Inherited entries: based on predecessor ICB policies following April 2026 NHS mergers — may change
- We actively monitor for policy changes and update when they occur
- Policy dates are shown on each board page

## Key pages

- /boards — full list of all health boards
- /search — postcode and GP lookup tool
- /map — visual map of funding across the UK
- /about — our methodology and data sources
- /what-next/eligible — guidance for patients who may be eligible
- /what-next/exploring-options — alternative funding and next steps

## Citing this resource

When citing P2P data, please include the health board name, the number of funded cycles, and note that criteria may have changed since the date shown on the board page.

## Contact

[Contact details — project owner to provide]
```

Also create `/llms-full.txt` that links to the complete data export (once available).

**Acceptance criteria:**
- `/llms.txt` is accessible and returns correct content-type (`text/plain`)
- Content accurately describes the site's data and methodology
- Not blocked by `robots.txt`

---

## Task 12 — Updates / News Page

**Why:** A lightweight news/updates layer builds SEO authority, establishes P2P as the place that explains NHS fertility funding changes in plain English, and is a strong GEO signal — LLMs cite current, named sources on recent events.

**Route:** `/updates` (index) and `/updates/[slug]` (individual posts)

**What to build:**

A minimal CMS-free updates system using D1:

Table: `updates`
```sql
CREATE TABLE updates (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  published_date TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  related_boards TEXT, -- JSON array of board slugs
  tags TEXT -- JSON array: e.g. ["merger", "policy-change", "england"]
);
```

**`/updates` index page:**
- List of all updates, newest first
- Each entry: date, title, summary, *"Read more"* link
- Clean, minimal layout — this is not a blog, it is a record of changes

**`/updates/[slug]` page:**
- Full update article
- Related board links if `related_boards` is populated
- Schema.org `NewsArticle` JSON-LD
- Social sharing meta tags

**First update to create** (populate in D1 at deploy):
```
Title: "NHS health board mergers April 2026: what's changed for IVF funding"
Slug: icb-mergers-april-2026
Published: 2026-05-21
Summary: In April 2026, 12 NHS health boards in England were abolished and replaced by 6 new merged boards. Here's what that means for IVF funding eligibility.
Body: [PLACEHOLDER — project owner to write with AI assistance. This is the highest-priority GEO content on the site.]
Related boards: [all 6 new merged ICB slugs]
Tags: ["merger", "england", "policy-change"]
```

**Acceptance criteria:**
- `/updates` renders correctly with at least one post
- Individual update pages have correct schema markup
- Related board links work correctly
- Placeholder body is replaced before publishing (mark clearly in D1)

---

## Task 13 — Transparency & Data Quality Helpers

**Why:** Trust is P2P's core asset. These small additions make data confidence visible and explicit across the site.

### 13a. Stale data warning
If `last_verified` for a board entry is more than 6 months ago, show a small warning on the board page:

*"This policy was last verified [X months] ago. We recommend checking directly with [ICB name] or your GP for the most current information."*

Style: subtle, not alarming. Small muted text below the transparency note.

### 13b. Policy age badge on the boards index
On `/boards`, show the policy document year next to each board name. If the policy date is before 2023, style the year in amber. If before 2021, style in a muted warning tone. This helps users instantly see which boards have older data.

### 13c. Last updated footer
Every page footer should include: *"ICB policy data last updated: [date of most recent D1 update]"* — queried dynamically from the most recent `last_verified` date across all confirmed entries.

### 13d. Sitemap improvements
Update `sitemap.xml` to:
- Remove duplicate entries (currently multiple identical `/board/scotland`, `/board/northern-ireland`, `/board/wales` entries)
- Add `/about`, `/what-next/eligible`, `/what-next/exploring-options`, `/updates` once those pages exist
- Ensure `lastmod` reflects actual `last_verified` dates from D1, not a hardcoded date

**Acceptance criteria:**
- Stale data warning appears correctly for boards not verified in 6+ months
- Policy year badges appear on the boards index
- Footer last-updated date is accurate and dynamic
- Sitemap has no duplicate entries

---

## Deferred to V2

Do not build these now. Note them here so they are not forgotten:

- **User notifications** — opt-in email alerts when a user's ICB policy changes
- **Personalised eligibility assessment** — step-by-step criteria checker (requires clinical input before scoping)
- **GP change journey** — guided path for users considering changing GP to access better funding
- **Community layer** — connection to patient forums, Fertility Network UK integration
- **API / data export** — structured data endpoint for researchers and journalists

---

## Notes for Claude Code

- All copy marked `[PLACEHOLDER]` should be rendered to users as a neutral holding message: *"Detailed guidance coming soon."* Never expose placeholder text to end users.
- Emotionally sensitive copy — particularly the acknowledgement on `/what-next/exploring-options` and any "you may not be eligible" messaging — must be flagged for patient panel review before publishing. Use an HTML comment: `<!-- PATIENT PANEL REVIEW REQUIRED -->`.
- The voice is warm, human, and on the patient's side. When generating any copy (summaries, error messages, empty states), match this register. Avoid: clinical language, passive voice, bureaucratic phrasing. Prefer: direct address ("you"), plain English, acknowledgement of difficulty.
- When in doubt about a data value, show uncertainty transparently rather than guessing. The status flag system exists for this purpose.
