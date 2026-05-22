import type { RefObject } from 'react';
import { PostcodeSearch } from '@/components/home/PostcodeSearch';
import { useReveal } from '@/hooks/useReveal';

export default function CTASection() {
  const revealRef = useReveal(0.15);

  return (
    <section
      className="grain relative overflow-hidden bg-brand py-24 md:py-32"
    >
      {/* Dark overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-brand-dark/30"
        aria-hidden="true"
      />

      <div
        ref={revealRef as RefObject<HTMLDivElement>}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        {/* Heading */}
        <h2 className="reveal stagger-1 font-heading text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Ready to find{' '}
          <em className="not-italic font-heading italic">
            your funding
          </em>
          ?
        </h2>

        {/* Subheading */}
        <p className="reveal stagger-2 mx-auto mt-4 max-w-xl font-sans text-lg text-white/90">
          Pop your postcode in below and we'll pull up the NHS fertility
          funding details for your area.
        </p>

        {/* PostcodeSearch */}
        <div className="reveal stagger-3 mx-auto mt-10 max-w-xl">
          <PostcodeSearch />
        </div>
      </div>
    </section>
  );
}
