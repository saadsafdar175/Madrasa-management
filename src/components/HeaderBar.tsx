import React from 'react';
import { Printer, Calendar, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { MadrasaSettings } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderBarProps {
  settings: MadrasaSettings;
  pageTitle: string;
  onQuickPrint?: () => void;
  quickPrintLabel?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  settings,
  pageTitle,
  onQuickPrint,
  quickPrintLabel = '🖨 پرنٹ رپورٹ',
}) => {
  const isOnline = useOnlineStatus();
  const currentDate = new Date().toLocaleDateString('ur-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="no-print bg-[#0B2545] border-b border-blue-900/80 px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-20 text-white">
      {/* Title & Path */}
      <div>
        <h2 className="text-xl font-nastaliq font-bold text-white tracking-wide">
          {pageTitle}
        </h2>
        <div className="flex items-center gap-2.5 text-xs text-blue-200 mt-0.5">
          <span className="text-amber-300 font-semibold">{settings.madrasaName}</span>
          <span className="text-blue-400">•</span>
          <span className="flex items-center gap-1.5 text-blue-200">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            {settings.hijriYear} | {currentDate}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real Online / Offline Indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs border ${
            isOnline
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
          }`}
          title={isOnline ? 'انٹرنیٹ فعال ہے' : 'انٹرنیٹ منقطع ہے - مقامی آف لائن ڈیٹا بیس فعال ہے'}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>🟢 Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>🔴 Offline</span>
            </>
          )}
        </div>

        {onQuickPrint && (
          <button
            type="button"
            onClick={onQuickPrint}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer border border-blue-500/40"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>{quickPrintLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};
