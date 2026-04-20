import { ShieldCheck } from 'lucide-react';

export function TrustBar() {
  return (
    <footer className="footer-bar mt-auto border-t border-gray-200 bg-white px-8 py-5 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
      <div className="flex gap-8">
        <div>
          <strong className="text-gray-700 uppercase">Verified Data</strong>
          <br />
          Last Synced: Oct 14, 2025
        </div>
        <div className="hidden sm:block">
          <strong className="text-gray-700 uppercase">Partners</strong>
          <br />
          NHS England & HFEA Data
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="italic hidden lg:inline">"Navigating IVF costs shouldn't be the hardest part of the journey."</span>
        <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/NHS-Logo.svg" 
          alt="NHS" 
          className="h-4 opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
    </footer>
  );
}
