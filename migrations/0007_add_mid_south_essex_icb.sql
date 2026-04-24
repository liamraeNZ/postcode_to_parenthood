-- Add the missing NHS Mid and South Essex ICB (99E).
-- The 0002 migration incorrectly used code 06N for this entity.
-- This migration adds the correct row and re-points the policy and document folder.

-- 1. Insert the correct ICB row for Mid and South Essex
INSERT OR IGNORE INTO icbs (id, name, sub_icb_code, parent_icb_code, region, country, status, created_at, updated_at)
VALUES ('99E', 'NHS MID AND SOUTH ESSEX INTEGRATED CARE BOARD', '99E', 'D7T5G', 'EAST OF ENGLAND', 'ENGLAND', 'active', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'); --> statement-breakpoint

-- 2. Move the policy from 06N to 99E
UPDATE icb_policies SET icb_id = '99E' WHERE id = 'pol-mid-south-essex'; --> statement-breakpoint

-- 3. Move the document folder mapping from 06N to 99E
UPDATE icbs SET document_folder_name = NULL WHERE sub_icb_code = '06N'; --> statement-breakpoint
UPDATE icbs SET document_folder_name = 'Mid and South Essex' WHERE id = '99E';
