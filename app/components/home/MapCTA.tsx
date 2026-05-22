import type { RefObject } from 'react';
import { Link } from 'react-router';
import { useReveal } from '@/hooks/useReveal';

export default function MapCTA() {
  const sectionRef = useReveal();

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="bg-surface-dark py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="reveal rounded-3xl bg-brand overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left — text content */}
            <div className="px-8 py-12 md:px-12 lg:py-16">
              <p className="reveal stagger-1 text-white/80 text-sm font-mono uppercase tracking-[0.2em] mb-4">
                Explore visually
              </p>
              <h2 className="reveal stagger-2 font-heading text-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                Curious how funding{' '}
                <em className="not-italic font-heading italic">
                  varies
                </em>{' '}
                across the UK?
              </h2>
              <p className="reveal stagger-3 font-sans text-white/90 text-base font-light leading-relaxed mb-8 max-w-md">
                Our interactive map lets you see fertility funding policies at a
                glance. Compare regions, spot patterns, and find your area
                without typing a thing.
              </p>
              <Link
                to="/map"
                className="reveal stagger-4 inline-flex items-center gap-2 rounded-full bg-tint px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-tint/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand btn-press"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                View the funding map
              </Link>
            </div>

            {/* Right — map preview */}
            <div className="relative hidden lg:block h-full min-h-[320px]">
              <img
                src="/assets/map.webp"
                alt="Preview of the interactive UK fertility funding map"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
