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
import type { AdminIcb, CreateIcbInput, UpdateIcbInput } from '@/types/admin';
import { validateIcbForm } from '@/utils/adminValidation';

interface IcbFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icb?: AdminIcb | null;
  onSubmit: (data: CreateIcbInput | UpdateIcbInput) => Promise<void>;
  onToggleStatus?: (icb: AdminIcb) => void;
}

interface FormFields {
  id: string;
  name: string;
  region: string;
  country: string;
  sub_icb_code: string;
  parent_icb_code: string;
}

const emptyFields: FormFields = {
  id: '',
  name: '',
  region: '',
  country: '',
  sub_icb_code: '',
  parent_icb_code: '',
};

function toFormFields(icb: AdminIcb): FormFields {
  return {
    id: icb.id,
    name: icb.name,
    region: icb.region ?? '',
    country: icb.country ?? '',
    sub_icb_code: icb.sub_icb_code ?? '',
    parent_icb_code: icb.parent_icb_code ?? '',
  };
}

export function IcbForm({ open, onOpenChange, icb, onSubmit, onToggleStatus }: IcbFormProps) {
  const isEditMode = icb != null;
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFields(isEditMode ? toFormFields(icb) : emptyFields);
      setErrors({});
    }
  }, [open, icb, isEditMode]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationInput = isEditMode
      ? { id: icb.id, name: fields.name }
      : { id: fields.id, name: fields.name };

    const validationErrors = validateIcbForm(validationInput);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const nullIfEmpty = (v: string) => v.trim() === '' ? null : v.trim();

    const data: CreateIcbInput | UpdateIcbInput = isEditMode
      ? {
          name: fields.name.trim(),
          region: nullIfEmpty(fields.region),
          country: nullIfEmpty(fields.country),
          sub_icb_code: nullIfEmpty(fields.sub_icb_code),
          parent_icb_code: nullIfEmpty(fields.parent_icb_code),
        } satisfies UpdateIcbInput
      : {
          id: fields.id.trim(),
          name: fields.name.trim(),
          region: nullIfEmpty(fields.region),
          country: nullIfEmpty(fields.country),
          sub_icb_code: nullIfEmpty(fields.sub_icb_code),
          parent_icb_code: nullIfEmpty(fields.parent_icb_code),
        } satisfies CreateIcbInput;

    setSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {
      // errors handled by parent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit ICB' : 'Create ICB'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-id">
                ODS Code {!isEditMode && <span className="text-destructive">*</span>}
              </label>
              {isEditMode ? (
                <Input
                  id="icb-id"
                  value={icb.id}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              ) : (
                <Input
                  id="icb-id"
                  name="id"
                  value={fields.id}
                  onChange={handleChange}
                  aria-invalid={!!errors.id}
                  placeholder="e.g. QHG"
                />
              )}
              {errors.id && <p className="text-xs text-destructive mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-name">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="icb-name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                placeholder="ICB name"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-region">
                Region
              </label>
              <Input
                id="icb-region"
                name="region"
                value={fields.region}
                onChange={handleChange}
                placeholder="e.g. North East and Yorkshire"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-country">
                Country
              </label>
              <Input
                id="icb-country"
                name="country"
                value={fields.country}
                onChange={handleChange}
                placeholder="e.g. England"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-sub-icb-code">
                Sub-ICB Code
              </label>
              <Input
                id="icb-sub-icb-code"
                name="sub_icb_code"
                value={fields.sub_icb_code}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="icb-parent-icb-code">
                Parent ICB Code
              </label>
              <Input
                id="icb-parent-icb-code"
                name="parent_icb_code"
                value={fields.parent_icb_code}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            {isEditMode && onToggleStatus && (
              <Button
                type="button"
                variant="outline"
                onClick={() => { onToggleStatus(icb); onOpenChange(false); }}
              >
                {icb.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
