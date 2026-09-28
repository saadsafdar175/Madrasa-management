import React, { useState } from 'react';
import {
  Printer,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  Send
} from 'lucide-react';
import { AttendanceRecord, Darja, Student, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  students: Student[];
  darajat: Darja[];
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  students,
  darajat,
  onSaveAttendanceBatch,
  onOpenPrint,
  onOpenWhatsAppModal,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDarja, setSelectedDarja] = useState(darajat[0]?.id || '');
  const [statusMap, setStatusMap] = useState<{ [studentId: string]: 'حاضر' | 'غیر حاضر' | 'رخصت' | 'بیمار' }>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students by selected class
  const classStudents = students.filter(s => !selectedDarja || s.darjaId === selectedDarja);

  // Check if today already has attendance records saved
  const existingForDate = attendance.filter(
    a => a.date === selectedDate && (!selectedDarja || a.darjaId === selectedDarja)
  );

  const handleMarkStatus = (studentId: string, status: 'حاضر' | 'غیر حاضر' | 'رخصت' | 'بیمار') => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: { [studentId: string]: 'حاضر' } = {};
    classStudents.forEach(st => {
      updated[st.id] = 'حاضر';
    });
    setStatusMap(updated);
  };

  const handleSave = () => {
    if (classStudents.length === 0) return;

    const newRecords: AttendanceRecord[] = classStudents.map(st => ({
      id: `att_${st.id}_${selectedDate}`,
      date: selectedDate,
      studentId: st.id,
      studentName: st.name,
      darjaId: st.darjaId,
      section: st.section,
      status: statusMap[st.id] || 'حاضر',
    }));

    onSaveAttendanceBatch(newRecords);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getDarjaName = (id: string) => {
    const found = darajat.find(d => d.id === id);
    return found ? found.name : id;
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Date and Darja select */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>تاریخ:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>درجہ / کلاس:</span>
            <select
              value={selectedDarja}
              onChange={e => setSelectedDarja(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600"
            >
              <option value="">تمام درجات</option>
              {darajat.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons: 🖨 PRINT & Save Attendance */}
        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'attendance-report',
                title: 'رپورٹِ حاضری طلبہ کرام',
                filterDarja: selectedDarja || undefined,
                filterDate: selectedDate,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ حاضری رپورٹ</span>
          </button>

          {classStudents.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-2 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                سب حاضر
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حاضری محفوظ کریں</span>
              </button>
            </>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-700" />
          <span>حاضری کامیابی کے ساتھ محفوظ ہو گئی ہے۔</span>
        </div>
      )}

      {/* Attendance Sheet Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {classStudents.length === 0 ? (
          <div className="py-20 text-center">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              منتخب درجہ میں کوئی طالب علم موجود نہیں ہے۔ پہلے طلبہ سیکشن میں طلبہ داخل کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-16">رول #</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">ولدیت</th>
                  <th className="p-3">درجہ</th>
                  <th className="p-3 text-center w-64">حاضری کا اندراج</th>
                  <th className="p-3 text-center w-52">غیر حاضری واٹس ایپ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st, idx) => {
                  const currentStatus =
                    statusMap[st.id] ||
                    existingForDate.find(a => a.studentId === st.id)?.status ||
                    'حاضر';

                  return (
                    <tr key={st.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{st.rollNo || '---'}</td>
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">{st.fatherName}</td>
                      <td className="p-3 text-slate-700">{getDarjaName(st.darjaId)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['حاضر', 'غیر حاضر', 'رخصت', 'بیمار'] as const).map(stOption => {
                            const isSelected = currentStatus === stOption;
                            return (
                              <button
                                key={stOption}
                                type="button"
                                onClick={() => handleMarkStatus(st.id, stOption)}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                                  isSelected
                                    ? stOption === 'حاضر'
                                      ? 'bg-blue-800 text-white shadow-xs'
                                      : stOption === 'غیر حاضر'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : stOption === 'رخصت'
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {stOption}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {/* 🟢 WhatsApp Absence Message */}
                        <button
                          type="button"
                          onClick={() =>
                            onOpenWhatsAppModal({
                              recipientName: `${st.name}`,
                              recipientType: 'طالب علم / سرپرست',
                              phone: st.guardianPhone || st.phone || '',
                              defaultTemplateCategory: currentStatus === 'حاضر' ? 'حاضری' : 'غیر حاضری',
                              dataVariables: {
                                student_name: st.name,
                                father_name: st.fatherName,
                                class: getDarjaName(st.darjaId),
                                date: selectedDate,
                              },
                            })
                          }
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <span>🟢 WhatsApp Absence Message</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Existing Attendance Logs */}
      {attendance.length > 0 && (
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h4 className="font-nastaliq font-bold text-sm text-blue-950">
              حالیہ محفوظ شدہ حاضری لاگ ({attendance.length} اندراجات)
            </h4>
            <button
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: 'attendance-report',
                  title: 'مکمل حاضری رجسٹر',
                })
              }
              className="text-xs text-blue-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>مکمل رپورٹ پرنٹ کریں</span>
            </button>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            کل ریکارڈز: {attendance.length} | حاضر: {attendance.filter(a => a.status === 'حاضر').length} | غیر حاضر: {attendance.filter(a => a.status === 'غیر حاضر').length}
          </div>
        </div>
      )}
    </div>
  );
};
