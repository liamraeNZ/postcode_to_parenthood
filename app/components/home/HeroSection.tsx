import type { ReactNode, RefObject } from 'react';
import { PostcodeSearch } from '@/components/home/PostcodeSearch';
import { useReveal } from '@/hooks/useReveal';
import { CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  /** Callback when GP list content changes (for desktop side panel) */
  onGpListChange?: (content: ReactNode | null) => void;
}

export function HeroSection({ onGpListChange }: HeroSectionProps) {
  const revealRef = useReveal(0.15);

  return (
    <section
      className="grain relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-off-white via-sand to-sand-dark"
    >
      {/* Subtle warm overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-off-white/50 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sand/40 to-transparent"
        aria-hidden="true"
      />

      {/* Main content */}
      <div
        ref={revealRef as RefObject<HTMLDivElement>}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-32"
      >
        {/* Eyebrow badge */}
        <div className="reveal stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 text-sm text-forest backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
          </span>
          Updated for 2026
        </div>

        {/* Headline */}
        <h1 className="reveal stagger-2 font-heading text-5xl font-bold leading-tight tracking-tight text-charcoal md:text-6xl lg:text-7xl">
          Your pathway to{' '}
          <em className="not-italic font-heading italic">
            NHS-funded
          </em>{' '}
          fertility treatment
        </h1>

        {/* Subheading */}
        <p className="reveal stagger-3 mx-auto mt-6 max-w-2xl font-sans text-lg text-charcoal/70 md:text-xl">
          Discover what fertility funding your local NHS area offers in seconds.
          Free, and totally independent.
        </p>

        {/* PostcodeSearch */}
        <div className="reveal stagger-4 mx-auto mt-10 max-w-xl">
          <PostcodeSearch onGpListChange={onGpListChange} />
        </div>

        {/* Trust note */}
        <p className="reveal stagger-5 mt-5 flex items-center justify-center gap-1.5 text-sm text-charcoal/60">
          <CheckCircle className="h-4 w-4 text-forest" aria-hidden="true" />
          Based on official NHS health board policies — updated regularly
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-sans text-xs uppercase tracking-widest text-charcoal/40">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-charcoal/30 to-transparent" />
      </div>
    </section>
  );
}
