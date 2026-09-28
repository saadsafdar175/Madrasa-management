import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Search,
  GraduationCap,
  Trash2,
  Edit,
  X,
  Check,
  Phone
} from 'lucide-react';
import { Teacher, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface TeachersViewProps {
  teachers: Teacher[];
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher,
  onOpenPrint,
  onOpenWhatsAppModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    fatherName: '',
    empNo: '',
    designation: 'مدرس / استاد',
    department: 'درس نظامی',
    qualification: 'شہادت العالمیہ',
    phone: '',
    cnic: '',
    salary: 25000,
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'فعال',
    assignedClasses: [],
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      fatherName: '',
      empNo: `T-${teachers.length + 1}`,
      designation: 'مدرس / استاد',
      department: 'درس نظامی',
      qualification: 'شہادت العالمیہ',
      phone: '',
      cnic: '',
      salary: 25000,
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'فعال',
      assignedClasses: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const teacherToSave: Teacher = {
      id: editingTeacher ? editingTeacher.id : `tch_${Date.now()}`,
      empNo: formData.empNo || `T-${Date.now().toString().slice(-3)}`,
      name: formData.name || '',
      fatherName: formData.fatherName || '',
      designation: formData.designation || 'استاد',
      department: formData.department || 'عام',
      qualification: formData.qualification || '',
      phone: formData.phone || '',
      cnic: formData.cnic || '',
      salary: Number(formData.salary) || 0,
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      status: formData.status as any || 'فعال',
      assignedClasses: formData.assignedClasses || [],
    };

    onSaveTeacher(teacherToSave);
    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.empNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="تلاش برائے نام، ایمپلائی نمبر، عہدہ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'teacher-list',
                title: 'فہرستِ اساتذہ کرام و عملہ جامعہ',
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ فہرست اساتذہ</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نیا استاد / ملازم</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filteredTeachers.length === 0 ? (
          <div className="py-20 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              فی الحال کوئی استاد یا ملازم درج نہیں ہے۔ اوپر دیے گئے بٹن سے نیا ریکارڈ شامل کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-20">ایمپلائی #</th>
                  <th className="p-3">نامِ گرامی</th>
                  <th className="p-3">عہدہ و ذمہ داری</th>
                  <th className="p-3">شعبہ</th>
                  <th className="p-3">علمی قابلیت</th>
                  <th className="p-3 font-mono">موبائل نمبر</th>
                  <th className="p-3 text-center w-20">ماہانہ مشاہرہ</th>
                  <th className="p-3 text-center w-16">حالت</th>
                  <th className="p-3 text-center w-44">واٹس ایپ و کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((tch, idx) => (
                  <tr key={tch.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{tch.empNo}</td>
                    <td className="p-3 font-bold text-slate-900">{tch.name}</td>
                    <td className="p-3 font-medium text-slate-800">{tch.designation}</td>
                    <td className="p-3 text-slate-600">{tch.department}</td>
                    <td className="p-3 text-slate-700">{tch.qualification}</td>
                    <td className="p-3 font-mono text-slate-600">{tch.phone}</td>
                    <td className="p-3 text-center font-mono font-bold text-blue-950">روپے {tch.salary}</td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {tch.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 🟢 WhatsApp button */}
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
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                          title="استاد کو واٹس ایپ کریں"
                        >
                          <span>🟢 WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(tch)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`کیا آپ واقعی ${tch.name} کا ریکارڈ خارج کرنا چاہتے ہیں؟`)) {
                              onDeleteTeacher(tch.id);
                            }
                          }}
                          className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                          title="خارج کریں"
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

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-blue-200 overflow-hidden text-right">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">
                {editingTeacher ? 'استاد کے کوائف میں ترمیم' : 'نیا استاد / ملازم فارم'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">نامِ گرامی *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-600"
                    placeholder="مثلاً: مولانا عبد الرحمن"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">عہدہ / منصب</label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مثلاً: شیخ الحدیث / مدرس"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">شعبہ</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="شعبہ کتب / حفظ"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">تعلیمی قابلیت / سند</label>
                  <input
                    type="text"
                    value={formData.qualification || ''}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="شہادت العالمیہ / قراءت سبعہ"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">موبائل / واٹس ایپ نمبر</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                    placeholder="0300-1234567"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ماہانہ مشاہرہ (روپے)</label>
                  <input
                    type="number"
                    value={formData.salary || 0}
                    onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ایمپلائی کوڈ</label>
                  <input
                    type="text"
                    value={formData.empNo || ''}
                    onChange={e => setFormData({ ...formData, empNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>محفوظ کریں</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
