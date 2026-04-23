-- Policy for NHS Bath and North East Somerset, Swindon and Wiltshire (QOX)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qox', id, 1, 40, 19.0, 30.0, 10, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england'
FROM icbs WHERE parent_icb_code = 'QOX' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Birmingham and Solihull (QHL)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QHL' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Black Country (QUA)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qua', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QUA' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Bristol, North Somerset and South Gloucestershire (QUY)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-quy', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QUY' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Thames Valley / Bucks, Oxon, Berks West (S0E4D)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-s0e4d', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'S0E4D' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Central East / Cambs & Peterborough (S1Y5D)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-s1y5d', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'S1Y5D' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Cornwall and the Isles of Scilly (QT6)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt6', id, 1, 40, 19.0, 30.0, 12, 'No children from current relationship and at least one person should have no children from previous relationships'
FROM icbs WHERE parent_icb_code = 'QT6' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Coventry and Warwickshire (QWU)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwu', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QWU' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for North East and North Cumbria (QHM)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhm', id, 3, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QHM' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Gloucestershire (QR1)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qr1', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QR1' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for South East London (QKK)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qkk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QKK' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for West Yorkshire (QWO)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwo', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE parent_icb_code = 'QWO' AND sub_icb_code IS NULL LIMIT 1;