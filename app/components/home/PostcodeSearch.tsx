import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Compass, Loader2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getIcbFromGpPractice,
  PostcodeLookupError,
  searchGpPracticesByName,
  searchGpPracticesByPostcode
} from '@/services/postcodeService';
import type { GpPracticeSummary } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { GpPracticeList } from '@/components/home/GpPracticeList';

type PostcodeLookupAction = 'search' | 'lookup';

type PostcodeSearchProps = {
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

export function PostcodeSearch({ onSearchStarted }: PostcodeSearchProps) {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [gpPractices, setGpPractices] = useState<GpPracticeSummary[] | null>(null);
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [nameSearchLoading, setNameSearchLoading] = useState(false);
  const [nameSearchError, setNameSearchError] = useState('');
  const [nameSearchResults, setNameSearchResults] = useState<GpPracticeSummary[] | null>(null);
  const [selectedGP, setSelectedGP] = useState<GpPracticeSummary | null>(null);
  const [error, setError] = useState('');

  const resetSearchState = () => {
    setError('');
    setGpPractices(null);
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
        // Scotland/Wales/NI: skip GP selection, navigate directly to board
        const { resolution } = result;
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
      <form
        onSubmit={handleSearch}
        className="group flex max-w-xl flex-col overflow-hidden rounded-full border border-warm-sand-dark/80 bg-white shadow-sm transition-[box-shadow] focus-within:border-sage/50 focus-within:shadow-[0_0_0_3px_rgba(122,158,142,0.4)] sm:flex-row sm:items-stretch"
      >
        <div className="relative flex min-h-[3rem] flex-1 items-center border-b border-warm-sand-dark/70 sm:border-b-0 sm:border-r sm:border-warm-sand-dark/70">
          <MapPin
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-route-teal"
            aria-hidden="true"
          />
          <Input
            placeholder="e.g. SW1A 1AA"
            aria-label="Enter your postcode"
            className="postcode-input h-12 w-full rounded-none border-0 bg-transparent py-3 pl-10 pr-3 font-mono text-base font-medium tracking-wider shadow-none ring-0 placeholder:text-deep-slate/45 focus-visible:ring-0 sm:h-14 sm:py-4 sm:pl-11 sm:pr-4 sm:text-lg"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loadingSearch || loadingSelect}
          className="h-12 shrink-0 rounded-full border-0 bg-sage px-5 font-semibold text-white shadow-none hover:bg-sage/90 disabled:opacity-60 sm:h-auto sm:min-w-[10.5rem]"
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

        {gpPractices && gpPractices.length > 0 && (
          <GpPracticeList
            practices={gpPractices}
            selectedGP={selectedGP}
            loadingSelect={loadingSelect}
            onSelectGp={handleSelectGp}
            nameSearchOpen={nameSearchOpen}
            onNameSearchOpenChange={setNameSearchOpen}
            nameSearchQuery={nameSearchQuery}
            onNameSearchQueryChange={setNameSearchQuery}
            nameSearchLoading={nameSearchLoading}
            nameSearchError={nameSearchError}
            nameSearchResults={nameSearchResults}
            onSearchByName={handleSearchByName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
