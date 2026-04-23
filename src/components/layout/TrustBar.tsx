export function TrustBar() {
  return (
    <footer className="footer-bar mt-auto border-t border-gray-200 bg-white px-8 py-5 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
      <div className="flex gap-8">
        <div>
          <strong className="text-gray-700 uppercase">Policy Data</strong>
          <br />
          Compiled from public ICB documents
        </div>
        <div className="hidden sm:block">
          <strong className="text-gray-700 uppercase">Independence</strong>
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
