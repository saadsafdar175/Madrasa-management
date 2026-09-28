import React from 'react';
import { MadrasaSettings } from '../../types';

interface PrintFooterProps {
  settings: MadrasaSettings;
  showAccountant?: boolean;
}

export const PrintFooter: React.FC<PrintFooterProps> = ({
  settings,
  showAccountant = true,
}) => {
  return (
    <div className="mt-8 pt-4 border-t border-slate-300 print-avoid-break">
      <div className="grid grid-cols-4 gap-4 text-center text-xs text-slate-800">
        {/* Signature 1 */}
        <div className="flex flex-col items-center">
          <div className="h-10"></div>
          <div className="w-full border-t border-dashed border-slate-400 pt-1 font-semibold text-slate-900">
            دستخط نگران / استاد
          </div>
          <span className="text-[10px] text-slate-500">نگران شعبہ</span>
        </div>

        {/* Signature 2 */}
        {showAccountant && (
          <div className="flex flex-col items-center">
            <div className="h-10"></div>
            <div className="w-full border-t border-dashed border-slate-400 pt-1 font-semibold text-slate-900">
              دستخط محاسب / کیشئر
            </div>
            <span className="text-[10px] text-slate-500">{settings.accountantName}</span>
          </div>
        )}

        {/* Signature 3 */}
        <div className="flex flex-col items-center">
          <div className="h-10"></div>
          <div className="w-full border-t border-dashed border-slate-400 pt-1 font-semibold text-slate-900">
            ناظمِ تعلیمات
          </div>
          <span className="text-[10px] text-slate-500">{settings.nazimTaleematName}</span>
        </div>

        {/* Stamp & Principal */}
        <div className="flex flex-col items-center">
          <div className="h-10 flex items-center justify-center">
            <div className="w-16 h-10 border border-dotted border-emerald-700/60 rounded flex items-center justify-center text-[9px] text-emerald-800 font-bold">
              (مہرِ جامعہ)
            </div>
          </div>
          <div className="w-full border-t border-dashed border-slate-400 pt-1 font-semibold text-slate-900">
            مہتمم / صدر مدرس
          </div>
          <span className="text-[10px] text-slate-500">{settings.mohtamimName}</span>
        </div>
      </div>

      <div className="mt-4 pt-1 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-100 font-mono">
        <span>جامعہ مینجمنٹ سافٹ ویئر - خودکار کمپیوٹرائزڈ ریکارڈ</span>
        <span>صفحہ ۱ از ۱</span>
      </div>
    </div>
  );
};
