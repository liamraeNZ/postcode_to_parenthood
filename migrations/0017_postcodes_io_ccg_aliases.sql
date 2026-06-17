-- Add board_aliases for new CCG codes returned by postcodes.io after the
-- April 2026 ICB mergers.  These map the updated ccg_id values back to the
-- sub-ICB boards that still hold published policies.

INSERT OR IGNORE INTO board_aliases (id, board_id, alias_kind, alias, created_at, updated_at) VALUES
('alias-06n', 'QM7', 'code', '06N', '2026-06-17T00:00:00.000Z', '2026-06-17T00:00:00.000Z'),
('alias-26a', '06L', 'code', '26A', '2026-06-17T00:00:00.000Z', '2026-06-17T00:00:00.000Z'),
('alias-93c', '07P', 'code', '93C', '2026-06-17T00:00:00.000Z', '2026-06-17T00:00:00.000Z'),
('alias-w2u3z', '08Y', 'code', 'W2U3Z', '2026-06-17T00:00:00.000Z', '2026-06-17T00:00:00.000Z'),
('alias-99g', '99E', 'code', '99G', '2026-06-17T00:00:00.000Z', '2026-06-17T00:00:00.000Z'); --> statement-breakpoint
