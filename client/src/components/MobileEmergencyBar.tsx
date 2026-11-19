import { Phone, Calendar } from 'lucide-react';
import type { PageRoute } from '../types.ts';

interface MobileEmergencyBarProps {
  onNavigate: (route: PageRoute) => void;
}

export function MobileEmergencyBar({ onNavigate }: MobileEmergencyBarProps) {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-30 h-12 bg-[#0F3D3E] text-white border-t border-white/15 px-4 flex items-center justify-between gap-3"
      role="region"
      aria-label="24/7 Emergency Contact Bar"
    >
      <a
        href="tel:+442079460811"
        className="inline-flex items-center gap-2 text-xs font-medium text-white whitespace-nowrap shrink-0 tabular-nums min-h-[40px]"
      >
        <Phone className="w-3.5 h-3.5 text-[#E3C696]" aria-hidden="true" />
        <span>24/7 Emergency: 020 7946 0811</span>
      </a>

      <button
        type="button"
        onClick={() => onNavigate('book')}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#8E6B35] hover:bg-[#78582A] text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors"
      >
        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Book</span>
      </button>
    </div>
  );
}
