-- Add data confidence tracking, policy metadata, and borough information to health_boards

ALTER TABLE health_boards ADD COLUMN data_confidence TEXT NOT NULL DEFAULT 'unconfirmed'
  CHECK (data_confidence IN ('confirmed', 'inherited', 'under_review', 'unconfirmed')); --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN policy_date TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN last_verified TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN predecessor_icb TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN source_url TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN policy_pdf_r2_key TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN boroughs TEXT; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN summary_override TEXT;
