import { PostcodeSearch } from './PostcodeSearch';
import type { PolicyPanelState } from './PostcodeSearch';
import { motion } from 'motion/react';

type HeroProps = {
  onPolicyPanelChange?: (state: PolicyPanelState) => void;
  onSearchStarted?: () => void;
  hasResults?: boolean;
  hasSearched?: boolean;
};

export function Hero({ onPolicyPanelChange, onSearchStarted, hasResults, hasSearched }: HeroProps) {
  return (
    <section className="col-span-12 lg:col-span-7 flex flex-col py-4 md:py-6">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-5 text-left"
      >
        <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-2 text-deep-slate">
          NHS-funded fertility care isn't the same everywhere.
        </h1>
      </motion.div>

      {/* Explainer text (hidden after search) */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 max-w-lg"
        >
          <div className="text-sm text-deep-slate/80 leading-relaxed space-y-3">
            <p>
              Where you live affects whether you qualify for support; a "postcode lottery" that leaves many people confused and frustrated.
            </p>
            <p><b>Enter your postcode below. We'll show you:</b>
              
            </p>
            <ul className="space-y-2 mt-1">
              <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
                <span className="text-deep-slate font-medium">Which integrated care board (ICB) covers your GP</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
                <span className="text-deep-slate font-medium">Whether NHS-funded care is available in that area</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
                <span className="text-deep-slate font-medium">The eligibility criteria you'll need to meet</span>
              </li>
            </ul>
            <p className="text-xs text-deep-slate/60 italic">
              Eligibility is determined by your GP practice's location, not your home address.
            </p>
          </div>
        </motion.div>
      )}

      {/* Search form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div id="postcode-search">
          <PostcodeSearch onPolicyPanelChange={onPolicyPanelChange} onSearchStarted={onSearchStarted} />
        </div>
      </motion.div>

      {/* Three-step guide (hidden when results show) */}
      {!hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-start gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-light text-deep-slate text-sm font-semibold">1</span>
              <span className="text-sm text-deep-slate/70">Enter postcode</span>
            </div>
            <span className="hidden md:block text-deep-slate/30" aria-hidden="true">→</span>
            <span className="block md:hidden text-deep-slate/30" aria-hidden="true">↓</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-light text-deep-slate text-sm font-semibold">2</span>
              <span className="text-sm text-deep-slate/70">Select GP</span>
            </div>
            <span className="hidden md:block text-deep-slate/30" aria-hidden="true">→</span>
            <span className="block md:hidden text-deep-slate/30" aria-hidden="true">↓</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-light text-deep-slate text-sm font-semibold">3</span>
              <span className="text-sm text-deep-slate/70">View results</span>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
