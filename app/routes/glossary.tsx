import type { Route } from "./+types/glossary";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function meta({}: Route.MetaArgs) {
  const title = "Glossary | Postcode to Parenthood";
  const description =
    "Plain-English definitions of IVF, fertility, and NHS funding terms. From AMH to unexplained infertility, we explain the jargon so you can focus on what matters.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/glossary";

  return [
    { title },
    { name: "description", content: description },
    ...standardMeta(canonicalUrl),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
}

type GlossaryEntry = {
  term: string;
  definition: string;
};

const glossaryEntries: GlossaryEntry[] = [
  {
    term: "AMH (Anti-Müllerian Hormone)",
    definition:
      "A blood test that gives an indication of your ovarian reserve (how many eggs you have left). A higher level generally suggests a larger remaining egg supply. It doesn't tell you about egg quality.",
  },
  {
    term: "Antral follicle count (AFC)",
    definition:
      "An ultrasound scan that counts the small follicles visible on your ovaries at the start of a cycle. Along with AMH, it helps your clinic assess your ovarian reserve and plan your stimulation dose.",
  },
  {
    term: "Assisted reproduction",
    definition:
      "An umbrella term for any medical treatment that helps someone conceive. Includes IUI, IVF, ICSI, and donor-assisted treatments.",
  },
  {
    term: "Blastocyst",
    definition:
      "An embryo that has developed for 5 to 6 days after fertilisation. At this stage it has around 100 cells and is ready to implant in the womb. Many clinics prefer to transfer embryos at blastocyst stage because it can improve success rates.",
  },
  {
    term: "BMI (Body Mass Index)",
    definition:
      "A number calculated from your height and weight. Most ICBs set BMI limits for funded fertility treatment, typically requiring a BMI between 19 and 30, though this varies by area.",
  },
  {
    term: "CCG (Clinical Commissioning Group)",
    definition:
      "The predecessor organisations to ICBs. CCGs were replaced by Integrated Care Boards in July 2022, but you might still see references to them in older documents.",
  },
  {
    term: "Commissioning policy",
    definition:
      "The document an ICB publishes setting out what fertility treatments they'll fund, and the eligibility criteria patients must meet. This is the source of the 'postcode lottery' variation.",
  },
  {
    term: "Cryopreservation (freezing)",
    definition:
      "Freezing eggs, sperm, or embryos for future use. Frozen embryos from a funded IVF cycle can sometimes be used in a later frozen embryo transfer without counting as a new 'full cycle'.",
  },
  {
    term: "Donor insemination (DI)",
    definition:
      "Using donated sperm to achieve pregnancy, either through IUI or IVF. Availability of NHS funding for donor treatments varies significantly by area.",
  },
  {
    term: "Egg collection",
    definition:
      "A short procedure during IVF where eggs are collected from your ovaries using a fine needle guided by ultrasound. It's done under sedation and usually takes 15 to 30 minutes. Sometimes called egg retrieval.",
  },
  {
    term: "Egg sharing",
    definition:
      "An arrangement where you donate some of your eggs to another patient in exchange for free or reduced-cost IVF treatment. Not all clinics offer this.",
  },
  {
    term: "Embryo transfer",
    definition:
      "The stage of IVF where one or more embryos are placed into the womb. Single embryo transfer is now standard practice in the UK to reduce the risk of multiple pregnancy.",
  },
  {
    term: "Endometriosis",
    definition:
      "A condition where tissue similar to the womb lining grows in other places, like the ovaries or fallopian tubes. It can affect fertility and is sometimes a factor in eligibility for funded treatment.",
  },
  {
    term: "Expectant management",
    definition:
      "The medical term for 'keep trying naturally'. Your clinic gives you advice on timing, lifestyle, and frequency of intercourse, but no active treatment. NICE recommends this for up to 2 years for unexplained infertility before offering IVF.",
  },
  {
    term: "Fertility MOT",
    definition:
      "An informal name for a set of initial fertility tests, usually including AMH, antral follicle count, and sometimes a semen analysis. Some private clinics offer this as a standalone package, but the same tests are available through your GP or NHS referral.",
  },
  {
    term: "FET (Frozen Embryo Transfer)",
    definition:
      "Transferring a previously frozen embryo into the womb. Some ICBs fund FET cycles from embryos created during a funded fresh cycle. It's less physically demanding than a full stimulated cycle.",
  },
  {
    term: "Follicle",
    definition:
      "A small fluid-filled sac in the ovary that contains a developing egg. During IVF stimulation, the aim is to grow multiple follicles so several eggs can be collected.",
  },
  {
    term: "FSH (Follicle Stimulating Hormone)",
    definition:
      "A hormone that stimulates the ovaries to produce eggs. FSH levels are sometimes tested as part of a fertility assessment. High levels can indicate reduced ovarian reserve.",
  },
  {
    term: "Full cycle",
    definition:
      "What counts as one funded IVF 'cycle' varies by ICB. NICE defines it as one episode of ovarian stimulation plus the transfer of any resulting fresh and frozen embryos. But some ICBs interpret this differently, so always check your local policy.",
  },
  {
    term: "GP referral",
    definition:
      "The first step to accessing NHS fertility treatment. Your GP refers you to a fertility clinic after initial investigations. Some ICBs require you to have been trying to conceive for a specific period before they'll refer you.",
  },
  {
    term: "Health board",
    definition:
      "The equivalent of an ICB in Scotland, Wales, and Northern Ireland. These bodies set fertility treatment policies for their region. Unlike England, the devolved nations tend to have national-level policies rather than area-by-area variation.",
  },
  {
    term: "HFEA (Human Fertilisation and Embryology Authority)",
    definition:
      "The UK regulator for fertility treatment and research. They license clinics, set standards, and publish data on clinic success rates. A good starting point when researching clinics.",
  },
  {
    term: "HSG (Hysterosalpingogram)",
    definition:
      "An X-ray test that checks whether your fallopian tubes are open. A dye is passed through the cervix and X-rays track its movement. It's part of the standard fertility workup and usually done as an outpatient.",
  },
  {
    term: "HyCoSy",
    definition:
      "An ultrasound-based alternative to HSG for checking if your fallopian tubes are open. It uses a contrast fluid instead of X-ray dye. Some clinics prefer it because it avoids radiation exposure.",
  },
  {
    term: "ICB (Integrated Care Board)",
    definition:
      "The NHS body responsible for planning and funding healthcare in your area, including fertility treatment. There are 42 ICBs in England, each with their own fertility policy. This is why funding varies by postcode.",
  },
  {
    term: "ICSI (Intracytoplasmic Sperm Injection)",
    definition:
      "A form of IVF where a single sperm is injected directly into an egg. It's used when sperm quality is poor or when standard IVF hasn't worked. Most ICBs fund ICSI when clinically indicated.",
  },
  {
    term: "IUI (Intrauterine Insemination)",
    definition:
      "A simpler fertility treatment where prepared sperm is placed directly into the womb around the time of ovulation. Less invasive and less expensive than IVF, and sometimes offered as a first step.",
  },
  {
    term: "IVF (In Vitro Fertilisation)",
    definition:
      "A process where eggs are collected from the ovaries and fertilised with sperm in a laboratory. The resulting embryo is then transferred to the womb. 'In vitro' means 'in glass', referring to the lab dish.",
  },
  {
    term: "Laparoscopy",
    definition:
      "Keyhole surgery used to look at or treat conditions inside the pelvis, such as endometriosis, fibroids, or blocked fallopian tubes. Sometimes part of the investigation before fertility treatment.",
  },
  {
    term: "Natural cycle IVF",
    definition:
      "An IVF cycle without stimulation drugs, where a single egg is collected during your natural menstrual cycle. Less physically intensive than standard IVF but with lower success rates per cycle. Not widely funded on the NHS.",
  },
  {
    term: "NICE (National Institute for Health and Care Excellence)",
    definition:
      "The body that produces evidence-based guidelines for the NHS. Their fertility guideline (NG257) recommends 3 full IVF cycles for eligible women under 42. ICBs aren't required to follow this, and most don't fully.",
  },
  {
    term: "OHSS (Ovarian Hyperstimulation Syndrome)",
    definition:
      "A potential side effect of the hormone drugs used in IVF, where the ovaries over-respond and swell. Mild symptoms are common (bloating, discomfort), but severe OHSS needs medical attention. Modern protocols have reduced the risk significantly.",
  },
  {
    term: "Ovarian reserve",
    definition:
      "A general term for how many eggs you have remaining. Assessed through AMH blood tests and antral follicle counts on ultrasound. Lower reserve doesn't necessarily mean you can't conceive, but it may affect treatment options.",
  },
  {
    term: "Ovulation induction",
    definition:
      "Using medication (usually tablets like letrozole or clomifene) to stimulate the ovaries to release eggs in people who aren't ovulating regularly. It's a less intensive treatment than IVF and is sometimes the first thing tried.",
  },
  {
    term: "Ovulation problems",
    definition:
      "When your ovaries don't release an egg regularly, or at all. One of the most common causes of difficulty conceiving. Often linked to PCOS, thyroid issues, or premature ovarian insufficiency. Usually treatable with medication.",
  },
  {
    term: "PCOS (Polycystic Ovary Syndrome)",
    definition:
      "A common condition affecting how the ovaries work. It can cause irregular periods, difficulty ovulating, and is one of the leading causes of fertility problems in the UK. Treatment usually starts with ovulation induction.",
  },
  {
    term: "PGT (Preimplantation Genetic Testing)",
    definition:
      "Testing embryos for genetic conditions before transfer during IVF. PGT-A screens for chromosome abnormalities, PGT-M tests for specific inherited conditions. Not routinely funded by the NHS.",
  },
  {
    term: "Postcode lottery",
    definition:
      "The variation in NHS fertility treatment access depending on where you live. Because each ICB sets its own policy, two people in identical circumstances can get different levels of funding based purely on their address.",
  },
  {
    term: "Premature ovarian insufficiency (POI)",
    definition:
      "When the ovaries stop working properly before age 40, leading to irregular or absent periods and reduced fertility. Previously called premature ovarian failure. Some ICBs have specific pathways for people with POI.",
  },
  {
    term: "Previous children",
    definition:
      "Most ICBs restrict funded treatment to people without existing children. The exact rules vary: some count biological children only, others include stepchildren or adopted children. Some distinguish between the patient and their partner.",
  },
  {
    term: "Previous treatment",
    definition:
      "Some ICBs won't fund IVF if you've already had cycles elsewhere, whether NHS or privately funded. The rules on what counts vary. Some only consider full IVF cycles, others include IUI or treatment abroad.",
  },
  {
    term: "Recurrent miscarriage",
    definition:
      "Usually defined as three or more consecutive pregnancy losses. Some ICBs have different eligibility pathways for people with recurrent miscarriage, and it may be investigated separately from general infertility.",
  },
  {
    term: "Referral to treatment (RTT)",
    definition:
      "The NHS waiting time standard. For fertility, this is the time between your GP referral and starting treatment. There's an 18-week target, though in practice fertility waits are often longer.",
  },
  {
    term: "Residency requirement",
    definition:
      "Most ICBs require you to have been registered with a GP in their area for a minimum period (often 12 months) before you can access funded fertility treatment. This prevents people moving postcode just to access better funding.",
  },
  {
    term: "Same-sex couples",
    definition:
      "Policies for same-sex couples vary. Some ICBs require self-funded IUI attempts before offering IVF (as evidence of need), while others don't. The number of required attempts and who pays for them differs by area.",
  },
  {
    term: "Secondary infertility",
    definition:
      "Difficulty conceiving after a previous successful pregnancy. Some ICBs don't fund treatment if you already have a child, regardless of whether you're experiencing secondary infertility.",
  },
  {
    term: "Semen analysis",
    definition:
      "A test that checks sperm count, movement, and shape. It's one of the first investigations done and can identify male factor issues early. Usually needs to be repeated to confirm results.",
  },
  {
    term: "Single embryo transfer (SET)",
    definition:
      "Transferring just one embryo at a time, which is now the recommended approach in the UK. It reduces the risk of twins or triplets, which carry higher health risks for both parent and babies.",
  },
  {
    term: "Stimulation (ovarian stimulation)",
    definition:
      "The phase of IVF where hormone injections encourage the ovaries to produce multiple eggs instead of the usual one. Lasts around 10 to 14 days, with regular monitoring scans.",
  },
  {
    term: "Subfertility",
    definition:
      "A term sometimes used instead of 'infertility'. Generally means difficulty conceiving after 12 months of regular unprotected sex (or 6 months if over 36). It doesn't mean you can't conceive, just that it's taking longer than expected.",
  },
  {
    term: "Surrogacy",
    definition:
      "When another person carries a pregnancy for you. NHS funding for surrogacy-related fertility treatment is very limited and varies significantly by ICB.",
  },
  {
    term: "Trigger injection",
    definition:
      "An injection given during IVF to trigger final egg maturation before collection. Timing is precise, usually 36 hours before the egg collection procedure.",
  },
  {
    term: "Two-week wait (2WW)",
    definition:
      "The period between embryo transfer and taking a pregnancy test. Technically around 10 to 14 days depending on the clinic. Known for being one of the most emotionally challenging parts of the process.",
  },
  {
    term: "Unexplained infertility",
    definition:
      "When standard tests don't identify a clear reason for difficulty conceiving. Affects around 1 in 4 couples investigated. You're still eligible for funded treatment in most areas, usually after 2 years of trying.",
  },
  {
    term: "Waiting list",
    definition:
      "The time between being accepted for funded fertility treatment and starting your first cycle. Varies by ICB and clinic, and can range from a few months to over a year depending on your area and demand.",
  },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getLetterGroups(entries: GlossaryEntry[]) {
  const groups: Record<string, GlossaryEntry[]> = {};
  for (const entry of entries) {
    const letter = entry.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(entry);
  }
  return groups;
}

export default function GlossaryPage() {
  const [filter, setFilter] = useState("");
  const letterGroups = getLetterGroups(glossaryEntries);

  const filteredEntries = filter
    ? glossaryEntries.filter(
        (e) =>
          e.term.toLowerCase().includes(filter.toLowerCase()) ||
          e.definition.toLowerCase().includes(filter.toLowerCase())
      )
    : null;

  const filteredGroups = filteredEntries
    ? getLetterGroups(filteredEntries)
    : letterGroups;

  const activeLetters = new Set(Object.keys(filteredGroups));

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Glossary"
        description="Fertility treatment comes with a lot of jargon. Here's what it all means, in plain English."
        breadcrumbCurrent="Glossary"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Search */}
        <div className="mb-8">
          <label htmlFor="glossary-search" className="sr-only">
            Search terms
          </label>
          <input
            id="glossary-search"
            type="search"
            placeholder="Search for a term..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-lg border border-tint/20 bg-surface px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40 focus:border-tint/40 focus:outline-none focus:ring-2 focus:ring-tint/20"
          />
        </div>

        {/* Alphabet nav */}
        <nav
          aria-label="Jump to letter"
          className="mb-10 flex flex-wrap gap-1.5"
        >
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={activeLetters.has(letter) ? `#letter-${letter}` : undefined}
              aria-disabled={!activeLetters.has(letter)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                activeLetters.has(letter)
                  ? "bg-surface text-tint hover:bg-tint/10"
                  : "text-ink/25 cursor-default"
              )}
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Glossary entries */}
        <div className="space-y-10 font-sans text-ink/85 leading-relaxed">
          {alphabet.map((letter) => {
            const entries = filteredGroups[letter];
            if (!entries || entries.length === 0) return null;
            return (
              <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`}>
                <h2
                  id={`heading-${letter}`}
                  className="font-heading text-2xl font-semibold text-brand mb-4 border-b border-tint/10 pb-2"
                >
                  {letter}
                </h2>
                <dl className="space-y-6">
                  {entries.map((entry) => (
                    <div key={entry.term}>
                      <dt className="font-sans text-base font-semibold text-ink">
                        {entry.term}
                      </dt>
                      <dd className="mt-1 text-base leading-relaxed text-ink/75 max-w-prose">
                        {entry.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}

          {filteredEntries && filteredEntries.length === 0 && (
            <p className="text-center text-ink/60 py-8">
              No terms match your search. Try a different word or phrase.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
