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
      className="relative bg-forest overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left panel — gradient image fallback */}
        <div className="relative lg:col-span-5 min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #0f2419 0%, #1a3d2e 30%, #2d5a45 60%, #7a9e8e 100%)',
            }}
          />
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest/80" />
        </div>

        {/* Right panel — text content */}
        <div className="lg:col-span-7 flex flex-col justify-center px-8 py-16 md:px-12 lg:px-16 lg:py-24">
          {/* Heading */}
          <h2 className="reveal font-heading text-off-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Why it{' '}
            <em className="text-sage-light not-italic font-heading italic">
              matters
            </em>
          </h2>

          {/* Body text */}
          <p className="reveal stagger-1 font-sans text-off-white/70 text-base md:text-lg font-light leading-relaxed mb-4 max-w-xl">
            Access to NHS-funded fertility treatment depends on where you live.
            This postcode lottery means that identical couples receive vastly
            different levels of support depending on their local health board.
          </p>
          <p className="reveal stagger-2 font-sans text-off-white/70 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl">
            We believe everyone deserves to understand their options. Pathway to
            Parenthood makes it simple to find out what funding is available in
            your area.
          </p>

          {/* 2×2 Statistics grid */}
          <div className="reveal stagger-3 grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="block font-heading text-sage-light text-2xl md:text-3xl font-semibold">
                  {stat.value}
                </span>
                <span className="block font-sans text-off-white/80 text-sm mt-1">
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
