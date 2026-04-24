-- ICB policy seed data
-- Source: https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qox', id, '2025-09-11', 1, 40, 19.0, 30.0, 10, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-m1j4y', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qhl', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qua', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-quy', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-10q', id, '2025-09-11', 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-06h', id, '2025-09-11', 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qt6', id, '2025-09-11', 1, 40, 19.0, 30.0, 12, 'No children from current relationship and at least one person should have no children from previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qwu', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qj2', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qjk', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current relationship and at least one person should have no children from previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qvv', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current relationship and at least one person should have no children from previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-d4u1y', id, '2025-09-11', 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qr1', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qrl', id, '2025-09-11', 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qgh', id, '2025-09-11', 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Hertfordshire and West Essex (sub-ICB 06K under Central East S1Y5D)
INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-herts', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '06K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qks', id, '2025-09-11', 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qe1', id, '2025-09-11', 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qjm', id, '2025-09-11', 1, 40, 19.0, 30.0, 0, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

-- Mid and South Essex (sub-ICB 99E under Essex D7T5G)
INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-mid-south-essex', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '99E' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-norfolk', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-ncl', id, '2025-09-11', 3, 40, 19.0, 30.0, 6, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qpm', id, '2025-09-11', 1, 42, 19.0, 30.0, 0, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qhm', id, '2025-09-11', 3, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qmf', id, '2025-09-11', 3, 40, 19.0, 30.0, 6, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-nwl', id, '2025-09-11', 1, 40, 19.0, 30.0, 12, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qt1', id, '2025-09-11', 1, 42, 19.0, 30.0, 0, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qoc', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qsl', id, '2025-09-11', 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qkk', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qwe', id, '2025-09-11', 1, 42, 19.0, 30.0, 12, 'No children from current relationship and at least one person should have no children from previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qf7', id, '2025-09-11', 2, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qnc', id, '2025-09-11', 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-suffolk', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-surrey', id, '2025-09-11', 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-sussex', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current relationship', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qwo', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1;
