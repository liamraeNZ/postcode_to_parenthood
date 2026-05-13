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
      className="grain relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0f2419 0%, #1a3d2e 40%, #2d5a45 70%, #1a3d2e 100%)',
      }}
    >
      {/* Layered gradient overlays for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, rgba(15, 36, 25, 0.7) 0%, transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to top, rgba(15, 36, 25, 0.8) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div
        ref={revealRef as RefObject<HTMLDivElement>}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-32"
      >
        {/* Eyebrow badge */}
        <div className="reveal stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-off-white/20 bg-off-white/10 px-4 py-1.5 text-sm text-off-white/80 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-light opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-light" />
          </span>
          Updated for 2026
        </div>

        {/* Headline */}
        <h1 className="reveal stagger-2 font-heading text-5xl font-bold leading-tight tracking-tight text-off-white md:text-6xl lg:text-7xl">
          Your pathway to{' '}
          <em className="not-italic font-heading italic text-sage-light">
            NHS-funded
          </em>{' '}
          fertility treatment
        </h1>

        {/* Subheading */}
        <p className="reveal stagger-3 mx-auto mt-6 max-w-2xl font-sans text-lg text-off-white/70 md:text-xl">
          Discover what fertility funding your local NHS area offers — in seconds.
          Free, independent, and always up to date.
        </p>

        {/* PostcodeSearch */}
        <div className="reveal stagger-4 mx-auto mt-10 max-w-xl">
          <PostcodeSearch onGpListChange={onGpListChange} />
        </div>

        {/* Trust note */}
        <p className="reveal stagger-5 mt-5 flex items-center justify-center gap-1.5 text-sm text-off-white/60">
          <CheckCircle className="h-4 w-4 text-sage-light" aria-hidden="true" />
          Based on official NHS health board policies — updated regularly
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-sans text-xs uppercase tracking-widest text-off-white/50">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-off-white/40 to-transparent" />
      </div>
    </section>
  );
}
