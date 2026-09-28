import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Coins,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { SalaryPayment, Teacher, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG, MONTHS_URDU } from '../../constants';

interface SalariesViewProps {
  salaryPayments: SalaryPayment[];
  teachers: Teacher[];
  onSavePayment: (payment: SalaryPayment) => void;
  onDeletePayment: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const SalariesView: React.FC<SalariesViewProps> = ({
  salaryPayments,
  teachers,
  onSavePayment,
  onDeletePayment,
  onOpenPrint,
}) => {
  const [filterMonth, setFilterMonth] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<SalaryPayment>>({
    slipNo: `${Date.now().toString().slice(-4)}`,
    teacherId: '',
    month: MONTHS_URDU[0],
    year: '2026ء',
    basicSalary: 25000,
    allowances: 0,
    deductions: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'نقد (Cash)',
    status: 'ادا شدہ',
    notes: '',
  });

  const handleTeacherChange = (teacherId: string) => {
    const tch = teachers.find(t => t.id === teacherId);
    setFormData(prev => ({
      ...prev,
      teacherId,
      basicSalary: tch ? tch.salary : 25000,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId) return;

    const tch = teachers.find(t => t.id === formData.teacherId);
    const basic = Number(formData.basicSalary) || 0;
    const allow = Number(formData.allowances) || 0;
    const deduct = Number(formData.deductions) || 0;
    const netSalary = basic + allow - deduct;

    const newPayment: SalaryPayment = {
      id: `sal_${Date.now()}`,
      slipNo: formData.slipNo || `${Date.now().toString().slice(-4)}`,
      teacherId: formData.teacherId,
      teacherName: tch ? tch.name : 'استاد محترم',
      designation: tch ? tch.designation : 'مدرس',
      month: formData.month || MONTHS_URDU[0],
      year: formData.year || '2026ء',
      basicSalary: basic,
      allowances: allow,
      deductions: deduct,
      netSalary,
      paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod || 'نقد',
      status: formData.status as any || 'ادا شدہ',
      notes: formData.notes || '',
    };

    onSavePayment(newPayment);
    setIsModalOpen(false);
  };

  const filtered = salaryPayments.filter(s => (filterMonth ? s.month === filterMonth : true));
  const totalSalaries = filtered.reduce((a, c) => a + (c.netSalary || 0), 0);

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">ماہ:</span>
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
          >
            <option value="">تمام مہینے</option>
            {MONTHS_URDU.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'salary-report',
                title: 'تنخواہ و مشاہرہ رجسٹر (اساتذہ و عملہ)',
                filterMonth: filterMonth || undefined,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ تنخواہ رجسٹر</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const defaultTch = teachers[0];
              setFormData({
                slipNo: `${Math.floor(1000 + Math.random() * 9000)}`,
                teacherId: defaultTch?.id || '',
                month: MONTHS_URDU[0],
                year: '2026ء',
                basicSalary: defaultTch ? defaultTch.salary : 25000,
                allowances: 0,
                deductions: 0,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: 'نقد (Cash)',
                status: 'ادا شدہ',
                notes: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ تنخواہ ادائیگی / سلپ</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              تنخواہوں کا کوئی ریکارڈ موجود نہیں ہے۔ نیا اندراج کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-20">سلپ #</th>
                  <th className="p-3">استاد / ملازم</th>
                  <th className="p-3">عہدہ</th>
                  <th className="p-3 text-center w-20">ماہ</th>
                  <th className="p-3 text-center w-24">بنیادی مشاہرہ</th>
                  <th className="p-3 text-center w-20">الاؤنس</th>
                  <th className="p-3 text-center w-20">کٹوتی</th>
                  <th className="p-3 text-center w-24">خالص مشاہرہ</th>
                  <th className="p-3 text-center w-28">پرنٹ و کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sal, idx) => (
                  <tr key={sal.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{sal.slipNo}</td>
                    <td className="p-3 font-bold text-slate-900">{sal.teacherName}</td>
                    <td className="p-3 text-slate-600">{sal.designation}</td>
                    <td className="p-3 text-center font-medium">{sal.month}</td>
                    <td className="p-3 text-center font-mono">{sal.basicSalary}</td>
                    <td className="p-3 text-center font-mono text-emerald-700">+{sal.allowances}</td>
                    <td className="p-3 text-center font-mono text-rose-700">-{sal.deductions}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-950 text-sm">روپے {sal.netSalary}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* 🖨 Print Salary Slip */}
                        <button
                          type="button"
                          onClick={() =>
                            onOpenPrint({
                              documentType: 'salary-slip',
                              title: `تنخواہ سلپ - ${sal.teacherName}`,
                              selectedItem: sal,
                            })
                          }
                          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 px-2 py-1 rounded text-[11px] font-bold transition border border-emerald-200"
                          title="تنخواہ سلپ پرنٹ کریں"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>سلپ پرنٹ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeletePayment(sal.id)}
                          className="p-1 hover:bg-rose-50 rounded text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Salary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">تنخواہ و مشاہرہ سلپ جاری کریں</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">استاد / ملازم کا انتخاب کریں *</label>
                {teachers.length === 0 ? (
                  <p className="text-rose-600 bg-rose-50 p-2 rounded">پہلے اساتذہ سیکشن میں عملہ داخل کریں</p>
                ) : (
                  <select
                    required
                    value={formData.teacherId}
                    onChange={e => handleTeacherChange(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="">استاد کا انتخاب کریں</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سلپ نمبر</label>
                  <input
                    type="text"
                    value={formData.slipNo}
                    onChange={e => setFormData({ ...formData, slipNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ماہ</label>
                  <select
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    {MONTHS_URDU.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">بنیادی مشاہرہ (روپے) *</label>
                  <input
                    type="number"
                    required
                    value={formData.basicSalary}
                    onChange={e => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اضافی الاؤنسز (روپے)</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={e => setFormData({ ...formData, allowances: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">کٹوتی (پیشگی / چھٹی)</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={e => setFormData({ ...formData, deductions: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono text-rose-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">طریقۂ ادائیگی</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="نقد (Cash)">نقد (Cash)</option>
                    <option value="بینک ٹرانسفر">بینک ٹرانسفر</option>
                    <option value="چیک">چیک</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700">منسوخ کریں</button>
                <button type="submit" disabled={teachers.length === 0} className="px-5 py-2 bg-emerald-700 text-white rounded font-bold">ادائیگی محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
