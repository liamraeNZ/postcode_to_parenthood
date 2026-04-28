-- ICB policy seed data (generated from extracted PDF policies)
-- Generated: 2026-04-28T11:57:22.549Z
-- Source: 38 ICB policy documents via scripts/extractPolicies.ts

-- Bedfordshire, Luton and Milton Keynes (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bedfordshire-luton-and-milton-', id, 'ivf', '2025-09-11', 1, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'Couples or single people are not eligible if there are any living children from the current or any previous relationships, to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-bedfordshire-luton-and-milton-', id, 'icsi', '2025-09-11', 1, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'Couples or single people are not eligible if there are any living children from the current or any previous relationships, to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-bedfordshire-luton-and-milton-', id, 'iui', '2025-09-11', 6, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Couples or single people are not eligible if there are any living children from the current or any previous relationships, to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-bedfordshire-luton-and-milton-', id, 'di', '2025-09-11', 6, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Couples or single people are not eligible if there are any living children from the current or any previous relationships, to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-bedfordshire-luton-and-milton-', id, 'fet', '2025-09-11', 3, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'Couples or single people are not eligible if there are any living children from the current or any previous relationships, to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

-- Birmingham and Solihull (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-birmingham-and-solihull', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Black Country (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-black-country', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-black-country', id, 'icsi', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-black-country', id, 'iui', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-black-country', id, 'di', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-black-country', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bristol, North Somerset and South Gloucestershire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bristol-north-somerset-and-sou', id, 'ivf', '2025-09-11', 1, 38, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Cambridgeshire and Peterborough (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-cambridgeshire-and-peterboroug', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-cambridgeshire-and-peterboroug', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

-- Cornwall and the Isles of Scilly (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-cornwall-and-the-isles-of-scil', id, 'ivf', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Coventry and Warwickshire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-coventry-and-warwickshire', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Derby and Derbyshire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-derby-and-derbyshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-derby-and-derbyshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-derby-and-derbyshire', id, 'iui', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hertfordshire and West Essex (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-hertfordshire-and-west-essex', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Dorset (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-dorset', id, 'ivf', '2025-09-11', 1, 41, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lincolnshire (high confidence, 2020)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-lincolnshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-lincolnshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Sussex (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-sussex', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

-- Devon (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-devon', id, 'ivf', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-devon', id, 'icsi', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-devon', id, 'iui', '2025-09-11', 6, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-devon', id, 'di', '2025-09-11', 6, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-devon', id, 'fet', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Gloucestershire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-gloucestershire', id, 'ivf', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-gloucestershire', id, 'icsi', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-gloucestershire', id, 'iui', '2025-09-11', 3, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-gloucestershire', id, 'di', '2025-09-11', 3, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-gloucestershire', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hampshire and Isle of Wight (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-hampshire-and-isle-of-wight', id, 'ivf', '2025-09-11', 1, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-hampshire-and-isle-of-wight', id, 'icsi', '2025-09-11', 1, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-hampshire-and-isle-of-wight', id, 'iui', '2025-09-11', 6, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-hampshire-and-isle-of-wight', id, 'di', '2025-09-11', 6, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-hampshire-and-isle-of-wight', id, 'fet', '2025-09-11', 2, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Herefordshire and Worcestershire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-herefordshire-and-worcestershi', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-herefordshire-and-worcestershi', id, 'icsi', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-herefordshire-and-worcestershi', id, 'iui', '2025-09-11', 3, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-herefordshire-and-worcestershi', id, 'di', '2025-09-11', 3, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-herefordshire-and-worcestershi', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Kent and Medway (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-kent-and-medway', id, 'ivf', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-kent-and-medway', id, 'icsi', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-kent-and-medway', id, 'iui', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-kent-and-medway', id, 'di', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-kent-and-medway', id, 'fet', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lancashire and South Cumbria (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-lancashire-and-south-cumbria', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-lancashire-and-south-cumbria', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-lancashire-and-south-cumbria', id, 'iui', '2025-09-11', 12, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-lancashire-and-south-cumbria', id, 'di', '2025-09-11', 12, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-lancashire-and-south-cumbria', id, 'fet', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North Central London (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-central-london', id, 'ivf', '2025-09-11', 3, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-central-london', id, 'icsi', '2025-09-11', 3, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-central-london', id, 'iui', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-north-central-london', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-north-central-london', id, 'fet', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

-- North East London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-east-london', id, 'ivf', '2025-09-11', 3, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North West London (high confidence, 2016)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-west-london', id, 'ivf', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-west-london', id, 'icsi', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-west-london', id, 'iui', '2025-09-11', 6, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-north-west-london', id, 'fet', '2025-09-11', 1, 40, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

-- Northamptonshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-northamptonshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-northamptonshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Nottingham and Nottinghamshire (high confidence, 2014)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-nottingham-and-nottinghamshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-nottingham-and-nottinghamshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Shropshire, Telford and Wrekin (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-shropshire-telford-and-wrekin', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-shropshire-telford-and-wrekin', id, 'icsi', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-shropshire-telford-and-wrekin', id, 'iui', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-shropshire-telford-and-wrekin', id, 'di', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-shropshire-telford-and-wrekin', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Somerset (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-somerset', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-somerset', id, 'icsi', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-somerset', id, 'iui', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-somerset', id, 'di', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-somerset', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South West London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-west-london', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-west-london', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-west-london', id, 'iui', '2025-09-11', 12, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-south-west-london', id, 'di', '2025-09-11', 12, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-west-london', id, 'fet', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Surrey Heartlands (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-surrey-heartlands', id, 'ivf', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-surrey-heartlands', id, 'icsi', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-surrey-heartlands', id, 'iui', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-surrey-heartlands', id, 'di', '2025-09-11', 6, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

-- West Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-west-yorkshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-west-yorkshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-west-yorkshire', id, 'iui', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-west-yorkshire', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-west-yorkshire', id, 'fet', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bath and North East Somerset, Swindon and Wiltshire (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bath-and-north-east-somerset-s', id, 'ivf', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-bath-and-north-east-somerset-s', id, 'icsi', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-bath-and-north-east-somerset-s', id, 'iui', '2025-09-11', 2, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-bath-and-north-east-somerset-s', id, 'fet', '2025-09-11', 1, 39, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Buckinghamshire, Oxfordshire and Berkshire West (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-buckinghamshire-oxfordshire-an', id, 'ivf', '2025-09-11', 1, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-buckinghamshire-oxfordshire-an', id, 'icsi', '2025-09-11', 1, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-buckinghamshire-oxfordshire-an', id, 'iui', '2025-09-11', 6, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-buckinghamshire-oxfordshire-an', id, 'di', '2025-09-11', 6, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-buckinghamshire-oxfordshire-an', id, 'fet', '2025-09-11', 0, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

-- Frimley (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-frimley', id, 'ivf', '2025-09-11', 1, 34, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

-- Mid and South Essex (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-mid-and-south-essex', id, 'ivf', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-mid-and-south-essex', id, 'icsi', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

-- Norfolk and Waveney (high confidence, 2019)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-norfolk-and-waveney', id, 'ivf', '2025-09-11', 2, 41, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-norfolk-and-waveney', id, 'icsi', '2025-09-11', 2, 41, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-norfolk-and-waveney', id, 'iui', '2025-09-11', 6, 41, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-norfolk-and-waveney', id, 'di', '2025-09-11', 6, 41, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

-- North East and North Cumbria (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-east-and-north-cumbria', id, 'ivf', '2025-09-11', 3, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-east-and-north-cumbria', id, 'icsi', '2025-09-11', 3, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-east-and-north-cumbria', id, 'iui', '2025-09-11', 12, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-north-east-and-north-cumbria', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South East London (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-east-london', id, 'ivf', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-east-london', id, 'icsi', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-east-london', id, 'iui', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-south-east-london', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-east-london', id, 'fet', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-yorkshire', id, 'ivf', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-yorkshire', id, 'icsi', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-yorkshire', id, 'iui', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-south-yorkshire', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-yorkshire', id, 'fet', '2025-09-11', 1, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Staffordshire and Stoke-on-Trent (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-staffordshire-and-stoke-on-tre', id, 'ivf', '2025-09-11', 1, 38, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-staffordshire-and-stoke-on-tre', id, 'icsi', '2025-09-11', 1, 38, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Suffolk and North East Essex (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-suffolk-and-north-east-essex', id, 'ivf', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-suffolk-and-north-east-essex', id, 'icsi', '2025-09-11', 2, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-suffolk-and-north-east-essex', id, 'di', '2025-09-11', 6, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-suffolk-and-north-east-essex', id, 'fet', '2025-09-11', 4, 42, NULL, NULL, NULL, NULL, 0, 0, 1, NULL
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1;
