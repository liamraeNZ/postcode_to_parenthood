INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qox', id, 1, 40, 19.0, 30.0, 10, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-m1j4y', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qua', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-quy', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-10q', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-06h', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt6', id, 1, 40, 19.0, 30.0, 12, 'No children from current relationship and at least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwu', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qj2', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qjk', id, 1, 40, 19.0, 30.0, 6, 'No children from current relationship and at least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qvv', id, 1, 42, 19.0, 30.0, 6, 'No children from current relationship and at least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-d4u1y', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qr1', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qrl', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qgh', id, 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-herts', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE name LIKE '%HERTFORDSHIRE%' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qks', id, 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qe1', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qjm', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-essex', id, 2, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'D7T5G' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-norfolk', id, 2, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-ncl', id, 3, 42, 19.0, 30.0, 6, 'At least one person should have no children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qpm', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhm', id, 3, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qmf', id, 3, 42, 19.0, 30.0, 6, 'At least one person should have no children from current or previous relationships'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-nwl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt1', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qoc', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qsl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qkk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwe', id, 1, 42, 19.0, 30.0, 6, 'At least one person should have no children from current or previous relationships'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qf7', id, 2, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qnc', id, 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-suffolk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-surrey', id, 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-sussex', id, 1, 42, 19.0, 30.0, 6, 'No children from current relationship'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1;

INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwo', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1;
