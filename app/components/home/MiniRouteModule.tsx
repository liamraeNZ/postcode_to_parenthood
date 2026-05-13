import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface MiniRouteModuleProps {
  className?: string;
}

const STEPS = [
  'Postcode',
  'Health board',
  'Local policy',
  'Next questions',
] as const;

export function MiniRouteModule({ className }: MiniRouteModuleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'flex items-center gap-2 px-4 py-3 max-h-[120px] rounded-xl border border-route-teal/20 bg-deep-slate/5',
        className
      )}
    >
      {STEPS.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-route-teal/10 px-2.5 py-1.5 text-xs font-medium text-deep-slate">
            {step}
          </span>
          {index < STEPS.length - 1 && (
            <span className="text-tint font-bold text-sm" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
