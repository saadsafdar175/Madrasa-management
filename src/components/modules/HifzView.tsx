import React, { useState } from 'react';
import {
  Printer,
  Plus,
  BookOpen,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { HifzRecord, Student, Teacher, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface HifzViewProps {
  hifzRecords: HifzRecord[];
  students: Student[];
  teachers: Teacher[];
  onSaveRecord: (record: HifzRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const HifzView: React.FC<HifzViewProps> = ({
  hifzRecords,
  students,
  teachers,
  onSaveRecord,
  onDeleteRecord,
  onOpenPrint,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [formData, setFormData] = useState<Partial<HifzRecord>>({
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    sabaq: '',
    sabaqi: '',
    manzil: '',
    quality: 'ممتاز',
    teacherName: teachers[0]?.name || 'استاد محترم',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    const newRecord: HifzRecord = {
      id: `hifz_${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      studentId: formData.studentId,
      studentName: student ? student.name : 'طالب علم',
      darjaId: student ? student.darjaId : 'hifz',
      sabaq: formData.sabaq || 'پارہ ۱',
      sabaqi: formData.sabaqi || 'پارہ ۱',
      manzil: formData.manzil || 'پارہ ۲',
      quality: formData.quality as any || 'ممتاز',
      teacherName: formData.teacherName || 'استاد محترم',
      remarks: formData.remarks || '',
    };

    onSaveRecord(newRecord);
    setIsModalOpen(false);
  };

  const filteredRecords = hifzRecords.filter(r => !selectedDate || r.date === selectedDate);

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">تاریخِ کارکردگی:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'hifz-report',
                title: 'شعبہ تحفیظ القرآن الکریم - یومیہ کارکردگی رپورٹ',
                filterDate: selectedDate,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ شعبہ حفظ رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                date: selectedDate,
                studentId: students[0]?.id || '',
                sabaq: '',
                sabaqi: '',
                manzil: '',
                quality: 'ممتاز',
                teacherName: teachers[0]?.name || 'استاد محترم',
                remarks: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نیا یومیہ اندراج</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              شعبہ حفظ کے لیے فی الحال کوئی ریکارڈ محفوظ نہیں ہے۔ اوپر دیے گئے بٹن سے نیا سبق اندراج کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">سبق (نیا)</th>
                  <th className="p-3">سبقی (پچھلا یاد)</th>
                  <th className="p-3">منزل (دور)</th>
                  <th className="p-3 text-center w-24">معیارِ تلاوت</th>
                  <th className="p-3">استاد محترم</th>
                  <th className="p-3">کیفیات</th>
                  <th className="p-3 text-center w-16">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="p-3 font-medium text-emerald-900">{r.sabaq}</td>
                    <td className="p-3">{r.sabaqi}</td>
                    <td className="p-3">{r.manzil}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {r.quality}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{r.teacherName}</td>
                    <td className="p-3 text-slate-500">{r.remarks || '---'}</td>
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

      {/* Add Hifz Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">شعبہ حفظ - یومیہ کارکردگی اندراج</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">طالب علم منتخب کریں *</label>
                {students.length === 0 ? (
                  <p className="text-rose-600 bg-rose-50 p-2 rounded">پہلے طلبہ داخلہ ماڈیول میں طالب علم شامل کریں</p>
                ) : (
                  <select
                    required
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="">طالب علم کا انتخاب کریں</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ولد {s.fatherName} ({s.regNo})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سبق (نیا پارہ / صفحہ)</label>
                  <input
                    type="text"
                    value={formData.sabaq || ''}
                    onChange={e => setFormData({ ...formData, sabaq: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مثلاً: پارہ ۱، صفحہ ۵"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سبقی (پچھلا یاد)</label>
                  <input
                    type="text"
                    value={formData.sabaqi || ''}
                    onChange={e => setFormData({ ...formData, sabaqi: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مثلاً: پارہ ۱ مکمل"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">منزل (دور)</label>
                  <input
                    type="text"
                    value={formData.manzil || ''}
                    onChange={e => setFormData({ ...formData, manzil: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مثلاً: پارہ ۱۰ تا ۱۲"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">معیارِ یاداشت</label>
                  <select
                    value={formData.quality}
                    onChange={e => setFormData({ ...formData, quality: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="ممتاز">ممتاز (بہترین)</option>
                    <option value="جید جدا">جید جداً (بہت اچھا)</option>
                    <option value="جید">جید (مناسب)</option>
                    <option value="مقبول">مقبول (گزارہ)</option>
                    <option value="ضعیف">ضعیف (کمزور)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">استاد محترم</label>
                  <input
                    type="text"
                    value={formData.teacherName || ''}
                    onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={students.length === 0}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>محفوظ کریں</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
