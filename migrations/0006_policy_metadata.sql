ALTER TABLE health_boards ADD COLUMN is_national INTEGER DEFAULT 0; --> statement-breakpoint

ALTER TABLE health_boards ADD COLUMN last_updated TEXT;
