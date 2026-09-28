import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { FinanceTransaction, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface FinanceViewProps {
  financeTransactions: FinanceTransaction[];
  onSaveTransaction: (tx: FinanceTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  financeTransactions,
  onSaveTransaction,
  onDeleteTransaction,
  onOpenPrint,
}) => {
  const [filterType, setFilterType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<FinanceTransaction>>({
    voucherNo: `V-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    type: 'آمدن',
    category: 'عام چندہ و عطیات',
    description: '',
    amount: 10000,
    payeePayer: '',
    paymentMethod: 'نقد (Cash)',
    recordedBy: 'محاسب صاحب',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const newTx: FinanceTransaction = {
      id: `tx_${Date.now()}`,
      voucherNo: formData.voucherNo || `V-${Date.now().toString().slice(-4)}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      type: formData.type as any || 'آمدن',
      category: formData.category || 'متفرق',
      description: formData.description,
      amount: Number(formData.amount) || 0,
      payeePayer: formData.payeePayer || '---',
      paymentMethod: formData.paymentMethod || 'نقد',
      recordedBy: formData.recordedBy || 'محاسب',
    };

    onSaveTransaction(newTx);
    setIsModalOpen(false);
  };

  const totalIncome = financeTransactions.filter(f => f.type === 'آمدن').reduce((a, c) => a + (c.amount || 0), 0);
  const totalExpense = financeTransactions.filter(f => f.type === 'خرچ').reduce((a, c) => a + (c.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const filtered = financeTransactions.filter(f => {
    const matchType = filterType ? f.type === filterType : true;
    const matchDate = selectedDate ? f.date === selectedDate : true;
    return matchType && matchDate;
  });

  return (
    <div className="space-y-4">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">کل آمدن (Income)</span>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-1">روپے {totalIncome}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <ArrowDownCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">کل اخراجات (Expense)</span>
            <div className="text-xl font-bold font-mono text-rose-700 mt-1">روپے {totalExpense}</div>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">
            <ArrowUpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">موجودہ بچت / کیش بیلنس</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">روپے {balance}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
          >
            <option value="">تمام آمدن و اخراجات</option>
            <option value="آمدن">صرف آمدن</option>
            <option value="خرچ">صرف اخراجات</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'finance-report',
                title: 'مالیاتی گوشوارہ و روزنامچہ (آمدن و خرچ)',
                filterDate: selectedDate || undefined,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ مالیاتی رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                voucherNo: `V-${Date.now().toString().slice(-4)}`,
                date: new Date().toISOString().split('T')[0],
                type: 'آمدن',
                category: 'عام چندہ و عطیات',
                description: '',
                amount: 5000,
                payeePayer: '',
                paymentMethod: 'نقد (Cash)',
                recordedBy: 'محاسب صاحب',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نیا واؤچر درج کریں</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              بیت المال اور مالیات کا کوئی اندراج محفوظ نہیں ہے۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-20">واؤچر #</th>
                  <th className="p-3 text-center w-24">تاریخ</th>
                  <th className="p-3 text-center w-20">قسم</th>
                  <th className="p-3">مد و تفصیل</th>
                  <th className="p-3">دینے والا / وصول کنندہ</th>
                  <th className="p-3 text-center w-28">رقم (روپے)</th>
                  <th className="p-3 text-center w-16">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{item.voucherNo}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{item.date}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.type === 'آمدن' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{item.description} ({item.category})</td>
                    <td className="p-3 text-slate-600">{item.payeePayer}</td>
                    <td className="p-3 text-center font-mono font-bold text-sm">
                      <span className={item.type === 'آمدن' ? 'text-emerald-700' : 'text-rose-700'}>
                        {item.type === 'آمدن' ? '+' : '-'}{item.amount}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(item.id)}
                        className="p-1 hover:bg-rose-50 rounded text-rose-600"
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

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">مالیاتی واؤچر درج کریں</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">واؤچر نمبر</label>
                  <input
                    type="text"
                    value={formData.voucherNo}
                    onChange={e => setFormData({ ...formData, voucherNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">نوعیت (قسم) *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                  >
                    <option value="آمدن">آمدن (Income)</option>
                    <option value="خرچ">خرچ (Expense)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">مد / زمرہ</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="عام چندہ / مطبخ خرچ / بل بجلی / تعمیراتی خرچ"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">تفصیل *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مختصر تفصیل درج کریں"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم (روپے) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">دینے والا / لینے والا</label>
                  <input
                    type="text"
                    value={formData.payeePayer}
                    onChange={e => setFormData({ ...formData, payeePayer: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700">منسوخ کریں</button>
                <button type="submit" className="px-5 py-2 bg-emerald-700 text-white rounded font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
