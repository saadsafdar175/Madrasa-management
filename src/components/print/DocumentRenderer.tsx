import React from 'react';
import {
  DocumentType,
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
import { PrintHeader } from './PrintHeader';
import { PrintFooter } from './PrintFooter';
import { EMPTY_RECORD_MSG } from '../../constants';

interface DocumentRendererProps {
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
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
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
}) => {
  const { documentType, title, selectedItem, filterDarja, filterSection, filterDate, filterMonth, filterYear, filterExamId } = previewData;

  const getDarjaName = (id?: string) => {
    if (!id) return 'تمام درجات';
    const found = darajat.find(d => d.id === id);
    return found ? found.name : id;
  };

  const EmptyNotice = () => (
    <div className="py-16 text-center my-6 border-2 border-dashed border-slate-300 rounded bg-slate-50/50">
      <div className="text-xl font-nastaliq font-bold text-slate-600 mb-2">
        {EMPTY_RECORD_MSG}
      </div>
      <p className="text-xs text-slate-500 font-sans">
        اس رپورٹ کے لیے فی الحال کوئی اندراج محفوظ نہیں ہے۔
      </p>
    </div>
  );

  // 1. Student Profile
  if (documentType === 'student-profile') {
    const student: Student | undefined = selectedItem || students[0];
    if (!student) {
      return (
        <div>
          <PrintHeader settings={settings} title="طالب علم کا مکمل کوائف نامہ / داخلہ فارم" />
          <EmptyNotice />
          <PrintFooter settings={settings} />
        </div>
      );
    }

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="طالب علم کا مکمل کوائف نامہ / داخلہ فارم"
          refNo={`داخلہ #${student.regNo || '---'}`}
          date={student.admissionDate}
        />

        {/* Top Details & Photo Area */}
        <div className="flex justify-between items-start gap-4 border border-slate-300 p-4 rounded bg-slate-50/40">
          <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4">
            <div><span className="font-bold text-slate-900">نام طالب علم:</span> {student.name}</div>
            <div><span className="font-bold text-slate-900">ولدیت:</span> {student.fatherName}</div>
            <div><span className="font-bold text-slate-900">رجسٹریشن / داخلہ نمبر:</span> {student.regNo}</div>
            <div><span className="font-bold text-slate-900">رول نمبر:</span> {student.rollNo || '---'}</div>
            <div><span className="font-bold text-slate-900">درجہ / کلاس:</span> {getDarjaName(student.darjaId)} ({student.section || 'الف'})</div>
            <div><span className="font-bold text-slate-900">تاریخِ پیدائش:</span> {student.dob || '---'}</div>
            <div><span className="font-bold text-slate-900">بے فارم / شناختی کارڈ:</span> {student.cnicBForm || '---'}</div>
            <div><span className="font-bold text-slate-900">بلڈ گروپ:</span> {student.bloodGroup || '---'}</div>
            <div><span className="font-bold text-slate-900">رہائش کی نوعیت:</span> {student.hostelResident ? 'مستقل مقیم (ہاسٹل)' : 'مقامی (غیر مقیم)'}</div>
            <div><span className="font-bold text-slate-900">حالتِ داخلہ:</span> <span className="font-semibold text-emerald-800">{student.status}</span></div>
          </div>
          {/* Photo placeholder */}
          <div className="w-28 h-32 border-2 border-dashed border-slate-400 rounded flex flex-col items-center justify-center text-center p-2 text-slate-400 bg-white">
            <span className="text-[10px]">حالیہ تصویر چسپاں کریں</span>
            <span className="text-[9px] mt-1 text-slate-300">سائز 1x1</span>
          </div>
        </div>

        {/* Guardian & Contact Info */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-100 font-bold px-3 py-1.5 border-b border-slate-300 text-slate-800">
            رابطہ و سرپرست کی تفصیلات
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <div><span className="font-bold text-slate-900">سرپرست کا فون نمبر:</span> <span className="font-mono">{student.guardianPhone || student.phone || '---'}</span></div>
            <div><span className="font-bold text-slate-900">طالب علم کا فون نمبر:</span> <span className="font-mono">{student.phone || '---'}</span></div>
            <div className="col-span-2"><span className="font-bold text-slate-900">مستقل پتہ:</span> {student.address || '---'}</div>
          </div>
        </div>

        {/* Previous Academic Background */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-100 font-bold px-3 py-1.5 border-b border-slate-300 text-slate-800">
            سابقہ تعلیمی کوائف و تفصیلات
          </div>
          <div className="p-3">
            <p className="text-slate-700 leading-relaxed">
              {student.previousEducation || 'کوئی سابقہ ریکارڈ درج نہیں'}
            </p>
            {student.remarks && (
              <p className="mt-2 text-slate-600 border-t border-slate-200 pt-2">
                <span className="font-bold">نوٹ / کیفیات:</span> {student.remarks}
              </p>
            )}
          </div>
        </div>

        {/* Declaration */}
        <div className="border border-slate-200 p-3 rounded text-[11px] text-slate-600 leading-relaxed bg-slate-50/50">
          <span className="font-bold text-slate-800">اقرار نامہ:</span> میں بقائمی ہوش و حواس اقرار کرتا ہوں کہ مندرجہ بالا تمام کوائف درست ہیں اور میں جامعہ کے تمام مروجہ قواعد و ضوابط اور اسباق کی پابندی کا پابند رہوں گا۔
        </div>

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 2. Student List
  if (documentType === 'student-list') {
    let filtered = students;
    if (filterDarja) filtered = filtered.filter(s => s.darjaId === filterDarja);
    if (filterSection) filtered = filtered.filter(s => s.section === filterSection);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="فہرستِ طلبہ کرام (داخلہ رجسٹر)"
          subTitle={`درجہ: ${getDarjaName(filterDarja)} ${filterSection ? `| سیکشن: ${filterSection}` : ''}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">رول نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">داخلہ نمبر</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">ولدیت</th>
                <th className="border border-slate-300 p-1.5">درجہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-12">سیکشن</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">موبائل نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">رہائش</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">کیفیت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st, idx) => (
                <tr key={st.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{st.rollNo || '---'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{st.regNo}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{st.name}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-700">{st.fatherName}</td>
                  <td className="border border-slate-300 p-1.5">{getDarjaName(st.darjaId)}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{st.section || 'الف'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-[11px]">{st.guardianPhone || st.phone || '---'}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{st.hostelResident ? 'ہاسٹل' : 'مقامی'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold text-emerald-800">{st.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={3} className="border border-slate-300 p-1.5 text-center">کل تعدادِ طلبہ:</td>
                <td colSpan={7} className="border border-slate-300 p-1.5 font-mono">{filtered.length} طلبہ</td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 3. Attendance Report
  if (documentType === 'attendance-report') {
    let filtered = attendance;
    if (filterDarja) filtered = filtered.filter(a => a.darjaId === filterDarja);
    if (filterDate) filtered = filtered.filter(a => a.date === filterDate);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="رپورٹِ حاضری طلبہ کرام"
          subTitle={`تاریخ: ${filterDate || 'تمام تاریخیں'} | درجہ: ${getDarjaName(filterDarja)}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">تاریخ</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">درجہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">حاضری کیفیت</th>
                <th className="border border-slate-300 p-1.5">وجہ / کیفیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((att, idx) => (
                <tr key={att.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{att.date}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{att.studentName}</td>
                  <td className="border border-slate-300 p-1.5">{getDarjaName(att.darjaId)}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    <span className={
                      att.status === 'حاضر' ? 'text-emerald-700' :
                      att.status === 'غیر حاضر' ? 'text-rose-700' :
                      att.status === 'رخصت' ? 'text-amber-700' : 'text-blue-700'
                    }>
                      {att.status}
                    </span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{att.remarks || '---'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={2} className="border border-slate-300 p-1.5 text-center">خلاصہ حاضری:</td>
                <td colSpan={4} className="border border-slate-300 p-1.5">
                  حاضر: {filtered.filter(a => a.status === 'حاضر').length} | 
                  غیر حاضر: {filtered.filter(a => a.status === 'غیر حاضر').length} | 
                  رخصت: {filtered.filter(a => a.status === 'رخصت').length} | 
                  کل اندراجات: {filtered.length}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 4. Hifz Report
  if (documentType === 'hifz-report') {
    let filtered = hifzRecords;
    if (filterDate) filtered = filtered.filter(h => h.date === filterDate);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="شعبہ تحفیظ القرآن الکریم - یومیہ کارکردگی رپورٹ"
          subTitle={`تاریخ: ${filterDate || 'تمام تاریخیں'}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">سبق (نیا پارہ / صفحہ)</th>
                <th className="border border-slate-300 p-1.5">سبقی (پچھلا یاد)</th>
                <th className="border border-slate-300 p-1.5">منزل (دور)</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">معیارِ تلاوت</th>
                <th className="border border-slate-300 p-1.5">استادِ محترم</th>
                <th className="border border-slate-300 p-1.5">کیفیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => (
                <tr key={rec.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{rec.studentName}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{rec.sabaq}</td>
                  <td className="border border-slate-300 p-1.5">{rec.sabaqi}</td>
                  <td className="border border-slate-300 p-1.5">{rec.manzil}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{rec.quality}</td>
                  <td className="border border-slate-300 p-1.5">{rec.teacherName}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{rec.remarks || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 5. Tajweed Report
  if (documentType === 'tajweed-report') {
    let filtered = tajweedRecords;
    if (filterDate) filtered = filtered.filter(t => t.date === filterDate);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="شعبہ تجوید و قراءت - مشق و کارکردگی رپورٹ"
          subTitle={`تاریخ: ${filterDate || 'تمام تاریخیں'}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">سورۃ مبارکہ</th>
                <th className="border border-slate-300 p-1.5 text-center">آیات</th>
                <th className="border border-slate-300 p-1.5 text-center">مخارجِ حروف</th>
                <th className="border border-slate-300 p-1.5 text-center">صفات و احکام</th>
                <th className="border border-slate-300 p-1.5">استادِ محترم</th>
                <th className="border border-slate-300 p-1.5">کیفیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => (
                <tr key={rec.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{rec.studentName}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{rec.surah}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{rec.ayahRange}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{rec.makharijGrade}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{rec.sifaatGrade}</td>
                  <td className="border border-slate-300 p-1.5">{rec.teacherName}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{rec.remarks || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 6. Dars Nizami Report
  if (documentType === 'dars-nizami-report') {
    let filtered = darsNizamiRecords;
    if (filterDarja) filtered = filtered.filter(d => d.darjaId === filterDarja);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="شعبہ درس نظامی - رپورٹِ تدریس و فہمِ کتب"
          subTitle={`درجہ: ${getDarjaName(filterDarja)}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">کتاب</th>
                <th className="border border-slate-300 p-1.5">سبق / مبحث</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">حاضری</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">فہم و استعداد</th>
                <th className="border border-slate-300 p-1.5">استاد / مدرس</th>
                <th className="border border-slate-300 p-1.5">کیفیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => (
                <tr key={rec.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{rec.studentName}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{rec.kitabName}</td>
                  <td className="border border-slate-300 p-1.5">{rec.lessonTitle}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">{rec.attendance}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{rec.performance}</td>
                  <td className="border border-slate-300 p-1.5">{rec.teacherName}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{rec.remarks || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 7. Daur-e-Hadith Report
  if (documentType === 'daur-hadith-report') {
    const filtered = daurHadithRecords;

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="دورۂ حدیث شریف (عالمیہ) - یومیہ کارگزاری و درسِ حدیث"
          subTitle="صحاحِ ستہ و کتبِ حدیث شریف"
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5 font-bold">کتاب الحدیث</th>
                <th className="border border-slate-300 p-1.5">باب / فصل</th>
                <th className="border border-slate-300 p-1.5 text-center">احادیث نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">حاضری</th>
                <th className="border border-slate-300 p-1.5">شیخ الحدیث صاحب</th>
                <th className="border border-slate-300 p-1.5">کیفیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => (
                <tr key={rec.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{rec.studentName}</td>
                  <td className="border border-slate-300 p-1.5 font-bold text-emerald-950">{rec.kitabHadith}</td>
                  <td className="border border-slate-300 p-1.5">{rec.bab}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{rec.hadithNumbers}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">{rec.attendance}</td>
                  <td className="border border-slate-300 p-1.5">{rec.teacherName}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{rec.remarks || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 8. Marks Sheet / Exam Result
  if (documentType === 'marks-sheet' || documentType === 'exam-result') {
    let filtered = examMarks;
    if (filterExamId) filtered = filtered.filter(m => m.examId === filterExamId);
    if (filterDarja) filtered = filtered.filter(m => m.darjaId === filterDarja);

    const exam = exams.find(e => e.id === filterExamId);
    const examName = exam ? exam.name : 'امتحانات';

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title={`کشف الدرجات (مارکس شیٹ) - ${examName}`}
          subTitle={`درجہ: ${getDarjaName(filterDarja)}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">رول نمبر</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">کل نمبرات</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">حاصل کردہ نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">فیصد</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">درجہ / گریڈ</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">پوزیشن</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mk, idx) => (
                <tr key={mk.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.rollNo || '---'}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{mk.studentName}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.totalMarks}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-slate-950">{mk.obtainedMarks}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.percentage}%</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    <span className={mk.grade === 'راسب (فیل)' ? 'text-rose-700' : 'text-emerald-800'}>
                      {mk.grade}
                    </span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-amber-900">{mk.rank || '---'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={3} className="border border-slate-300 p-1.5 text-center">مجموعی طلبہ:</td>
                <td colSpan={5} className="border border-slate-300 p-1.5">
                  کل امیدوار: {filtered.length} | 
                  کامیاب: {filtered.filter(m => m.grade !== 'راسب (فیل)').length} | 
                  ناکام: {filtered.filter(m => m.grade === 'راسب (فیل)').length}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 9. DMC (Detailed Marks Certificate)
  if (documentType === 'dmc') {
    const mark: ExamMark | undefined = selectedItem || examMarks[0];
    if (!mark) {
      return (
        <div>
          <PrintHeader settings={settings} title="تفصیلی مارکس سرٹیفکیٹ (DMC)" />
          <EmptyNotice />
          <PrintFooter settings={settings} />
        </div>
      );
    }

    const exam = exams.find(e => e.id === mark.examId);
    const examTitle = exam ? exam.name : 'امتحانات سالانہ';

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="تفصیلی مارکس سرٹیفکیٹ (Detailed Marks Certificate)"
          subTitle={examTitle}
          refNo={`DMC-${mark.rollNo || mark.id.slice(0, 5)}`}
        />

        {/* Student Dossier Bar */}
        <div className="border border-slate-300 p-3 rounded grid grid-cols-3 gap-2 bg-slate-50/60">
          <div><span className="font-bold text-slate-900">طالب علم کا نام:</span> {mark.studentName}</div>
          <div><span className="font-bold text-slate-900">رول نمبر:</span> <span className="font-mono">{mark.rollNo || '---'}</span></div>
          <div><span className="font-bold text-slate-900">درجہ:</span> {getDarjaName(mark.darjaId)}</div>
          <div><span className="font-bold text-slate-900">تعلیمی سال:</span> {settings.academicYear}</div>
          <div><span className="font-bold text-slate-900">پوزیشن:</span> {mark.rank || 'عام'}</div>
          <div><span className="font-bold text-slate-900">کیفیتِ نتیجہ:</span> <span className="font-bold text-emerald-800">{mark.grade}</span></div>
        </div>

        {/* Subject-wise Marks Table */}
        <table className="w-full border-collapse border border-slate-400 text-right mt-3">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
              <th className="border border-slate-300 p-2 text-center w-12">شمار</th>
              <th className="border border-slate-300 p-2">مضمون / کتاب</th>
              <th className="border border-slate-300 p-2 text-center w-24">کل نمبرات</th>
              <th className="border border-slate-300 p-2 text-center w-24">حاصل کردہ نمبرات</th>
              <th className="border border-slate-300 p-2 text-center w-28">کیفیت (درجہ)</th>
            </tr>
          </thead>
          <tbody>
            {mark.subjects && mark.subjects.length > 0 ? (
              mark.subjects.map((sub, idx) => (
                <tr key={idx} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-2 font-semibold text-slate-900">{sub.subjectName}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{sub.totalMarks}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-950">{sub.obtainedMarks}</td>
                  <td className="border border-slate-300 p-2 text-center text-slate-700">
                    {sub.obtainedMarks >= sub.totalMarks * 0.8 ? 'ممتاز' :
                     sub.obtainedMarks >= sub.totalMarks * 0.65 ? 'جید جدا' :
                     sub.obtainedMarks >= sub.totalMarks * 0.5 ? 'جید' :
                     sub.obtainedMarks >= sub.totalMarks * 0.4 ? 'مقبول' : 'راسب'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-slate-300 p-4 text-center text-slate-500">
                  تفصیلی مضامین درج نہیں ہیں
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t border-slate-400">
              <td colSpan={2} className="border border-slate-300 p-2 text-left pl-4">میزان کل (Grand Total):</td>
              <td className="border border-slate-300 p-2 text-center font-mono text-sm">{mark.totalMarks}</td>
              <td className="border border-slate-300 p-2 text-center font-mono text-sm font-bold text-emerald-950">{mark.obtainedMarks}</td>
              <td className="border border-slate-300 p-2 text-center font-mono text-sm">{mark.percentage}%</td>
            </tr>
          </tfoot>
        </table>

        {/* Grading Scale Legend */}
        <div className="border border-slate-300 p-2 rounded text-[10px] text-slate-600 flex justify-between bg-slate-50">
          <span><strong>معیارِ درجات:</strong></span>
          <span>ممتاز: 80% تا 100%</span>
          <span>جید جدا: 65% تا 79%</span>
          <span>جید: 50% تا 64%</span>
          <span>مقبول: 40% تا 49%</span>
          <span>راسب: 40% سے کم</span>
        </div>

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 10. Result Gazette
  if (documentType === 'result-gazette') {
    let filtered = examMarks;
    if (filterExamId) filtered = filtered.filter(m => m.examId === filterExamId);
    if (filterDarja) filtered = filtered.filter(m => m.darjaId === filterDarja);

    const exam = exams.find(e => e.id === filterExamId);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title={`گزٹِ نتائجِ امتحانات - ${exam ? exam.name : 'سالانہ'}`}
          subTitle={`درجہ: ${getDarjaName(filterDarja)}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">پوزیشن</th>
                <th className="border border-slate-300 p-1.5 text-center w-14">رول نمبر</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">کل نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">حاصل کردہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-14">فیصد</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">درجہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">نتیجہ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mk, idx) => (
                <tr key={mk.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-amber-900">{mk.rank || (idx + 1)}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.rollNo || '---'}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{mk.studentName}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.totalMarks}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-slate-900">{mk.obtainedMarks}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{mk.percentage}%</td>
                  <td className="border border-slate-300 p-1.5 text-center">{mk.grade}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    <span className={mk.grade === 'راسب (فیل)' ? 'text-rose-700' : 'text-emerald-700'}>
                      {mk.grade === 'راسب (فیل)' ? 'راسب' : 'ناجح (پاس)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 11. Fee Receipt (Duplicate copy: Student Copy & Madrasa Copy)
  if (documentType === 'fee-receipt') {
    const fee: FeeReceipt | undefined = selectedItem || feeReceipts[0];
    if (!fee) {
      return (
        <div>
          <PrintHeader settings={settings} title="رسید برائے فیس و چندہ" />
          <EmptyNotice />
          <PrintFooter settings={settings} />
        </div>
      );
    }

    const SingleReceipt = ({ copyLabel }: { copyLabel: string }) => (
      <div className="border border-slate-400 p-3 rounded bg-white shadow-xs">
        <div className="flex justify-between items-center border-b border-emerald-900 pb-2 mb-2">
          <div className="text-right">
            <h3 className="font-nastaliq font-bold text-base text-emerald-950">{settings.madrasaName}</h3>
            <p className="text-[10px] text-slate-600">{settings.subTitle}</p>
          </div>
          <div className="text-center">
            <span className="bg-emerald-900 text-white px-3 py-0.5 rounded text-[11px] font-bold">
              رسید برائے فیس و چندہ ({copyLabel})
            </span>
          </div>
          <div className="text-left font-mono text-[10px]">
            <p><strong>رسید نمبر:</strong> {fee.receiptNo}</p>
            <p><strong>تاریخ:</strong> {fee.paymentDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-slate-50 p-2 rounded border border-slate-200">
          <div><span className="font-bold text-slate-800">نام طالب علم:</span> {fee.studentName}</div>
          <div><span className="font-bold text-slate-800">ولدیت:</span> {fee.fatherName || '---'}</div>
          <div><span className="font-bold text-slate-800">رول نمبر:</span> <span className="font-mono">{fee.rollNo || '---'}</span></div>
          <div><span className="font-bold text-slate-800">درجہ:</span> {getDarjaName(fee.darjaId)}</div>
          <div><span className="font-bold text-slate-800">ماہ / سال:</span> {fee.month} {fee.year}</div>
          <div><span className="font-bold text-slate-800">طریقۂ ادائیگی:</span> {fee.paymentMethod}</div>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-xs mb-3 text-right">
          <thead>
            <tr className="bg-slate-100 font-bold">
              <th className="border border-slate-300 p-1">مد (تفصیل)</th>
              <th className="border border-slate-300 p-1 text-center w-24">مبلغ (روپے)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-slate-300 p-1">ماہانہ تعلیمی فیس (Tuition Fee)</td><td className="border border-slate-300 p-1 text-center font-mono">{fee.tuitionFee}</td></tr>
            <tr><td className="border border-slate-300 p-1">طعام و مطبخ فیس (Food/Mess Fee)</td><td className="border border-slate-300 p-1 text-center font-mono">{fee.foodFee}</td></tr>
            <tr><td className="border border-slate-300 p-1">رہائشی / ہاسٹل فیس (Hostel Fee)</td><td className="border border-slate-300 p-1 text-center font-mono">{fee.hostelFee}</td></tr>
            <tr><td className="border border-slate-300 p-1">امتحان و دیگر واجبات (Exam & Other)</td><td className="border border-slate-300 p-1 text-center font-mono">{fee.examFee + fee.otherFee}</td></tr>
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-semibold"><td className="border border-slate-300 p-1">کل میزان واجبات:</td><td className="border border-slate-300 p-1 text-center font-mono">{fee.totalAmount}</td></tr>
            {fee.discount > 0 && <tr><td className="border border-slate-300 p-1 text-emerald-800">رعایت / وظیفہ جامعہ:</td><td className="border border-slate-300 p-1 text-center font-mono text-emerald-800">-{fee.discount}</td></tr>}
            <tr className="bg-emerald-50 font-bold text-emerald-950 text-sm"><td className="border border-slate-300 p-1">حاصل کردہ رقم (Net Received):</td><td className="border border-slate-300 p-1 text-center font-mono">روپے {fee.netPaid}</td></tr>
            {fee.remainingDue > 0 && <tr className="text-rose-800 font-bold"><td className="border border-slate-300 p-1">بقایا واجب الاداء:</td><td className="border border-slate-300 p-1 text-center font-mono">روپے {fee.remainingDue}</td></tr>}
          </tfoot>
        </table>

        <div className="flex justify-between items-center pt-2 text-[10px] text-slate-600 border-t border-slate-200">
          <span>وصول کنندہ: {fee.receiverName || settings.accountantName}</span>
          <span className="border-t border-dashed border-slate-400 px-6 pt-0.5 font-bold">دستخط وصول کنندہ مع مہر</span>
        </div>
      </div>
    );

    return (
      <div className="space-y-4 text-xs">
        <SingleReceipt copyLabel="جامعہ کاپی" />
        <div className="border-t-2 border-dashed border-slate-400 my-4 text-center">
          <span className="bg-white px-4 text-[10px] text-slate-400 font-mono -translate-y-2 inline-block">✂ یہاں سے کاٹیں</span>
        </div>
        <SingleReceipt copyLabel="طالب علم کاپی" />
      </div>
    );
  }

  // 12. Fee Report
  if (documentType === 'fee-report') {
    let filtered = feeReceipts;
    if (filterDarja) filtered = filtered.filter(f => f.darjaId === filterDarja);
    if (filterMonth) filtered = filtered.filter(f => f.month === filterMonth);

    const totalCollected = filtered.reduce((acc, curr) => acc + (curr.netPaid || 0), 0);
    const totalRemaining = filtered.reduce((acc, curr) => acc + (curr.remainingDue || 0), 0);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="رپورٹ فیس و بقایاجاتِ طلبہ"
          subTitle={`ماہ: ${filterMonth || 'تمام مہینے'} | درجہ: ${getDarjaName(filterDarja)}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">رسید نمبر</th>
                <th className="border border-slate-300 p-1.5">نام طالب علم</th>
                <th className="border border-slate-300 p-1.5">درجہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">ماہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">کل فیس</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">وصول شدہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">بقایا</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">حالت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fee, idx) => (
                <tr key={fee.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{fee.receiptNo}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{fee.studentName}</td>
                  <td className="border border-slate-300 p-1.5">{getDarjaName(fee.darjaId)}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{fee.month}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{fee.totalAmount}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-emerald-800">{fee.netPaid}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-rose-700">{fee.remainingDue}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{fee.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={5} className="border border-slate-300 p-1.5 text-left pl-3">کل مجموعہ:</td>
                <td className="border border-slate-300 p-1.5 text-center font-mono">
                  {filtered.reduce((a, c) => a + (c.totalAmount || 0), 0)}
                </td>
                <td className="border border-slate-300 p-1.5 text-center font-mono text-emerald-900">
                  {totalCollected}
                </td>
                <td className="border border-slate-300 p-1.5 text-center font-mono text-rose-900">
                  {totalRemaining}
                </td>
                <td className="border border-slate-300 p-1.5"></td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 13. Finance Report
  if (documentType === 'finance-report') {
    let filtered = financeTransactions;
    if (filterDate) filtered = filtered.filter(f => f.date === filterDate);

    const totalIncome = filtered.filter(f => f.type === 'آمدن').reduce((a, c) => a + (c.amount || 0), 0);
    const totalExpense = filtered.filter(f => f.type === 'خرچ').reduce((a, c) => a + (c.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="مالیاتی گوشوارہ و روزنامچہ (آمدن و خرچ)"
          subTitle={`تاریخ: ${filterDate || 'مکمل مالیاتی ریکارڈ'}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">واؤچر</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">تاریخ</th>
                <th className="border border-slate-300 p-1.5">تفصیل / مد</th>
                <th className="border border-slate-300 p-1.5">دینے والا / لینے والا</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">آمدن (روپے)</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">خرچ (روپے)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.voucherNo}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.date}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{item.description} ({item.category})</td>
                  <td className="border border-slate-300 p-1.5 text-slate-700">{item.payeePayer}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-emerald-800">
                    {item.type === 'آمدن' ? item.amount : '---'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-rose-700">
                    {item.type === 'خرچ' ? item.amount : '---'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={5} className="border border-slate-300 p-1.5 text-left pl-3">کل آمدن و خرچ:</td>
                <td className="border border-slate-300 p-1.5 text-center font-mono text-emerald-950 font-bold">{totalIncome}</td>
                <td className="border border-slate-300 p-1.5 text-center font-mono text-rose-950 font-bold">{totalExpense}</td>
              </tr>
              <tr className="bg-emerald-50 font-bold border-t border-slate-400 text-sm">
                <td colSpan={5} className="border border-slate-300 p-1.5 text-left pl-3 text-emerald-950">خالص بچت / میزان کیش ان ہینڈ:</td>
                <td colSpan={2} className="border border-slate-300 p-1.5 text-center font-mono text-emerald-950">روپے {balance}</td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 14. Salary Slip
  if (documentType === 'salary-slip') {
    const sal: SalaryPayment | undefined = selectedItem || salaryPayments[0];
    if (!sal) {
      return (
        <div>
          <PrintHeader settings={settings} title="تنخواہ سلپ / پے سلپ (Salary Slip)" />
          <EmptyNotice />
          <PrintFooter settings={settings} />
        </div>
      );
    }

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="تنخواہ و مشاہرہ سلپ (Salary Slip)"
          subTitle={`ماہ: ${sal.month} ${sal.year}`}
          refNo={`سلپ #${sal.slipNo}`}
        />

        <div className="border border-slate-300 p-4 rounded bg-slate-50/50 grid grid-cols-2 gap-3 mb-4">
          <div><span className="font-bold text-slate-800">نام استاد / ملازم:</span> {sal.teacherName}</div>
          <div><span className="font-bold text-slate-800">عہدہ / شعبہ:</span> {sal.designation}</div>
          <div><span className="font-bold text-slate-800">ماہ و سال:</span> {sal.month} {sal.year}</div>
          <div><span className="font-bold text-slate-800">طریقۂ ادائیگی:</span> {sal.paymentMethod}</div>
          <div><span className="font-bold text-slate-800">تاریخِ ادائیگی:</span> {sal.paymentDate}</div>
          <div><span className="font-bold text-slate-800">حالت:</span> <span className="font-bold text-emerald-800">{sal.status}</span></div>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-xs mb-4 text-right">
          <thead>
            <tr className="bg-slate-100 font-bold border-b border-slate-300">
              <th className="border border-slate-300 p-2">تفصیلاتِ مشاہرہ</th>
              <th className="border border-slate-300 p-2 text-center w-36">رقم (روپے)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2">بنیادی تنخواہ (Basic Salary)</td>
              <td className="border border-slate-300 p-2 text-center font-mono">{sal.basicSalary}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 text-emerald-800">اضافی مراعات / الاؤنسز (Allowances)</td>
              <td className="border border-slate-300 p-2 text-center font-mono text-emerald-800">+{sal.allowances}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 text-rose-800">کٹوتیاں / پیشگی رقم (Deductions)</td>
              <td className="border border-slate-300 p-2 text-center font-mono text-rose-800">-{sal.deductions}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-emerald-50 text-emerald-950 font-bold text-sm border-t-2 border-emerald-900">
              <td className="border border-slate-300 p-2">خالص قابلِ ادائیگی مشاہرہ (Net Salary):</td>
              <td className="border border-slate-300 p-2 text-center font-mono">روپے {sal.netSalary}</td>
            </tr>
          </tfoot>
        </table>

        {sal.notes && (
          <div className="p-2 border border-slate-200 rounded text-slate-600 bg-slate-50">
            <strong>نوٹ:</strong> {sal.notes}
          </div>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 15. Salary Report
  if (documentType === 'salary-report') {
    let filtered = salaryPayments;
    if (filterMonth) filtered = filtered.filter(s => s.month === filterMonth);

    const totalPaid = filtered.reduce((a, c) => a + (c.netSalary || 0), 0);

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="تنخواہ و مشاہرہ رجسٹر (اساتذہ و عملہ)"
          subTitle={`ماہ: ${filterMonth || 'تمام مہینے'}`}
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">سلپ نمبر</th>
                <th className="border border-slate-300 p-1.5">نام استاد / ملازم</th>
                <th className="border border-slate-300 p-1.5">عہدہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">بنیادی تنخواہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">الاؤنس</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">کٹوتی</th>
                <th className="border border-slate-300 p-1.5 text-center w-20">خالص تنخواہ</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">دستخط وصول کنندہ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sal, idx) => (
                <tr key={sal.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{sal.slipNo}</td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{sal.teacherName}</td>
                  <td className="border border-slate-300 p-1.5">{sal.designation}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{sal.basicSalary}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-emerald-700">+{sal.allowances}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-rose-700">-{sal.deductions}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-slate-950">{sal.netSalary}</td>
                  <td className="border border-slate-300 p-1.5 text-center text-[10px] text-slate-400">دستخط</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={7} className="border border-slate-300 p-1.5 text-left pl-3">کل ادا شدہ مشاہرہ:</td>
                <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-emerald-950">روپے {totalPaid}</td>
                <td className="border border-slate-300 p-1.5"></td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  // 16. Teacher List
  if (documentType === 'teacher-list') {
    const filtered = teachers;

    return (
      <div className="space-y-4 text-xs">
        <PrintHeader
          settings={settings}
          title="فہرستِ اساتذہ کرام و عملہ جامعہ"
          subTitle="اساتذہ و انتظامی عملہ"
        />

        {filtered.length === 0 ? (
          <EmptyNotice />
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                <th className="border border-slate-300 p-1.5 text-center w-10">شمار</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">ایمپلائی #</th>
                <th className="border border-slate-300 p-1.5">نامِ گرامی</th>
                <th className="border border-slate-300 p-1.5">ولدیت</th>
                <th className="border border-slate-300 p-1.5">عہدہ / ذمہ داری</th>
                <th className="border border-slate-300 p-1.5">شعبہ</th>
                <th className="border border-slate-300 p-1.5">قابلیت / سند</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">رابطہ نمبر</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">کیفیت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className="border-b border-slate-300 even:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{t.empNo}</td>
                  <td className="border border-slate-300 p-1.5 font-bold text-slate-900">{t.name}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-700">{t.fatherName || '---'}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{t.designation}</td>
                  <td className="border border-slate-300 p-1.5">{t.department}</td>
                  <td className="border border-slate-300 p-1.5">{t.qualification || 'شہادت العالمیہ'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-[11px]">{t.phone}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold text-emerald-800">{t.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-400">
                <td colSpan={2} className="border border-slate-300 p-1.5 text-center">کل تعداد:</td>
                <td colSpan={7} className="border border-slate-300 p-1.5 font-mono">{filtered.length} اساتذہ و ملازمین</td>
              </tr>
            </tfoot>
          </table>
        )}

        <PrintFooter settings={settings} />
      </div>
    );
  }

  return (
    <div>
      <PrintHeader settings={settings} title={title} />
      <EmptyNotice />
      <PrintFooter settings={settings} />
    </div>
  );
};
