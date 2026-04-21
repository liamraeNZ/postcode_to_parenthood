import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TrustBar } from './components/layout/TrustBar';
import { Hero } from './components/home/Hero';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sparkles, BarChart3, RefreshCw, DatabaseZap, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

type MatchingResource = {
  initials: string;
  initialsClassName: string;
  name: string;
  subtitle: string;
  subtitleClassName?: string;
  rightLabel: string;
  rightLabelClassName: string;
};

type WhyFeature = {
  icon: ReactNode;
  text: string;
};

const whyFeatures: WhyFeature[] = [
  {
    icon: <Sparkles className="w-4 h-4 text-emerald-700" />,
    text: 'AI-powered eligibility matching against 40+ private trusts and regional NHS policies.'
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-emerald-700" />,
    text: 'Real-time cost comparison between UK clinics and European "Refund Guarantee" schemes.'
  }
];

function WhyFertilityFundCard() {
  return (
    <Card className="p-6 border border-gray-200 shadow-md rounded-xl bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 -z-0" />
      <div className="relative z-10">
        <h3 className="font-bold text-gray-800 mb-4">Why FertilityFund?</h3>
        <div className="space-y-4">
          {whyFeatures.map((feature, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="bg-emerald-100 p-1.5 rounded-md mt-0.5">{feature.icon}</div>
              <p className="text-xs text-gray-600 leading-snug">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

type IcbRow = {
  id: string;
  name: string;
  sub_icb_code: string | null;
  parent_icb_code: string | null;
  region: string | null;
  created_at: string;
  updated_at: string;
};

type SyncResult = {
  total: number;
  inserted: number;
  updated: number;
  aliased: number;
};

function AdminIcbSyncPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncDurationMs, setSyncDurationMs] = useState<number | null>(null);
  const [icbs, setIcbs] = useState<IcbRow[] | null>(null);

  const refreshIcbs = useCallback(async () => {
    setError(null);
    const response = await fetch('/api/admin/icbs', { method: 'GET' });
    const payload = (await response.json().catch(() => null)) as
      | { ok: true; icbs: IcbRow[] }
      | { error?: string }
      | null;
    if (!response.ok) {
      throw new Error(payload && 'error' in payload && payload.error ? payload.error : `Request failed (${response.status})`);
    }
    setIcbs(payload && 'icbs' in payload ? payload.icbs : []);
  }, []);

  const runSync = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/icb-sync', { method: 'POST' });
      const payload = (await response.json().catch(() => null)) as
        | { ok: true; sync: SyncResult; sync_duration_ms?: number; icbs: IcbRow[] }
        | { error?: string }
        | null;
      if (!response.ok) {
        throw new Error(payload && 'error' in payload && payload.error ? payload.error : `Request failed (${response.status})`);
      }
      if (payload && 'sync' in payload) {
        setSyncResult(payload.sync);
        setSyncDurationMs(typeof payload.sync_duration_ms === 'number' ? payload.sync_duration_ms : null);
      }
      setIcbs(payload && 'icbs' in payload ? payload.icbs : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    refreshIcbs().catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
    });
  }, [refreshIcbs]);

  return (
    <Card className="p-6 border border-gray-200 shadow-md rounded-xl bg-white overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <DatabaseZap className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight">ICB Sync</h3>
              <p className="text-xs text-gray-500">Triggers the scheduled ORD sync, then renders the icbs table.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={runSync} disabled={isRunning}>
              <RefreshCw className={isRunning ? 'animate-spin' : ''} />
              {isRunning ? 'Running…' : 'Run sync'}
            </Button>
            <Button variant="outline" onClick={() => refreshIcbs().catch((err) => setError(err instanceof Error ? err.message : String(err)))} disabled={isRunning}>
              Refresh table
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncResult ? (
            <>
              <Badge variant="secondary">total {syncResult.total}</Badge>
              <Badge variant="secondary">inserted {syncResult.inserted}</Badge>
              <Badge variant="secondary">updated {syncResult.updated}</Badge>
              {typeof syncDurationMs === 'number' ? <Badge variant="outline">{syncDurationMs}ms</Badge> : null}
            </>
          ) : (
            <Badge variant="outline">no sync run yet</Badge>
          )}
          {icbs ? <Badge variant="outline">{icbs.length} rows</Badge> : null}
          {error ? (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle />
              {error}
            </Badge>
          ) : null}
        </div>

        {icbs && icbs.length > 0 ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-3">Name</TableHead>
                  <TableHead className="px-3">Sub ICB</TableHead>
                  <TableHead className="px-3">Parent ICB</TableHead>
                  <TableHead className="px-3">Region</TableHead>
                  <TableHead className="px-3">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {icbs.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-3 font-medium text-gray-800">{row.name}</TableCell>
                    <TableCell className="px-3 text-gray-700">{row.sub_icb_code ?? '—'}</TableCell>
                    <TableCell className="px-3 text-gray-700">{row.parent_icb_code ?? '—'}</TableCell>
                    <TableCell className="px-3 text-gray-700">{row.region ?? '—'}</TableCell>
                    <TableCell className="px-3 text-gray-600">{row.updated_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            {icbs ? 'No rows returned.' : 'Loading…'}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function App() {
  const isAdminMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('admin');
  }, []);

  return (
    <div className="min-h-screen bg-soft-bg font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          <Hero />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <WhyFertilityFundCard />
          </section>
        </div>

        {isAdminMode ? (
          <section className="mt-12">
            <AdminIcbSyncPanel />
          </section>
        ) : null}
      </main>

      <TrustBar />
    </div>
  );
}
