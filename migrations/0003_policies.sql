-- Policy for NHS Bath and North East Somerset, Swindon and Wiltshire (QOX)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-qox', id, 1, 40, 19.0, 30.0, 10, 'At least one person should have no children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Birmingham and Solihull (QHL)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Black Country (QUA)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qua', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Bristol, North Somerset and South Gloucestershire (QUY)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-quy', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Thames Valley / Bucks, Oxon, Berks West (S0E4D)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-s0e4d', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'S0E4D' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Central East / Cambs & Peterborough (S1Y5D)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-s1y5d', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'S1Y5D' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Cornwall and the Isles of Scilly (QT6)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt6', id, 1, 40, 19.0, 30.0, 12, 'No children from current relationship and at least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Coventry and Warwickshire (QWU)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwu', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for North East and North Cumbria (QHM)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhm', id, 3, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Gloucestershire (QR1)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qr1', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for South East London (QKK)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qkk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for West Yorkshire (QWO)
INSERT INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwo', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1;

-- Policy for Bedfordshire, Luton and Milton Keynes (using the M1J4Y sub-entity)
INSERT INTO icb_policies (
    id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, 
    iui_rounds_required, living_children_rule, source_url
)
SELECT 
    'pol-blmk-2025', 
    id, -- This picks up 'M1J4Y'
    1, 42, 19.0, 30.0, 6, 
    'No children from current or previous relationships', 
    'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england'
FROM icbs 
WHERE sub_icb_code = 'M1J4Y' LIMIT 1;

-- 0002_populate_policies.sql

-- 1. Bath and North East Somerset, Swindon and Wiltshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qox', id, 1, 40, 19.0, 30.0, 10, 'At least one person should have no children from current or previous relationships'
FROM icbs WHERE id = 'QOX' AND sub_icb_code IS NULL LIMIT 1;

-- 2. Bedfordshire, Luton and Milton Keynes
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-m1j4y', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = 'M1J4Y' LIMIT 1;

-- 3. Birmingham and Solihull
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHL' AND sub_icb_code IS NULL LIMIT 1;

-- 4. Black Country
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qua', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUA' AND sub_icb_code IS NULL LIMIT 1;

-- 5. Bristol, North Somerset and South Gloucestershire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-quy', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QUY' AND sub_icb_code IS NULL LIMIT 1;

-- 6. Buckinghamshire, Oxfordshire and Berkshire West
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-10q', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '10Q' LIMIT 1;

-- 7. Cambridgeshire and Peterborough
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-06h', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '06H' LIMIT 1;

-- 8. Cornwall and the Isles of Scilly
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt6', id, 1, 40, 19.0, 30.0, 12, 'At least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QT6' AND sub_icb_code IS NULL LIMIT 1;

-- 9. Coventry and Warwickshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwu', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWU' AND sub_icb_code IS NULL LIMIT 1;

-- 10. Derby and Derbyshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qj2', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QJ2' AND sub_icb_code IS NULL LIMIT 1;

-- 11. Devon
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qjk', id, 1, 40, 19.0, 30.0, 6, 'At least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QJK' AND sub_icb_code IS NULL LIMIT 1;

-- 12. Dorset
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qvv', id, 1, 42, 19.0, 30.0, 6, 'At least one person should have no children from previous relationships'
FROM icbs WHERE id = 'QVV' AND sub_icb_code IS NULL LIMIT 1;

-- 13. Frimley
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-d4u1y', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = 'D4U1Y' LIMIT 1;

-- 14. Gloucestershire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qr1', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QR1' AND sub_icb_code IS NULL LIMIT 1;

-- 15. Hampshire and Isle of Wight
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qrl', id, 1, 35, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QRL' AND sub_icb_code IS NULL LIMIT 1;

-- 16. Herefordshire and Worcestershire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qgh', id, 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QGH' AND sub_icb_code IS NULL LIMIT 1;

-- 17. Hertfordshire and West Essex
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-herts', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE name LIKE '%HERTFORDSHIRE%' AND sub_icb_code IS NULL LIMIT 1;

-- 18. Kent and Medway
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qks', id, 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QKS' AND sub_icb_code IS NULL LIMIT 1;

-- 19. Lancashire and South Cumbria
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qe1', id, 1, 42, 19.0, 30.0, 12, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QE1' AND sub_icb_code IS NULL LIMIT 1;

-- 20. Lincolnshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qjm', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QJM' AND sub_icb_code IS NULL LIMIT 1;

-- 21. Mid and South Essex (Using Essex parent)
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-essex', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'D7T5G' AND sub_icb_code IS NULL LIMIT 1;

-- 22. Norfolk and Waveney
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-norfolk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '06L' LIMIT 1;

-- 23. North Central London
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-ncl', id, 3, 40, 19.0, 30.0, 6, 'At least one person should have no children'
FROM icbs WHERE sub_icb_code = '07P' LIMIT 1;

-- 24. Northamptonshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qpm', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QPM' AND sub_icb_code IS NULL LIMIT 1;

-- 25. North East and North Cumbria
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qhm', id, 3, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QHM' AND sub_icb_code IS NULL LIMIT 1;

-- 26. North East London
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qmf', id, 3, 40, 19.0, 30.0, 6, 'At least one person should have no children'
FROM icbs WHERE id = 'QMF' AND sub_icb_code IS NULL LIMIT 1;

-- 27. North West London
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-nwl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '08Y' LIMIT 1;

-- 28. Nottingham and Nottinghamshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qt1', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QT1' AND sub_icb_code IS NULL LIMIT 1;

-- 29. Shropshire, Telford and Wrekin
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qoc', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QOC' AND sub_icb_code IS NULL LIMIT 1;

-- 30. Somerset
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qsl', id, 1, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QSL' AND sub_icb_code IS NULL LIMIT 1;

-- 31. South East London
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qkk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QKK' AND sub_icb_code IS NULL LIMIT 1;

-- 32. South West London
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwe', id, 1, 42, 19.0, 30.0, 6, 'At least one person should have no children'
FROM icbs WHERE id = 'QWE' AND sub_icb_code IS NULL LIMIT 1;

-- 33. South Yorkshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qf7', id, 2, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QF7' AND sub_icb_code IS NULL LIMIT 1;

-- 34. Staffordshire and Stoke-on-Trent
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qnc', id, 1, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QNC' AND sub_icb_code IS NULL LIMIT 1;

-- 35. Suffolk and North East Essex
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-suffolk', id, 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '07K' LIMIT 1;

-- 36. Surrey Heartlands
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-surrey', id, 2, 40, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE sub_icb_code = '92A' LIMIT 1;

-- 37. Sussex
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-sussex', id, 1, 42, 19.0, 30.0, 6, 'No children from current relationship'
FROM icbs WHERE sub_icb_code = '09D' LIMIT 1;

-- 38. West Yorkshire
INSERT OR IGNORE INTO icb_policies (id, icb_id, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule)
SELECT 'pol-qwo', id, 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships'
FROM icbs WHERE id = 'QWO' AND sub_icb_code IS NULL LIMIT 1;
