import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Printer,
  PlusCircle,
  FileText,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { AppState, NavModule } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface DashboardViewProps {
  state: AppState;
  onNavigate: (module: NavModule) => void;
  onOpenPrint: (previewData: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onOpenPrint,
}) => {
  const { students, teachers, feeReceipts, exams } = state;

  const totalFeesReceived = feeReceipts.reduce((acc: number, curr: any) => acc + (curr.netPaid || 0), 0);

  const statCards = [
    {
      title: 'کل داخل شدہ طلبہ',
      count: students.length,
      unit: 'طلبہ',
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      action: () => onNavigate('students'),
      printAction: () =>
        onOpenPrint({
          documentType: 'student-list',
          title: 'فہرستِ طلبہ کرام (داخلہ رجسٹر)',
        }),
      printLabel: '🖨 پرنٹ لسٹ',
    },
    {
      title: 'اساتذہ و عملہ',
      count: teachers.length,
      unit: 'افراد',
      icon: GraduationCap,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      action: () => onNavigate('teachers'),
      printAction: () =>
        onOpenPrint({
          documentType: 'teacher-list',
          title: 'فہرستِ اساتذہ کرام و عملہ جامعہ',
        }),
      printLabel: '🖨 پرنٹ لسٹ',
    },
    {
      title: 'کل وصول شدہ فیس',
      count: `روپے ${totalFeesReceived}`,
      unit: '',
      icon: Receipt,
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-800',
      action: () => onNavigate('fees'),
      printAction: () =>
        onOpenPrint({
          documentType: 'fee-report',
          title: 'رپورٹ فیس و بقایاجاتِ طلبہ',
        }),
      printLabel: '🖨 پرنٹ رپورٹ',
    },
    {
      title: 'امتحانات و نتائج',
      count: exams.length,
      unit: 'امتحانات',
      icon: FileText,
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-800',
      action: () => onNavigate('exams'),
      printAction: () =>
        onOpenPrint({
          documentType: 'result-gazette',
          title: 'گزٹِ نتائجِ امتحانات',
        }),
      printLabel: '🖨 پرنٹ گزٹ',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Zero Data Indicator Notice */}
      <div className="bg-blue-50 border-r-4 border-blue-700 p-4 rounded-xl flex items-center justify-between text-xs text-blue-950 shadow-xs border border-blue-100">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <p className="font-bold text-sm">ڈیٹا بیس مکمل طور پر خالی اور محفوظ ہے (Zero Demo Data)</p>
            <p className="text-blue-800 mt-0.5">تمام ماڈیولز اصلی ڈیٹا کے اندراج، واٹس ایپ نوٹیفکیشنز اور پرنٹنگ کے لیے تیار ہیں۔</p>
          </div>
        </div>
        <div className="text-left font-mono font-bold bg-white px-3 py-1 rounded border border-blue-200 text-blue-900">
          ریکارڈز: {students.length + teachers.length + feeReceipts.length}
        </div>
      </div>

      {/* Top Stat Cards with direct PRINT buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white border border-blue-100 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">{c.title}</span>
                  <div className="text-2xl font-bold font-mono text-blue-950 mt-1">
                    {c.count} <span className="text-xs font-sans text-slate-500">{c.unit}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${c.bgColor} ${c.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Action Buttons: View & Print */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={c.action}
                  className="text-blue-800 hover:text-blue-950 font-semibold cursor-pointer"
                >
                  کھولیں ←
                </button>
                <button
                  type="button"
                  onClick={c.printAction}
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-800 px-2.5 py-1 rounded font-bold transition cursor-pointer"
                  title="پرنٹ پریویو دیکھیں"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{c.printLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Quick Notification Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold">
            WA
          </div>
          <div>
            <h4 className="font-nastaliq font-bold text-base">واٹس ایپ نوٹیفکیشن و میسجنگ سروس</h4>
            <p className="text-xs text-blue-200">
              طلبہ کی غیر حاضری، فیس یاد دہانی اور امتحانی نتائج سرپرستوں کو واٹس ایپ پر ارسال کریں
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('whatsapp')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>واٹس ایپ سنٹر کھولیں</span>
        </button>
      </div>

      {/* Quick Print Center */}
      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-nastaliq font-bold text-lg text-blue-950">
              فوری پرنٹ سنٹر (Quick Print Center)
            </h3>
            <p className="text-xs text-slate-500">
              کسی بھی دستاویز کا پرنٹ پریویو کھولنے اور فوری پرنٹ کرنے کے لیے نیچے دیے گئے بٹن پر کلک کریں:
            </p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">
            ۱۶ پرنٹ رپورٹس
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            { title: 'فہرستِ طلبہ', type: 'student-list', orient: 'portrait' },
            { title: 'طالب علم پروفائل', type: 'student-profile', orient: 'portrait' },
            { title: 'حاضری رپورٹ', type: 'attendance-report', orient: 'portrait' },
            { title: 'شعبہ حفظ رپورٹ', type: 'hifz-report', orient: 'portrait' },
            { title: 'شعبہ تجوید رپورٹ', type: 'tajweed-report', orient: 'portrait' },
            { title: 'درسِ نظامی رپورٹ', type: 'dars-nizami-report', orient: 'portrait' },
            { title: 'دورۂ حدیث رپورٹ', type: 'daur-hadith-report', orient: 'portrait' },
            { title: 'کشف الدرجات (مارکس شیٹ)', type: 'marks-sheet', orient: 'portrait' },
            { title: 'تفصیلی مارکس سرٹیفکیٹ (DMC)', type: 'dmc', orient: 'portrait' },
            { title: 'گزٹِ امتحانات', type: 'result-gazette', orient: 'landscape' },
            { title: 'فیس رسید (دو کاپیاں)', type: 'fee-receipt', orient: 'portrait' },
            { title: 'فیس و بقایاجات رپورٹ', type: 'fee-report', orient: 'portrait' },
            { title: 'مالیاتی گوشوارہ (آمدن و خرچ)', type: 'finance-report', orient: 'portrait' },
            { title: 'تنخواہ سلپ (پے سلپ)', type: 'salary-slip', orient: 'portrait' },
            { title: 'تنخواہ رجسٹر', type: 'salary-report', orient: 'portrait' },
            { title: 'فہرستِ اساتذہ و عملہ', type: 'teacher-list', orient: 'portrait' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                onOpenPrint({
                  documentType: item.type,
                  title: item.title,
                  orientation: item.orient,
                })
              }
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-700 hover:bg-blue-50/50 text-slate-800 transition group text-right cursor-pointer"
            >
              <span className="font-semibold group-hover:text-blue-900">{item.title}</span>
              <Printer className="w-4 h-4 text-blue-700 group-hover:scale-110 transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity / Zero Data View */}
      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-xs">
        <h3 className="font-nastaliq font-bold text-base text-blue-950 mb-3">
          حالیہ ریکارڈز اور اندراجات
        </h3>
        <div className="py-12 border-2 border-dashed border-blue-100 rounded-lg text-center bg-blue-50/20">
          <p className="text-base font-nastaliq font-bold text-slate-500">
            {EMPTY_RECORD_MSG}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            نیا اصلی ریکارڈ شامل کرنے کے لیے متعلقہ ماڈیول پر جائیں۔
          </p>
        </div>
      </div>
    </div>
  );
};
