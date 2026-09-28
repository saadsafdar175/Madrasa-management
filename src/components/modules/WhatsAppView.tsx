import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  GraduationCap,
  CalendarX,
  Receipt,
  Award,
  History,
  Plus,
  Edit,
  Trash2,
  Check,
  Phone,
  AlertCircle
} from 'lucide-react';
import {
  Student,
  Teacher,
  FeeReceipt,
  AttendanceRecord,
  ExamMark,
  WhatsAppTemplate,
  WhatsAppMessage,
  Darja
} from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface WhatsAppViewProps {
  students: Student[];
  teachers: Teacher[];
  feeReceipts: FeeReceipt[];
  attendance: AttendanceRecord[];
  examMarks: ExamMark[];
  templates: WhatsAppTemplate[];
  history: WhatsAppMessage[];
  darajat: Darja[];
  onSaveTemplate: (tpl: WhatsAppTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  students,
  teachers,
  feeReceipts,
  attendance,
  examMarks,
  templates,
  history,
  darajat,
  onSaveTemplate,
  onDeleteTemplate,
  onOpenWhatsAppModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'direct' | 'templates' | 'students' | 'teachers' | 'fees' | 'attendance' | 'results' | 'history'
  >('students');

  // Direct send form state
  const [directPhone, setDirectPhone] = useState('');
  const [directName, setDirectName] = useState('');
  const [directMsg, setDirectMsg] = useState('');

  // Template edit modal
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const getDarjaName = (id: string) => {
    return darajat.find(d => d.id === id)?.name || id;
  };

  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPhone) {
      alert('براہ کرم موبائل یا واٹس ایپ نمبر درج کریں۔');
      return;
    }
    onOpenWhatsAppModal({
      recipientName: directName || 'معزز صارف',
      recipientType: 'دیگر',
      phone: directPhone,
      defaultTemplateCategory: 'عام اطلاع',
      dataVariables: {
        student_name: directName,
        remarks: directMsg,
      },
    });
  };

  const handleSaveTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.name) return;
    onSaveTemplate(editingTemplate);
    setIsTemplateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            WA
          </div>
          <div>
            <h2 className="font-nastaliq font-bold text-xl">
              واٹس ایپ رابطہ و میسجنگ سسٹم (WhatsApp Communication)
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              طلبہ، سرپرستوں، اساتذہ اور ملازمین کو باآسانی حاضری، فیس، امتحانی نتائج اور عام اعلانات واٹس ایپ پر ارسال کریں
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('direct')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>+ نیا واٹس ایپ میسج لکھیں</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-xs p-1 flex flex-wrap gap-1 text-xs">
        {[
          { id: 'students', label: 'طلبہ و سرپرست واٹس ایپ', icon: Users },
          { id: 'teachers', label: 'اساتذہ واٹس ایپ', icon: GraduationCap },
          { id: 'fees', label: 'فیس یاد دہانی', icon: Receipt },
          { id: 'attendance', label: 'حاضری و غیر حاضری', icon: CalendarX },
          { id: 'results', label: 'امتحانی نتائج / DMC', icon: Award },
          { id: 'templates', label: 'پیغامات کے ٹیمپلیٹس', icon: MessageSquare },
          { id: 'direct', label: 'براہِ راست میسج', icon: Send },
          { id: 'history', label: `ہسٹری لاگ (${history.length})`, icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Students & Parents */}
      {activeTab === 'students' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                طلبہ و سرپرست واٹس ایپ لسٹ ({students.length} طلبہ)
              </h3>
              <p className="text-xs text-slate-500">
                کسی بھی طالب علم کے سرپرست کو محفوظ کردہ نمبر پر واٹس ایپ میسج بھیجنے کے لیے سبز بٹن دبائیں
              </p>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">پہلے داخلہ ماڈیول میں طلبہ کے کوائف و موبائل نمبر درج کریں۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3">نام طالب علم</th>
                    <th className="p-3">ولدیت</th>
                    <th className="p-3">درجہ / کلاس</th>
                    <th className="p-3 font-mono">سرپرست فون / واٹس ایپ</th>
                    <th className="p-3 text-center w-40">واٹس ایپ بٹن</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">{st.fatherName}</td>
                      <td className="p-3 text-slate-800">{getDarjaName(st.darjaId)}</td>
                      <td className="p-3 font-mono text-slate-700">{st.guardianPhone || st.phone || 'نمبر درج نہیں'}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenWhatsAppModal({
                              recipientName: `${st.name} (ولد ${st.fatherName})`,
                              recipientType: 'طالب علم / سرپرست',
                              phone: st.guardianPhone || st.phone || '',
                              defaultTemplateCategory: 'عام اطلاع',
                              dataVariables: {
                                student_name: st.name,
                                father_name: st.fatherName,
                                class: getDarjaName(st.darjaId),
                              },
                            })
                          }
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <span>🟢 WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Teachers */}
      {activeTab === 'teachers' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                اساتذہ و عملہ واٹس ایپ لسٹ ({teachers.length} اساتذہ)
              </h3>
              <p className="text-xs text-slate-500">
                اساتذہ کرام اور ملازمین کے محفوظ فون نمبرز پر فوری رابطہ کریں
              </p>
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className="py-20 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">پہلے اساتذہ سیکشن میں عملہ داخل کریں۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3">نامِ گرامی</th>
                    <th className="p-3">عہدہ و شعبہ</th>
                    <th className="p-3 font-mono">موبائل / واٹس ایپ نمبر</th>
                    <th className="p-3 text-center w-40">واٹس ایپ بٹن</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((tch, idx) => (
                    <tr key={tch.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{tch.name}</td>
                      <td className="p-3 text-slate-700">{tch.designation} ({tch.department})</td>
                      <td className="p-3 font-mono text-slate-700">{tch.phone || 'نمبر درج نہیں'}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenWhatsAppModal({
                              recipientName: tch.name,
                              recipientType: 'استاد',
                              phone: tch.phone || '',
                              defaultTemplateCategory: 'عام اطلاع',
                              dataVariables: {
                                student_name: tch.name,
                                remarks: `محترم ${tch.name} صاحب! السلام علیکم۔`,
                              },
                            })
                          }
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <span>🟢 WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Fees WhatsApp */}
      {activeTab === 'fees' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                فیس یاد دہانی بذریعہ واٹس ایپ (Fee Reminder)
              </h3>
              <p className="text-xs text-slate-500">
                بقایاجات یا فیس کی ادائیگی کی خودکار یاد دہانی سرپرست کے واٹس ایپ پر ارسال کریں
              </p>
            </div>
          </div>

          {feeReceipts.length === 0 ? (
            <div className="py-20 text-center">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">کوئی فیس رسید درج نہیں ہے۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3">نام طالب علم</th>
                    <th className="p-3">درجہ</th>
                    <th className="p-3 text-center">ماہ</th>
                    <th className="p-3 text-center">کل واجبات</th>
                    <th className="p-3 text-center">وصول شدہ</th>
                    <th className="p-3 text-center">بقایا رقم</th>
                    <th className="p-3 text-center w-48">فیس یاد دہانی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeReceipts.map((fee, idx) => {
                    const st = students.find(s => s.id === fee.studentId);
                    const phone = st?.guardianPhone || st?.phone || '';
                    return (
                      <tr key={fee.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{fee.studentName}</td>
                        <td className="p-3 text-slate-700">{getDarjaName(fee.darjaId)}</td>
                        <td className="p-3 text-center">{fee.month}</td>
                        <td className="p-3 text-center font-mono">{fee.totalAmount}</td>
                        <td className="p-3 text-center font-mono text-emerald-700 font-bold">{fee.netPaid}</td>
                        <td className="p-3 text-center font-mono text-rose-700 font-bold">{fee.remainingDue}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsAppModal({
                                recipientName: `${fee.studentName} (ولد ${fee.fatherName})`,
                                recipientType: 'طالب علم / سرپرست',
                                phone,
                                defaultTemplateCategory: 'فیس',
                                dataVariables: {
                                  student_name: fee.studentName,
                                  father_name: fee.fatherName,
                                  class: getDarjaName(fee.darjaId),
                                  fee_amount: String(fee.remainingDue > 0 ? fee.remainingDue : fee.totalAmount),
                                },
                              })
                            }
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <span>🟢 WhatsApp Fee Reminder</span>
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
      )}

      {/* Tab 4: Attendance & Absence */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                حاضری و غیر حاضری واٹس ایپ نوٹس (Attendance / Absence Notice)
              </h3>
              <p className="text-xs text-slate-500">
                غیر حاضر یا رخصت پر موجود طالب علم کے سرپرست کو اطلاع ارسال کریں
              </p>
            </div>
          </div>

          {attendance.length === 0 ? (
            <div className="py-20 text-center">
              <CalendarX className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">حاضری کا کوئی اندراج موجود نہیں ہے۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3 text-center">تاریخ</th>
                    <th className="p-3">نام طالب علم</th>
                    <th className="p-3">درجہ</th>
                    <th className="p-3 text-center">کیفیت حاضری</th>
                    <th className="p-3 text-center w-52">غیر حاضری کا پیغام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((att, idx) => {
                    const st = students.find(s => s.id === att.studentId);
                    const phone = st?.guardianPhone || st?.phone || '';
                    return (
                      <tr key={att.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 text-center font-mono">{att.date}</td>
                        <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                        <td className="p-3 text-slate-700">{getDarjaName(att.darjaId)}</td>
                        <td className="p-3 text-center font-bold">
                          <span
                            className={
                              att.status === 'حاضر'
                                ? 'text-emerald-700'
                                : att.status === 'غیر حاضر'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                            }
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsAppModal({
                                recipientName: `${att.studentName}`,
                                recipientType: 'طالب علم / سرپرست',
                                phone,
                                defaultTemplateCategory: att.status === 'حاضر' ? 'حاضری' : 'غیر حاضری',
                                dataVariables: {
                                  student_name: att.studentName,
                                  father_name: st?.fatherName || 'والد صاحب',
                                  class: getDarjaName(att.darjaId),
                                  date: att.date,
                                },
                              })
                            }
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
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
      )}

      {/* Tab 5: Results & DMC */}
      {activeTab === 'results' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                امتحانی نتائج و DMC واٹس ایپ (Result WhatsApp)
              </h3>
              <p className="text-xs text-slate-500">
                طالب علم کے نمبرات اور امتحانی گریڈ کی تفصیل سرپرست کو واٹس ایپ پر ارسال کریں
              </p>
            </div>
          </div>

          {examMarks.length === 0 ? (
            <div className="py-20 text-center">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">کوئی امتحانی نتیجہ درج نہیں ہے۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3">نام طالب علم</th>
                    <th className="p-3 text-center">کل نمبر</th>
                    <th className="p-3 text-center">حاصل کردہ</th>
                    <th className="p-3 text-center">فیصد</th>
                    <th className="p-3 text-center">درجہ / گریڈ</th>
                    <th className="p-3 text-center w-48">نتیجہ واٹس ایپ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examMarks.map((mk, idx) => {
                    const st = students.find(s => s.id === mk.studentId);
                    const phone = st?.guardianPhone || st?.phone || '';
                    return (
                      <tr key={mk.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{mk.studentName}</td>
                        <td className="p-3 text-center font-mono">{mk.totalMarks}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900">{mk.obtainedMarks}</td>
                        <td className="p-3 text-center font-mono">{mk.percentage}%</td>
                        <td className="p-3 text-center font-bold text-emerald-800">{mk.grade}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsAppModal({
                                recipientName: `${mk.studentName}`,
                                recipientType: 'طالب علم / سرپرست',
                                phone,
                                defaultTemplateCategory: 'نتیجہ',
                                dataVariables: {
                                  student_name: mk.studentName,
                                  father_name: st?.fatherName || 'والد صاحب',
                                  class: getDarjaName(mk.darjaId),
                                  result: `${mk.grade} (${mk.obtainedMarks}/${mk.totalMarks} - ${mk.percentage}%)`,
                                  remarks: mk.remarks || `پوزیشن: ${mk.rank || 'کامیاب'}`,
                                },
                              })
                            }
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <span>🟢 WhatsApp Result</span>
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
      )}

      {/* Tab 6: Message Templates */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                پیغامات کے ٹیمپلیٹس (Message Templates)
              </h3>
              <p className="text-xs text-slate-500">
                تمام متغیرات (Variables) خودکار طریقے سے طالب علم اور فیس کے ڈیٹا سے پر ہو جاتے ہیں
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTemplate({
                  id: `tpl_${Date.now()}`,
                  name: 'نیا ٹیمپلیٹ',
                  category: 'عام اطلاع',
                  content: 'محترم {father_name} صاحب! السلام علیکم۔\nطالب علم: {student_name}\nدرجہ: {class}',
                });
                setIsTemplateModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ نیا ٹیمپلیٹ بنائیں</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="border border-blue-100 rounded-xl p-4 bg-blue-50/20 hover:bg-blue-50/50 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-950 text-sm">{tpl.name}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {tpl.category}
                    </span>
                  </div>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-3 rounded border border-slate-200 leading-relaxed max-h-36 overflow-y-auto">
                    {tpl.content}
                  </pre>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">متغیرات فعال ہیں</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTemplate({ ...tpl });
                        setIsTemplateModalOpen(true);
                      }}
                      className="text-blue-800 hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>ترمیم</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTemplate(tpl.id)}
                      className="text-rose-600 hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>خارج</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Direct Composer */}
      {activeTab === 'direct' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs p-6 max-w-xl mx-auto space-y-4">
          <div className="border-b border-blue-100 pb-3">
            <h3 className="font-nastaliq font-bold text-base text-blue-950">
              براہِ راست واٹس ایپ میسج کمپوزر (Send Custom WhatsApp)
            </h3>
            <p className="text-xs text-slate-500">کسی بھی نمبر پر براہِ راست پیغام تحریر کریں اور واٹس ایپ میں کھولیں</p>
          </div>

          <form onSubmit={handleSendDirect} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">وصول کنندہ کا نام</label>
              <input
                type="text"
                value={directName}
                onChange={e => setDirectName(e.target.value)}
                placeholder="مثلاً: قاری صاحب / حافظ محمد"
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">واٹس ایپ / موبائل نمبر *</label>
              <input
                type="text"
                required
                value={directPhone}
                onChange={e => setDirectPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full border border-blue-300 rounded-lg p-2.5 font-mono text-left bg-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">پیغام کی عبارت</label>
              <textarea
                rows={5}
                value={directMsg}
                onChange={e => setDirectMsg(e.target.value)}
                placeholder="پیغام یہاں تحریر کریں..."
                className="w-full border border-slate-300 rounded-lg p-3 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>🟢 واٹس ایپ پر تیار کریں اور کھولیں</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 8: Message History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-nastaliq font-bold text-base text-blue-950">
                واٹس ایپ پیغامات کی ہسٹری لاگ ({history.length} پیغامات)
              </h3>
              <p className="text-xs text-slate-500">
                سافٹ ویئر کے ذریعے واٹس ایپ پر بھیجے گئے تمام پیغامات کا خودکار کمپیوٹرائزڈ ریکارڈ
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="py-20 text-center">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-nastaliq font-bold text-slate-600 text-base">{EMPTY_RECORD_MSG}</p>
              <p className="text-xs text-slate-400 mt-1">ابھی تک کوئی واٹس ایپ پیغام نہیں بھیجا گیا۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">شمار</th>
                    <th className="p-3 text-center w-36">وقت و تاریخ</th>
                    <th className="p-3">وصول کنندہ</th>
                    <th className="p-3 font-mono">فون نمبر</th>
                    <th className="p-3">عنوان / ٹیمپلیٹ</th>
                    <th className="p-3">پیغام کی عبارت</th>
                    <th className="p-3 text-center w-24">حالت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((msg, idx) => (
                    <tr key={msg.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 text-center font-mono text-slate-600 text-[11px]">{msg.timestamp}</td>
                      <td className="p-3 font-bold text-slate-900">{msg.recipientName}</td>
                      <td className="p-3 font-mono text-slate-700">{msg.phone}</td>
                      <td className="p-3 text-blue-900 font-semibold">{msg.templateType}</td>
                      <td className="p-3 text-slate-600 line-clamp-2 max-w-xs">{msg.message}</td>
                      <td className="p-3 text-center">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          {msg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit / Add Template Modal */}
      {isTemplateModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-blue-200 overflow-hidden text-right">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">پیغام کا ٹیمپلیٹ ترمیم کریں</h3>
            </div>
            <form onSubmit={handleSaveTemplateSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">ٹیمپلیٹ کا نام *</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.name}
                  onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">زمرہ (Category)</label>
                <select
                  value={editingTemplate.category}
                  onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  <option value="غیر حاضری">غیر حاضری</option>
                  <option value="حاضری">حاضری</option>
                  <option value="فیس">فیس</option>
                  <option value="امتحان">امتحان</option>
                  <option value="نتیجہ">نتیجہ</option>
                  <option value="عام اطلاع">عام اطلاع</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">عبارتِ پیغام</label>
                <textarea
                  rows={6}
                  value={editingTemplate.content}
                  onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  className="w-full border border-slate-300 rounded p-3 leading-relaxed"
                />
                <span className="text-[10px] text-blue-700 mt-1 block">
                  دستیاب متغیرات: &#123;student_name&#125;, &#123;father_name&#125;, &#123;class&#125;, &#123;date&#125;, &#123;fee_amount&#125;, &#123;result&#125;, &#123;remarks&#125;
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 text-white rounded font-bold shadow-xs"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
