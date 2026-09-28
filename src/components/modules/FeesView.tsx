import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Receipt,
  Search,
  Trash2,
  X,
  Check,
  Send
} from 'lucide-react';
import { FeeReceipt, Student, Darja, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG, MONTHS_URDU } from '../../constants';

interface FeesViewProps {
  feeReceipts: FeeReceipt[];
  students: Student[];
  darajat: Darja[];
  onSaveFeeReceipt: (receipt: FeeReceipt) => void;
  onDeleteFeeReceipt: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  feeReceipts,
  students,
  darajat,
  onSaveFeeReceipt,
  onDeleteFeeReceipt,
  onOpenPrint,
  onOpenWhatsAppModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDarja, setFilterDarja] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<FeeReceipt>>({
    receiptNo: `${Date.now().toString().slice(-5)}`,
    studentId: '',
    month: MONTHS_URDU[0],
    year: '2026ء',
    tuitionFee: 3000,
    foodFee: 4000,
    hostelFee: 2000,
    examFee: 0,
    otherFee: 0,
    discount: 0,
    netPaid: 9000,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'نقد (Cash)',
    receiverName: 'محاسب صاحب',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    const tuition = Number(formData.tuitionFee) || 0;
    const food = Number(formData.foodFee) || 0;
    const hostel = Number(formData.hostelFee) || 0;
    const exam = Number(formData.examFee) || 0;
    const other = Number(formData.otherFee) || 0;
    const totalAmount = tuition + food + hostel + exam + other;
    const discount = Number(formData.discount) || 0;
    const netPaid = Number(formData.netPaid) || 0;
    const remainingDue = Math.max(0, totalAmount - discount - netPaid);

    let status: 'مکمل ادا شدہ' | 'جزوی ادا شدہ' | 'بقایا' = 'مکمل ادا شدہ';
    if (remainingDue > 0 && netPaid > 0) status = 'جزوی ادا شدہ';
    else if (netPaid === 0) status = 'بقایا';

    const newReceipt: FeeReceipt = {
      id: `fee_${Date.now()}`,
      receiptNo: formData.receiptNo || `${Date.now().toString().slice(-5)}`,
      studentId: formData.studentId,
      studentName: student ? student.name : 'طالب علم',
      fatherName: student ? student.fatherName : '',
      rollNo: student ? student.rollNo : '---',
      darjaId: student ? student.darjaId : '',
      month: formData.month || MONTHS_URDU[0],
      year: formData.year || '2026ء',
      tuitionFee: tuition,
      foodFee: food,
      hostelFee: hostel,
      examFee: exam,
      otherFee: other,
      totalAmount,
      discount,
      netPaid,
      remainingDue,
      paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod as any || 'نقد (Cash)',
      status,
      receiverName: formData.receiverName || 'محاسب صاحب',
    };

    onSaveFeeReceipt(newReceipt);
    setIsModalOpen(false);
  };

  const filtered = feeReceipts.filter(f => {
    const matchSearch =
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.receiptNo.includes(searchTerm);
    const matchMonth = filterMonth ? f.month === filterMonth : true;
    const matchDarja = filterDarja ? f.darjaId === filterDarja : true;
    return matchSearch && matchMonth && matchDarja;
  });

  const getDarjaName = (id: string) => {
    const found = darajat.find(d => d.id === id);
    return found ? found.name : id;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-56">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="تلاش برائے نام یا رسید نمبر..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

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

          <select
            value={filterDarja}
            onChange={e => setFilterDarja(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
          >
            <option value="">تمام درجات</option>
            {darajat.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'fee-report',
                title: 'رپورٹ فیس و بقایاجاتِ طلبہ',
                filterMonth: filterMonth || undefined,
                filterDarja: filterDarja || undefined,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ فیس رپورٹ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                receiptNo: `${Math.floor(10000 + Math.random() * 90000)}`,
                studentId: students[0]?.id || '',
                month: MONTHS_URDU[0],
                year: '2026ء',
                tuitionFee: 3000,
                foodFee: 4000,
                hostelFee: 2000,
                examFee: 0,
                otherFee: 0,
                discount: 0,
                netPaid: 9000,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: 'نقد (Cash)',
                receiverName: 'محاسب صاحب',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نئی فیس رسید جاری کریں</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              فیس اور چندہ کا کوئی ریکارڈ محفوظ نہیں ہے۔ نئی رسید جاری کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-20">رسید #</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">درجہ</th>
                  <th className="p-3 text-center w-20">ماہ</th>
                  <th className="p-3 text-center w-24">کل واجبات</th>
                  <th className="p-3 text-center w-24">وصول شدہ</th>
                  <th className="p-3 text-center w-20">بقایا</th>
                  <th className="p-3 text-center w-20">حالت</th>
                  <th className="p-3 text-center w-52">پرنٹ و واٹس ایپ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((fee, idx) => {
                  const st = students.find(s => s.id === fee.studentId);
                  const phone = st?.guardianPhone || st?.phone || '';

                  return (
                    <tr key={fee.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{fee.receiptNo}</td>
                      <td className="p-3 font-bold text-slate-900">{fee.studentName}</td>
                      <td className="p-3 text-slate-700">{getDarjaName(fee.darjaId)}</td>
                      <td className="p-3 text-center font-medium">{fee.month}</td>
                      <td className="p-3 text-center font-mono">{fee.totalAmount}</td>
                      <td className="p-3 text-center font-mono font-bold text-blue-900">{fee.netPaid}</td>
                      <td className="p-3 text-center font-mono font-bold text-rose-700">{fee.remainingDue}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          fee.status === 'مکمل ادا شدہ' ? 'bg-blue-50 text-blue-800' :
                          fee.status === 'جزوی ادا شدہ' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 🟢 WhatsApp Fee Reminder */}
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
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                            title="فیس یاد دہانی واٹس ایپ پر بھیجیں"
                          >
                            <span>🟢 WhatsApp Fee Reminder</span>
                          </button>

                          {/* 🖨 Print individual receipt */}
                          <button
                            type="button"
                            onClick={() =>
                              onOpenPrint({
                                documentType: 'fee-receipt',
                                title: `فیس رسید #${fee.receiptNo} - ${fee.studentName}`,
                                selectedItem: fee,
                              })
                            }
                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-800 px-2 py-1 rounded text-[11px] font-bold transition border border-blue-200 cursor-pointer"
                            title="رسید پرنٹ کریں"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>پرنٹ</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteFeeReceipt(fee.id)}
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

      {/* Add Receipt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-blue-200 overflow-hidden text-right">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">نئی فیس رسید جاری کریں</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white cursor-pointer">
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
                      <option key={s.id} value={s.id}>{s.name} ولد {s.fatherName} ({s.regNo})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رسید نمبر</label>
                  <input
                    type="text"
                    value={formData.receiptNo}
                    onChange={e => setFormData({ ...formData, receiptNo: e.target.value })}
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
                  <label className="block text-slate-700 font-bold mb-1">تعلیمی فیس (روپے)</label>
                  <input
                    type="number"
                    value={formData.tuitionFee}
                    onChange={e => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">طعام / خوراک فیس (روپے)</label>
                  <input
                    type="number"
                    value={formData.foodFee}
                    onChange={e => setFormData({ ...formData, foodFee: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رہائش / ہاسٹل فیس</label>
                  <input
                    type="number"
                    value={formData.hostelFee}
                    onChange={e => setFormData({ ...formData, hostelFee: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رعایت / وظیفہ جامعہ</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">وصول شدہ رقم (Net Paid) *</label>
                  <input
                    type="number"
                    required
                    value={formData.netPaid}
                    onChange={e => setFormData({ ...formData, netPaid: Number(e.target.value) })}
                    className="w-full border border-blue-500 rounded p-2 font-mono font-bold text-blue-950 bg-blue-50/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">طریقۂ ادائیگی</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="نقد (Cash)">نقد (Cash)</option>
                    <option value="بینک ٹرانسفر">بینک ٹرانسفر</option>
                    <option value="ایزی پیسہ / جاز کیش">ایزی پیسہ / جاز کیش</option>
                    <option value="چیک">چیک</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700 cursor-pointer">منسوخ کریں</button>
                <button type="submit" disabled={students.length === 0} className="px-5 py-2 bg-blue-800 text-white rounded font-bold cursor-pointer">رسید محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
