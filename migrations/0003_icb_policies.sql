-- ICB policy seed data (generated from extracted PDF policies)
-- Generated: 2026-04-28T13:23:02.164Z
-- Source: 38 ICB policy documents via scripts/extractPolicies.ts

-- Bath and North East Somerset, Swindon and Wiltshire (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bath-and-north-east-somerset-s', id, 'ivf', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-bath-and-north-east-somerset-s', id, 'icsi', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-bath-and-north-east-somerset-s', id, 'iui', '2025-09-11', 2, 25, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-bath-and-north-east-somerset-s', id, 'fet', '2025-09-11', 1, 25, 39, 19, 30, NULL, NULL, 12, 0, 1, 'Neither partner may have a living child from their current or previous relationships (including adopted children).'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bedfordshire, Luton and Milton Keynes (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bedfordshire-luton-and-milton-', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-bedfordshire-luton-and-milton-', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-bedfordshire-luton-and-milton-', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-bedfordshire-luton-and-milton-', id, 'fet', '2025-09-11', 3, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

-- Birmingham and Solihull (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-birmingham-and-solihull', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-birmingham-and-solihull', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-birmingham-and-solihull', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-birmingham-and-solihull', id, 'fet', '2025-09-11', 3, 23, 42, 19, 30, 5.4, 8.9, 6, 1, 1, 'No living children from current or previous relationships to either partner, including adopted children.'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Black Country (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-black-country', id, 'ivf', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 6, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-black-country', id, 'icsi', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 6, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-black-country', id, 'iui', '2025-09-11', 6, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-black-country', id, 'di', '2025-09-11', 6, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-black-country', id, 'fet', '2025-09-11', 1, 20, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'Neither partner has living children of any age from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Bristol, North Somerset and South Gloucestershire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-bristol-north-somerset-and-sou', id, 'ivf', '2025-09-11', 1, NULL, 38, 19, 29.9, 5.4, 12, 6, 1, 1, 'No living offspring for either partner or single women'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-bristol-north-somerset-and-sou', id, 'icsi', '2025-09-11', 1, NULL, 38, 19, 29.9, 5.4, 12, 6, 1, 1, 'No living offspring for either partner or single women'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-bristol-north-somerset-and-sou', id, 'iui', '2025-09-11', 3, NULL, 38, 19, 29.9, 5.4, 15, 0, 1, 1, 'No living offspring for either partner or single women'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-bristol-north-somerset-and-sou', id, 'fet', '2025-09-11', 1, NULL, 38, 19, 29.9, NULL, NULL, 6, 1, 1, 'No living offspring for either partner or single women'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Buckinghamshire, Oxfordshire and Berkshire West (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-buckinghamshire-oxfordshire-an', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-buckinghamshire-oxfordshire-an', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-buckinghamshire-oxfordshire-an', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-buckinghamshire-oxfordshire-an', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-buckinghamshire-oxfordshire-an', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

-- Cambridgeshire and Peterborough (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-cambridgeshire-and-peterboroug', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, NULL, 12, 1, 1, 'No living children from current or previous relationships, including adopted children'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-cambridgeshire-and-peterboroug', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, NULL, 12, 1, 1, 'No living children from current or previous relationships, including adopted children'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-cambridgeshire-and-peterboroug', id, 'iui', '2025-09-11', 3, 23, 42, 19, 30, 5.4, NULL, 0, 1, 1, 'No living children from current or previous relationships, including adopted children'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-cambridgeshire-and-peterboroug', id, 'fet', '2025-09-11', 2, 23, 42, 19, 30, 5.4, NULL, 0, 1, 1, 'No living children from current or previous relationships, including adopted children'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

-- Coventry and Warwickshire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-coventry-and-warwickshire', id, 'ivf', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-coventry-and-warwickshire', id, 'icsi', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-coventry-and-warwickshire', id, 'fet', '2025-09-11', 2, NULL, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner has living or adopted children of any age'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-coventry-and-warwickshire', id, 'iui', '2025-09-11', 0, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner has living or adopted children of any age'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-coventry-and-warwickshire', id, 'di', '2025-09-11', 0, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner has living or adopted children of any age'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Derby and Derbyshire (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-derby-and-derbyshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 12, 0, 1, 'No living child from current or previous relationship. Adopted children count as biological; children given up for adoption do not.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-derby-and-derbyshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 12, 0, 1, 'No living child from current or previous relationship. Adopted children count as biological; children given up for adoption do not.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-derby-and-derbyshire', id, 'iui', '2025-09-11', 6, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationship(s), including adopted children, but excluding foster children.'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Devon (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-devon', id, 'ivf', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-devon', id, 'icsi', '2025-09-11', 1, NULL, 39, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-devon', id, 'iui', '2025-09-11', 6, NULL, 40, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-devon', id, 'di', '2025-09-11', 6, NULL, 40, 19, 30, NULL, NULL, 0, 0, 1, 'No living children from current relationship, and at least one partner must have no living children from previous relationships.'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Dorset (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-dorset', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 12, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-dorset', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 12, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-dorset', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 29.9, NULL, NULL, 0, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-dorset', id, 'fet', '2025-09-11', 1, NULL, 42, 19, 29.9, NULL, NULL, 0, 0, 1, 'At least one partner must have no living children, and there must be no living children from the current partnership.'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Frimley (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-frimley', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-frimley', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-frimley', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-frimley', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-frimley', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships for either partner (including adopted children).'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

-- Gloucestershire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-gloucestershire', id, 'ivf', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-gloucestershire', id, 'icsi', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-gloucestershire', id, 'iui', '2025-09-11', 3, 18, 39, 19, 29.5, 5.4, 12, 0, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-gloucestershire', id, 'fet', '2025-09-11', 2, 18, 39, 19, 29.5, 5.4, 12, 6, 1, 1, 'No living children from current or previous relationships (includes adopted children, excludes fostered children).'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hampshire and Isle of Wight (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-hampshire-and-isle-of-wight', id, 'ivf', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-hampshire-and-isle-of-wight', id, 'icsi', '2025-09-11', 1, NULL, 34, 19, 29.9, NULL, NULL, 6, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-hampshire-and-isle-of-wight', id, 'iui', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-hampshire-and-isle-of-wight', id, 'di', '2025-09-11', 6, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-hampshire-and-isle-of-wight', id, 'fet', '2025-09-11', 0, NULL, 34, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living child from current or previous relationships (including adopted children)'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Herefordshire and Worcestershire (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-herefordshire-and-worcestershi', id, 'ivf', '2025-09-11', 1, 18, 39, 19, 29, 5.4, 9, 6, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-herefordshire-and-worcestershi', id, 'icsi', '2025-09-11', 1, 18, 39, 19, 29, 5.4, 9, 6, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-herefordshire-and-worcestershi', id, 'iui', '2025-09-11', 3, 18, 39, 19, 29, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-herefordshire-and-worcestershi', id, 'fet', '2025-09-11', 1, 18, 42, 19, 29, NULL, NULL, 0, 0, 1, 'No living children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hertfordshire and West Essex (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-hertfordshire-and-west-essex', id, 'ivf', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 12, 1, 1, 'No living children from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-hertfordshire-and-west-essex', id, 'icsi', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 12, 1, 1, 'No living children from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-hertfordshire-and-west-essex', id, 'iui', '2025-09-11', 6, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-hertfordshire-and-west-essex', id, 'fet', '2025-09-11', 1, 23, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living children from current or previous relationships, including adopted children.'
FROM icbs WHERE id = 'QM7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Kent and Medway (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-kent-and-medway', id, 'ivf', '2025-09-11', 2, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-kent-and-medway', id, 'icsi', '2025-09-11', 2, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-kent-and-medway', id, 'iui', '2025-09-11', 6, NULL, 39, 19, 30, 5.4, NULL, 0, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-kent-and-medway', id, 'fet', '2025-09-11', 4, NULL, 39, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner in a couple (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lancashire and South Cumbria (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-lancashire-and-south-cumbria', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-lancashire-and-south-cumbria', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-lancashire-and-south-cumbria', id, 'iui', '2025-09-11', 12, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living biological or adopted child from current or any previous relationship for either partner'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Lincolnshire (high confidence, 2020)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-lincolnshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-lincolnshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-lincolnshire', id, 'iui', '2025-09-11', 3, 23, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living children from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-lincolnshire', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Mid and South Essex (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-mid-and-south-essex', id, 'ivf', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-mid-and-south-essex', id, 'icsi', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-mid-and-south-essex', id, 'iui', '2025-09-11', 0, 23, 41, 19, 30, NULL, NULL, 0, 0, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-mid-and-south-essex', id, 'di', '2025-09-11', 0, 23, 41, 19, 30, NULL, NULL, 0, 0, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-mid-and-south-essex', id, 'fet', '2025-09-11', 4, 23, 41, 19, 30, 5.4, 9, 6, 1, 1, 'No surviving children from current or previous relationships (including adopted, excluding fostered).'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

-- Norfolk and Waveney (high confidence, 2019)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-norfolk-and-waveney', id, 'ivf', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-norfolk-and-waveney', id, 'icsi', '2025-09-11', 2, 23, 41, 19, 30, 5.4, 9, 6, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-norfolk-and-waveney', id, 'iui', '2025-09-11', 6, 23, 41, 19, 30, 5.4, 9, 0, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-norfolk-and-waveney', id, 'di', '2025-09-11', 6, 23, 41, 19, 30, 5.4, 9, 0, 0, 1, 'No living or adopted children from the current or any previous relationships for either partner.'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

-- North Central London (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-central-london', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-central-london', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-central-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-north-central-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 6, 0, 1, 'At least one individual in a couple must not have a living child from their relationship or any previous relationship. Single persons should not have a living child.'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

-- North East London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-east-london', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-east-london', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-east-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-north-east-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-north-east-london', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner has a child, or one partner has a child from a previous relationship but the other does not.'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North East and North Cumbria (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-east-and-north-cumbria', id, 'ivf', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-east-and-north-cumbria', id, 'icsi', '2025-09-11', 3, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-east-and-north-cumbria', id, 'iui', '2025-09-11', 12, NULL, 42, 19, 30, NULL, NULL, 0, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-north-east-and-north-cumbria', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, NULL, NULL, 0, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-north-east-and-north-cumbria', id, 'fet', '2025-09-11', 0, NULL, 42, 19, 30, NULL, NULL, 6, 0, 1, 'No living children for any party to the pregnancy with proposed parental responsibility.'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- North West London (high confidence, 2016)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-north-west-london', id, 'ivf', '2025-09-11', 1, NULL, 39, NULL, 29.9, NULL, NULL, 12, 0, 1, 'No living biological or adopted children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-north-west-london', id, 'icsi', '2025-09-11', 1, NULL, 39, NULL, 29.9, NULL, NULL, 12, 0, 1, 'No living biological or adopted children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-north-west-london', id, 'iui', '2025-09-11', 6, NULL, 39, NULL, 29.9, NULL, NULL, 0, 0, 1, 'No living biological or adopted children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

-- Northamptonshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-northamptonshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships (adopted children count as biological).'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-northamptonshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 6, 0, 1, 'No living child from current or previous relationships (adopted children count as biological).'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Nottingham and Nottinghamshire (high confidence, 2014)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-nottingham-and-nottinghamshire', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 0, 0, 1, 'Couples must not have a living child from their current relationship nor any previous relationships (includes adopted children).'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-nottingham-and-nottinghamshire', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 30, NULL, 8.9, 0, 0, 1, 'Couples must not have a living child from their current relationship nor any previous relationships (includes adopted children).'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Shropshire, Telford and Wrekin (high confidence, 2022)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-shropshire-telford-and-wrekin', id, 'ivf', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-shropshire-telford-and-wrekin', id, 'icsi', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-shropshire-telford-and-wrekin', id, 'iui', '2025-09-11', 1, 18, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-shropshire-telford-and-wrekin', id, 'fet', '2025-09-11', 0, 18, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Couples must not have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Somerset (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-somerset', id, 'ivf', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 9, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-somerset', id, 'icsi', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 9, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-somerset', id, 'iui', '2025-09-11', 9, 23, 39, 19, 29.9, 5.4, 15, 0, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-somerset', id, 'fet', '2025-09-11', 1, 23, 39, 19, 29.9, 5.4, 15, 0, 0, 1, 'No living children from the current or previous relationships for either partner, including adopted children but excluding fostered children.'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South East London (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-east-london', id, 'ivf', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-east-london', id, 'icsi', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-east-london', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, NULL, 0, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-south-east-london', id, 'di', '2025-09-11', 6, NULL, 42, 19, 30, 5.4, NULL, 6, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-east-london', id, 'fet', '2025-09-11', 2, NULL, 42, 19, 30, 5.4, NULL, 12, 0, 1, 'Neither partner (or single person) should have a living child from their relationship or any previous relationship, including adopted children.'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South West London (high confidence, 2023)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-west-london', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-west-london', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-west-london', id, 'iui', '2025-09-11', 12, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-west-london', id, 'fet', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 12, 0, 1, 'No living child from current relationship and at least one partner has no living children from previous relationships'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- South Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-south-yorkshire', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-south-yorkshire', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-south-yorkshire', id, 'iui', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-south-yorkshire', id, 'di', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-south-yorkshire', id, 'fet', '2025-09-11', 0, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Staffordshire and Stoke-on-Trent (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-staffordshire-and-stoke-on-tre', id, 'ivf', '2025-09-11', 1, 23, 39, 19, 30, 3, NULL, 6, 0, 1, 'Couples must not have a living child from their current or any previous relationships (includes adopted children, excludes foster children).'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-staffordshire-and-stoke-on-tre', id, 'icsi', '2025-09-11', 1, 23, 39, 19, 30, 3, NULL, 6, 0, 1, 'Couples must not have a living child from their current or any previous relationships (includes adopted children, excludes foster children).'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Suffolk and North East Essex (high confidence, 2021)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-suffolk-and-north-east-essex', id, 'ivf', '2025-09-11', 2, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-suffolk-and-north-east-essex', id, 'icsi', '2025-09-11', 2, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-suffolk-and-north-east-essex', id, 'di', '2025-09-11', 6, 23, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-suffolk-and-north-east-essex', id, 'iui', '2025-09-11', 0, 23, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-suffolk-and-north-east-essex', id, 'fet', '2025-09-11', 0, 23, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Neither partner has a living or adopted child from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

-- Surrey Heartlands (high confidence, 2024)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-surrey-heartlands', id, 'ivf', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-surrey-heartlands', id, 'icsi', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-surrey-heartlands', id, 'iui', '2025-09-11', 6, 23, 39, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-surrey-heartlands', id, 'fet', '2025-09-11', 2, 23, 39, 19, 30, NULL, NULL, 6, 0, 1, 'Neither partner can have a living or adopted child from their current or any previous relationships.'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

-- Sussex (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-sussex', id, 'ivf', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-sussex', id, 'icsi', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 12, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-sussex', id, 'iui', '2025-09-11', 6, NULL, 42, 19, 29.9, 5.4, NULL, 6, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-sussex', id, 'di', '2025-09-11', 6, NULL, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-sussex', id, 'fet', '2025-09-11', 1, NULL, 42, 19, 29.9, 5.4, NULL, 0, 0, 1, 'Couples must have no living children from their current relationship. Single women must have no living children.'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

-- West Yorkshire (high confidence, 2025)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-west-yorkshire', id, 'ivf', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-west-yorkshire', id, 'icsi', '2025-09-11', 1, 18, 42, 19, 30, 5.4, 8.9, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-west-yorkshire', id, 'iui', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-west-yorkshire', id, 'di', '2025-09-11', 6, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-west-yorkshire', id, 'fet', '2025-09-11', 1, 18, 42, 19, 30, NULL, NULL, 0, 0, 1, 'Neither partner should have any living children (including adopted, but not fostered) from their current or any previous relationship.'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Cornwall and the Isles of Scilly (high confidence, 2018)
INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-ivf-cornwall-and-the-isles-of-scil', id, 'ivf', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-icsi-cornwall-and-the-isles-of-scil', id, 'icsi', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-iui-cornwall-and-the-isles-of-scil', id, 'iui', '2025-09-11', 4, NULL, 40, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-di-cornwall-and-the-isles-of-scil', id, 'di', '2025-09-11', 4, NULL, 40, 19, 29.9, NULL, NULL, 0, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, treatment_type_id, effective_from, cycles_offered, min_age, max_age, bmi_min, bmi_max, amh_min_pmol, fsh_max_iu, iui_rounds_required, endometriosis_priority_access, smoking_restricted, living_children_rule)
SELECT 'pol-fet-cornwall-and-the-isles-of-scil', id, 'fet', '2025-09-11', 1, NULL, 40, 19, 29.9, NULL, NULL, 4, 0, 1, 'No living children from current relationship; at least 1 partner has no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1;
