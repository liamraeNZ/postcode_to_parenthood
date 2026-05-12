import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Compass, Loader2, MapPin } from 'lucide-react';
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
  PostcodeLookupError,
  searchGpPracticesByName,
  searchGpPracticesByPostcode
} from '@/services/postcodeService';
import type { GpPracticeSummary } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { TrustDisclaimer } from '@/components/shared/TrustDisclaimer';

type PostcodeLookupAction = 'search' | 'lookup';

type PostcodeSearchProps = {
  onSearchStarted?: () => void;
  onPostcodeSearched?: (postcode: string) => void;
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

export function PostcodeSearch({ onSearchStarted, onPostcodeSearched }: PostcodeSearchProps) {
  const navigate = useNavigate();
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
    setGpPractices(null);
    setGpPracticeQuery('');
    setSelectedGP(null);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setLoadingSearch(true);
    resetSearchState();

    try {
      const result = await searchGpPracticesByPostcode(postcode);

      if (result.kind === 'direct') {
        // Scotland/Wales/NI — skip GP selection, navigate directly to board
        const { resolution } = result;
        onPostcodeSearched?.(postcode);
        if (resolution.redirectUrl) {
          const params = new URLSearchParams({ gpPostcode: postcode });
          if (resolution.boardName) params.set('boardName', resolution.boardName);
          navigate(`${resolution.redirectUrl}?${params.toString()}`);
        } else {
          setError(
            "We found your health board but don't have a dedicated policy page for it yet. Please try the map view for more information."
          );
        }
        return;
      }

      const gps = result.practices;
      if (gps.length > 0) {
        setGpPractices(gps);
        onSearchStarted?.();
        onPostcodeSearched?.(postcode);
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
    setError('');

    try {
      const resolved = await getIcbFromGpPractice(gp);
      if (!resolved) {
        setError("We couldn't determine a health board for that GP practice.");
        return;
      }

      const { slug } = resolved;

      if (slug) {
        const gpPostcode = gp.postcode ?? postcode;
        navigate(`/board/${slug}?gpPostcode=${encodeURIComponent(gpPostcode)}`);
      } else {
        setError(
          "We found your health board but don't have a dedicated policy page for it yet. Please try the map view for more information."
        );
      }
    } catch (err) {
      logDevError('[PostcodeSearch] gp selection failed', err);
      setError(getPostcodeLookupErrorMessage('lookup', err));
    } finally {
      setLoadingSelect(false);
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 max-w-md sm:relative group">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-route-teal" aria-hidden="true" />
          <Input 
            placeholder="Enter your postcode" 
            aria-label="Enter your postcode"
            className="w-full pl-10 pr-4 sm:pl-11 sm:pr-6 py-3 sm:py-4 h-12 sm:h-14 text-base sm:text-lg font-medium border-2 border-warm-sand-dark focus-visible:border-route-teal focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(45,156,154,0.22)] rounded-lg bg-white shadow-lg transition-all"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loadingSearch || loadingSelect}
          className="sm:absolute sm:right-2 w-full sm:w-auto px-6 h-11 bg-sage-btn hover:bg-route-teal-dark text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          {loadingSearch ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="sr-only">Finding your funding details</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              Find My Funding
            </>
          )}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100"
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
            <Card className="border-none shadow-md overflow-hidden rounded-lg bg-cream p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <CardTitle className="text-deep-slate font-bold">Choose your GP practice</CardTitle>
                  <p className="mt-1 text-xs text-deep-slate/60">
                    NHS funding is usually linked to your GP practice, so we use this to find the right local policy.
                  </p>
                </div>
                {loadingSelect && (
                  <Badge className="bg-sage-light text-deep-slate hover:bg-sage-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finding route
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
                  <DialogTrigger render={<Button type="button" variant="outline" className="border-warm-sand-dark text-sage-dark hover:bg-sage-light hover:border-route-teal" />}>
                    Can't find your GP? Search by name
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Search for your GP by name</DialogTitle>
                      <DialogDescription>
                        Search across the UK for active GP practices (useful for digital GP services or a workplace GP).
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
            <TrustDisclaimer className="mt-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
