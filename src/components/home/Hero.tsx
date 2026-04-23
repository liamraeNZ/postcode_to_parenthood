import { PostcodeSearch } from './PostcodeSearch';
import type { PolicyPanelState } from './PostcodeSearch';
import { motion } from 'motion/react';

type HeroProps = {
  onPolicyPanelChange?: (state: PolicyPanelState) => void;
};

export function Hero({ onPolicyPanelChange }: HeroProps) {
  return (
    <section className="col-span-12 lg:col-span-7 flex flex-col justify-center">
      <div className="w-full">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-full">
              Updated for 2026 Policies
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-sage-text">
              Stop the Postcode Lottery. <br />
              <span className="text-emerald-solid underline decoration-emerald-200 underline-offset-4 decoration-4">Find IVF funding</span> in 60 seconds.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Instant NHS ICB lookup and a curated database of private grants, loans, and European refund guarantees for UK residents.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PostcodeSearch onPolicyPanelChange={onPolicyPanelChange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-4 text-sm text-gray-500 max-w-xl"
        >
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-emerald-300 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white"></div>
          </div>
          <p>Joined by <span className="font-bold text-gray-700">1,240+ residents</span> this month.</p>
        </motion.div>
      </div>
    </section>
  );
}
