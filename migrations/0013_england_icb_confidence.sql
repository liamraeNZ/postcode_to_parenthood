-- Set data_confidence and policy_date for England ICBs based on the most recent
-- document year in their R2 folder (documents/policies/<folder>/<year>/).
--
-- Thresholds:
--   confirmed     = document from 2023, 2024, 2025, or 2026
--   under_review  = document from 2022 or earlier

-- === confirmed (document year 2023+) ===

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Bristol, North Somerset and South Gloucestershire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Derby and Derbyshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Hertfordshire and West Essex'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Humber and North Yorkshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'North East London'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Somerset'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2023-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'South West London'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Buckinghamshire, Oxfordshire and Berkshire West'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Coventry and Warwickshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Frimley'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Hampshire and Isle of Wight'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Herefordshire and Worcestershire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Kent and Medway'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Mid and South Essex'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'South East London'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Staffordshire and Stoke-on-Trent'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2024-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Surrey Heartlands'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Cheshire and Merseyside'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Gloucestershire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'North East and North Cumbria'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Northamptonshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'South Yorkshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Sussex'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2025-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'West Yorkshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'confirmed', policy_date = '2026-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Greater Manchester'; --> statement-breakpoint

-- === under_review (document year 2020–2022) ===

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2020-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Lincolnshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2021-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Dorset'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2021-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Suffolk and North East Essex'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Bath and North East Somerset, Swindon and Wiltshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Bedfordshire, Luton and Milton Keynes'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Black Country'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Cambridgeshire and Peterborough'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Devon'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Lancashire and South Cumbria'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'North Central London'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2022-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Shropshire, Telford and Wrekin'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2019-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Norfolk and Waveney'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2018-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Birmingham and Solihull'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2018-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Cornwall and the Isles of Scilly'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2016-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'North West London'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2014-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Nottingham and Nottinghamshire'; --> statement-breakpoint

UPDATE health_boards SET data_confidence = 'under_review', policy_date = '2013-01-01', last_verified = '2026-04-21'
WHERE document_folder_name = 'Leicester, Leicestershire and Rutland'; --> statement-breakpoint
