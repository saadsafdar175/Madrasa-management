import React, { useState } from 'react';
import {
  Save,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Building,
  GraduationCap,
  FileSpreadsheet
} from 'lucide-react';
import { MadrasaSettings, Darja, AppState } from '../../types';

interface SettingsViewProps {
  settings: MadrasaSettings;
  darajat: Darja[];
  onSaveSettings: (settings: MadrasaSettings) => void;
  onClearAllRecords: () => void;
  fullState: AppState;
  onRestoreState: (state: AppState) => void;
  onOpenImportWizard?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  darajat,
  onSaveSettings,
  onClearAllRecords,
  fullState,
  onRestoreState,
  onOpenImportWizard,
}) => {
  const [formData, setFormData] = useState<MadrasaSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(fullState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `madrasa_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) {
          onRestoreState(parsed);
          alert('بیک اپ کامیابی سے بحال کر دیا گیا ہے۔');
        } else {
          alert('فائل کا فارمیٹ درست نہیں ہے!');
        }
      } catch (err) {
        alert('بیک اپ فائل پڑھنے میں خرابی پیش آئی!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>ترتیبات اور کوائف کامیابی سے محفوظ کر لیے گئے ہیں۔ تمام پرنٹنگ رپورٹس اب نئی ترتیبات کے ساتھ پرنٹ ہوں گی۔</span>
        </div>
      )}

      {/* Madrasa Basic Profile Form */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-300" />
            <h3 className="font-nastaliq font-bold text-base">کوائف و معلوماتِ جامعہ (Madrasa Profile)</h3>
          </div>
          <span className="text-[11px] text-emerald-300">پرنٹ ہیڈر و لیٹر ہیڈ میں استعمال ہوتی ہیں</span>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-800 font-bold mb-1">جامعہ / مدرسہ کا مکمل نام *</label>
              <input
                type="text"
                required
                value={formData.madrasaName}
                onChange={e => setFormData({ ...formData, madrasaName: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 font-nastaliq text-base focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">ذیلی عنوان / تعارفی سطر</label>
              <input
                type="text"
                value={formData.subTitle}
                onChange={e => setFormData({ ...formData, subTitle: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">الحاق (Affiliation)</label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={e => setFormData({ ...formData, affiliation: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
                placeholder="وفاق المدارس العربیہ پاکستان"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">رجسٹریشن نمبر</label>
              <input
                type="text"
                value={formData.registrationNo}
                onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">تعلیمی سال</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">ہجری سال</label>
              <input
                type="text"
                value={formData.hijriYear}
                onChange={e => setFormData({ ...formData, hijriYear: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">رابطہ نمبرز</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-800 font-bold mb-1">مکمل پتہ و مقام</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            {/* Official Signatories */}
            <div>
              <label className="block text-slate-800 font-bold mb-1">نامِ مہتمم / صدر مدرس (دستخط کنندہ)</label>
              <input
                type="text"
                value={formData.mohtamimName}
                onChange={e => setFormData({ ...formData, mohtamimName: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">نامِ ناظمِ تعلیمات (دستخط کنندہ)</label>
              <input
                type="text"
                value={formData.nazimTaleematName}
                onChange={e => setFormData({ ...formData, nazimTaleematName: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">نامِ محاسب / اکاؤنٹنٹ (دستخط کنندہ)</label>
              <input
                type="text"
                value={formData.accountantName}
                onChange={e => setFormData({ ...formData, accountantName: e.target.value })}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">ای میل ایڈریس</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ترتیبات محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>

      {/* Darajat / Classes Structure View */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-800" />
            <h4 className="font-nastaliq font-bold text-sm text-slate-800">
              جامعہ کے درجات و کتب نظام ({darajat.length} درجات)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">نصابِ تعلیم اور درجات کا مکمل ڈھانچہ</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {darajat.map(d => (
            <div key={d.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
              <span className="font-bold text-slate-900">{d.name}</span>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">شعبہ: {d.department}</p>
              <div className="mt-2 text-[10px] text-slate-600 line-clamp-2">
                کتب: {d.subjects.join('، ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management: Backup & Zero Data Guarantee */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
        <h4 className="font-nastaliq font-bold text-base text-slate-800 border-b border-slate-200 pb-2">
          ڈیٹا بیک اپ، ریسٹور اور زیرو ڈیٹا کنٹرول
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Export JSON */}
          <div className="border border-slate-200 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block mb-1">کمپیوٹر پر بیک اپ فائل ڈاؤن لوڈ کریں</span>
              <p className="text-slate-500">اپنے تمام داخل شدہ طلبہ، اساتذہ، امتحانات اور فیس کا بیک اپ محفوظ کریں۔</p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="mt-3 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold"
            >
              <Download className="w-4 h-4" />
              <span>بیک اپ فائل ڈاؤن لوڈ (JSON)</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="border border-slate-200 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block mb-1">سابقہ بیک اپ فائل بحال کریں</span>
              <p className="text-slate-500">پہلے سے محفوظ شدہ بیک اپ فائل منتخب کر کے تمام ڈیٹا بحال کریں۔</p>
            </div>
            <label className="mt-3 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-4 py-2 rounded-lg font-bold cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>فائل منتخب کریں (JSON)</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>

        {/* Feature 1: Data Import Wizard Section */}
        <div className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-5 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-amber-300 flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-blue-950 text-sm block">
                  بیرونی فائل سے ڈیٹا درآمد کریں (Excel / CSV / Access Data Import)
                </span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  اپنے سابقہ سسٹم، ایکسل شیٹس یا مائیکروسافٹ ایکسس سے طلبہ، اساتذہ، فیس، حاضری اور مارکس کا ڈیٹا فوری منتقل کریں۔
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">.xlsx</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">.xls</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">.csv</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">.accdb</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">.mdb</span>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={onOpenImportWizard}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>📥 ایکسل / CSV / ایکسس امپورٹ وزرڈ کھولیں (Import Wizard)</span>
            </button>
          </div>
        </div>

        {/* Clear All Records */}
        <div className="border border-rose-200 bg-rose-50/50 p-4 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>تمام ریکارڈز مکمل صاف کریں (Clear All Data - Zero Demo Records)</span>
          </div>
          <p className="text-slate-600">
            اس بٹن کو دبانے سے تمام طلبہ، اساتذہ، حاضری، فیس، امتحانات اور مالیات کے ریکارڈز مکمل طور پر ختم ہو جائیں گے اور ڈیٹا بیس 0 ریکارڈ پر آ جائے گا۔ درجات اور ترتیبات برقرار رہیں گی۔
          </p>

          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>ڈیٹا مکمل خالی کریں</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-rose-800 font-bold">کیا آپ واقعی تمام ریکارڈز مٹانا چاہتے ہیں؟</span>
              <button
                type="button"
                onClick={() => {
                  onClearAllRecords();
                  setShowClearConfirm(false);
                  alert('تمام ریکارڈز کامیابی سے مٹا دیے گئے ہیں۔ سسٹم اب بالکل خالی ہے۔');
                }}
                className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1.5 rounded font-bold"
              >
                ہاں، مکمل مٹا دیں
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="border border-slate-300 px-3 py-1.5 rounded text-slate-700 hover:bg-slate-100"
              >
                منسوخ کریں
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
