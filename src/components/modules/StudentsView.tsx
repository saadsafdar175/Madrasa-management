import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Search,
  UserCheck,
  Trash2,
  Edit,
  Eye,
  X,
  Check,
  Phone,
  FileSpreadsheet
} from 'lucide-react';
import { Student, Darja, PrintPreviewData } from '../../types';
import { EMPTY_RECORD_MSG } from '../../constants';

interface StudentsViewProps {
  students: Student[];
  darajat: Darja[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenPrint: (data: PrintPreviewData) => void;
  onOpenWhatsAppModal: (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => void;
  onOpenImportWizard?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  darajat,
  onSaveStudent,
  onDeleteStudent,
  onOpenPrint,
  onOpenWhatsAppModal,
  onOpenImportWizard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDarja, setSelectedDarja] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    fatherName: '',
    regNo: '',
    rollNo: '',
    cnicBForm: '',
    phone: '',
    guardianPhone: '',
    address: '',
    darjaId: darajat[0]?.id || '',
    section: 'الف',
    admissionDate: new Date().toISOString().split('T')[0],
    dob: '',
    bloodGroup: '',
    status: 'حاضر',
    previousEducation: '',
    hostelResident: false,
    remarks: '',
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      fatherName: '',
      regNo: `${new Date().getFullYear().toString().slice(2)}-${students.length + 1}`,
      rollNo: `${students.length + 1}`,
      cnicBForm: '',
      phone: '',
      guardianPhone: '',
      address: '',
      darjaId: selectedDarja || darajat[0]?.id || '',
      section: 'الف',
      admissionDate: new Date().toISOString().split('T')[0],
      dob: '',
      bloodGroup: '',
      status: 'حاضر',
      previousEducation: '',
      hostelResident: false,
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const studentToSave: Student = {
      id: editingStudent ? editingStudent.id : `st_${Date.now()}`,
      regNo: formData.regNo || `${Date.now().toString().slice(-4)}`,
      rollNo: formData.rollNo || '',
      name: formData.name || '',
      fatherName: formData.fatherName || '',
      cnicBForm: formData.cnicBForm || '',
      phone: formData.phone || '',
      guardianPhone: formData.guardianPhone || '',
      address: formData.address || '',
      darjaId: formData.darjaId || darajat[0]?.id || '',
      section: formData.section || 'الف',
      admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
      dob: formData.dob || '',
      bloodGroup: formData.bloodGroup || '',
      status: formData.status as any || 'حاضر',
      previousEducation: formData.previousEducation || '',
      hostelResident: Boolean(formData.hostelResident),
      remarks: formData.remarks || '',
    };

    onSaveStudent(studentToSave);
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm);
    const matchesDarja = selectedDarja ? s.darjaId === selectedDarja : true;
    const matchesSection = selectedSection ? s.section === selectedSection : true;
    return matchesSearch && matchesDarja && matchesSection;
  });

  const getDarjaName = (id: string) => {
    const found = darajat.find(d => d.id === id);
    return found ? found.name : id;
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-56">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="تلاش برائے نام، ولدیت، داخلہ نمبر..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

          <select
            value={selectedDarja}
            onChange={e => setSelectedDarja(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">تمام درجات (شعبہ جات)</option>
            {darajat.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">تمام سیکشنز</option>
            <option value="الف">سیکشن الف</option>
            <option value="ب">سیکشن ب</option>
            <option value="ج">سیکشن ج</option>
          </select>
        </div>

        {/* Buttons: 🖨 PRINT & + ADD STUDENT */}
        <div className="flex items-center gap-2">
          {/* Prominent PRINT button */}
          <button
            type="button"
            onClick={() =>
              onOpenPrint({
                documentType: 'student-list',
                title: 'فہرستِ طلبہ کرام (داخلہ رجسٹر)',
                filterDarja: selectedDarja || undefined,
                filterSection: selectedSection || undefined,
              })
            }
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer border border-blue-700"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>🖨 پرنٹ فہرست طلبہ</span>
          </button>

          {/* Import Excel */}
          {onOpenImportWizard && (
            <button
              type="button"
              onClick={onOpenImportWizard}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-blue-900 border border-blue-300 px-3 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="ایکسل، CSV یا ایکسس سے طلبہ درآمد کریں"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>📥 ایکسل / CSV امپورٹ</span>
            </button>
          )}

          {/* Add Student */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نیا داخلہ فارم</span>
          </button>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="py-20 text-center">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-nastaliq font-bold text-slate-600 mb-1">
              {EMPTY_RECORD_MSG}
            </p>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              فی الحال کوئی طالب علم داخل نہیں ہے۔ اوپر دیے گئے بٹن سے نیا طالب علم شامل کریں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-center w-12">شمار</th>
                  <th className="p-3 text-center w-16">رول #</th>
                  <th className="p-3 text-center w-20">داخلہ #</th>
                  <th className="p-3">نام طالب علم</th>
                  <th className="p-3">ولدیت</th>
                  <th className="p-3">درجہ / شعبہ</th>
                  <th className="p-3 text-center w-14">سیکشن</th>
                  <th className="p-3">سرپرست موبائل</th>
                  <th className="p-3 text-center w-16">حالت</th>
                  <th className="p-3 text-center w-48">کارروائی، پرنٹ و واٹس ایپ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{st.rollNo || '---'}</td>
                    <td className="p-3 text-center font-mono text-blue-900 font-semibold">{st.regNo}</td>
                    <td className="p-3 font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => setProfileStudent(st)}
                        className="text-right hover:text-blue-700 hover:underline cursor-pointer font-bold"
                        title="پروفائل دیکھیں"
                      >
                        {st.name}
                      </button>
                    </td>
                    <td className="p-3 text-slate-700">{st.fatherName}</td>
                    <td className="p-3 text-slate-800">{getDarjaName(st.darjaId)}</td>
                    <td className="p-3 text-center">{st.section}</td>
                    <td className="p-3 font-mono text-slate-600">{st.guardianPhone || st.phone || '---'}</td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {st.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 🟢 WhatsApp button */}
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
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                          title="طالب علم / سرپرست کو واٹس ایپ کریں"
                        >
                          <span>🟢 WhatsApp</span>
                        </button>

                        {/* View Profile */}
                        <button
                          type="button"
                          onClick={() => setProfileStudent(st)}
                          className="p-1 hover:bg-blue-50 rounded text-blue-700 cursor-pointer"
                          title="پروفائل دیکھیں"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 🖨 Individual Print Profile */}
                        <button
                          type="button"
                          onClick={() =>
                            onOpenPrint({
                              documentType: 'student-profile',
                              title: `پروفائل - ${st.name}`,
                              selectedItem: st,
                            })
                          }
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-800 px-2 py-1 rounded text-[11px] font-bold transition border border-blue-200 cursor-pointer"
                          title="طالب علم کا پروفائل پرنٹ کریں"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>پرنٹ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(st)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                          title="تبدیل کریں"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`کیا آپ واقعی ${st.name} کا ریکارڈ خارج کرنا چاہتے ہیں؟`)) {
                              onDeleteStudent(st.id);
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

      {/* Add / Edit Student Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-blue-200 my-8 overflow-hidden text-right">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-nastaliq font-bold text-base">
                {editingStudent ? 'طالب علم کے کوائف میں ترمیم' : 'نیا داخلہ فارم (طلبہ)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">نام طالب علم *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-600"
                    placeholder="مثلاً: محمد عبد اللہ"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ولدیت *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName || ''}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-600"
                    placeholder="والد محترم کا نام"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">داخلہ / رجسٹریشن نمبر</label>
                  <input
                    type="text"
                    value={formData.regNo || ''}
                    onChange={e => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">رول نمبر</label>
                  <input
                    type="text"
                    value={formData.rollNo || ''}
                    onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">درجہ / کلاس *</label>
                  <select
                    value={formData.darjaId}
                    onChange={e => setFormData({ ...formData, darjaId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    {darajat.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سیکشن</label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="الف">سیکشن الف</option>
                    <option value="ب">سیکشن ب</option>
                    <option value="ج">سیکشن ج</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سرپرست کا رابطہ / واٹس ایپ نمبر</label>
                  <input
                    type="text"
                    value={formData.guardianPhone || ''}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                    placeholder="0300-0000000"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">بے فارم / شناختی کارڈ</label>
                  <input
                    type="text"
                    value={formData.cnicBForm || ''}
                    onChange={e => setFormData({ ...formData, cnicBForm: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                    placeholder="00000-0000000-0"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">مستقل پتہ</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="مکمل پتہ و رہائش"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hostel"
                    checked={formData.hostelResident}
                    onChange={e => setFormData({ ...formData, hostelResident: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <label htmlFor="hostel" className="font-semibold text-slate-800">
                    مستقل مقیم (ہاسٹل میں رہائش پذیر)
                  </label>
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

      {/* Student Profile View Modal */}
      {profileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-blue-200 overflow-hidden text-right my-8">
            {/* Header */}
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div>
                <h3 className="font-nastaliq font-bold text-lg leading-tight">
                  پروفائل کارڈ - {profileStudent.name}
                </h3>
                <p className="text-xs text-blue-200">
                  جامعہ دارالعلوم الاسلامیہ • شعبہ کوائفِ طلبہ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileStudent(null)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Top Banner with prominent WhatsApp and Print buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-800 text-white flex items-center justify-center font-nastaliq text-xl font-bold shadow-xs">
                    {profileStudent.name.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-blue-950">{profileStudent.name}</h4>
                    <p className="text-slate-600">ولد {profileStudent.fatherName}</p>
                    <span className="inline-block mt-1 bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px] font-bold">
                      {getDarjaName(profileStudent.darjaId)} (سیکشن {profileStudent.section})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {/* 🟢 Clearly visible WhatsApp button */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWhatsAppModal({
                        recipientName: `${profileStudent.name} (ولد ${profileStudent.fatherName})`,
                        recipientType: 'طالب علم / سرپرست',
                        phone: profileStudent.guardianPhone || profileStudent.phone || '',
                        defaultTemplateCategory: 'عام اطلاع',
                        dataVariables: {
                          student_name: profileStudent.name,
                          father_name: profileStudent.fatherName,
                          class: getDarjaName(profileStudent.darjaId),
                        },
                      });
                      setProfileStudent(null);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <span>🟢 WhatsApp</span>
                  </button>

                  {/* 🖨 Print Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPrint({
                        documentType: 'student-profile',
                        title: `پروفائل - ${profileStudent.name}`,
                        selectedItem: profileStudent,
                      });
                      setProfileStudent(null);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>🖨 پرنٹ پروفائل</span>
                  </button>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">داخلہ / رجسٹریشن نمبر:</span>
                  <span className="font-mono font-bold text-blue-950 text-sm">{profileStudent.regNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">رول نمبر:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{profileStudent.rollNo || '---'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">سرپرست رابطہ / واٹس ایپ:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm dir-ltr text-right block" dir="ltr">
                    {profileStudent.guardianPhone || profileStudent.phone || 'غیر درج شدہ'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">بے فارم / شناختی کارڈ:</span>
                  <span className="font-mono text-slate-700">{profileStudent.cnicBForm || '---'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">تاریخِ داخلہ:</span>
                  <span className="font-mono text-slate-700">{profileStudent.admissionDate || '---'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">رہائشی حالت:</span>
                  <span className="font-bold text-slate-800">
                    {profileStudent.hostelResident ? 'ہاسٹل مقیم (مستقل)' : 'شعبہ مقامی (روزانہ آمد و رفت)'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">مستقل پتہ:</span>
                  <span className="text-slate-800">{profileStudent.address || '---'}</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setProfileStudent(null)}
                  className="px-5 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-bold cursor-pointer"
                >
                  بند کریں
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
