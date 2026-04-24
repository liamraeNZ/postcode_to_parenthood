-- Audit fixes for 0003_policies.sql against GOV.UK source data (as at 11 September 2025)
-- Source: https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england

-- 1. Remove pol-essex: D7T5G (NHS Essex ICB) is a newly formed parent ICB with no unified policy.
--    The GOV.UK page lists "Hertfordshire and West Essex" and "Mid and South Essex" separately.
DELETE FROM icb_policies WHERE id = 'pol-essex'; --> statement-breakpoint

-- 2. Fix pol-herts: The original INSERT matched `name LIKE '%HERTFORDSHIRE%' AND sub_icb_code IS NULL`
--    which matches nothing. "Hertfordshire and West Essex" is sub-ICB code 06K under Central East (S1Y5D).
--    Re-insert targeting the correct entity.
DELETE FROM icb_policies WHERE id = 'pol-herts'; --> statement-breakpoint

INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-herts', id, '2025-09-11', 1, 42, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '06K' LIMIT 1; --> statement-breakpoint

-- 3. Add missing policy for Mid and South Essex (sub-ICB code 06N).
--    GOV.UK: 2 (non-full) cycles for age 23-39, 1 (non-full) cycle for age 40-42.
--    Using the primary tier (2 cycles, max age 39) and 6 IUI rounds.
INSERT OR IGNORE INTO icb_policies (id, icb_id, effective_from, cycles_offered, max_age, bmi_min, bmi_max, iui_rounds_required, living_children_rule, source_url)
SELECT 'pol-mid-south-essex', id, '2025-09-11', 2, 39, 19.0, 30.0, 6, 'No children from current or previous relationships', 'https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england'
FROM icbs WHERE sub_icb_code = '06N' LIMIT 1;
