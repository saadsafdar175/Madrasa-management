import React, { useState } from 'react';
import {
  Printer,
  X,
  Maximize2,
  Minimize2,
  FileText,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import {
  MadrasaSettings,
  Darja,
  Student,
  Teacher,
  AttendanceRecord,
  HifzRecord,
  TajweedRecord,
  DarsNizamiRecord,
  DaurHadithRecord,
  Exam,
  ExamMark,
  FeeReceipt,
  FinanceTransaction,
  SalaryPayment,
  PrintPreviewData
} from '../../types';
import { DocumentRenderer } from './DocumentRenderer';

interface PrintModalProps {
  previewData: PrintPreviewData;
  settings: MadrasaSettings;
  darajat: Darja[];
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  hifzRecords: HifzRecord[];
  tajweedRecords: TajweedRecord[];
  darsNizamiRecords: DarsNizamiRecord[];
  daurHadithRecords: DaurHadithRecord[];
  exams: Exam[];
  examMarks: ExamMark[];
  feeReceipts: FeeReceipt[];
  financeTransactions: FinanceTransaction[];
  salaryPayments: SalaryPayment[];
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  previewData,
  settings,
  darajat,
  students,
  teachers,
  attendance,
  hifzRecords,
  tajweedRecords,
  darsNizamiRecords,
  daurHadithRecords,
  exams,
  examMarks,
  feeReceipts,
  financeTransactions,
  salaryPayments,
  onClose,
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    previewData.orientation || 'portrait'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrintNow = () => {
    // Inject dynamic @page rule for chosen orientation
    const existingStyle = document.getElementById('dynamic-print-orientation');
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement('style');
    style.id = 'dynamic-print-orientation';
    style.innerHTML = `@page { size: A4 ${orientation}; margin: 8mm; }`;
    document.head.appendChild(style);

    // Trigger system print dialog directly
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-xs text-slate-100 font-sans">
      {/* Top Action Toolbar (Never Printed) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Document Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded border border-emerald-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-nastaliq tracking-wide">
              پرنٹ پریویو (Print Preview)
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              دستاویز: <span className="text-emerald-400 font-semibold">{previewData.title}</span>
            </p>
          </div>
        </div>

        {/* View Options & Orientation */}
        <div className="flex items-center gap-4">
          {/* Orientation switch */}
          <div className="flex items-center bg-slate-800 rounded p-1 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-3 py-1.5 rounded transition ${
                orientation === 'portrait'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عمودی (Portrait)
            </button>
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-3 py-1.5 rounded transition ${
                orientation === 'landscape'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              افقی (Landscape)
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-1 border border-slate-700 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 15))}
              className="p-1 hover:text-white"
              title="چھوٹا کریں"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono w-10 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 15))}
              className="p-1 hover:text-white"
              title="بڑا کریں"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center gap-3">
          {/* 🖨 Print Now */}
          <button
            type="button"
            onClick={handlePrintNow}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded font-bold text-sm shadow-md transition transform active:scale-95 cursor-pointer border border-emerald-400/40"
          >
            <Printer className="w-4 h-4 text-emerald-100" />
            <span>🖨 اب پرنٹ کریں (Print Now)</span>
          </button>

          {/* ❌ Close Preview */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 px-4 py-2 rounded text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>❌ پریویو بند کریں (Close Preview)</span>
          </button>
        </div>
      </header>

      {/* Screen Preview Canvas Area */}
      <main className="flex-1 overflow-auto p-8 flex justify-center items-start bg-slate-900/90">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
          className="transition-transform duration-150"
        >
          {/* Printable Document Sheet (A4 Size) */}
          <div
            id="printable-document"
            dir="rtl"
            className={`bg-white text-slate-900 shadow-2xl p-8 rounded-xs border border-slate-300 relative ${
              orientation === 'landscape' ? 'a4-landscape' : 'a4-portrait'
            }`}
          >
            <DocumentRenderer
              previewData={previewData}
              settings={settings}
              darajat={darajat}
              students={students}
              teachers={teachers}
              attendance={attendance}
              hifzRecords={hifzRecords}
              tajweedRecords={tajweedRecords}
              darsNizamiRecords={darsNizamiRecords}
              daurHadithRecords={daurHadithRecords}
              exams={exams}
              examMarks={examMarks}
              feeReceipts={feeReceipts}
              financeTransactions={financeTransactions}
              salaryPayments={salaryPayments}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
