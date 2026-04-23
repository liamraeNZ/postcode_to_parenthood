import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CreatePolicyInput } from '../../types/admin';
import { validatePolicyForm } from '../../utils/adminValidation';

interface PolicyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icbId: string;
  onSubmit: (data: CreatePolicyInput) => Promise<void>;
}

interface FormFields {
  cycles_offered: string;
  max_age: string;
  iui_rounds_required: string;
  living_children_rule: string;
  effective_from: string;
  effective_to: string;
  bmi_min: string;
  bmi_max: string;
  source_url: string;
}

const emptyFields: FormFields = {
  cycles_offered: '',
  max_age: '',
  iui_rounds_required: '',
  living_children_rule: '',
  effective_from: '',
  effective_to: '',
  bmi_min: '',
  bmi_max: '',
  source_url: '',
};

function parseNum(v: string): number | undefined {
  const n = parseFloat(v);
  return isNaN(n) ? undefined : n;
}

function nullIfEmpty(v: string): string | null {
  return v.trim() === '' ? null : v.trim();
}

export function PolicyForm({ open, onOpenChange, icbId: _icbId, onSubmit }: PolicyFormProps) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFields(emptyFields);
      setErrors({});
    }
  }, [open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed: Partial<CreatePolicyInput> = {
      cycles_offered: parseNum(fields.cycles_offered),
      max_age: parseNum(fields.max_age),
      iui_rounds_required: parseNum(fields.iui_rounds_required),
      living_children_rule: fields.living_children_rule,
      effective_from: nullIfEmpty(fields.effective_from),
      effective_to: nullIfEmpty(fields.effective_to),
      bmi_min: parseNum(fields.bmi_min) ?? null,
      bmi_max: parseNum(fields.bmi_max) ?? null,
      source_url: nullIfEmpty(fields.source_url),
    };

    const validationErrors = validatePolicyForm(parsed);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed as CreatePolicyInput);
      onOpenChange(false);
    } catch {
      // errors handled by parent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Policy Version</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-cycles">
                Cycles offered <span className="text-destructive">*</span>
              </label>
              <Input id="pol-cycles" name="cycles_offered" type="number" value={fields.cycles_offered} onChange={handleChange} aria-invalid={!!errors.cycles_offered} placeholder="e.g. 1" />
              {errors.cycles_offered && <p className="text-xs text-destructive mt-1">{errors.cycles_offered}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-max-age">
                Max age <span className="text-destructive">*</span>
              </label>
              <Input id="pol-max-age" name="max_age" type="number" value={fields.max_age} onChange={handleChange} aria-invalid={!!errors.max_age} placeholder="e.g. 40" />
              {errors.max_age && <p className="text-xs text-destructive mt-1">{errors.max_age}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-iui">
                IUI rounds required <span className="text-destructive">*</span>
              </label>
              <Input id="pol-iui" name="iui_rounds_required" type="number" value={fields.iui_rounds_required} onChange={handleChange} aria-invalid={!!errors.iui_rounds_required} placeholder="e.g. 6" />
              {errors.iui_rounds_required && <p className="text-xs text-destructive mt-1">{errors.iui_rounds_required}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-living">
                Living children rule <span className="text-destructive">*</span>
              </label>
              <Input id="pol-living" name="living_children_rule" value={fields.living_children_rule} onChange={handleChange} aria-invalid={!!errors.living_children_rule} placeholder="e.g. No children from current or previous relationships" />
              {errors.living_children_rule && <p className="text-xs text-destructive mt-1">{errors.living_children_rule}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-eff-from">Effective from</label>
              <Input id="pol-eff-from" name="effective_from" value={fields.effective_from} onChange={handleChange} placeholder="YYYY-MM-DD" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-eff-to">Effective to</label>
              <Input id="pol-eff-to" name="effective_to" value={fields.effective_to} onChange={handleChange} placeholder="YYYY-MM-DD (optional)" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block" htmlFor="pol-bmi-min">BMI min</label>
                <Input id="pol-bmi-min" name="bmi_min" type="number" value={fields.bmi_min} onChange={handleChange} aria-invalid={!!errors.bmi_min} placeholder="e.g. 19" />
                {errors.bmi_min && <p className="text-xs text-destructive mt-1">{errors.bmi_min}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block" htmlFor="pol-bmi-max">BMI max</label>
                <Input id="pol-bmi-max" name="bmi_max" type="number" value={fields.bmi_max} onChange={handleChange} placeholder="e.g. 30" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="pol-source">Source URL</label>
              <Input id="pol-source" name="source_url" type="url" value={fields.source_url} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Create Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
