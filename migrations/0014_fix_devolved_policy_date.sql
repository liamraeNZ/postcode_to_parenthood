-- Fix: policy_date was not applied for devolved nation boards in migration 0012.
-- The multi-column SET in that migration set data_confidence and last_verified
-- but policy_date remained null. This migration corrects that.

UPDATE health_boards SET policy_date = '2017-04-01' WHERE country = 'SCOTLAND' AND policy_date IS NULL; --> statement-breakpoint

UPDATE health_boards SET policy_date = '2020-01-01' WHERE country = 'WALES' AND policy_date IS NULL; --> statement-breakpoint

UPDATE health_boards SET policy_date = '2019-06-01' WHERE country = 'NORTHERN_IRELAND' AND policy_date IS NULL; --> statement-breakpoint
