import type { Route } from "./+types/llms-full[.]txt";
import { toSlug } from "../lib/slug";

interface BoardRow {
  id: string;
  name: string;
  document_folder_name: string;
  country: string;
  data_confidence: string;
  policy_date: string | null;
  last_verified: string | null;
  predecessor_icb: string | null;
  source_url: string | null;
  boroughs: string | null;
}

interface PolicyRow {
  board_id: string;
  treatment_type_name: string;
  cycles_offered: number;
  min_age: number | null;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  amh_min_pmol: number | null;
  fsh_max_iu: number | null;
  iui_rounds_required: number;
  endometriosis_priority_access: number;
  smoking_restricted: number;
  living_children_rule: string | null;
  additional_notes: string | null;
  effective_from: string;
  effective_to: string | null;
}

function formatCountry(country: string): string {
  const map: Record<string, string> = {
    ENGLAND: "England",
    SCOTLAND: "Scotland",
    WALES: "Wales",
    NORTHERN_IRELAND: "Northern Ireland",
  };
  return map[country] ?? country;
}

function parseBoroughs(boroughs: string | null): string[] {
  if (!boroughs) return [];
  try {
    const parsed = JSON.parse(boroughs);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Array.isArray(parsed.boroughs) ? parsed.boroughs : [];
    }
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function renderPolicy(policy: PolicyRow): string {
  const lines: string[] = [];
  lines.push(`  - Treatment: ${policy.treatment_type_name}`);
  lines.push(`    Cycles offered: ${policy.cycles_offered}`);
  lines.push(`    Age range: ${policy.min_age ?? "not specified"}–${policy.max_age}`);

  if (policy.bmi_min !== null || policy.bmi_max !== null) {
    const bmiParts: string[] = [];
    if (policy.bmi_min !== null) bmiParts.push(`min ${policy.bmi_min}`);
    if (policy.bmi_max !== null) bmiParts.push(`max ${policy.bmi_max}`);
    lines.push(`    BMI: ${bmiParts.join(", ")}`);
  }

  if (policy.amh_min_pmol !== null) {
    lines.push(`    AMH minimum: ${policy.amh_min_pmol} pmol/L`);
  }
  if (policy.fsh_max_iu !== null) {
    lines.push(`    FSH maximum: ${policy.fsh_max_iu} IU/L`);
  }

  lines.push(`    IUI rounds required: ${policy.iui_rounds_required}`);
  lines.push(`    Endometriosis priority access: ${policy.endometriosis_priority_access ? "yes" : "no"}`);
  lines.push(`    Smoking restricted: ${policy.smoking_restricted ? "yes" : "no"}`);

  if (policy.living_children_rule) {
    lines.push(`    Living children rule: ${policy.living_children_rule}`);
  }
  if (policy.additional_notes) {
    lines.push(`    Notes: ${policy.additional_notes}`);
  }

  lines.push(`    Effective from: ${policy.effective_from}`);
  if (policy.effective_to) {
    lines.push(`    Effective to: ${policy.effective_to}`);
  }

  return lines.join("\n");
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const baseUrl = "https://postcodetoparenthood.org.uk";

  const { results: boards } = await db
    .prepare(
      `SELECT id, name, document_folder_name, country,
              data_confidence, policy_date, last_verified,
              predecessor_icb, source_url, boroughs
       FROM health_boards
       WHERE document_folder_name IS NOT NULL AND status = 'active'
       ORDER BY country, name`
    )
    .bind()
    .all<BoardRow>();

  const { results: policies } = await db
    .prepare(
      `SELECT p.board_id, t.name as treatment_type_name,
              p.cycles_offered, p.min_age, p.max_age,
              p.bmi_min, p.bmi_max, p.amh_min_pmol, p.fsh_max_iu,
              p.iui_rounds_required, p.endometriosis_priority_access,
              p.smoking_restricted, p.living_children_rule,
              p.additional_notes, p.effective_from, p.effective_to
       FROM board_policies p
       JOIN treatment_types t ON t.id = p.treatment_type_id
       WHERE (p.effective_to IS NULL OR p.effective_to >= date('now'))
       ORDER BY p.board_id, p.effective_from DESC`
    )
    .bind()
    .all<PolicyRow>();

  // Group policies by board_id
  const policiesByBoard = new Map<string, PolicyRow[]>();
  for (const policy of policies) {
    const existing = policiesByBoard.get(policy.board_id) ?? [];
    existing.push(policy);
    policiesByBoard.set(policy.board_id, existing);
  }

  const generatedAt = new Date().toISOString().slice(0, 10);

  const sections: string[] = [];

  sections.push(`# Postcode to Parenthood — Full Data Export

> Complete structured data export of all UK health board NHS fertility policies.
> Generated: ${generatedAt}
> Source: ${baseUrl}

## About This Data

This file contains all health board entries with their full policy details for programmatic consumption. Each entry includes cycles offered, age limits, BMI criteria, waiting times, data confidence status, and area coverage.

For a summary overview, see: ${baseUrl}/llms.txt
For individual board pages: ${baseUrl}/board/[slug]

## Data Confidence Levels

- **confirmed**: Policy verified against original source document
- **inherited**: Policy inherited from predecessor ICB (may change)
- **under_review**: Policy being actively reviewed or updated
- **unconfirmed**: Policy not yet verified against source

---

## Health Boards (${boards.length} active)
`);

  for (const board of boards) {
    const slug = toSlug(board.document_folder_name);
    const boardPolicies = policiesByBoard.get(board.id) ?? [];
    const boroughs = parseBoroughs(board.boroughs);

    const boardLines: string[] = [];
    boardLines.push(`### ${board.name}`);
    boardLines.push(``);
    boardLines.push(`- Country: ${formatCountry(board.country)}`);
    boardLines.push(`- Data confidence: ${board.data_confidence}`);
    boardLines.push(`- URL: ${baseUrl}/board/${slug}`);

    if (board.policy_date) {
      boardLines.push(`- Policy date: ${board.policy_date}`);
    }
    if (board.last_verified) {
      boardLines.push(`- Last verified: ${board.last_verified}`);
    }
    if (board.predecessor_icb) {
      boardLines.push(`- Predecessor ICB: ${board.predecessor_icb}`);
    }
    if (board.source_url) {
      boardLines.push(`- Source: ${board.source_url}`);
    }

    if (boroughs.length > 0) {
      boardLines.push(`- Areas covered: ${boroughs.join(", ")}`);
    }

    if (boardPolicies.length > 0) {
      boardLines.push(``);
      boardLines.push(`**Policies:**`);
      boardLines.push(``);
      for (const policy of boardPolicies) {
        boardLines.push(renderPolicy(policy));
        boardLines.push(``);
      }
    } else {
      boardLines.push(``);
      boardLines.push(`*No current policies on record.*`);
      boardLines.push(``);
    }

    sections.push(boardLines.join("\n"));
  }

  sections.push(`---

## Methodology

Policies are compiled from publicly available ICB policy documents, FOI responses, and direct communication with health boards. Data is updated periodically and confidence levels reflect verification status.

## Contact

For data access requests or questions: ${baseUrl}/about`);

  const body = sections.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
