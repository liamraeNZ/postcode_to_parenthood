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
import { DbSyncPanel } from '../components/admin/DbSyncPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function getErrorMessage(err: unknown): string {
  if (err instanceof ConnectionError) return 'Connection error — please try again';
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Authentication failed — check your credentials';
    if (err.status >= 500) return 'Server error — please try again';
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

  const [icbFormOpen, setIcbFormOpen] = useState(false);
  const [editingIcb, setEditingIcb] = useState<AdminIcb | null>(null);
  const [policyFormOpen, setPolicyFormOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState<AdminIcb | null>(null);

  const loadIcbs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setIcbs(await listIcbs());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadIcbs(); }, [loadIcbs]);

  function handleSelectIcb(icb: AdminIcb) {
    setSelectedIcb(icb);
    setError(null);
    listPoliciesForIcb(icb.id)
      .then(setPolicies)
      .catch(err => setError(getErrorMessage(err)));
  }

  function handleEditIcb(icb: AdminIcb) { setEditingIcb(icb); setIcbFormOpen(true); }
  function handleCreateIcb() { setEditingIcb(null); setIcbFormOpen(true); }

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
      throw err;
    }
  }

  function handleToggleStatus(icb: AdminIcb) { setConfirmToggle(icb); }

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
      setPolicies(await listPoliciesForIcb(selectedIcb.id));
      setSuccessMsg('Policy created successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Admin</h1>

      <Tabs defaultValue="icb-management">
        <TabsList>
          <TabsTrigger value="icb-management">ICB Management</TabsTrigger>
          <TabsTrigger value="db-sync">DB Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="icb-management">
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Manage ICB records and funding policies</span>
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
                onSelect={handleSelectIcb}
                onEdit={handleEditIcb}
                onToggleStatus={handleToggleStatus}
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
          </div>
        </TabsContent>

        <TabsContent value="db-sync">
          <div className="pt-4">
            <DbSyncPanel />
          </div>
        </TabsContent>
      </Tabs>

      <IcbForm
        open={icbFormOpen}
        onOpenChange={setIcbFormOpen}
        icb={editingIcb}
        onSubmit={handleIcbSubmit}
      />

      {selectedIcb && (
        <PolicyForm
          open={policyFormOpen}
          onOpenChange={setPolicyFormOpen}
          icbId={selectedIcb.id}
          onSubmit={handlePolicySubmit}
        />
      )}

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
