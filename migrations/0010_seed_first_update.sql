-- Seed the initial update post about the April 2026 NHS ICB mergers in England.

INSERT INTO updates (slug, title, published_date, summary, body, related_boards, tags)
VALUES (
  'icb-mergers-april-2026',
  'Six new NHS Integrated Care Boards formed in England — April 2026',
  '2026-04-01',
  'In April 2026, NHS England merged several Integrated Care Boards into six new larger organisations. IVF funding policies for these areas are currently inherited from predecessor boards while the new ICBs establish their own commissioning positions.',
  'In April 2026, NHS England restructured several Integrated Care Boards (ICBs) across the country, merging them into six new organisations. This affects IVF and fertility funding policies for patients registered with GPs in these areas.

We are actively monitoring each new ICB for updated commissioning policies. Until new policies are published, the funding information shown on Postcode to Parenthood is inherited from the predecessor boards.

If you are in one of the affected areas, we recommend confirming your eligibility directly with your GP or the new ICB. We will update this page as new policies are announced.',
  '["nhs-west-and-north-london-integrated-care-board","nhs-central-east-integrated-care-board","nhs-essex-integrated-care-board","nhs-norfolk-and-suffolk-integrated-care-board","nhs-surrey-and-sussex-integrated-care-board","nhs-thames-valley-integrated-care-board"]',
  '["merger", "england", "policy-change"]'
);
