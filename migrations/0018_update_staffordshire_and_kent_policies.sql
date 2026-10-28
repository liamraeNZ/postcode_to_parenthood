-- Update Staffordshire and Stoke-on-Trent and Kent and Medway policies to the 2026 versions.
-- Staffordshire: IVF Aligned Policy v1.2 (ratified 30 April 2026)
-- Kent and Medway: ART policy document applying from 1 April 2026
-- Source PDFs are stored in R2 under policies/<ICB>/2026/

-- Staffordshire and Stoke-on-Trent (QNC) board details
UPDATE health_boards SET policy_date = '2026-04-30',
  source_url = 'https://staffsstoke.icb.nhs.uk/your-nhs-integrated-care-board/our-publications/fertility/ivf-aligned-policy-v12-april-2026-approvedpdf/?layout=file',
  policy_pdf_r2_key = 'policies/Staffordshire and Stoke-on-Trent/2026/IVF Aligned Policy V1.2 April 2026 Approved.pdf',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE id = 'QNC'; --> statement-breakpoint

-- Staffordshire and Stoke-on-Trent (QNC) IVF policy
UPDATE board_policies SET effective_from = '2026-04-30',
  additional_notes = 'One partial IVF/ICSI cycle funded, including one fresh, blastocyst or frozen embryo transfer. Further frozen embryo transfers are not funded. Donor sperm is not routinely funded for same-sex couples. The ICB funds HFEA-approved donor sperm for azoospermia, severe semen deficits (where the couple does not wish to undergo ICSI), high risk of passing on a genetic disorder or infectious disease, and severe rhesus iso-immunisation. Embryo storage is funded for 3 years. One cancelled cycle is funded if cancelled for medical reasons. Previous sterilisation makes couples ineligible, even if reversed. Same-sex couples require 6 self-funded IUI/DI cycles to demonstrate infertility. AMH above 3 is required for women aged 35 and over (the policy does not state units). Patients must be non-smoking for at least 6 months before treatment.',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE board_id = 'QNC' AND treatment_type_id = 'ivf'; --> statement-breakpoint

-- Kent and Medway (QKS) board details
UPDATE health_boards SET policy_date = '2026-04-01',
  policy_pdf_r2_key = 'policies/Kent and Medway/2026/kent-and-medway-art-policy-document-final-31012026.pdf',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE id = 'QKS'; --> statement-breakpoint

-- Kent and Medway (QKS) IVF policy: 1 cycle, age under 38, max 2 transfers (1 fresh)
UPDATE board_policies SET effective_from = '2026-04-01', cycles_offered = 1, max_age = 37,
  additional_notes = '1 IVF/ICSI cycle funded from 1 April 2026 (previously 2). Maximum of 2 embryo transfers funded, no more than 1 from a fresh cycle (previously 4, no more than 2 fresh). Will not be funded if 3 previous fresh cycles have been received. Storage of supernumerary embryos funded for up to 2 years. AI pathway requires 12 unsuccessful cycles (at least 6 IUI). Unexplained infertility requires 2 years of regular unprotected sex.',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE board_id = 'QKS' AND treatment_type_id = 'ivf'; --> statement-breakpoint

-- Kent and Medway (QKS) IUI policy: age under 38 applies (other criteria unchanged)
UPDATE board_policies SET effective_from = '2026-04-01', max_age = 37,
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE board_id = 'QKS' AND treatment_type_id = 'iui'; --> statement-breakpoint

-- Kent and Medway (QKS) FET policy: max 2 transfers (1 fresh), age under 38
UPDATE board_policies SET effective_from = '2026-04-01', cycles_offered = 2, max_age = 37,
  additional_notes = 'Maximum of 2 embryo transfer procedures funded, no more than 1 from a fresh cycle (from 1 April 2026; previously 4, no more than 2 fresh).',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE board_id = 'QKS' AND treatment_type_id = 'fet';
