import type { RefObject } from 'react';
import { PostcodeSearch } from '@/components/home/PostcodeSearch';
import { useReveal } from '@/hooks/useReveal';
import { CheckCircle } from 'lucide-react';

export function HeroSection() {
  const revealRef = useReveal(0.15);

  return (
    <section
      className="grain relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-base via-canvas to-canvas-dark"
    >
      {/* Background image — transparent, blending behind text */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <img
          src="/assets/hand-hold.webp"
          alt=""
          className="h-full w-full object-cover opacity-65"
        />
        {/* Overlay to blend image into canvasy background */}
        <div className="absolute inset-0 bg-gradient-to-br from-base/50 via-canvas/40 to-canvas-dark/50" />
      </div>

      {/* Subtle warm overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-base/50 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent"
        aria-hidden="true"
      />

      {/* Main content */}
      <div
        ref={revealRef as RefObject<HTMLDivElement>}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-32"
      >

        {/* Headline */}
        <h1 className="reveal stagger-2 font-heading text-5xl font-bold leading-tight tracking-tight text-ink md:text-6xl lg:text-7xl">
          Your pathway to{' '}
          <em className="not-italic font-heading italic text-brand">
            NHS-funded
          </em>{' '}
          fertility treatment
        </h1>

        {/* Subheading */}
        <p className="reveal stagger-3 mx-auto mt-6 max-w-2xl font-sans text-lg text-ink/70 md:text-xl">
          Discover what fertility funding your local NHS area offers in seconds.
          Free, and totally independent.
        </p>

        {/* PostcodeSearch */}
        <div className="reveal stagger-4 mx-auto mt-10 max-w-xl">
          <PostcodeSearch />
        </div>

        {/* Trust note */}
        <p className="reveal stagger-5 mt-5 flex items-center justify-center gap-1.5 text-sm text-ink/60">
          <CheckCircle className="h-4 w-4 text-brand" aria-hidden="true" />
          Based on official NHS health board policies — updated regularly
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-sans text-xs uppercase tracking-widest text-ink/40">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-ink/30 to-transparent" />
      </div>
    </section>
  );
}
