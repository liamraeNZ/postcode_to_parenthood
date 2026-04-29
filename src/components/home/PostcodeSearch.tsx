import { useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  getIcbFromGpPractice,
  lookupICBPoliciesByIcbCode,
  PostcodeLookupError,
  searchGpPracticesByName,
  searchGpPracticesByPostcode
} from '@/services/postcodeService';
import { GpPracticeSummary, ICBPoliciesResponse } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { IcbDocuments } from './IcbDocuments';
import { PolicyTabs } from './PolicyTabs';

type PostcodeLookupAction = 'search' | 'lookup';

export type PolicyPanelState = {
  postcode: string;
  selectedGP: GpPracticeSummary | null;
  icbCode: string | null;
  policiesResponse: ICBPoliciesResponse | null;
  isLoading: boolean;
  error: string | null;
};

type PostcodeSearchProps = {
  onPolicyPanelChange?: (state: PolicyPanelState) => void;
  onSearchStarted?: () => void;
};

function getPostcodeLookupErrorMessage(action: PostcodeLookupAction, err: unknown) {
  const verb = action === 'search' ? 'search' : 'lookup';

  if (err instanceof PostcodeLookupError) {
    if (err.kind === 'timeout') return `That ${verb} took too long. Please try again.`;
    if (err.kind === 'network') return 'Network error. Check your connection and try again.';
    if (err.kind === 'server') return 'The service is temporarily unavailable. Please try again shortly.';
    if (err.kind === 'misconfigured') return 'The app is misconfigured. Please contact support.';
    return 'An unexpected response was received. Please try again.';
  }

  return `An error occurred while ${verb}ing. Please try again.`;
}

function logDevError(message: string, err: unknown) {
  if (import.meta.env.DEV) {
    console.error(message, err);
  }
}

export function PostcodeSearch({ onPolicyPanelChange, onSearchStarted }: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [gpPractices, setGpPractices] = useState<GpPracticeSummary[] | null>(null);
  const [gpPracticeQuery, setGpPracticeQuery] = useState('');
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [nameSearchLoading, setNameSearchLoading] = useState(false);
  const [nameSearchError, setNameSearchError] = useState('');
  const [nameSearchResults, setNameSearchResults] = useState<GpPracticeSummary[] | null>(null);
  const [selectedGP, setSelectedGP] = useState<GpPracticeSummary | null>(null);
  const [icbCode, setIcbCode] = useState<string | null>(null);
  const [result, setResult] = useState<ICBPoliciesResponse | null>(null);
  const [error, setError] = useState('');

  const sortedGpPractices = gpPractices
    ? [...gpPractices].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    : null;

  const filteredGpPractices = sortedGpPractices
    ? sortedGpPractices.filter((gp) => {
        const q = gpPracticeQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          gp.name.toLowerCase().includes(q) ||
          gp.odsCode.toLowerCase().includes(q) ||
          (gp.postcode ?? '').toLowerCase().includes(q)
        );
      })
    : null;

  const nameSearchSortedResults = nameSearchResults
    ? [...nameSearchResults].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    : null;

  const resetSearchState = () => {
    setError('');
    setResult(null);
    setGpPractices(null);
    setGpPracticeQuery('');
    setSelectedGP(null);
    setIcbCode(null);
    onPolicyPanelChange?.({
      postcode,
      selectedGP: null,
      icbCode: null,
      policiesResponse: null,
      isLoading: false,
      error: null
    });
  };

  const resetSelectionState = () => {
    setError('');
    setResult(null);
    setIcbCode(null);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setLoadingSearch(true);
    resetSearchState();

    try {
      const gps = await searchGpPracticesByPostcode(postcode);
      if (gps.length > 0) {
        setGpPractices(gps);
        onSearchStarted?.();
      } else {
        setGpPractices([]);
        setError("We couldn't find any active GP practices for that postcode.");
      }
    } catch (err) {
      logDevError('[PostcodeSearch] gp search failed', err);
      setError(getPostcodeLookupErrorMessage('search', err));
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchByName = async () => {
    const q = nameSearchQuery.trim();
    if (q.length < 3) {
      setNameSearchResults([]);
      setNameSearchError('Type at least 3 characters.');
      return;
    }

    setNameSearchLoading(true);
    setNameSearchError('');
    setNameSearchResults(null);
    try {
      const gps = await searchGpPracticesByName(q);
      setNameSearchResults(gps);
      if (gps.length === 0) setNameSearchError("We couldn't find any active GP practices with that name.");
    } catch (err) {
      logDevError('[PostcodeSearch] gp name search failed', err);
      setNameSearchError(getPostcodeLookupErrorMessage('search', err));
      setNameSearchResults([]);
    } finally {
      setNameSearchLoading(false);
    }
  };

  const handleSelectGp = async (gp: GpPracticeSummary) => {
    setSelectedGP(gp);
    setLoadingSelect(true);
    resetSelectionState();
    onPolicyPanelChange?.({
      postcode,
      selectedGP: gp,
      icbCode: null,
      policiesResponse: null,
      isLoading: true,
      error: null
    });

    try {
      const resolvedIcbCode = await getIcbFromGpPractice(gp);
      if (!resolvedIcbCode) {
        const message = "We couldn't determine an ICB for that GP practice.";
        setError(message);
        onPolicyPanelChange?.({
          postcode,
          selectedGP: gp,
          icbCode: null,
          policiesResponse: null,
          isLoading: false,
          error: message
        });
        return;
      }

      setIcbCode(resolvedIcbCode);
      onPolicyPanelChange?.({
        postcode,
        selectedGP: gp,
        icbCode: resolvedIcbCode,
        policiesResponse: null,
        isLoading: true,
        error: null
      });
      const policiesResult = await lookupICBPoliciesByIcbCode(resolvedIcbCode);
      if (!policiesResult) {
        const message = "We couldn't find an ICB policy for that GP practice.";
        setError(message);
        onPolicyPanelChange?.({
          postcode,
          selectedGP: gp,
          icbCode: resolvedIcbCode,
          policiesResponse: null,
          isLoading: false,
          error: message
        });
        return;
      }

      setResult(policiesResult);
      onPolicyPanelChange?.({
        postcode,
        selectedGP: gp,
        icbCode: resolvedIcbCode,
        policiesResponse: policiesResult,
        isLoading: false,
        error: null
      });
    } catch (err) {
      logDevError('[PostcodeSearch] gp selection failed', err);
      const message = getPostcodeLookupErrorMessage('lookup', err);
      setError(message);
      onPolicyPanelChange?.({
        postcode,
        selectedGP: gp,
        icbCode: null,
        policiesResponse: null,
        isLoading: false,
        error: message
      });
    } finally {
      setLoadingSelect(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSearch} className="relative flex items-center max-w-md group">
        <div className="relative flex-1">
          <Input 
            placeholder="Enter your postcode (e.g. SE26 5EN)..." 
            aria-label="Enter your postcode"
            className="w-full px-6 py-4 h-14 text-lg font-medium border-2 border-warm-sand-dark focus-visible:border-sage-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(143,168,139,0.3)] rounded-2xl bg-white shadow-lg transition-all"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loadingSearch || loadingSelect}
          className="absolute right-2 px-6 h-11 bg-sage-dark hover:bg-sage-hover text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          {loadingSearch ? <Loader2 className="w-5 h-5 animate-spin" /> : "Find your GP"}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100"
          >
            {error}
          </motion.div>
        )}

        {sortedGpPractices && sortedGpPractices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <Card className="border-none shadow-md overflow-hidden rounded-xl bg-cream p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <CardTitle className="text-deep-slate font-bold">Select your GP practice</CardTitle>
                </div>
                {loadingSelect && (
                  <Badge className="bg-sage-light text-deep-slate hover:bg-sage-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading
                    </span>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Input
                  placeholder="Search GP name, postcode, or ODS…"
                  aria-label="Filter GP practices"
                  className="h-10"
                  value={gpPracticeQuery}
                  onChange={(e) => setGpPracticeQuery(e.target.value)}
                />
                {gpPracticeQuery.trim() ? (
                  <Button type="button" variant="outline" className="h-10" onClick={() => setGpPracticeQuery('')}>
                    Clear
                  </Button>
                ) : null}
              </div>

              <div className="max-h-[340px] overflow-y-auto pr-1 -mr-1">
                <div className="space-y-2">
                  {filteredGpPractices && filteredGpPractices.length > 0 ? (
                    filteredGpPractices.map((gp) => {
                      const isSelected = selectedGP?.odsCode === gp.odsCode;
                      return (
                        <Button
                          key={gp.odsCode}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          disabled={loadingSelect}
                          className="w-full justify-between rounded-lg"
                          onClick={() => handleSelectGp(gp)}
                        >
                          <span className="text-left">
                            <span className="block font-bold">{gp.name}</span>
                            <span className="block text-xs opacity-75">
                              {gp.postcode ? `${gp.postcode} · ` : null}
                              {gp.odsCode}
                            </span>
                          </span>
                          {isSelected && icbCode && result && <span className="text-xs opacity-90 truncate max-w-[120px]">{result.icb_name}</span>}
                        </Button>
                      );
                    })
                  ) : (
                    <div className="text-sm text-deep-slate/60 px-1 py-2">No GP practices match that search.</div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <Dialog open={nameSearchOpen} onOpenChange={setNameSearchOpen}>
                  <DialogTrigger render={<Button type="button" variant="outline" className="border-warm-sand-dark text-sage-dark hover:bg-sage-light hover:border-sage-green" />}>
                    Can't find your GP? Search by name
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Search for your GP by name</DialogTitle>
                      <DialogDescription>
                        Search across England for active GP practices (useful for digital GP services or a workplace GP).
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. Babylon, The Vale Medical Centre…"
                        aria-label="Search GP practice by name"
                        className="h-10"
                        value={nameSearchQuery}
                        onChange={(e) => setNameSearchQuery(e.target.value)}
                      />
                      <Button
                        type="button"
                        className="h-10"
                        disabled={nameSearchLoading || nameSearchQuery.trim().length < 3}
                        onClick={handleSearchByName}
                      >
                        {nameSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                      </Button>
                    </div>

                    {nameSearchError ? <div className="text-sm text-red-600">{nameSearchError}</div> : null}

                    <div className="max-h-[360px] overflow-y-auto pr-1 -mr-1">
                      <div className="space-y-2">
                        {nameSearchSortedResults && nameSearchSortedResults.length > 0 ? (
                          nameSearchSortedResults.map((gp) => (
                            <Button
                              key={gp.odsCode}
                              type="button"
                              variant="outline"
                              className="w-full justify-between rounded-lg"
                              disabled={loadingSelect}
                              onClick={() => {
                                void handleSelectGp(gp);
                                setNameSearchOpen(false);
                              }}
                            >
                              <span className="text-left">
                                <span className="block font-bold">{gp.name}</span>
                                <span className="block text-xs opacity-75">
                                  {gp.postcode ? `${gp.postcode} · ` : null}
                                  {gp.odsCode}
                                </span>
                              </span>
                            </Button>
                          ))
                        ) : nameSearchResults && nameSearchResults.length === 0 ? (
                          <div className="text-sm text-deep-slate/60 px-1 py-2">No GP practices found.</div>
                        ) : (
                          <div className="text-sm text-deep-slate/60 px-1 py-2">
                            Type a name (3+ characters) and search.
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {filteredGpPractices ? (
                  <div className="text-xs text-deep-slate/60">{filteredGpPractices.length} shown</div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 lg:hidden"
          >
            <Card className="border-none border-l-4 border-l-sage-green shadow-md overflow-hidden rounded-xl bg-cream p-5">
              <div className="mb-4">
                <CardTitle className="text-deep-slate font-bold">
                  {selectedGP ? selectedGP.name : 'Eligibility Result'}
                </CardTitle>
                <p className="text-[0.7rem] font-medium text-deep-slate/70 mt-1 leading-snug">
                  {result.icb_name}
                </p>
              </div>

              <PolicyTabs policies={result.policies} />
            </Card>

            <IcbDocuments icbCode={icbCode} />

            <div className="mt-4 rounded-lg border border-warm-sand-dark bg-cream/60 p-4 text-xs text-deep-slate/70 leading-relaxed">
              <div className="font-bold text-deep-slate">Disclaimer on NHS funding data</div>
              <div className="mt-2 space-y-2">
                <p>
                  We aim to keep the information accurate and current. The policy data is compiled from publicly
                  available documents published by each Integrated Care Board (ICB).
                </p>
                <p>
                  NHS IVF eligibility criteria can be updated with little notice, and some local exceptions may not be
                  widely published. For the latest guidance on your circumstances, always confirm with your ICB or speak
                  to your GP.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
