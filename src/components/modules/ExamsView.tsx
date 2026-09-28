import React, { useState } from 'react';
import {
  Printer,
  Plus,
  FileSpreadsheet,
  Award,
  Scroll,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { Exam, ExamMark, Student, Darja, PrintPreviewData, SubjectMarks } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface ExamsViewProps {
  exams: Exam[];
  examMarks: ExamMark[];
  students: Student[];
  darajat: Darja[];
  onSaveExam: (exam: Exam) => void;
  onSaveExamMark: (mark: ExamMark) => void;
  onDeleteExamMark: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  examMarks,
  students,
  darajat,
  onSaveExam,
  onSaveExamMark,
  onDeleteExamMark,
  onOpenPrint,
  onOpenWhatsAppModal,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'dmc' | 'gazette'>('sheet');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [selectedDarjaId, setSelectedDarjaId] = useState(darajat[0]?.id || '');
  const [selectedStudentForDmc, setSelectedStudentForDmc] = useState<string>('');

  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isAddMarkOpen, setIsAddMarkOpen] = useState(false);

  // New Exam form
  const [newExamData, setNewExamData] = useState({
    name: 'سالانہ امتحان (وفاق المدارس)',
    academicYear: '2026-2027ء',
    hijriYear: '۱۴۴۷-۱۴۴۸ھ',
    examDate: new Date().toISOString().split('T')[0],
    darjaId: darajat[0]?.id || '',
  });

  // Marks Entry Form
  const [newMarkData, setNewMarkData] = useState<{
    studentId: string;
    subjects: { name: string; total: number; obtained: number }[];
    rank: string;
    remarks: string;
  }>({
    studentId: '',
    subjects: [
      { name: 'قرآن کریم و تجوید', total: 100, obtained: 85 },
      { name: 'فقہ و اصول فقہ', total: 100, obtained: 80 },
      { name: 'عربی ادب و انشائیہ', total: 100, obtained: 75 },
    ],
    rank: 'اول',
    remarks: '',
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newEx: Exam = {
      id: `ex_${Date.now()}`,
      name: newExamData.name,
      academicYear: newExamData.academicYear,
      hijriYear: newExamData.hijriYear,
      examDate: newExamData.examDate,
      darjaId: newExamData.darjaId,
    };
    onSaveExam(newEx);
    setSelectedExamId(newEx.id);
    setIsAddExamOpen(false);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkData.studentId) return;

    const student = students.find(s => s.id === newMarkData.studentId);
    const totalMarks = newMarkData.subjects.reduce((a, c) => a + Number(c.total || 0), 0);
    const obtainedMarks = newMarkData.subjects.reduce((a, c) => a + Number(c.obtained || 0), 0);
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

    let grade: 'ممتاز' | 'جید جدا' | 'جید' | 'مقبول' | 'راسب (فیل)' = 'راسب (فیل)';
    if (percentage >= 80) grade = 'ممتاز';
    else if (percentage >= 65) grade = 'جید جدا';
    else if (percentage >= 50) grade = 'جید';
    else if (percentage >= 40) grade = 'مقبول';

    const examMark: ExamMark = {
      id: `mark_${Date.now()}`,
      examId: selectedExamId || exams[0]?.id || `ex_default`,
      studentId: newMarkData.studentId,
      studentName: student ? student.name : 'طالب علم',
      rollNo: student ? student.rollNo : '---',
      darjaId: student ? student.darjaId : selectedDarjaId,
      subjects: newMarkData.subjects.map(s => ({
        subjectName: s.name,
        totalMarks: Number(s.total),
        obtainedMarks: Number(s.obtained),
      })),
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      rank: newMarkData.rank,
      remarks: newMarkData.remarks,
    };

    onSaveExamMark(examMark);
    setIsAddMarkOpen(false);
  };

  // Filter marks
  const filteredMarks = examMarks.filter(m =>
    (!selectedExamId || m.examId === selectedExamId) &&
    (!selectedDarjaId || m.darjaId === selectedDarjaId)
  );

  const selectedDmcRecord = examMarks.find(m => m.studentId === selectedStudentForDmc) || filteredMarks[0];

  const getDarjaName = (id: string) => {
    const found = darajat.find(d => d.id === id);
    return found ? found.name : id;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Exam Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>امتحان:</span>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-600"
            >
              {exams.length === 0 ? (
                <option value="">امتحان درج کریں</option>
              ) : (
                exams.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.academicYear})</option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>درجہ:</span>
            <select
              value={selectedDarjaId}
              onChange={e => setSelectedDarjaId(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">تمام درجات</option>
              {darajat.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

          {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Main Contextual 🖨 PRINT Button */}
          {activeTab === 'sheet' && (
            <button
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: 'marks-sheet',
                  title: 'کشف الدرجات (مارکس شیٹ)',
                  filterExamId: selectedExamId,
                  filterDarja: selectedDarjaId,
                })
              }
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>🖨 پرنٹ مارکس شیٹ</span>
            </button>
          )}

          {activeTab === 'dmc' && (
            <button
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: 'dmc',
                  title: 'تفصیلی مارکس سرٹیفکیٹ (DMC)',
                  selectedItem: selectedDmcRecord,
                  filterExamId: selectedExamId,
                })
              }
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>🖨 پرنٹ تفصیلی سرٹیفکیٹ (DMC)</span>
            </button>
          )}

          {activeTab === 'gazette' && (
            <button
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: 'result-gazette',
                  title: 'گزٹِ نتائجِ امتحانات',
                  orientation: 'landscape',
                  filterExamId: selectedExamId,
                  filterDarja: selectedDarjaId,
                })
              }
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>🖨 پرنٹ گزٹ نتائج</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddExamOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            + نیا امتحان
          </button>

          <button
            type="button"
            onClick={() => {
              setNewMarkData({
                studentId: students[0]?.id || '',
                subjects: [
                  { name: 'قرآن کریم و تجوید', total: 100, obtained: 85 },
                  { name: 'فقہ و اصول فقہ', total: 100, obtained: 80 },
                  { name: 'عربی زبان و نحو', total: 100, obtained: 75 },
                ],
                rank: 'اول',
                remarks: '',
              });
              setIsAddMarkOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نمبرات درج کریں</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('sheet')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'sheet'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>کشف الدرجات (مارکس شیٹ)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dmc')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'dmc'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>تفصیلی مارکس سرٹیفکیٹ (DMC)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gazette')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'gazette'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scroll className="w-4 h-4" />
          <span>گزٹِ نتائج (Result Gazette)</span>
        </button>
      </div>

      {/* Tab 1: Marks Sheet */}
      {activeTab === 'sheet' && (
        <div className="bg-white border border-blue-200 rounded-b-xl shadow-xs overflow-hidden">
          {filteredMarks.length === 0 ? (
            <div className="py-20 text-center">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
                {EMPTY_RECORD_MSG}
              </p>
              <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
                امتحانی مارکس کا کوئی ریکارڈ محفوظ نہیں ہے۔ اوپر دیے گئے بٹن سے نمبرات درج کریں۔
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
                    <th className="p-3">درجہ</th>
                    <th className="p-3 text-center w-20">کل نمبرات</th>
                    <th className="p-3 text-center w-20">حاصل کردہ</th>
                    <th className="p-3 text-center w-16">فیصد</th>
                    <th className="p-3 text-center w-24">درجہ (گریڈ)</th>
                    <th className="p-3 text-center w-16">پوزیشن</th>
                    <th className="p-3 text-center w-64">پرنٹ، واٹس ایپ و کارروائی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMarks.map((mk, idx) => {
                    const st = students.find(s => s.id === mk.studentId);
                    return (
                      <tr key={mk.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-700">{mk.rollNo || '---'}</td>
                        <td className="p-3 font-bold text-slate-900">{mk.studentName}</td>
                        <td className="p-3 text-slate-700">{getDarjaName(mk.darjaId)}</td>
                        <td className="p-3 text-center font-mono">{mk.totalMarks}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900">{mk.obtainedMarks}</td>
                        <td className="p-3 text-center font-mono">{mk.percentage}%</td>
                        <td className="p-3 text-center font-bold">
                          <span className={mk.grade === 'راسب (فیل)' ? 'text-rose-700' : 'text-blue-900'}>
                            {mk.grade}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-amber-900">{mk.rank || '---'}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* 🟢 WhatsApp Result */}
                            <button
                              type="button"
                              onClick={() => {
                                onOpenWhatsAppModal({
                                  recipientName: `${mk.studentName}`,
                                  recipientType: 'طالب علم / سرپرست',
                                  phone: st?.guardianPhone || st?.phone || '',
                                  defaultTemplateCategory: 'نتیجہ',
                                  dataVariables: {
                                    student_name: mk.studentName,
                                    father_name: st?.fatherName || 'والد صاحب',
                                    class: getDarjaName(mk.darjaId),
                                    result: `${mk.grade} (${mk.obtainedMarks}/${mk.totalMarks} - ${mk.percentage}%)`,
                                    remarks: mk.remarks || `پوزیشن: ${mk.rank || 'کامیاب'}`,
                                  },
                                });
                              }}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                              title="نتیجہ واٹس ایپ پر ارسال کریں"
                            >
                              <span>🟢 WhatsApp Result</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onOpenPrint({
                                  documentType: 'dmc',
                                  title: `DMC - ${mk.studentName}`,
                                  selectedItem: mk,
                                })
                              }
                              className="bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-200 cursor-pointer"
                              title="طالب علم کا DMC پرنٹ کریں"
                            >
                              DMC پرنٹ
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteExamMark(mk.id)}
                              className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: DMC Preview */}
      {activeTab === 'dmc' && (
        <div className="bg-white border border-blue-200 rounded-b-xl shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">طالب علم منتخب کریں:</span>
              <select
                value={selectedStudentForDmc}
                onChange={e => setSelectedStudentForDmc(e.target.value)}
                className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs"
              >
                <option value="">طالب علم کا انتخاب کریں</option>
                {filteredMarks.map(m => (
                  <option key={m.studentId} value={m.studentId}>{m.studentName} (رول #{m.rollNo})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {selectedDmcRecord && (
                <button
                  type="button"
                  onClick={() => {
                    const st = students.find(s => s.id === selectedDmcRecord.studentId);
                    onOpenWhatsAppModal({
                      recipientName: `${selectedDmcRecord.studentName}`,
                      recipientType: 'طالب علم / سرپرست',
                      phone: st?.guardianPhone || st?.phone || '',
                      defaultTemplateCategory: 'نتیجہ',
                      dataVariables: {
                        student_name: selectedDmcRecord.studentName,
                        father_name: st?.fatherName || 'والد صاحب',
                        class: getDarjaName(selectedDmcRecord.darjaId),
                        result: `${selectedDmcRecord.grade} (${selectedDmcRecord.obtainedMarks}/${selectedDmcRecord.totalMarks} - ${selectedDmcRecord.percentage}%)`,
                        remarks: selectedDmcRecord.remarks || `پوزیشن: ${selectedDmcRecord.rank || 'کامیاب'}`,
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <span>🟢 WhatsApp Result</span>
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  onOpenPrint({
                    documentType: 'dmc',
                    title: 'تفصیلی مارکس سرٹیفکیٹ (DMC)',
                    selectedItem: selectedDmcRecord,
                    filterExamId: selectedExamId,
                  })
                }
                className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>🖨 پرنٹ DMC اب</span>
              </button>
            </div>
          </div>

          {!selectedDmcRecord ? (
            <div className="py-16 text-center text-slate-500">
              <p className="font-nastaliq font-bold text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs mt-1">DMC دیکھنے کے لیے پہلے مارکس شیٹ میں نمبرات درج کریں۔</p>
            </div>
          ) : (
            <div className="border border-slate-300 p-6 rounded-lg bg-slate-50/50 max-w-xl mx-auto text-xs space-y-3">
              <div className="text-center border-b border-emerald-900 pb-2">
                <h4 className="font-nastaliq font-bold text-lg text-emerald-950">جامعہ دارالعلوم الاسلامیہ</h4>
                <p className="font-bold text-emerald-800">تفصیلی مارکس سرٹیفکیٹ (DMC)</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <p><strong>نام طالب علم:</strong> {selectedDmcRecord.studentName}</p>
                <p><strong>رول نمبر:</strong> {selectedDmcRecord.rollNo || '---'}</p>
                <p><strong>درجہ:</strong> {getDarjaName(selectedDmcRecord.darjaId)}</p>
                <p><strong>پوزیشن:</strong> {selectedDmcRecord.rank || 'عام'}</p>
                <p><strong>کل حاصل کردہ:</strong> {selectedDmcRecord.obtainedMarks} / {selectedDmcRecord.totalMarks}</p>
                <p><strong>فیصد و درجہ:</strong> {selectedDmcRecord.percentage}% ({selectedDmcRecord.grade})</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Result Gazette */}
      {activeTab === 'gazette' && (
        <div className="bg-white border border-slate-200 rounded-b-xl shadow-xs p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h4 className="font-nastaliq font-bold text-base text-slate-800">
              گزٹ امتحانات (خلاصہ نتائج برائے رینکنگ)
            </h4>
            <button
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: 'result-gazette',
                  title: 'گزٹِ نتائجِ امتحانات',
                  orientation: 'landscape',
                  filterExamId: selectedExamId,
                  filterDarja: selectedDarjaId,
                })
              }
              className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-xs"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>🖨 پرنٹ مکمل گزٹ</span>
            </button>
          </div>

          {filteredMarks.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="font-nastaliq font-bold text-base">{EMPTY_RECORD_MSG}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-2 text-center w-12">پوزیشن</th>
                    <th className="p-2 text-center w-16">رول #</th>
                    <th className="p-2">نام طالب علم</th>
                    <th className="p-2 text-center">کل نمبر</th>
                    <th className="p-2 text-center">حاصل کردہ</th>
                    <th className="p-2 text-center">فیصد</th>
                    <th className="p-2 text-center">کیفیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMarks.map((mk, idx) => (
                    <tr key={mk.id}>
                      <td className="p-2 text-center font-bold text-amber-900">{mk.rank || (idx + 1)}</td>
                      <td className="p-2 text-center font-mono">{mk.rollNo || '---'}</td>
                      <td className="p-2 font-bold">{mk.studentName}</td>
                      <td className="p-2 text-center font-mono">{mk.totalMarks}</td>
                      <td className="p-2 text-center font-mono font-bold">{mk.obtainedMarks}</td>
                      <td className="p-2 text-center font-mono">{mk.percentage}%</td>
                      <td className="p-2 text-center font-bold text-emerald-800">{mk.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">نیا امتحانی سیشن بنائیں</h3>
              <button type="button" onClick={() => setIsAddExamOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">امتحان کا نام *</label>
                <input
                  type="text"
                  required
                  value={newExamData.name}
                  onChange={e => setNewExamData({ ...newExamData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                  placeholder="سالانہ امتحان / ششماہی امتحان"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تعلیمی سال</label>
                <input
                  type="text"
                  value={newExamData.academicYear}
                  onChange={e => setNewExamData({ ...newExamData, academicYear: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تاریخِ امتحان</label>
                <input
                  type="date"
                  value={newExamData.examDate}
                  onChange={e => setNewExamData({ ...newExamData, examDate: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsAddExamOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700">منسوخ کریں</button>
                <button type="submit" className="px-5 py-2 bg-emerald-700 text-white rounded font-bold">بنائیں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Marks Modal */}
      {isAddMarkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">طالب علم کے امتحانی نمبرات درج کریں</h3>
              <button type="button" onClick={() => setIsAddMarkOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="p-6 space-y-3 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1">طالب علم کا انتخاب کریں *</label>
                {students.length === 0 ? (
                  <p className="text-rose-600 bg-rose-50 p-2 rounded">پہلے طلبہ ماڈیول میں طالب علم داخل کریں</p>
                ) : (
                  <select
                    required
                    value={newMarkData.studentId}
                    onChange={e => setNewMarkData({ ...newMarkData, studentId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="">طالب علم منتخب کریں</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (رول #{s.rollNo})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">مضامین اور حاصل کردہ نمبرات</label>
                <div className="space-y-2">
                  {newMarkData.subjects.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={e => {
                          const updated = [...newMarkData.subjects];
                          updated[i].name = e.target.value;
                          setNewMarkData({ ...newMarkData, subjects: updated });
                        }}
                        className="flex-1 border border-slate-300 rounded p-1.5"
                        placeholder="مضمون"
                      />
                      <input
                        type="number"
                        value={sub.total}
                        onChange={e => {
                          const updated = [...newMarkData.subjects];
                          updated[i].total = Number(e.target.value);
                          setNewMarkData({ ...newMarkData, subjects: updated });
                        }}
                        className="w-20 border border-slate-300 rounded p-1.5 font-mono text-center"
                        placeholder="کل"
                      />
                      <input
                        type="number"
                        value={sub.obtained}
                        onChange={e => {
                          const updated = [...newMarkData.subjects];
                          updated[i].obtained = Number(e.target.value);
                          setNewMarkData({ ...newMarkData, subjects: updated });
                        }}
                        className="w-20 border border-slate-300 rounded p-1.5 font-mono text-center font-bold text-emerald-800"
                        placeholder="حاصل"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNewMarkData({
                      ...newMarkData,
                      subjects: [...newMarkData.subjects, { name: 'نیا مضمون', total: 100, obtained: 70 }],
                    })
                  }
                  className="mt-2 text-emerald-700 font-bold hover:underline"
                >
                  + مزید مضمون شامل کریں
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">پوزیشن (اگر ہو)</label>
                  <input
                    type="text"
                    value={newMarkData.rank}
                    onChange={e => setNewMarkData({ ...newMarkData, rank: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="اول / دوم / سوم"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">کیفیات</label>
                  <input
                    type="text"
                    value={newMarkData.remarks}
                    onChange={e => setNewMarkData({ ...newMarkData, remarks: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsAddMarkOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700">منسوخ کریں</button>
                <button type="submit" disabled={students.length === 0} className="px-5 py-2 bg-emerald-700 text-white rounded font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
