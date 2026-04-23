import { useState, useEffect, useCallback } from 'react';
import type { AdminIcb, AdminPolicy, CreateIcbInput, UpdateIcbInput, CreatePolicyInput } from '../types/admin';
import {
  listIcbs,
  createIcb,
  updateIcb,
  listPoliciesForIcb,
  createPolicy,
  ConnectionError,
  ApiError,
} from '../services/adminApi';
import { IcbTable } from '../components/admin/IcbTable';
import { IcbForm } from '../components/admin/IcbForm';
import { PolicyList } from '../components/admin/PolicyList';
import { PolicyForm } from '../components/admin/PolicyForm';
import { Button } from '@/components/ui/button';

function getErrorMessage(err: unknown): string {
  if (err instanceof ConnectionError) return 'Connection error — please try again';
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Authentication failed — check your credentials';
    if (err.status >= 500) return 'Server error — please try again';
    // 400 / 409 — use server error field if available
    const body = err.body as Record<string, unknown> | null;
    if (body && typeof body.error === 'string') return body.error;
    return `Request failed (${err.status})`;
  }
  return 'An unexpected error occurred';
}

export function AdminPage() {
  const [icbs, setIcbs] = useState<AdminIcb[]>([]);
  const [selectedIcb, setSelectedIcb] = useState<AdminIcb | null>(null);
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ICB form state
  const [icbFormOpen, setIcbFormOpen] = useState(false);
  const [editingIcb, setEditingIcb] = useState<AdminIcb | null>(null);

  // Policy form state
  const [policyFormOpen, setPolicyFormOpen] = useState(false);

  // Confirmation dialog for status toggle
  const [confirmToggle, setConfirmToggle] = useState<AdminIcb | null>(null);

  const loadIcbs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listIcbs();
      setIcbs(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadIcbs(); }, [loadIcbs]);

  async function handleSelectIcb(icb: AdminIcb) {
    setSelectedIcb(icb);
    setError(null);
    try {
      const data = await listPoliciesForIcb(icb.id);
      setPolicies(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleEditIcb(icb: AdminIcb) {
    setEditingIcb(icb);
    setIcbFormOpen(true);
  }

  function handleCreateIcb() {
    setEditingIcb(null);
    setIcbFormOpen(true);
  }

  async function handleIcbSubmit(data: CreateIcbInput | UpdateIcbInput) {
    setError(null);
    try {
      if (editingIcb) {
        const updated = await updateIcb(editingIcb.id, data as UpdateIcbInput);
        setIcbs(prev => prev.map(i => i.id === updated.id ? updated : i));
        if (selectedIcb?.id === updated.id) setSelectedIcb(updated);
        setSuccessMsg('ICB updated successfully');
      } else {
        await createIcb(data as CreateIcbInput);
        await loadIcbs();
        setSuccessMsg('ICB created successfully');
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err; // re-throw so form stays open
    }
  }

  function handleToggleStatus(icb: AdminIcb) {
    setConfirmToggle(icb);
  }

  async function confirmStatusToggle() {
    if (!confirmToggle) return;
    const newStatus = confirmToggle.status === 'active' ? 'inactive' : 'active';
    setError(null);
    try {
      const updated = await updateIcb(confirmToggle.id, { status: newStatus });
      setIcbs(prev => prev.map(i => i.id === updated.id ? updated : i));
      if (selectedIcb?.id === updated.id) setSelectedIcb(updated);
      setSuccessMsg(`ICB marked as ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setConfirmToggle(null);
    }
  }

  async function handlePolicySubmit(data: CreatePolicyInput) {
    if (!selectedIcb) return;
    setError(null);
    try {
      await createPolicy(selectedIcb.id, data);
      const updated = await listPoliciesForIcb(selectedIcb.id);
      setPolicies(updated);
      setSuccessMsg('Policy created successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin — ICB Management</h1>
        <Button onClick={handleCreateIcb}>Add ICB</Button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {successMsg && (
        <div role="status" className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          {successMsg}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <IcbTable
          icbs={icbs}
          onEdit={handleEditIcb}
          onToggleStatus={handleToggleStatus}
          onLoadPolicies={async (icb) => {
            setSelectedIcb(icb)
            const data = await listPoliciesForIcb(icb.id)
            setPolicies(data)
            return data
          }}
          onNewPolicy={(icb) => {
            setSelectedIcb(icb)
            setPolicyFormOpen(true)
          }}
        />
      )}

      {selectedIcb && (
        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground mb-3">
            Policies for: <span className="font-medium text-foreground">{selectedIcb.name}</span>
          </p>
          <PolicyList
            icbId={selectedIcb.id}
            policies={policies}
            onNewPolicy={() => setPolicyFormOpen(true)}
          />
        </div>
      )}

      <IcbForm
        open={icbFormOpen}
        onOpenChange={setIcbFormOpen}
        icb={editingIcb}
        onSubmit={handleIcbSubmit}
        onToggleStatus={handleToggleStatus}
      />

      {selectedIcb && (
        <PolicyForm
          open={policyFormOpen}
          onOpenChange={setPolicyFormOpen}
          icbId={selectedIcb.id}
          onSubmit={handlePolicySubmit}
        />
      )}

      {/* Status toggle confirmation */}
      {confirmToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-popover rounded-xl p-6 ring-1 ring-foreground/10 max-w-sm w-full space-y-4">
            <p className="text-sm">
              Mark <span className="font-medium">{confirmToggle.name}</span> as{' '}
              <span className="font-medium">{confirmToggle.status === 'active' ? 'inactive' : 'active'}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmToggle(null)}>Cancel</Button>
              <Button onClick={confirmStatusToggle}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
