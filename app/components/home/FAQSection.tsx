import type { RefObject } from 'react';
import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

const faqs = [
  {
    question: 'Is this service free?',
    answer:
      'Yes, completely. Pathway to Parenthood is a free, independent resource. We do not charge for access to funding information and we have no commercial relationship with any fertility clinic or pharmaceutical company.',
  },
  {
    question: 'How accurate is the data?',
    answer:
      'Our data is sourced directly from official health board policy documents and Freedom of Information requests. We cross-reference multiple sources and update regularly, but we always recommend confirming details with your GP or local health board.',
  },
  {
    question: 'What is a health board?',
    answer:
      'A health board is the NHS organisation responsible for planning and funding healthcare services in your area, including fertility treatment. Each region of the UK has its own health board with its own fertility funding policy.',
  },
  {
    question: 'How often is the data updated?',
    answer:
      'We review and update policy data regularly, and whenever a health board publishes a new or revised fertility policy. Major policy changes are reflected as quickly as possible after publication.',
  },
  {
    question: 'Does this cover the whole UK?',
    answer:
      'Yes. Pathway to Parenthood covers NHS fertility funding policies across the UK, including England, Scotland, Wales, and Northern Ireland. Each nation has different health board structures and funding arrangements.',
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-tint/20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint/40 rounded-sm"
      >
        <span className="font-heading text-ink text-lg md:text-xl pr-4">
          {question}
        </span>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tint/30 transition-transform duration-500"
          style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 text-tint transition-transform duration-500 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 font-sans text-ink/70 text-base font-light leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const sectionRef = useReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef as RefObject<HTMLElement>}
      className="bg-surface py-24 px-6 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left column — sticky heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="reveal text-tint text-sm font-mono uppercase tracking-[0.2em] mb-4">
                FAQ
              </p>
              <h2 className="reveal stagger-1 font-heading text-ink text-3xl md:text-4xl lg:text-5xl">
                Common{' '}
                <em className="not-italic font-heading italic">
                  questions
                </em>
              </h2>
              <p className="reveal stagger-2 font-sans text-ink/60 text-base font-light mt-4 leading-relaxed">
                Everything you need to know about NHS fertility funding and how
                our service works.
              </p>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className="lg:col-span-8">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`reveal stagger-${Math.min(index + 1, 5)}`}
              >
                <AccordionItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
