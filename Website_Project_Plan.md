# IVF NHS Funding Website — Project Plan
*AI Fluency Framework: Delegation Exercise*
*Last updated: May 2026*

---

## Project Vision

A website for people at the very start of their NHS IVF funding journey in England. It meets them where they are — knowing nothing — and walks them through how funding works, what their ICB likely offers, what criteria they need to meet, and what to do next if NHS funding isn't available to them.

It is honest about uncertainty and the postcode lottery, empathetic about the emotional weight of that, and speaks with the authority of people who have worked in fertility and seen this up close.

**It is a partner, not a tool.**

### What success looks like
Someone lands on the site knowing nothing. They leave understanding how NHS IVF funding works in England, what their local ICB's criteria likely are, what their realistic chances look like, and — whatever the answer — they know exactly what to do next. They feel informed, not judged, and not alone.

### What makes this valuable and meaningful
- The postcode lottery is real, complex, and emotionally devastating for many patients. This site makes it visible, navigable, and less isolating.
- The site has a point of view: the system is complicated and sometimes unfair, and patients deserve better. That credibility — lived and professional — is the site's most valuable asset.
- It is a multiple-visit tool. Someone may return after a GP appointment, after discussing with a partner, or when their ICB's policy changes.

### Product Evolution
- **V1** — Informational site, postcode tool, shareable ICB pages, GP guides, alternative funding
- **V2** — Opt-in notifications when ICB policy changes
- **V3** — Community layer, deeper integration with organisations like Fertility Network UK

---

## Key Design Decisions

### The site cannot offer a definitive Yes or No
It informs patients of the likelihood of funding and the criteria they must meet. It is transparent about this limitation — and that honesty is itself an act of empathy.

### The shareable ICB page is the heart of the site
Every ICB has its own permanent, linkable page (e.g. `yoursite.com/icb/north-central-london`). This is what gets shared with partners, bookmarked for return visits, and referenced in GP appointments. No accounts required — the URL is the persistence mechanism.

### The map changes everything
The postcode tool visualises the funding landscape, not just the user's own ICB. Users can see neighbouring ICBs and their policies — making the postcode lottery viscerally real. This must be framed with great care and empathy.

### ICB Status Flags
Every ICB entry carries a status to reflect data confidence:
- **Confirmed** — current policy, verified and dated
- **Inherited** — pre-merger predecessor policy, shown with empathetic caveat
- **Under review** — known to be in transition, actively monitored
- **Unconfirmed** — policy located but not yet verified

### The "you may not be eligible" moment
The hardest piece of writing on the site. Must be written collaboratively, checked by the patient review panel, and iterated until it feels right. Never drafted by AI alone.

---

## ICB Landscape (May 2026)

As of 1 April 2026, NHS England completed Phase 1 of ICB mergers:
- **12 ICBs abolished**, replaced by **6 new ICBs** (plus 1 boundary widening)
- Affected regions: **London, East of England, South East**
- Further mergers expected **summer 2026**, taking effect **April 2027**

**Implication for the site:** The baseline of 42 ICB policy documents remains valid until new policies are published. Newly merged ICBs will show inherited policies with a clear caveat. Locating new policy pages for merged ICBs is an active task.

---

## Major Tasks & Delegation Decisions

---

### Task 1: Research & Content

**What this involves:**
Gathering, structuring, and maintaining accurate IVF funding criteria for all ICBs in England — including newly merged organisations whose policies may be in flux.

**Three sub-tasks:**

#### 1a. Baseline Structuring
Extracting and organising the existing 42 ICB policy documents into structured, usable data.
- **AI-led:** bulk extraction, structuring, formatting
- **Human-verified:** every entry checked against source documents before publishing
- **Human strength:** domain knowledge to catch errors that would mislead patients

#### 1b. Merger Mapping
Identifying the 12 abolished ICBs, tracking their successor organisations, and locating new policy pages as they are published.
- **Collaborative:** AI monitors public sources and new ICB websites; human judgement decides what is reliable enough to publish
- **Human strength:** understanding of NHS organisational structures, ability to distinguish policy changes from formatting changes
- **Note:** This is an active, ongoing task — new policies will emerge unpredictably

#### 1c. Ongoing Monitoring
A hybrid system to detect policy changes across all active ICB pages.
- **AI-led:** automated web monitoring tools (e.g. Visualping, ChangeTower) watching ICB pages and triggering alerts
- **Human-led:** reviewing alerts, verifying changes, updating the site
- **Human strength:** distinguishing genuine policy changes from administrative updates; judgement on what to publish
- **Future:** industry network contacts as a second intelligence layer, particularly for newly merged ICBs

**Uniquely human in this task:** verification, reliability judgement, accountability for what is published, industry network intelligence

**AI strength in this task:** bulk extraction, structuring, monitoring at scale across 36+ ICB websites simultaneously

---

### Task 2: Site Architecture & UX

**What this involves:**
Designing how someone moves through the site — from knowing nothing to feeling equipped — across multiple visits and emotional states.

**User journey:**
1. First visit — orientation, postcode tool, ICB results, map
2. Return visit — straight to ICB page, GP guide, next steps
3. Sharing — shareable link sent to partner or saved for GP appointment

#### Information Architecture
- **Collaborative:** AI proposes structures, human validates against emotional understanding of the user journey
- Three layers: Orientation → The Tool → What Next

#### Rapid Prototyping & Mockups
- **AI-led:** generates visual options quickly and iteratively
- **Human role:** expert client and emotional gut-check, not technical UX designer
- **Feedback model:** honest human reactions ("this feels cold", "I wouldn't know where to start") are more valuable here than technical UX knowledge

#### The ICB Page Design
- **AI generates** multiple approaches
- **Patient contacts test** against real emotional responses
- **Iterated** based on genuine feedback until it feels right

#### Shareable URL Structure
- Simple, permanent ICB pages: `yoursite.com/icb/[icb-name]`
- No accounts, no cookies — the URL is the persistence mechanism
- Newsletter/notification signup as a future feature, earned through trust

**Uniquely human in this task:** emotional gut-check on every design decision, access to real patient testers, final approval on what feels right

**AI strength in this task:** speed of iteration, breadth of visual options, translating emotional requirements into structural and visual solutions

---

### Task 3: Writing & Tone of Voice

**What this involves:**
Creating the words the site speaks — across every page, every emotional moment, every functional element.

**The voice:** Warm, informed, honest about the system's flaws, firmly on the patient's side. Credible because of lived and professional experience. A partner, not a tool.

**The tone of voice guide** will be derived from the language used in this planning process — phrases like "postcode lottery", "a partner not a tool", and the framing of the user's emotional state on arrival. This guide becomes the benchmark everything else is measured against.

#### Voice & Raw Material
- **Human-led:** the authentic perspective, industry credibility, and emotional truth must come from the people behind the site
- AI cannot invent this — and in this context, patients will feel the difference

#### Shaping & Polishing
- **AI-led:** takes human raw material and shapes it into consistent, well-crafted copy across the site
- Multiple versions generated quickly for human selection

#### Functional Writing
- **AI-led:** navigation labels, meta descriptions, button copy, status flag messaging, error states — on-brand but not worth human drafting time

#### The Hard Moments
- **Deeply collaborative:** the "you may not be eligible" moment, the postcode lottery map framing, the GP conversation guide
- **Patient review panel** reads every draft of emotionally sensitive content
- Nothing goes live on these moments without patient panel validation

#### Tone Consistency
- **AI-monitored:** every page audited against the agreed voice; clinical or bureaucratic drift flagged before publishing

**Patient Review Panel:** A core quality assurance mechanism — not a nice-to-have. Real people who have navigated this journey emotionally validate the writing, particularly at the hardest moments. Their involvement is also a legitimacy claim: when the site says "we understand this journey", the panel is what makes that true.

**Uniquely human in this task:** the authentic voice, lived experience, patient panel emotional checking, final judgement on all sensitive copy

**AI strength in this task:** consistency at scale, speed of iteration, multiple versions, catching clinical or bureaucratic drift

---

### Task 4: The Eligibility Tool

**What this involves:**
The interactive postcode and GP lookup tool that maps a user to their ICB and returns funding criteria, status, and surrounding ICB map.

**V1 Scope: Option A — ICB-level criteria only.** No personal assessment. The tool returns what the ICB offers and its general criteria. The user interprets whether they personally meet those criteria. Personalised eligibility checking is a future feature requiring clinical input before it exists.

**Tool flow:**
1. User enters postcode
2. Tool returns nearby GP practices as selectable options
3. User selects their GP — or searches manually if not listed
4. Tool maps GP practice to its ICB
5. ICB page loads — criteria, status flag, transparency note, map of surrounding ICBs

**Key decisions:**
- GP-level lookup (not postcode-only) eliminates boundary ambiguity and puts the user in control of the most accurate data point
- "Search manually" option is critical — users may be between GPs, or registered far from their home postcode
- Changing GP as a path to better funding eligibility is a future feature (V2+)

**Virtual GP handling (known edge case — V1):**
Providers like E-Med (formerly Babylon) are registered with a specific ICB regardless of where their patients live. These must be:
- Tagged in the GP database as virtual providers
- Clearly labelled in search results
- Accompanied by specific empathetic messaging explaining ICB determination by practice location, not home address
- Reviewed by patient panel — this can be a genuinely shocking discovery

**Transparency layer — on every result:**
Every result displays data source, publication date, and a clear caveat directing users to verify with their GP. Example:
*"This is based on the policy [ICB Name] published in [year]. We're actively monitoring for updates — but please verify with your GP before making any decisions."*

**Delegation:**
- **Postcode-to-GP mapping** — AI-assisted build using NHS Digital GP practice data; human verification of virtual provider tagging
- **GP-to-ICB mapping** — AI-assisted, built from Task 1 structured data; status flag system feeds directly into results
- **Tool flow & UX** — Collaborative design, AI builds, human and patient panel test
- **Virtual GP messaging** — AI drafts, patient panel reviews specifically
- **Transparency layer** — AI drafts, human approves tone

**Uniquely human:** identifying edge cases, emotional checking of surprising or difficult results, final judgement on what the tool should and shouldn't claim

**AI strength:** building and maintaining postcode/GP mapping database, handling lookup logic, generating result pages at scale

**Key risk:** the tool being wrong. Mitigated by transparency layer, status flag system, and GP verification nudge on every result.

---

### Task 5: "What Next" Content

**What this involves:**
The content layer that catches users after their ICB result — serving everyone regardless of what they found, across multiple emotional states.

**Important V1 constraint:** The tool does not determine eligibility — it returns ICB criteria only. "What Next" cannot branch on a verdict that doesn't exist. Instead, it offers two soft paths the user self-selects, respecting that they know their own situation better than the tool does.

**Two user-selected paths:**
- **Path A — "I think I may be eligible"** — cautious optimism, forward momentum, GP conversation guide, referral process, waiting list expectations
- **Path B — "I'm not sure / I don't think I'm eligible"** — acknowledgement first, alternatives second, support organisations third
- Neither path closes off the other — they are entry points, not silos

**The postcode message — appears on both paths:**
A critical second chance to surface the postcode/map information for users who may have missed it, or weren't ready to absorb it during the result moment.
- **Path A** — lighter touch, future awareness: *"Worth knowing — if you ever change GP practice, your eligibility could change too."*
- **Path B** — prominent and actionable, links back to the map: *"Before you explore other options, it's worth knowing that NHS funding criteria vary significantly by area. Some people find they have more options than they initially thought."*
- Patient panel reviews this language specifically — getting the tone wrong here (too pushy, or making someone feel foolish) would undermine the site's core purpose

**Content components and ownership:**

| Component | Owner | Dependency |
|---|---|---|
| GP conversation guide | Partners (clinical knowledge) + AI shapes | Partners must draft before AI polishes |
| Alternative funding options | AI research + human verification | Needs regular updating alongside ICB data |
| Support organisations | Coordinator + AI structures | Fertility Network UK and others to be confirmed |
| Postcode/map messaging | AI drafts, patient panel checks | Patient panel sign-off required |
| Waiting list guidance | Partners + AI | Clinical input needed |

**Content dependencies — coordinator assigned:**
- GP conversation guide sign-off from clinical partners
- Support organisation relationships (e.g. Fertility Network UK)
- Patient panel availability for emotional checking
- Regular review schedule for alternative funding options

**Uniquely human:** clinical knowledge for GP guide, emotional checking of disappointment moments, relationships with support organisations, judgement on what alternatives are genuinely worth signposting

**AI strength:** structuring the alternative funding landscape, consistency of tone across both paths, flagging when content drifts from empathetic voice, research into grant and charity funding options

---

### Task 6: Design & Build

**Brand Identity:**
- **Full name:** Postcode to Parenthood
- **Logo mark:** P2P — a play on peer-to-peer. Works on multiple levels simultaneously:
  - P2P = Postcode to Parenthood (literal)
  - Peer-to-peer = directness, no intermediary, human to human — cuts through the bureaucracy
  - Peers in the industry — alongside patients, not above them
  - Built by peers, for peers — the patient review panel are co-creators, not just testers
- **Logo usage:** P2P mark stands alone at small sizes (favicon, mobile, social). Full "Postcode to Parenthood" sits alongside when space allows.
- **Visual register:** Warm clinical. Unmind as a reference point, volume turned down. Stiller, more spacious, quieter. Calm rather than vibrant. More still — no carousels, no movement for movement's sake.
- **Typography:** Warm but precise. Human without being whimsical.
- **Colour:** Humanity without frivolity. To be developed through rapid prototyping.
- **Photography/imagery:** Real and intimate rather than aspirational stock.

**Technical Stack:**
- **Hosting:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite at edge) — ICB data, GP practice database, GP-to-ICB mapping
- **Storage:** Cloudflare R2 — ICB policy PDFs, downloadable documents
- **Logic:** Cloudflare Workers — postcode lookup, GP-to-ICB mapping, shareable URL routing
- **Rationale:** Edge delivery for low latency, read-heavy workload perfectly suited to D1, fully maintainable by one person with existing cloud/DevOps expertise

**Design process:**
- AI generates rapid prototypes and visual options iteratively
- Human acts as expert client and emotional gut-check — not technical UX designer
- Patient panel tests emotionally sensitive design moments
- Honest human reactions ("this feels cold", "I wouldn't know where to start") drive iteration
- Iteration continues until it feels right, not until it looks impressive

**Uniquely human:** brand instinct and final approval, emotional reaction to prototypes, patient panel visual testing, infrastructure ownership and maintenance

**AI strength:** rapid visual iteration, design consistency across pages, translating emotional brief into visual options, component and page building within the defined stack

---

### Task 7: SEO

**Core SEO advantage:**
Not keywords — data. A clean, accurate, regularly updated, human-verified database of IVF funding criteria for every ICB in England, with GP-level lookup and plain-English explanations. This data doesn't exist anywhere else in this form. Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) rewards exactly what P2P is built on.

**Competitive landscape:**
Current results for searches like "NHS IVF funding Lewisham" return NHS sites and ICB/ICS pages. These rank on domain authority alone — they don't serve patient search intent well. They're written for commissioners, assume prior knowledge, and don't explain, compare, or empathise. That gap is P2P's SEO opportunity.

**SEO backbone — the ICB pages:**
Each ICB has a permanent, well-structured, plain-English page optimised for "[area] NHS IVF funding" searches. 36 pages of highly specific, locally relevant content no competitor has. Each page includes:
- ICB name and status flag
- **Boroughs and areas covered** — scannable list; captures neighbourhood-level searches (e.g. "NHS IVF funding Catford") without needing separate pages. Acts as semantic signal for Google and orientation tool for users simultaneously.
- Funding criteria in plain English
- Transparency note — data source, date, caveat
- Map of surrounding ICBs
- What Next — both paths
- Downloadable policy PDF

**Content architecture — sustainable, not burdensome:**
- **ICB pages** — core SEO backbone, maintained through monitoring process
- **Updates/news** — published when things change, not on a schedule. Triggered by real events: mergers, policy changes, NHS announcements. Demonstrates P2P is watching the system and translating it for patients. Owns search space when NHS structural changes happen.
- **About Us** — the authority and trust page. States industry experience, patient panel involvement, the P2P peer-to-peer philosophy. The site's emotional manifesto. A one-time investment with ongoing SEO value.
- **What Next content** — evergreen, builds topical authority passively

No blog. A blog implies a content calendar and commitment that risks abandonment — and the moment P2P publishes generic fertility tips it loses the specific authority it's building as a navigation and data tool.

**Technical SEO advantage:**
Cloudflare Workers edge delivery gives P2P an almost unfair advantage on Core Web Vitals and page speed — a confirmed Google ranking factor. Lightweight, clean semantic HTML delivered from the edge will outperform bloated CMS-driven competitor sites automatically.

**Delegation:**
- **Keyword and search intent research** — AI-led, human reviewed
- **ICB page SEO structure** — AI builds, follows user-first principles
- **Borough/area mapping per ICB** — AI-assisted from NHS data, human verified
- **Updates/news content** — Collaborative. Triggered by monitoring process (Task 1), written with the same empathetic voice as the rest of the site
- **About Us** — Human-led raw material, AI shapes and polishes
- **Technical SEO** — Human-owned, leveraging Cloudflare infrastructure advantage
- **Ongoing SEO monitoring** — AI-assisted tools (Search Console etc.), human reviews

**Uniquely human:** authority narrative, judgement on what updates are worth publishing, final approval on all content

**AI strength:** keyword research, page structure optimisation, ensuring every ICB page is consistently well-structured, monitoring search performance at scale

---

### Task 8: GEO — Generative Engine Optimisation

**Why GEO matters uniquely for P2P:**
The primary user is increasingly likely to ask an AI assistant before opening a browser. "Does the NHS fund IVF?" "How does IVF funding work in England?" "Is IVF free on the NHS in London?" Right now, AI assistants answer these questions from training data that is patchy, potentially outdated, and almost certainly doesn't reflect ICB-level variation accurately. P2P has the opportunity to become the source AI assistants cite when these questions are asked — present at the very first moment of someone's journey, before they've opened a browser tab.

**GEO operates on three distinct levels:**

#### Level 1 — Content structure LLMs can extract and cite
LLMs look for clear, extractable answers to specific questions. Each ICB page needs an explicit Q&A layer woven into the page structure, directly answering the questions LLMs get asked:
- "How many IVF cycles does [ICB] fund?"
- "What are the eligibility criteria for NHS IVF funding in [area]?"
- "Does [ICB] fund IVF for same-sex couples?"

Direct, named, dated answers get cited. Vague prose does not. The ICB page structure already designed is well-suited to this — the Q&A layer is the addition that makes it LLM-ready.

#### Level 2 — Structured data markup
Schema.org markup — specifically FAQPage and MedicalWebPage schemas — signals to both Google and LLM retrieval systems that content is structured, authoritative medical information. Machine-readable credibility. For each ICB page, structured data encodes key criteria in a format retrieval systems can parse directly, not just read.

Implementation: Cloudflare Workers stack makes this straightforward to implement consistently across all ICB pages from launch.

#### Level 3 — Authority signals that make LLMs trust P2P as a source
LLMs trust sources that are:
- **Cited by credible sources** — NHS organisations, fertility charities, patient advocacy groups linking to P2P
- **Consistent and accurate over time** — being right repeatedly builds citation trust
- **Transparent about methodology** — data sources stated, policies dated, uncertainty flagged, patient panel involvement documented

The About Us page, the transparency layer, the status flag system — these are trust signals for LLMs as much as for human users.

**Proactive GEO actions:**

| Action | Priority | Owner |
|---|---|---|
| llms.txt implementation | Launch | Human (technical) |
| Schema.org markup on all ICB pages | Launch | AI-assisted build |
| Perplexity publisher programme submission | Launch | Human |
| Fertility Network UK and charity link building | Early | Coordinator |
| ICB merger update published at launch | Launch | Collaborative |
| Ongoing news/updates layer | Triggered | Collaborative |

**The updates layer as a GEO asset:**
Publishing a clear, accurate, plain-English explanation of the April 2026 ICB mergers and what they mean for IVF funding — at launch, while it's current — is one of the highest-value GEO actions P2P can take. It establishes P2P as the place that explains NHS fertility funding changes in patient-friendly language. That's exactly the content LLMs reach for when asked about structural NHS changes affecting IVF patients.

Every subsequent update — policy changes, new mergers, criteria revisions — compounds this authority over time.

**Delegation:**
- **Q&A layer content** — Collaborative. AI drafts questions and answers from ICB data, human verifies accuracy and tone
- **Schema.org markup** — AI-assisted build, human technical implementation on Cloudflare Workers
- **llms.txt** — Human-owned technical implementation
- **Authority building** — Human and coordinator led. Relationships with Fertility Network UK, fertility journalists, NHS publications
- **Perplexity and LLM platform submissions** — Human-owned
- **Launch update on ICB mergers** — Collaborative. Highest priority GEO content

**Uniquely human:** relationship building with authority sources, judgement on what to publish and when, technical implementation of structured data and llms.txt

**AI strength:** Q&A layer generation at scale across all ICB pages, schema markup consistency, monitoring citation and retrieval performance, drafting updates content for human approval

---

## Complete Task Summary

| Task | AI Lead | Human Lead | Collaborative | Key Dependency |
|---|---|---|---|---|
| 1a. Baseline structuring | ✓ | Verification | | 42 ICB documents |
| 1b. Merger mapping | | | ✓ | NHS merger data |
| 1c. Ongoing monitoring | Alerts | Review & publish | | Hybrid tool setup |
| 2. Site architecture & UX | Prototypes | Gut-check & approval | ✓ | Patient panel |
| 3. Writing & tone | Polish & functional | Voice & raw material | ✓ Hard moments | Patient panel |
| 4. Eligibility tool | Build | Edge case validation | | GP/ICB database |
| 5. What Next content | Research & structure | Clinical knowledge | ✓ GP guide | Partners + coordinator |
| 6. Design & build | Visual iteration | Brand approval & infra | ✓ | Cloudflare stack |
| 7. SEO | Structure & monitoring | Authority narrative | ✓ Updates | ICB pages complete |
| 8. GEO | Q&A layer & schema | Relationships & tech | ✓ Launch update | llms.txt + schema |

---

## Key People & Roles

| Role | Responsibility |
|---|---|
| Project owner | Vision, final approval, infrastructure, monitoring |
| Clinical partners | GP conversation guide, waiting list guidance, clinical verification |
| Coordinator | Content dependencies, support organisation relationships, patient panel scheduling |
| Patient review panel | Emotional checking of all sensitive content and design moments |

---

## Immediate Priorities (Pre-Launch)

1. **Merger mapping** — identify new ICB pages and policy status for all 12 abolished ICBs
2. **Tone of voice guide** — capture P2P voice before any copy is written
3. **Patient panel** — identify and brief members
4. **Baseline data structuring** — extract and structure the 42 ICB documents into D1-ready format
5. **Launch update** — publish ICB merger explainer at launch for immediate GEO authority

---

## Notes
- This is a living document — to be updated as the project develops
- V1 scope is deliberately constrained. Features like personalised eligibility assessment, GP change journey, notifications, and community layer are future versions
- The patient review panel should be involved from the earliest design and writing stages, not just at the end
- P2P brand name and P2P logo mark are confirmed

---

## Notes
- This plan is a living document — to be updated as tasks 4–8 are discussed
- The patient review panel should be identified and briefed before writing begins
- Merger mapping (Task 1b) should begin immediately, given April 2026 changes are live
- The tone of voice guide should be drafted before any copy is written
