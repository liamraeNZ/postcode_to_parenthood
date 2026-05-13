const stats = [
  { value: "All UK", label: "health boards covered" },
  { value: "Updated", label: "regularly" },
  { value: "3,500+", label: "GP practices mapped" },
  { value: "Independent", label: "& transparent" },
  { value: "Instant", label: "postcode lookup" },
  { value: "Open", label: "source data" },
];

export default function StatsTicker() {
  return (
    <section className="relative overflow-hidden bg-forest py-5">
      {/* Left fade gradient overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-forest to-transparent" />
      {/* Right fade gradient overlay */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-forest to-transparent" />

      {/* Ticker track — duplicated array for seamless infinite loop */}
      <div className="ticker-track flex w-max items-center gap-12 px-6">
        {[...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="font-heading text-2xl font-semibold text-off-white">
              {stat.value}
            </span>
            <span className="font-sans text-sm text-off-white/70">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
