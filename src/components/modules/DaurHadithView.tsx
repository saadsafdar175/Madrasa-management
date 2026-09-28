import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Scroll,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { DaurHadithRecord, Student, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface DaurHadithViewProps {
  daurHadithRecords: DaurHadithRecord[];
  students: Student[];
  onSaveRecord: (record: DaurHadithRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const DaurHadithView: React.FC<DaurHadithViewProps> = ({
  daurHadithRecords,
  students,
  onSaveRecord,
  onDeleteRecord,
  onOpenPrint,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hadithBooks = [
    'صحیح البخاری (جلد اول)',
    'صحیح البخاری (جلد دوم)',
    'صحیح مسلم شریف',
    'جامع الترمذی شریف',
    'سنن ابی داود شریف',
    'سنن النسائی شریف',
    'سنن ابن ماجہ شریف',
    'شرح معانی الآثار (طحاوی)',
    'موطا امام مالک'
  ];

  const [formData, setFormData] = useState<Partial<DaurHadithRecord>>({
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    kitabHadith: hadithBooks[0],
    bab: 'کتاب بدء الوحی',
    hadithNumbers: '۱ تا ۷',
    attendance: 'حاضر',
    teacherName: 'حضرت شیخ الحدیث دامت برکاتہم',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    const newRecord: DaurHadithRecord = {
      id: `dh_${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      studentId: formData.studentId,
      studentName: student ? student.name : 'طالب علم',
      darjaId: 'daur-hadith',
      kitabHadith: formData.kitabHadith || hadithBooks[0],
      bab: formData.bab || '',
      hadithNumbers: formData.hadithNumbers || '',
      attendance: formData.attendance as any || 'حاضر',
      teacherName: formData.teacherName || 'شیخ الحدیث صاحب',
      remarks: formData.remarks || '',
    };

    onSaveRecord(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-nastaliq font-bold text-base text-blue-950">دورۂ حدیث شریف (عالمیہ)</h3>
          <p className="text-xs text-slate-500">صحاحِ ستہ و کتبِ حدیث شریف کا درس و حاضری ریکارڈ</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'daur-hadith-report',
                title: 'دورۂ حدیث شریف (عالمیہ) - یومیہ کارگزاری و درسِ حدیث',
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ دورۂ حدیث رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                date: new Date().toISOString().split('T')[0],
                studentId: students[0]?.id || '',
                kitabHadith: hadithBooks[0],
                bab: 'کتاب الایمان',
                hadithNumbers: '۸ تا ۲۵',
                attendance: 'حاضر',
                teacherName: 'حضرت شیخ الحدیث صاحب',
                remarks: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ حدیثِ مبارکہ درس لاگ</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {daurHadithRecords.length === 0 ? (
          <div className="py-20 text-center">
            <Scroll className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              دورۂ حدیث شریف کا کوئی ریکارڈ محفوظ نہیں ہے۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3 font-bold text-slate-900">کتاب الحدیث</th>
                  <th className="p-3">باب / فصل</th>
                  <th className="p-3 text-center">احادیث مبارکہ نمبر</th>
                  <th className="p-3 text-center w-20">حاضری</th>
                  <th className="p-3">شیخ الحدیث صاحب</th>
                  <th className="p-3 text-center w-16">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daurHadithRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="p-3 font-bold text-emerald-950">{r.kitabHadith}</td>
                    <td className="p-3 text-slate-700">{r.bab}</td>
                    <td className="p-3 text-center font-mono">{r.hadithNumbers}</td>
                    <td className="p-3 text-center font-semibold">{r.attendance}</td>
                    <td className="p-3 text-slate-700">{r.teacherName}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 hover:bg-rose-50 rounded text-rose-600"
                        title="خارج کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">دورۂ حدیث شریف - سبق اندراج</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">طالب علم منتخب کریں *</label>
                {students.length === 0 ? (
                  <p className="text-rose-600 bg-rose-50 p-2 rounded">پہلے طلبہ داخل کریں</p>
                ) : (
                  <select
                    required
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="">طالب علم کا انتخاب کریں</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.regNo})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">کتاب الحدیث</label>
                  <select
                    value={formData.kitabHadith}
                    onChange={e => setFormData({ ...formData, kitabHadith: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    {hadithBooks.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">باب / عنوان</label>
                  <input
                    type="text"
                    value={formData.bab || ''}
                    onChange={e => setFormData({ ...formData, bab: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">احادیث نمبر</label>
                  <input
                    type="text"
                    value={formData.hadithNumbers || ''}
                    onChange={e => setFormData({ ...formData, hadithNumbers: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700">منسوخ کریں</button>
                <button type="submit" disabled={students.length === 0} className="px-5 py-2 bg-emerald-700 text-white rounded font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
