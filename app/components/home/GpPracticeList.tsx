/*
 * DESIGN: Tender Modernism — GP Practice Selector
 * Warm white card with sage accents, matching the rounded-2xl
 * card style used across HowItWorks and other home sections.
 */
import { useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { GpPracticeSummary } from '@/types';
import { motion } from 'motion/react';

interface GpPracticeListProps {
  practices: GpPracticeSummary[];
  selectedGP: GpPracticeSummary | null;
  loadingSelect: boolean;
  onSelectGp: (gp: GpPracticeSummary) => void;
  /* Name search */
  nameSearchOpen: boolean;
  onNameSearchOpenChange: (open: boolean) => void;
  nameSearchQuery: string;
  onNameSearchQueryChange: (query: string) => void;
  nameSearchLoading: boolean;
  nameSearchError: string;
  nameSearchResults: GpPracticeSummary[] | null;
  onSearchByName: () => void;
}

export function GpPracticeList({
  practices,
  selectedGP,
  loadingSelect,
  onSelectGp,
  nameSearchOpen,
  onNameSearchOpenChange,
  nameSearchQuery,
  onNameSearchQueryChange,
  nameSearchLoading,
  nameSearchError,
  nameSearchResults,
  onSearchByName,
}: GpPracticeListProps) {
  const [filterQuery, setFilterQuery] = useState('');

  const sorted = [...practices].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  );

  const filtered = sorted.filter((gp) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      gp.name.toLowerCase().includes(q) ||
      gp.odsCode.toLowerCase().includes(q) ||
      (gp.postcode ?? '').toLowerCase().includes(q)
    );
  });

  const nameSearchSorted = nameSearchResults
    ? [...nameSearchResults].sort((a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-sage/20">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading text-charcoal text-lg">
              Select your GP practice
            </h3>
            <p className="font-sans text-charcoal/60 text-sm font-light mt-1">
              We'll show you the funding policy that applies to your practice.
            </p>
          </div>
          {loadingSelect && (
            <span className="inline-flex items-center gap-2 rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Finding route
            </span>
          )}
        </div>

        {/* Filter input */}
        <div className="relative mb-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
            aria-hidden="true"
          />
          <Input
            placeholder="Filter by name, postcode, or ODS…"
            aria-label="Filter GP practices"
            className="h-9 pl-9 pr-9 text-sm border-sage/20 focus-visible:ring-sage/40"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          {filterQuery.trim() && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors"
              aria-label="Clear filter"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Practice list */}
        <div className="relative">
          <div className="max-h-[240px] overflow-y-auto pr-1 -mr-1">
            <div className="divide-y divide-sage/15">
              {filtered.length > 0 ? (
                filtered.map((gp) => {
                  const isSelected = selectedGP?.odsCode === gp.odsCode;
                  return (
                    <button
                      key={gp.odsCode}
                      type="button"
                      disabled={loadingSelect}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-sage/10 font-medium'
                          : 'hover:bg-cream'
                      } ${loadingSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      onClick={() => onSelectGp(gp)}
                    >
                      <span className="font-sans text-charcoal truncate">
                        {gp.name}
                      </span>
                      <span className="font-mono text-xs text-charcoal/50 whitespace-nowrap shrink-0">
                        {gp.postcode ? `${gp.postcode} · ` : ''}
                        {gp.odsCode}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="font-sans text-sm text-charcoal/50 px-3 py-3">
                  No GP practices match that filter.
                </p>
              )}
            </div>
          </div>

          {/* Scroll fade hint */}
          {filtered.length > 6 && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent rounded-b-lg" />
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-sage/15">
          <Dialog open={nameSearchOpen} onOpenChange={onNameSearchOpenChange}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 text-xs border-sage/25 text-charcoal/70 hover:bg-cream hover:border-sage/40"
                />
              }
            >
              Can't find your GP? Search by name
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Search for your GP by name</DialogTitle>
                <DialogDescription>
                  Search across the UK for active GP practices (useful for
                  digital GP services or a workplace GP).
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g. Babylon, The Vale Medical Centre…"
                  aria-label="Search GP practice by name"
                  className="h-10"
                  value={nameSearchQuery}
                  onChange={(e) => onNameSearchQueryChange(e.target.value)}
                />
                <Button
                  type="button"
                  className="h-10 bg-sage hover:bg-sage/90"
                  disabled={nameSearchLoading || nameSearchQuery.trim().length < 3}
                  onClick={onSearchByName}
                >
                  {nameSearchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>

              {nameSearchError && (
                <p className="text-sm text-red-600">{nameSearchError}</p>
              )}

              <div className="max-h-[360px] overflow-y-auto pr-1 -mr-1">
                <div className="space-y-2">
                  {nameSearchSorted && nameSearchSorted.length > 0 ? (
                    nameSearchSorted.map((gp) => (
                      <Button
                        key={gp.odsCode}
                        type="button"
                        variant="outline"
                        className="w-full justify-between rounded-lg"
                        disabled={loadingSelect}
                        onClick={() => {
                          onSelectGp(gp);
                          onNameSearchOpenChange(false);
                        }}
                      >
                        <span className="text-left">
                          <span className="block font-medium text-charcoal">
                            {gp.name}
                          </span>
                          <span className="block font-mono text-xs text-charcoal/50">
                            {gp.postcode ? `${gp.postcode} · ` : null}
                            {gp.odsCode}
                          </span>
                        </span>
                      </Button>
                    ))
                  ) : nameSearchResults && nameSearchResults.length === 0 ? (
                    <p className="font-sans text-sm text-charcoal/50 px-1 py-2">
                      No GP practices found.
                    </p>
                  ) : (
                    <p className="font-sans text-sm text-charcoal/50 px-1 py-2">
                      Type a name (3+ characters) and search.
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <span className="font-mono text-xs text-charcoal/40">
            {filtered.length} practice{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
