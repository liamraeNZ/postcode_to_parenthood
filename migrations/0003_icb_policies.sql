-- ICB policy seed data (generated from extracted PDF policies)
-- Generated: 2026-04-28T14:15:34.460Z
-- Source: 38 ICB policy documents via scripts/extractPolicies.ts

-- Bath and North East Somerset, Swindon and Wiltshire (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-bath-and-north-east-somerset-s', id, 'ivf', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).', '1 full cycle includes max 1 fresh and 1 frozen transfer. Ineligible if 3+ previous cycles. Same-sex couples/single women must complete 12 AI/IUI cycles before IVF. Alcohol must be within DoH guidelines. No sterilization reversal.'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-bath-and-north-east-somerset-s', id, 'icsi', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).', '1 full cycle includes max 1 fresh and 1 frozen transfer. Ineligible if 3+ previous cycles. Same-sex couples/single women must complete 12 AI/IUI cycles before IVF. Alcohol must be within DoH guidelines. No sterilization reversal.'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-bath-and-north-east-somerset-s', id, 'iui', '2025-09-11', 2, 25, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).', '2 NHS cycles funded for same-sex/single women after 10 self-funded AI/IUI cycles. Alcohol must be within DoH guidelines. No sterilization reversal.'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-bath-and-north-east-somerset-s', id, 'fet', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).', '1 frozen embryo transfer is included as part of the single funded IVF/ICSI cycle. Embryo storage funded for up to 2 years or until female''s 40th birthday.'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bedfordshire, Luton and Milton Keynes (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-bedfordshire-luton-and-milton-', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'One full cycle includes a maximum of 4 embryo transfers. Excludes patients with >2 previous self-funded cycles. Shared motherhood is accommodated for same-sex female couples.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-bedfordshire-luton-and-milton-', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'One full cycle includes a maximum of 4 embryo transfers. Excludes patients with >2 previous self-funded cycles.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-bedfordshire-luton-and-milton-', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'Up to 6 cycles of unstimulated IUI offered for specific groups (unable to have vaginal intercourse, sperm washing, same-sex couples, single people) before IVF is considered.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-bedfordshire-luton-and-milton-', id, 'fet', '2025-09-11', 3, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'A full IVF cycle includes up to three frozen embryo transfers. Any frozen embryos not transferred will be stored for one calendar year.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

-- Birmingham and Solihull (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-birmingham-and-solihull', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', '1 full cycle includes up to 4 embryo transfers (1 fresh, 3 frozen). Shared motherhood accommodated. Previous sterilisation excludes. Male BMI must be <35.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-birmingham-and-solihull', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', '1 full cycle includes up to 4 embryo transfers (1 fresh, 3 frozen). Shared motherhood accommodated. Previous sterilisation excludes. Male BMI must be <35.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-birmingham-and-solihull', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'Up to 6 cycles of unstimulated IUI offered for specific groups (e.g., physical disability, psychosexual problems, HIV positive sperm washing, same-sex).'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-birmingham-and-solihull', id, 'fet', '2025-09-11', 3, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.', 'Up to 3 frozen embryo transfers are included as part of the 1 full funded IVF/ICSI cycle.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Black Country (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-black-country', id, 'ivf', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 6, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.', 'Male partner must be under 55. Neither partner can have had previous IVF/ICSI (NHS or private) or sterilisation. Both partners must be registered with a Black Country GP.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-black-country', id, 'icsi', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 6, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.', 'Male partner must be under 55. Neither partner can have had previous IVF/ICSI (NHS or private) or sterilisation. Both partners must be registered with a Black Country GP.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-black-country', id, 'iui', '2025-09-11', 6, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.', 'Only commissioned for couples where one partner has a permanent physical disability preventing natural conception or an infection requiring sperm-washing (e.g., HIV).'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-black-country', id, 'di', '2025-09-11', 6, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.', 'Commissioned for heterosexual couples where the male partner has azoospermia or oligospermia, or couples with a permanent physical disability/infection requiring sperm washing.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-black-country', id, 'fet', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.', 'Funded for one transfer of frozen embryos if transfer of fresh embryos is unable to take place for a clinical reason (e.g., OHSS risk, infection, or bleeding).'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bristol, North Somerset and South Gloucestershire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-bristol-north-somerset-and-sou', id, 'ivf', '2025-09-11', 1, NULL, 38, 19, 29.9, 5.4, 12, 6, 1, 1, 'No living offspring for either partner or single women', 'BMI max is relaxed to 35 for women aged 37 to 38. Neither partner may have been previously sterilised. Same-sex couples and single women must complete 6 self-funded IUI cycles. Prospective father must be under 54.'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-bristol-north-somerset-and-sou', id, 'icsi', '2025-09-11', 1, NULL, 38, 19, 29.9, 5.4, 12, 6, 1, 1, 'No living offspring for either partner or single women', 'BMI max is relaxed to 35 for women aged 37 to 38. Neither partner may have been previously sterilised. Same-sex couples and single women must complete 6 self-funded IUI cycles. Prospective father must be under 54.'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-bristol-north-somerset-and-sou', id, 'iui', '2025-09-11', 3, NULL, 38, 19, 29.9, 5.4, 15, 0, 1, 1, 'No living offspring for either partner or single women', 'BMI max is relaxed to 35 for women aged 37 to 38. Neither partner may have been previously sterilised. Prospective father must be under 54.'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-bristol-north-somerset-and-sou', id, 'fet', '2025-09-11', 1, NULL, 38, 19, 29.9, NULL, NULL, 6, 1, 1, 'No living offspring for either partner or single women', 'One frozen embryo transfer is included if the fresh cycle is unsuccessful, to be used within 12 months of cryopreservation (maximum of 2 embryos per cycle).'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Buckinghamshire, Oxfordshire and Berkshire West (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-buckinghamshire-oxfordshire-an', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Max 1 NHS cycle. Previous self-funded allowed if <=2 fresh cycles. Sterilisation excludes eligibility. 12 cycles of AI (at least 6 IUI) required for those using AI.'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-buckinghamshire-oxfordshire-an', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Max 1 NHS cycle. Previous self-funded allowed if <=2 fresh cycles. Sterilisation excludes eligibility. 12 cycles of AI (at least 6 IUI) required for those using AI.'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-buckinghamshire-oxfordshire-an', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Up to 6 cycles of unstimulated IUI using partner sperm for physical disability, psychosexual problems, or specific conditions. Requires 6 prior self-funded AI cycles.'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-buckinghamshire-oxfordshire-an', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Up to 6 cycles of unstimulated IUI using donor sperm for azoospermia, genetic risk, or after 6 self-funded AI cycles for same-sex couples and single individuals.'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-buckinghamshire-oxfordshire-an', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'FET is not funded. Cryopreservation of good quality embryos is funded for up to 3 years for use in subsequent self-funded frozen embryo transfer cycles.'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

-- Cambridgeshire and Peterborough (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-cambridgeshire-and-peterboroug', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, NULL, 12, 1, 1, 'No living children from current or previous relationships, including adopted children', 'Male partner must have BMI <35. Same-sex couples and unexplained infertility require 12 self-funded AI cycles. Previous sterilisation makes couples ineligible.'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-cambridgeshire-and-peterboroug', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, NULL, 12, 1, 1, 'No living children from current or previous relationships, including adopted children', 'Male partner must have BMI <35. Same-sex couples and unexplained infertility require 12 self-funded AI cycles. Previous sterilisation makes couples ineligible.'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-cambridgeshire-and-peterboroug', id, 'iui', '2025-09-11', 3, 23, 42, 19, 30, 5.4, NULL, 0, 1, 1, 'No living children from current or previous relationships, including adopted children', 'Only offered under exceptional circumstances with prior CCG approval. Same-sex couples may receive 3 NHS funded IUI cycles if they gain Exceptional Case Panel approval.'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-cambridgeshire-and-peterboroug', id, 'fet', '2025-09-11', 2, 23, 42, 19, 30, 5.4, NULL, 0, 1, 1, 'No living children from current or previous relationships, including adopted children', 'A maximum of three transfers of embryos are allowed per full cycle, consisting of one fresh plus two frozen transfers.'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

-- Coventry and Warwickshire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-coventry-and-warwickshire', id, 'ivf', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age', '1 cycle includes up to 2 FETs. Previous NHS IVF/ICSI cycle or 3+ private cycles disqualifies. Same-sex/unexplained infertility requires 6 self-funded IUI or 2 self-funded IVF cycles.'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-coventry-and-warwickshire', id, 'icsi', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age', '1 cycle includes up to 2 FETs. Previous NHS IVF/ICSI cycle or 3+ private cycles disqualifies. Same-sex/unexplained infertility requires 6 self-funded IUI or 2 self-funded IVF cycles.'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-coventry-and-warwickshire', id, 'fet', '2025-09-11', 2, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age', 'Up to a maximum of 2 frozen embryo transfers (FETs) are funded following a fresh cycle. Must be completed within 12 months of cryopreservation.'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-coventry-and-warwickshire', id, 'iui', '2025-09-11', 0, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner has living or adopted children of any age', 'Intrauterine insemination (IUI) is explicitly not commissioned in line with Clinical Guideline Addendum 156.1 August 2016.'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-coventry-and-warwickshire', id, 'di', '2025-09-11', 0, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner has living or adopted children of any age', 'The Commissioner will fund donor sperm procedures where the male partner has Azoospermia or Oligospermia.'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Derby and Derbyshire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-derby-and-derbyshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 12, 0, 1, 'No living child from current or previous relationship. Adopted children count as biological; children given up for adoption do not.', 'Neither partner may be previously sterilised. E-cigarettes allowed. 1 cycle offered for women up to 42 (conditions apply for 40-42). Same-sex couples and single women eligible.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-derby-and-derbyshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 12, 0, 1, 'No living child from current or previous relationship. Adopted children count as biological; children given up for adoption do not.', 'Neither partner may be previously sterilised. E-cigarettes allowed. 1 cycle offered for women up to 42 (conditions apply for 40-42). Same-sex couples and single women eligible.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-derby-and-derbyshire', id, 'iui', '2025-09-11', 6, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationship(s), including adopted children, but excluding foster children.', 'NHS funds 6 cycles ONLY after 6 self-funded cycles are completed (except if male partner is HIV positive, where the initial 6 are funded). E-cigarettes allowed.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Devon (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-devon', id, 'ivf', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.', '1 fresh and 1 frozen transfer. Same-sex couples require 6 privately funded AI cycles, then 6 NHS IUI cycles before IVF. Neither partner may be sterilised. Stable relationship for 2+ years required.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-devon', id, 'icsi', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.', 'Offered for male factor infertility or previous IVF fertilisation failure. Neither partner may be sterilised. Stable relationship for 2+ years required.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-devon', id, 'iui', '2025-09-11', 6, NULL, 40, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.', 'Up to 12 cycles for physical/psychosexual disability or HIV sperm washing. 6 cycles for same-sex couples (after 6 private AI cycles). Not routinely offered for unexplained infertility.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-devon', id, 'di', '2025-09-11', 6, NULL, 40, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.', 'Funded for azoospermia, severe semen deficits, genetic/infectious disease risk, or severe rhesus isoimmunisation. Up to 6 unstimulated or 3 stimulated IUI cycles offered before IVF.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Dorset (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-dorset', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 12, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.', '1 full cycle includes 1 fresh and 1 frozen embryo transfer. Patients using artificial insemination must complete 12 cycles (at least 6 by IUI) before IVF.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-dorset', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 12, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.', 'Indicated for severe semen deficits, azoospermia, or previous failed fertilization. 1 full cycle includes 1 fresh and 1 frozen embryo transfer.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-dorset', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 29.9, NULL, NULL, 0, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.', 'Up to 6 cycles of unstimulated IUI offered for same-sex couples, physical/psychosexual disability, or specific conditions (e.g., HIV). Not routinely offered for unexplained infertility.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-dorset', id, 'fet', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 0, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.', '1 frozen cycle is available if there are embryos generated from the fresh cycle suitable for freezing. Minimum 3-month interval between fresh and frozen cycle.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Frimley (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-frimley', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).', 'Referral must be before 35th birthday. Max 2 previous self-funded fresh IVF cycles allowed. 12 cycles of AI (at least 6 IUI) required if not conceiving via unprotected intercourse.'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-frimley', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).', 'Referral must be before 35th birthday. Max 2 previous self-funded fresh IVF cycles allowed. 12 cycles of AI (at least 6 IUI) required if not conceiving via unprotected intercourse.'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-frimley', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).', 'Up to 6 cycles of unstimulated IUI using partner sperm for physical/psychosexual problems or specific conditions. Not routinely funded for unexplained infertility or mild endometriosis.'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-frimley', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).', 'Up to 6 cycles of unstimulated IUI using donor sperm for azoospermia, genetic risk, or after 6 self-funded AI cycles for same-sex/single patients.'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-frimley', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).', 'The transfer of frozen-thawed embryos from previous cycles of IVF will not be funded. Only 1 fresh embryo transfer is included in the funded IVF cycle.'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

-- Gloucestershire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-gloucestershire', id, 'ivf', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).', 'Must be in a stable relationship for at least 2 years. Alcohol must be within DH guidelines; no recreational drugs for 6 months. Not funded if infertility is due to previous sterilisation. Same-sex couples and single women are eligible.'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-gloucestershire', id, 'icsi', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).', 'Must be in a stable relationship for at least 2 years. Alcohol must be within DH guidelines; no recreational drugs for 6 months. Not funded if infertility is due to previous sterilisation. Same-sex couples and single women are eligible.'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-gloucestershire', id, 'iui', '2025-09-11', 3, 18, 39, 19, 29.5, 5.4, 12, 0, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).', '3 cycles of IUI (including donor sperm if required) are funded for same-sex couples, single women, or those unable to have vaginal intercourse. Any IUI treatment replaces one cycle of IVF/ICSI.'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-gloucestershire', id, 'fet', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).', 'Where frozen embryos can successfully be developed, the ICB will fund implantation of these in preference to new fresh embryos for a second cycle. Maximum of two embryo transfer opportunities total.'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hampshire and Isle of Wight (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-hampshire-and-isle-of-wight', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)', '1 cycle includes up to 2 embryo transfers. Max 2 previous self-funded fresh cycles allowed. Excludes previous NHS funded fresh cycles. Subfertility cannot be the result of a sterilisation procedure.'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-hampshire-and-isle-of-wight', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)', '1 cycle includes up to 2 embryo transfers. Max 2 previous self-funded fresh cycles allowed. Excludes previous NHS funded fresh cycles. Subfertility cannot be the result of a sterilisation procedure.'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-hampshire-and-isle-of-wight', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Funded for physical disability, psychosexual problems, or as an alternative to IVF for social/cultural/religious objections. Requires 6 self-funded AI cycles first for some groups.'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-hampshire-and-isle-of-wight', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'Funded for azoospermia, severe semen deficits, genetic risk, rhesus isoimmunisation, or after 6 self-funded AI cycles for same-sex/single/transgender patients.'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-hampshire-and-isle-of-wight', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)', 'The transfer of frozen stored embryos from previous cycles of IVF will not be funded. Frozen transfers are only funded as part of the single fresh IVF cycle provision (up to 2 transfers total).'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Herefordshire and Worcestershire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-herefordshire-and-worcestershi', id, 'ivf', '2025-09-11', 1, 18, 39, 19, 29, 5.4, 9, 6, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).', 'No prior IVF/ICSI (NHS or private). Neither partner can be sterilised. Male BMI should be 29 or less. Max 2 embryos transferred (or 3 eggs).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-herefordshire-and-worcestershi', id, 'icsi', '2025-09-11', 1, 18, 39, 19, 29, 5.4, 9, 6, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).', 'No prior IVF/ICSI (NHS or private). Neither partner can be sterilised. Male BMI should be 29 or less. Max 2 embryos transferred (or 3 eggs).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-herefordshire-and-worcestershi', id, 'iui', '2025-09-11', 3, 18, 39, 19, 29, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).', 'Funded for physical disability/psychosexual problems preventing intercourse, same-sex relationships, or known reproductive pathology. Donor sperm funded if required.'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-herefordshire-and-worcestershi', id, 'fet', '2025-09-11', 1, 18, 42, 19, 29, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).', '1 single treatment utilising resultant gametes/embryos funded for patients who undertook prior NHS cryopreservation. May use material up to age 42 if clinically unable to use before 40.'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hertfordshire and West Essex (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-hertfordshire-and-west-essex', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 12, 1, 1, 'No living children from current or previous relationships, including adopted children.', '1 full cycle includes a maximum of 2 embryo transfers. Same-sex couples require 6 self-funded and 6 NHS-funded IUI cycles before IVF. Previous sterilisation renders couples ineligible.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-hertfordshire-and-west-essex', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 12, 1, 1, 'No living children from current or previous relationships, including adopted children.', 'Funded as part of the IVF cycle (1 full cycle, max 2 transfers). Same-sex couples require 6 self-funded and 6 NHS-funded IUI cycles before IVF/ICSI.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-hertfordshire-and-west-essex', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships, including adopted children.', 'Maximum of 6 NHS-funded cycles offered only if the couple has previously self-funded 6 cycles. Donor sperm must be self-funded.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-hertfordshire-and-west-essex', id, 'fet', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships, including adopted children.', 'Included within the 1 full IVF cycle (maximum of 2 embryo transfers total). Storage of frozen embryos is funded for 1 year following egg collection.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Kent and Medway (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-kent-and-medway', id, 'ivf', '2025-09-11', 2, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Max 4 embryo transfers total (max 2 fresh). Will not be funded if 3 previous fresh cycles received. AI pathway requires 12 unsuccessful cycles (at least 6 IUI). Unexplained infertility requires 2 years unprotected sex.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-kent-and-medway', id, 'icsi', '2025-09-11', 2, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Max 4 embryo transfers total (max 2 fresh). Will not be funded if 3 previous fresh cycles received. AI pathway requires 12 unsuccessful cycles (at least 6 IUI).'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-kent-and-medway', id, 'iui', '2025-09-11', 6, NULL, 39, 19, 30, 5.4, NULL, 0, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Up to 6 cycles of unstimulated IUI using partner or donor sperm. Funded for physical/psychosexual problems, HIV sperm washing, or as an alternative to IVF for social/cultural/religious objections.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-kent-and-medway', id, 'fet', '2025-09-11', 4, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Maximum of 4 embryo transfer procedures funded (no more than 2 from fresh cycles). All good quality frozen embryos must be transferred before starting the next NHS funded fresh cycle.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lancashire and South Cumbria (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-lancashire-and-south-cumbria', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner', 'Includes transfer of all resultant fresh and frozen embryos. Neither partner must have been previously sterilised. E-cigarettes are considered equivalent to non-smoking.'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-lancashire-and-south-cumbria', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner', 'ICSI is regarded as a type of IVF. Includes transfer of all resultant fresh and frozen embryos. Neither partner must have been previously sterilised.'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-lancashire-and-south-cumbria', id, 'iui', '2025-09-11', 12, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner', 'Up to 12 separate attempts at IUI. Neither partner must have been previously sterilised. E-cigarettes are considered equivalent to non-smoking.'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lincolnshire (high confidence, 2020)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-lincolnshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships', 'Neither partner previously sterilised. Same-sex couples require 6 privately funded AI cycles before assessment. Single women are not funded.'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-lincolnshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships', 'Neither partner previously sterilised. Same-sex couples require 6 privately funded AI cycles before assessment. Single women are not funded.'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-lincolnshire', id, 'iui', '2025-09-11', 3, 23, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living children from current or previous relationships', 'Unstimulated IUI only. Same-sex couples require 6 privately funded AI cycles prior. No previous IVF cycles allowed. Single women not funded.'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-lincolnshire', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships', 'Frozen embryo transfers are included as part of the complete IVF cycle. Not funded for embryos remaining after a live birth.'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Mid and South Essex (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-mid-and-south-essex', id, 'ivf', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).', 'Max 2 cycles (4 transfers) for ages 23-39; 1 cycle (2 transfers) for ages 40-41. Same-sex couples must self-fund 6 IUI cycles. Male BMI must be < 35. Neither partner may be sterilised.'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-mid-and-south-essex', id, 'icsi', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).', 'Funded under same criteria as IVF if sperm quality/quantity is poor, zero sperm in semen but retrievable, or previous IVF resulted in poor/no fertilisation.'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-mid-and-south-essex', id, 'iui', '2025-09-11', 0, 23, 41, 19, 30, NULL, NULL, 0, 0, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).', 'IUI is not routinely funded. Same-sex couples must self-fund up to 6 cycles of IUI to be eligible for IVF.'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-mid-and-south-essex', id, 'di', '2025-09-11', 0, 23, 41, 19, 30, NULL, NULL, 0, 0, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).', 'Donor insemination is explicitly defined as not funded by the ICB.'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-mid-and-south-essex', id, 'fet', '2025-09-11', 4, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).', 'Up to 4 embryo transfers (fresh and frozen) for ages 23-39; up to 2 transfers for ages 40-41. All viable embryos must be used before a further cycle is funded.'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

-- Norfolk and Waveney (high confidence, 2019)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-norfolk-and-waveney', id, 'ivf', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.', 'Max 2 fresh cycles for ages 23-39; 1 fresh cycle for ages 40-41. E-cigarette users are not classed as smokers. Ineligible if previous sterilisation has taken place.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-norfolk-and-waveney', id, 'icsi', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.', 'Max 2 fresh cycles for ages 23-39; 1 fresh cycle for ages 40-41. E-cigarette users are not classed as smokers. Ineligible if previous sterilisation has taken place.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-norfolk-and-waveney', id, 'iui', '2025-09-11', 6, 23, 41, 19, 30, 5.4, 9, 0, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.', 'Maximum of 6 cycles of unstimulated IUI offered as a replacement for IVF/ICSI and without donor sperm. Available for physical/psychosexual issues, same-sex couples, or single parents.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-norfolk-and-waveney', id, 'di', '2025-09-11', 6, 23, 41, 19, 30, 5.4, 9, 0, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.', 'Funded up to 6 cycles for specific conditions including azoospermia, severe semen deficits, infectious disease, severe rhesus isoimmunisation, or high risk of genetic disorder transmission.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

-- North Central London (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-north-central-london', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.', 'Patients under 40 are eligible for up to 3 fresh cycles (max 6 embryo transfers). Patients aged 40-42 are eligible for 1 fresh cycle (max 2 embryo transfers). Neither partner can have undergone previous sterilisation.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-north-central-london', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.', 'Patients under 40 are eligible for up to 3 fresh cycles (max 6 embryo transfers). Patients aged 40-42 are eligible for 1 fresh cycle (max 2 embryo transfers). Neither partner can have undergone previous sterilisation.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-north-central-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.', 'Funded for physical/psychosexual inability to have intercourse, HIV sperm washing, spinal cord injury, or exceptional social/cultural/religious objections to IVF.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-north-central-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 6, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.', 'Funded for azoospermia, genetic/infectious risks, or same-sex/single people after 6 self-funded IUI cycles. Donor sperm must be sourced and paid for by the patient.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

-- North East London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-north-east-london', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.', 'Under 40: up to 3 cycles. 40-42: 1 cycle. No previous sterilisation. Same-sex/single people require 12 self-funded IUI cycles (6 if aged 36+) before IVF.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-north-east-london', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.', 'Funded as part of IVF cycle. Under 40: up to 3 cycles. 40-42: 1 cycle. No previous sterilisation. Same-sex/single people require 12 self-funded IUI cycles (6 if aged 36+) before IVF.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-north-east-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.', 'Up to 6 cycles using partner sperm for physical/psychosexual problems (requires 6 self-funded cycles first) or sperm washing (e.g., HIV). No previous sterilisation.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-north-east-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.', 'Up to 6 cycles using donor sperm for azoospermia, genetic risk, or individuals/same-sex couples after 6 self-funded IUI cycles. Donor sperm must be self-funded. No previous sterilisation.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-north-east-london', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.', 'All frozen embryos must be transferred before starting the next fresh IVF cycle. Storage funded for a maximum of two years following each fresh cycle.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North East and North Cumbria (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-north-east-and-north-cumbria', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.', '3 cycles for women under 40; 1 cycle for women aged 40-42. Previous privately funded cycles are deducted from the NHS entitlement. Male partner must also be a non-smoker if there is male factor infertility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-north-east-and-north-cumbria', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.', '3 cycles for women under 40; 1 cycle for women aged 40-42. Previous privately funded cycles are deducted from the NHS entitlement. Male partner must also be a non-smoker if there is male factor infertility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-north-east-and-north-cumbria', id, 'iui', '2025-09-11', 12, NULL, 42, 19, 30, NULL, NULL, 0, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.', 'Up to 12 cycles of artificial insemination using partner''s sperm are funded.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-north-east-and-north-cumbria', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, NULL, NULL, 0, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.', 'Up to 6 cycles of artificial insemination using donor sperm (by an HFEA licensed provider) are funded.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-north-east-and-north-cumbria', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, NULL, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.', 'A full cycle of IVF/ICSI includes the transfer of the fresh and frozen embryo(s) relating to that cycle.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North West London (high confidence, 2016)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-north-west-london', id, 'ivf', '2025-09-11', 1, NULL, 39, NULL, 29.9, NULL, NULL, 12, 0, 1, 'No living biological or adopted children from current or previous relationships', '1 cycle defined as 1 fresh and 1 frozen transfer. Same-sex couples/single women require 12 self-funded AI cycles (at least 6 by IUI). Donor sperm is not funded.'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-north-west-london', id, 'icsi', '2025-09-11', 1, NULL, 39, NULL, 29.9, NULL, NULL, 12, 0, 1, 'No living biological or adopted children from current or previous relationships', '1 cycle defined as 1 fresh and 1 frozen transfer. Same-sex couples/single women require 12 self-funded AI cycles (at least 6 by IUI). Donor sperm is not funded.'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-north-west-london', id, 'iui', '2025-09-11', 6, NULL, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'No living biological or adopted children from current or previous relationships', 'Funded specifically for couples where the male partner is HIV positive (sperm washing) to prevent transmission to an unborn child.'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

-- Northamptonshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-northamptonshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships (adopted children count as biological).', 'Same-sex couples must complete 6 cycles of AI. Neither partner can be previously sterilised. Ovarian stimulation must be completed before the woman''s 43rd birthday.'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-northamptonshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships (adopted children count as biological).', 'Same-sex couples must complete 6 cycles of AI. Neither partner can be previously sterilised. Ovarian stimulation must be completed before the woman''s 43rd birthday.'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Nottingham and Nottinghamshire (high confidence, 2014)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-nottingham-and-nottinghamshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 0, 0, 1, 'Couples must not have a living child from their current relationship nor any previous relationships (includes adopted children).', 'Same-sex couples eligible provided evidence of subfertility following AI (as per local CCG policy). No funding if either partner has been sterilised or had sterilisation reversed.'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-nottingham-and-nottinghamshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 0, 0, 1, 'Couples must not have a living child from their current relationship nor any previous relationships (includes adopted children).', 'Same-sex couples eligible provided evidence of subfertility following AI (as per local CCG policy). No funding if either partner has been sterilised or had sterilisation reversed.'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Shropshire, Telford and Wrekin (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-shropshire-telford-and-wrekin', id, 'ivf', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.', 'Previous IVF treatment (however funded) precludes eligibility. Same-sex couples must self-fund 6 IUI cycles to demonstrate infertility. Previous sterilisation precludes eligibility.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-shropshire-telford-and-wrekin', id, 'icsi', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.', 'Previous IVF treatment (however funded) precludes eligibility. Same-sex couples must self-fund 6 IUI cycles to demonstrate infertility. Previous sterilisation precludes eligibility.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-shropshire-telford-and-wrekin', id, 'iui', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.', 'One cycle of IUI is commissioned where appropriate. Previous IVF treatment precludes eligibility. Previous sterilisation precludes eligibility.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-shropshire-telford-and-wrekin', id, 'fet', '2025-09-11', 0, 18, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.', 'Freezing and subsequent transfer of any resultant frozen embryos is included if the fresh transfer is not successful, as part of one full cycle.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Somerset (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-somerset', id, 'ivf', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 9, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.', 'Male partner must be under 54. Neither partner may be sterilised. Same-sex/unexplained infertility requires 6 cycles of insemination plus 3 further NHS-funded IUI cycles before IVF is considered.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-somerset', id, 'icsi', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 9, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.', 'Male partner must be under 54. Neither partner may be sterilised. Same-sex/unexplained infertility requires 6 cycles of insemination plus 3 further NHS-funded IUI cycles before IVF is considered.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-somerset', id, 'iui', '2025-09-11', 9, 23, 39, 19, 29.9, 5.4, 15, 0, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.', 'Up to 6 initial unstimulated IUI funded, followed by a further 3 if appropriate. Couples with mild male factor, unexplained infertility, or mild endometriosis are offered up to 6 stimulated IUI cycles.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-somerset', id, 'fet', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 0, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.', 'One further full cycle using frozen embryo(s) will follow a fresh cycle if deemed clinically appropriate.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South East London (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-south-east-london', id, 'ivf', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Up to 2 cycles for under 40s; 1 cycle for ages 40-42 (if no previous IVF). Natural cycle IVF not funded. Neither partner may have undergone previous sterilisation.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-south-east-london', id, 'icsi', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Funded under the same criteria as IVF. Up to 2 cycles for under 40s; 1 cycle for ages 40-42. Neither partner may have undergone previous sterilisation.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-south-east-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, NULL, 0, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Up to 6 cycles using partner sperm for specific conditions (e.g., physical disability, HIV sperm washing) or as an alternative to IVF for social/cultural/religious objections.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-south-east-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'Up to 6 cycles of IUI using donor sperm. Patients must source and pay for the donor sperm. Requires 6 self-funded IUI cycles first for individuals/couples using donor insemination.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-south-east-london', id, 'fet', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.', 'All frozen embryos must be transferred before starting the next NHS funded fresh IVF cycle. Storage of cryopreserved embryos is funded for a maximum of two years following a fresh cycle.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South West London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-south-west-london', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships', '1 cycle funded. Previous self-funded cycles limit: max 2 if under 40, max 1 if over 40. Same-sex/single women must self-fund 12 IUI cycles. Neither partner should have undergone previous sterilisation.'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-south-west-london', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships', '1 cycle funded. Previous self-funded cycles limit: max 2 if under 40, max 1 if over 40. Same-sex/single women must self-fund 12 IUI cycles. Neither partner should have undergone previous sterilisation.'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-south-west-london', id, 'iui', '2025-09-11', 12, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships', 'Up to 12 cycles funded for heterosexual couples unable to have vaginal intercourse due to physical disability or psychosexual problems. Not routinely funded for same-sex couples or single women.'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-south-west-london', id, 'fet', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships', 'A full IVF/ICSI cycle includes 1 fresh and 1 frozen embryo transfer. If fresh transfer is not possible due to medical reasons, 2 FETs are funded.'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-south-yorkshire', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', '1 full cycle funded for women aged 18-42. Couples must co-habit for 2 years. No funding if previously sterilised. IUI is not a strict requirement if impractical.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-south-yorkshire', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', '1 full cycle funded for women aged 18-42. Couples must co-habit for 2 years. No funding if previously sterilised. IUI is not a strict requirement if impractical.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-south-yorkshire', id, 'iui', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'Up to 6 cycles funded for same-sex couples, physical disability, or psychosexual problems. Not routinely funded for unexplained infertility.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-south-yorkshire', id, 'di', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'Up to 6 cycles of donor insemination offered where clinically indicated (e.g., azoospermia). Patients placed on waiting list for up to 3 years.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-south-yorkshire', id, 'fet', '2025-09-11', 0, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'FET is included as part of a full IVF cycle. All stored and viable embryos should be used before a new cycle commences.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Staffordshire and Stoke-on-Trent (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-staffordshire-and-stoke-on-tre', id, 'ivf', '2025-09-11', 1, 23, 39, 19, 30, 3, NULL, 6, 0, 1, 'Couples must not have a living child from their current or any previous relationships (includes adopted children, excludes foster children).', '1 partial cycle funded (includes 1 fresh or frozen transfer). Donor sperm is not funded. Previous sterilisation makes couples ineligible. Same-sex couples require 6 self-funded IUI/DI cycles to demonstrate infertility.'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-staffordshire-and-stoke-on-tre', id, 'icsi', '2025-09-11', 1, 23, 39, 19, 30, 3, NULL, 6, 0, 1, 'Couples must not have a living child from their current or any previous relationships (includes adopted children, excludes foster children).', '1 partial cycle funded (includes 1 fresh or frozen transfer). Donor sperm is not funded. Previous sterilisation makes couples ineligible. Same-sex couples require 6 self-funded IUI/DI cycles to demonstrate infertility.'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Suffolk and North East Essex (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-suffolk-and-north-east-essex', id, 'ivf', '2025-09-11', 2, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships', 'Women aged 23-39 get 2 cycles; 40-42 get 1 cycle. Same-sex couples require 12 cycles of AI to prove infertility. Male partner must be 23-54, BMI <30. No previous sterilisation.'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-suffolk-and-north-east-essex', id, 'icsi', '2025-09-11', 2, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships', 'Women aged 23-39 get 2 cycles; 40-42 get 1 cycle. Same-sex couples require 12 cycles of AI to prove infertility. Male partner must be 23-54, BMI <30. No previous sterilisation.'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-suffolk-and-north-east-essex', id, 'di', '2025-09-11', 6, 23, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships', 'Funded for max 6 cycles if male partner has inheritable genetic condition, severe rhesus incompatibility, or azoospermia. Followed by IVF with donor sperm if needed.'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-suffolk-and-north-east-essex', id, 'iui', '2025-09-11', 0, 23, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships', 'Due to poor clinical evidence, intra uterine insemination (IUI) will only be offered in exceptional circumstances.'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-suffolk-and-north-east-essex', id, 'fet', '2025-09-11', 0, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships', 'Frozen embryos must be used before a fresh cycle is funded. Maximum of 4 embryo transfers (fresh plus frozen) funded for women under 40.'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

-- Surrey Heartlands (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-surrey-heartlands', id, 'ivf', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.', 'Up to 2 cycles if no previous NHS cycles; 1 cycle if 1 previous NHS cycle. Privately funded cycles do not count unless they resulted in a living child. Single embryo transfer is preferred.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-surrey-heartlands', id, 'icsi', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.', 'Up to 2 cycles if no previous NHS cycles; 1 cycle if 1 previous NHS cycle. Privately funded cycles do not count unless they resulted in a living child. Single embryo transfer is preferred.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-surrey-heartlands', id, 'iui', '2025-09-11', 6, 23, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.', 'Funded for physical/psychosexual disability, HIV sperm washing, same-sex relationships, social/cultural/religious objections to IVF, or females with no partner. Not funded for unexplained infertility or mild endometriosis.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-surrey-heartlands', id, 'fet', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.', 'A ''full cycle'' of IVF includes the transfer of 1 set of fresh and 1 set of frozen embryos, if available. Cryopreservation of good-quality embryos is funded for up to 2 years.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

-- Sussex (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-sussex', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.', '1 cycle includes 1 fresh and 1 frozen embryo transfer. Same-sex couples/single women require 12 AI cycles (6 self-funded, 6 NHS) before IVF. No surrogacy funded.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-sussex', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.', '1 cycle includes 1 fresh and 1 frozen embryo transfer. Same-sex couples/single women require 12 AI cycles (6 self-funded, 6 NHS) before ICSI. No surrogacy funded.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-sussex', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 29.9, 5.4, NULL, 6, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.', '6 NHS IUI cycles offered after 6 self-funded AI cycles for same-sex couples, single women, or those unable to have vaginal intercourse.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-sussex', id, 'di', '2025-09-11', 6, NULL, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.', 'Donor insemination funded for azoospermia, severe semen deficits, or high risk of transmitting genetic/infectious diseases. Inherits IUI cycle limits.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-sussex', id, 'fet', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.', '1 frozen embryo transfer included per IVF cycle. Patients at moderate/high risk of OHSS can have up to 2 frozen embryos transferred instead of a fresh cycle.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

-- West Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-west-yorkshire', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'West Yorkshire ICB funds 1 cycle. Couples must co-habit for 2 years. No funding for sterilised patients. E-cigarettes allowed if no concurrent tobacco use. Patients aged 40-42 must have no previous IVF and meet ovarian reserve criteria.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-west-yorkshire', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'West Yorkshire ICB funds 1 cycle. Couples must co-habit for 2 years. No funding for sterilised patients. E-cigarettes allowed if no concurrent tobacco use. Patients aged 40-42 must have no previous IVF and meet ovarian reserve criteria.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-west-yorkshire', id, 'iui', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'Up to 6 cycles funded for physical disability, psychosexual problems, same-sex relationships, or specific conditions. Not routinely funded for unexplained infertility.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-west-yorkshire', id, 'di', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'Up to 6 cycles of donor insemination offered where clinically indicated. Cost of donor sperm is included. Patients requiring donor gametes placed on waiting list up to 3 years.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-west-yorkshire', id, 'fet', '2025-09-11', 1, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.', 'A full cycle includes sequential replacement of all frozen embryos from the fresh stimulation cycle until pregnancy is successful or no embryos remain.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Cornwall and the Isles of Scilly (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-ivf-cornwall-and-the-isles-of-scil', id, 'ivf', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships', 'Residency required. 2-year stable relationship. No previous NHS funded fertility treatment. Max 3 self-funded cycles. Same-sex couples: NHS funding not available for donor insemination or surrogacy.'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-icsi-cornwall-and-the-isles-of-scil', id, 'icsi', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships', 'Offered if few/poor quality sperm, no sperm (surgically recoverable), or failed IVF. Same-sex provisions apply.'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-iui-cornwall-and-the-isles-of-scil', id, 'iui', '2025-09-11', 4, NULL, 40, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships', 'Residency required. 2-year stable relationship. No previous NHS funded fertility treatment.'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-di-cornwall-and-the-isles-of-scil', id, 'di', '2025-09-11', 4, NULL, 40, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships', 'Funded for severe male factor infertility, high risk of genetic disorder, or rhesus isoimmunisation. Same-sex provisions apply.'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule, additional_notes)
SELECT 'pol-fet-cornwall-and-the-isles-of-scil', id, 'fet', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships', 'Available from remaining embryos if fresh cycle unsuccessful. NHS funds cryopreservation for 1 year.'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1;
