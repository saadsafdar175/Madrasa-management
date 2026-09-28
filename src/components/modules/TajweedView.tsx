import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Award,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { TajweedRecord, Student, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface TajweedViewProps {
  tajweedRecords: TajweedRecord[];
  students: Student[];
  onSaveRecord: (record: TajweedRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const TajweedView: React.FC<TajweedViewProps> = ({
  tajweedRecords,
  students,
  onSaveRecord,
  onDeleteRecord,
  onOpenPrint,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState<Partial<TajweedRecord>>({
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    surah: 'سورۃ الفاتحۃ',
    ayahRange: '۱ تا ۷',
    makharijGrade: 'ممتاز',
    sifaatGrade: 'ممتاز',
    teacherName: 'قاری صاحب',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    const newRecord: TajweedRecord = {
      id: `tj_${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      studentId: formData.studentId,
      studentName: student ? student.name : 'طالب علم',
      darjaId: student ? student.darjaId : 'tajweed',
      surah: formData.surah || '',
      ayahRange: formData.ayahRange || '',
      makharijGrade: formData.makharijGrade as any || 'ممتاز',
      sifaatGrade: formData.sifaatGrade as any || 'ممتاز',
      teacherName: formData.teacherName || 'قاری صاحب',
      remarks: formData.remarks || '',
    };

    onSaveRecord(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">تاریخ:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'tajweed-report',
                title: 'شعبہ تجوید و قراءت - مشق و کارکردگی رپورٹ',
                filterDate: selectedDate,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ تجوید رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                date: selectedDate,
                studentId: students[0]?.id || '',
                surah: 'سورۃ البقرۃ',
                ayahRange: '۱ تا ۱۰',
                makharijGrade: 'ممتاز',
                sifaatGrade: 'ممتاز',
                teacherName: 'قاری صاحب',
                remarks: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نیا ریکارڈ</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {tajweedRecords.length === 0 ? (
          <div className="py-20 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              شعبہ تجوید و قراءت میں فی الوقت کوئی ریکارڈ موجود نہیں ہے۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">سورۃ مبارکہ</th>
                  <th className="p-3 text-center">آیات</th>
                  <th className="p-3 text-center w-24">مخارجِ حروف</th>
                  <th className="p-3 text-center w-24">صفات و احکام</th>
                  <th className="p-3">استاد محترم</th>
                  <th className="p-3 text-center w-16">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tajweedRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="p-3 font-medium text-emerald-950">{r.surah}</td>
                    <td className="p-3 text-center font-mono">{r.ayahRange}</td>
                    <td className="p-3 text-center font-bold text-emerald-800">{r.makharijGrade}</td>
                    <td className="p-3 text-center font-bold text-emerald-800">{r.sifaatGrade}</td>
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
              <h3 className="font-nastaliq font-bold text-base">شعبہ تجوید و قراءت - مشق اندراج</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">طالب علم منتخب کریں *</label>
                {students.length === 0 ? (
                  <p className="text-rose-600 bg-rose-50 p-2 rounded">پہلے طالب علم داخل کریں</p>
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
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سورۃ کا نام</label>
                  <input
                    type="text"
                    value={formData.surah || ''}
                    onChange={e => setFormData({ ...formData, surah: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">آیات کی حدود</label>
                  <input
                    type="text"
                    value={formData.ayahRange || ''}
                    onChange={e => setFormData({ ...formData, ayahRange: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">مخارج الحروف کیفیت</label>
                  <select
                    value={formData.makharijGrade}
                    onChange={e => setFormData({ ...formData, makharijGrade: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="ممتاز">ممتاز</option>
                    <option value="جید جدا">جید جدا</option>
                    <option value="جید">جید</option>
                    <option value="مقبول">مقبول</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">صفات و تجوید کیفیت</label>
                  <select
                    value={formData.sifaatGrade}
                    onChange={e => setFormData({ ...formData, sifaatGrade: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="ممتاز">ممتاز</option>
                    <option value="جید جدا">جید جدا</option>
                    <option value="جید">جید</option>
                    <option value="مقبول">مقبول</option>
                  </select>
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
