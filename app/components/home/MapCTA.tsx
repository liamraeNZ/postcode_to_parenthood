import type { RefObject } from 'react';
import { Link } from 'react-router';
import { useReveal } from '@/hooks/useReveal';

export default function MapCTA() {
  const sectionRef = useReveal();

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="bg-cream-dark py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="reveal rounded-3xl bg-forest overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left — text content */}
            <div className="px-8 py-12 md:px-12 lg:py-16">
              <p className="reveal stagger-1 text-sage-light text-sm font-mono uppercase tracking-[0.2em] mb-4">
                Explore visually
              </p>
              <h2 className="reveal stagger-2 font-heading text-off-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                Curious how funding{' '}
                <em className="not-italic font-heading italic text-sage-light">
                  varies
                </em>{' '}
                across the UK?
              </h2>
              <p className="reveal stagger-3 font-sans text-off-white/70 text-base font-light leading-relaxed mb-8 max-w-md">
                Our interactive map lets you see fertility funding policies at a
                glance — compare regions, spot patterns, and find your area
                without typing a thing.
              </p>
              <Link
                to="/map"
                className="reveal stagger-4 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-sage/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 focus-visible:ring-offset-forest btn-press"
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

            {/* Right — decorative map preview */}
            <div className="relative hidden lg:block h-full min-h-[320px]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, #2d5a45 0%, #7a9e8e 40%, #a8c4b8 70%, #7a9e8e 100%)',
                }}
              />
              {/* Abstract map-like shapes */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg
                  className="w-48 h-48 text-off-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={0.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-forest/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
