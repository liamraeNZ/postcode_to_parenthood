export function TrustBar() {
  return (
    <footer className="footer-bar mt-auto border-t border-warm-sand-dark bg-warm-sand px-3 sm:px-4 md:px-8 py-3 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-deep-slate/70">
      <div className="flex gap-4 sm:gap-8">
        <div>
          <strong className="text-deep-slate uppercase">Policy Data</strong>
          <br />
          Compiled from public ICB documents
        </div>
        <div className="hidden sm:block">
          <strong className="text-deep-slate uppercase">Independence</strong>
          <br />
          Not affiliated with the NHS
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="italic hidden lg:inline">"Navigating IVF costs shouldn't be the hardest part of the journey."</span>
      </div>
    </footer>
  );
}
