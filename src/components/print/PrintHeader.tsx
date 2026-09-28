import React from 'react';
import { MadrasaSettings } from '../../types';

interface PrintHeaderProps {
  settings: MadrasaSettings;
  title: string;
  subTitle?: string;
  refNo?: string;
  date?: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  settings,
  title,
  subTitle,
  refNo,
  date,
}) => {
  const currentDate = date || new Date().toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border-b-2 border-emerald-900 pb-3 mb-4 text-center">
      {/* Bismillah */}
      <div className="text-sm font-arabic tracking-widest text-emerald-950 font-bold mb-1">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Right Info (RTL) */}
        <div className="text-right text-xs text-slate-700 w-1/4 leading-relaxed">
          <p className="font-semibold text-slate-900">{settings.affiliation}</p>
          <p>{settings.registrationNo}</p>
          <p className="mt-1 font-mono text-[11px]">{settings.phone}</p>
        </div>

        {/* Center Madrasa Branding */}
        <div className="flex-1 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            {/* Islamic Crescent / Book Icon */}
            <div className="w-10 h-10 rounded-full border-2 border-emerald-800 flex items-center justify-center bg-emerald-50 text-emerald-900 font-bold text-lg">
              ☪
            </div>
            <h1 className="text-2xl font-nastaliq font-bold text-emerald-950 tracking-wide">
              {settings.madrasaName}
            </h1>
          </div>
          <p className="text-xs text-slate-700 font-medium">{settings.subTitle}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{settings.address}</p>
        </div>

        {/* Left Dates (RTL) */}
        <div className="text-left text-xs text-slate-700 w-1/4 leading-relaxed font-mono">
          <p><span className="font-sans font-semibold text-slate-900">تعلیمی سال:</span> {settings.academicYear}</p>
          <p><span className="font-sans font-semibold text-slate-900">ہجری سال:</span> {settings.hijriYear}</p>
          <p><span className="font-sans font-semibold text-slate-900">تاریخ:</span> {currentDate}</p>
          {refNo && <p><span className="font-sans font-semibold text-slate-900">شمار نمبر:</span> {refNo}</p>}
        </div>
      </div>

      {/* Document Badge */}
      <div className="mt-3 flex justify-center items-center">
        <div className="inline-block bg-emerald-900 text-white px-6 py-1 rounded border border-emerald-950 font-bold text-sm tracking-wide shadow-xs">
          {title}
        </div>
      </div>
      {subTitle && (
        <div className="text-xs text-slate-600 mt-1 font-medium">
          {subTitle}
        </div>
      )}
    </div>
  );
};
