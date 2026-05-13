import type { RefObject } from 'react';
import { useReveal } from '@/hooks/useReveal';

const steps = [
  {
    number: '01',
    title: 'Enter your postcode',
    description:
      'Type in your postcode or search for your GP practice to find your local Integrated Care Board.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'See your local policy',
    description:
      'We show you the NHS fertility funding policy for your area, including eligibility criteria and number of cycles.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Understand your options',
    description:
      'Compare policies across the country and understand what funding you may be entitled to on the NHS.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useReveal();

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="bg-surface py-24 px-6 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <p className="reveal text-tint text-sm font-mono uppercase tracking-[0.2em] mb-4">
          How it works
        </p>

        {/* Heading */}
        <h2 className="reveal stagger-1 font-heading text-ink text-3xl md:text-4xl lg:text-5xl mb-16">
          Three simple steps to{' '}
          <em className="not-italic font-heading italic">
            find your funding
          </em>
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`reveal stagger-${index + 2} card-hover rounded-2xl bg-white p-8 shadow-sm`}
            >
              {/* Icon */}
              <div className="text-tint mb-6">{step.icon}</div>

              {/* Step number */}
              <span className="font-mono text-tint text-sm tracking-[0.15em] mb-3 block">
                Step {step.number}
              </span>

              {/* Title */}
              <h3 className="font-heading text-ink text-xl mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-ink/70 text-base font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
