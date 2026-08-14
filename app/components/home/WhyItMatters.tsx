/*
 * DESIGN: Tender Modernism — Why It Matters
 * Forest green section with asymmetric split layout:
 * gradient image panel left, text + stats panel right.
 * Explains the postcode lottery problem with emotional weight.
 */
import type { RefObject } from 'react';
import { useReveal } from '@/hooks/useReveal';

const stats = [
  { value: '1 in 6', label: 'Couples affected by infertility' },
  { value: '100+', label: 'Health boards with different policies' },
  { value: '3×', label: 'Variation in funded cycles' },
  { value: '£5,000+', label: 'Average IVF cycle cost' },
];

export default function WhyItMatters() {
  const sectionRef = useReveal();

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="relative bg-brand overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] min-h-[600px]">
        {/* Left panel — image */}
        <div className="relative min-h-[300px] lg:min-h-full">
          <img
            src="/assets/fields.webp"
            alt="Patchwork fields divided by hedgerows, illustrating how boundaries determine access"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Teal overlay to blend with section */}
          <div className="absolute inset-0 bg-brand/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand/40" />
        </div>

        {/* Right panel — text content */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-12 lg:px-16 lg:py-24">
          {/* Heading */}
          <h2 className="reveal font-heading text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Funding rules{' '}
            <em className="not-italic font-heading italic underline decoration-canvas/60 underline-offset-4">
              change by area.
            </em>{' '}
            <br className="hidden md:inline" />
            Sometimes{' '}
            <em className="font-heading italic underline decoration-canvas/60 underline-offset-4">
              by the mile.
            </em>
          </h2>

          {/* Body text */}
          <p className="reveal stagger-1 font-sans text-white/90 text-base md:text-lg font-light leading-relaxed mb-4 max-w-xl">
            Access to NHS-funded fertility treatment depends on where you live.
            Two couples in identical situations can receive completely different
            levels of support, just because of their postcode.
          </p>
          <p className="reveal stagger-2 font-sans text-white/90 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl">
            Everyone deserves to understand their options. Postcode to
            Parenthood makes it simple to find out what funding is available in
            your area, so you can focus on what matters.
          </p>

          {/* 2×2 Statistics grid */}
          <div className="reveal stagger-3 grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="block font-heading text-white text-2xl md:text-3xl font-semibold">
                  {stat.value}
                </span>
                <span className="block font-sans text-white/80 text-sm mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
