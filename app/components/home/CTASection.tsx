import type { RefObject } from 'react';
import { PostcodeSearch } from '@/components/home/PostcodeSearch';
import { useReveal } from '@/hooks/useReveal';

export default function CTASection() {
  const revealRef = useReveal(0.15);

  return (
    <section
      className="grain relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          'linear-gradient(160deg, #0f2419 0%, #1a3d2e 35%, #2d5a45 65%, #1a3d2e 100%)',
      }}
    >
      {/* Dark overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(15, 36, 25, 0.4) 0%, rgba(15, 36, 25, 0.7) 100%)',
        }}
      />

      <div
        ref={revealRef as RefObject<HTMLDivElement>}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        {/* Heading */}
        <h2 className="reveal stagger-1 font-heading text-4xl font-bold leading-tight tracking-tight text-off-white md:text-5xl lg:text-6xl">
          Ready to find{' '}
          <em className="not-italic font-heading italic text-sage-light">
            your funding
          </em>
          ?
        </h2>

        {/* Subheading */}
        <p className="reveal stagger-2 mx-auto mt-4 max-w-xl font-sans text-lg text-off-white/70">
          Enter your postcode below and we'll show you exactly what NHS fertility
          funding is available in your area.
        </p>

        {/* PostcodeSearch */}
        <div className="reveal stagger-3 mx-auto mt-10 max-w-xl">
          <PostcodeSearch />
        </div>
      </div>
    </section>
  );
}
