import React, { useState } from 'react';
import {
  Printer,
  Plus,
  BookMarked,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { DarsNizamiRecord, Student, Darja, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface DarsNizamiViewProps {
  darsNizamiRecords: DarsNizamiRecord[];
  students: Student[];
  darajat: Darja[];
  onSaveRecord: (record: DarsNizamiRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const DarsNizamiView: React.FC<DarsNizamiViewProps> = ({
  darsNizamiRecords,
  students,
  darajat,
  onSaveRecord,
  onDeleteRecord,
  onOpenPrint,
}) => {
  const [selectedDarja, setSelectedDarja] = useState('salisa');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<DarsNizamiRecord>>({
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    darjaId: 'salisa',
    kitabName: 'کافیہ (ابن حاجب)',
    lessonTitle: 'باب الفاعل و احکامہ',
    attendance: 'حاضر',
    performance: 'ممتاز',
    teacherName: 'استاد محترم',
    remarks: '',
  });

  const darsNizamiDarajat = darajat.filter(d =>
    ['oola', 'saniya', 'salisa', 'rabia', 'khamisa', 'sadisa', 'sabia', 'darasat'].includes(d.id)
  );

  const filtered = darsNizamiRecords.filter(r => !selectedDarja || r.darjaId === selectedDarja);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    const newRecord: DarsNizamiRecord = {
      id: `dn_${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      studentId: formData.studentId,
      studentName: student ? student.name : 'طالب علم',
      darjaId: formData.darjaId || selectedDarja,
      kitabName: formData.kitabName || '',
      lessonTitle: formData.lessonTitle || '',
      attendance: formData.attendance as any || 'حاضر',
      performance: formData.performance as any || 'ممتاز',
      teacherName: formData.teacherName || 'استاد محترم',
      remarks: formData.remarks || '',
    };

    onSaveRecord(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">منتخب درجہ:</span>
          <select
            value={selectedDarja}
            onChange={e => setSelectedDarja(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600"
          >
            <option value="">تمام درجات (درس نظامی)</option>
            {darsNizamiDarajat.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'dars-nizami-report',
                title: 'شعبہ درس نظامی - رپورٹِ تدریس و فہمِ کتب',
                filterDarja: selectedDarja || undefined,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ درس نظامی رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                date: new Date().toISOString().split('T')[0],
                studentId: students[0]?.id || '',
                darjaId: selectedDarja || 'salisa',
                kitabName: 'ہدایۃ النحو',
                lessonTitle: 'بحث اعراب',
                attendance: 'حاضر',
                performance: 'ممتاز',
                teacherName: 'استاد محترم',
                remarks: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ تدریسی سبق اندراج</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              درسِ نظامی میں فی الوقت کوئی کارکردگی ریکارڈ موجود نہیں ہے۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">کتاب</th>
                  <th className="p-3">مبحث / درس</th>
                  <th className="p-3 text-center w-20">حاضری</th>
                  <th className="p-3 text-center w-24">فہم و استعداد</th>
                  <th className="p-3">استاد محترم</th>
                  <th className="p-3 text-center w-16">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="p-3 font-semibold text-emerald-950">{r.kitabName}</td>
                    <td className="p-3 text-slate-700">{r.lessonTitle}</td>
                    <td className="p-3 text-center">{r.attendance}</td>
                    <td className="p-3 text-center font-bold text-emerald-800">{r.performance}</td>
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
              <h3 className="font-nastaliq font-bold text-base">درس نظامی - سبق و فہمِ کتب اندراج</h3>
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
                <div>
                  <label className="block text-slate-700 font-bold mb-1">نام کتاب</label>
                  <input
                    type="text"
                    value={formData.kitabName || ''}
                    onChange={e => setFormData({ ...formData, kitabName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سبق کا عنوان / مبحث</label>
                  <input
                    type="text"
                    value={formData.lessonTitle || ''}
                    onChange={e => setFormData({ ...formData, lessonTitle: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">حاضری</label>
                  <select
                    value={formData.attendance}
                    onChange={e => setFormData({ ...formData, attendance: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="حاضر">حاضر</option>
                    <option value="غیر حاضر">غیر حاضر</option>
                    <option value="رخصت">رخصت</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">استعداد و فہم</label>
                  <select
                    value={formData.performance}
                    onChange={e => setFormData({ ...formData, performance: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="ممتاز">ممتاز (اعلیٰ)</option>
                    <option value="بہتر">بہتر</option>
                    <option value="محتاج محنت">محتاجِ محنت</option>
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
