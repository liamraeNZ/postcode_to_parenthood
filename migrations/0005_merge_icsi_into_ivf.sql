-- Merge ICSI into IVF
-- ICSI eligibility criteria are always identical to IVF within the same ICB.
-- Where ICSI additional_notes differ, append them to the IVF additional_notes.
-- Then remove all ICSI policies and the ICSI treatment type.

-- Step 1: For ICBs where ICSI has different additional_notes from IVF,
-- append the ICSI-specific notes to the IVF row.
UPDATE board_policies
SET additional_notes = additional_notes || ' [ICSI: ' || (
  SELECT icsi.additional_notes
  FROM board_policies icsi
  WHERE icsi.board_id = board_policies.board_id
    AND icsi.treatment_type_id = 'icsi'
    AND icsi.additional_notes IS NOT NULL
    AND icsi.additional_notes != board_policies.additional_notes
) || ']'
WHERE treatment_type_id = 'ivf'
  AND EXISTS (
    SELECT 1 FROM board_policies icsi
    WHERE icsi.board_id = board_policies.board_id
      AND icsi.treatment_type_id = 'icsi'
      AND icsi.additional_notes IS NOT NULL
      AND icsi.additional_notes != board_policies.additional_notes
  ); --> statement-breakpoint

-- Step 2: Delete all ICSI policies
DELETE FROM board_policies WHERE treatment_type_id = 'icsi'; --> statement-breakpoint

-- Step 3: Remove the ICSI treatment type
DELETE FROM treatment_types WHERE id = 'icsi'; --> statement-breakpoint

-- Step 4: Update IVF treatment type name to reflect it now covers ICSI
UPDATE treatment_types
SET name = 'IVF/ICSI',
    description = 'In vitro fertilisation / Intracytoplasmic sperm injection'
WHERE id = 'ivf'; --> statement-breakpoint
