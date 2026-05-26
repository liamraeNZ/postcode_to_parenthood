-- Mark Scotland, Wales, and Northern Ireland boards as 'confirmed' confidence.
-- These are national policies published in multiple official sources and were
-- gathered/verified in April 2026.

UPDATE health_boards
SET data_confidence = 'confirmed',
    policy_date = '2017-04-01',
    last_verified = '2026-04-21'
WHERE country = 'SCOTLAND'; --> statement-breakpoint

UPDATE health_boards
SET data_confidence = 'confirmed',
    policy_date = '2020-01-01',
    last_verified = '2026-04-21'
WHERE country = 'WALES'; --> statement-breakpoint

UPDATE health_boards
SET data_confidence = 'confirmed',
    policy_date = '2019-06-01',
    last_verified = '2026-04-21'
WHERE country = 'NORTHERN_IRELAND'; --> statement-breakpoint
