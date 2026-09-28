export type NavModule =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'attendance'
  | 'hifz'
  | 'tajweed'
  | 'dars-nizami'
  | 'daur-hadith'
  | 'exams'
  | 'fees'
  | 'finance'
  | 'salaries'
  | 'whatsapp'
  | 'settings';

export interface WhatsAppMessage {
  id: string;
  timestamp: string;
  recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
  recipientName: string;
  phone: string;
  templateType: string;
  message: string;
  status: 'واٹس ایپ پر بھیجا گیا';
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'حاضری' | 'غیر حاضری' | 'فیس' | 'امتحان' | 'نتیجہ' | 'عام اطلاع';
  content: string;
}

export type DocumentType =
  | 'student-profile'
  | 'student-list'
  | 'attendance-report'
  | 'hifz-report'
  | 'tajweed-report'
  | 'dars-nizami-report'
  | 'daur-hadith-report'
  | 'exam-result'
  | 'marks-sheet'
  | 'dmc'
  | 'result-gazette'
  | 'fee-receipt'
  | 'fee-report'
  | 'finance-report'
  | 'salary-slip'
  | 'salary-report'
  | 'teacher-list';

export interface MadrasaSettings {
  madrasaName: string;
  subTitle: string;
  registrationNo: string;
  affiliation: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  hijriYear: string;
  mohtamimName: string;
  nazimTaleematName: string;
  accountantName: string;
  logoUrl?: string;
}

export interface AppState {
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
  whatsappHistory: WhatsAppMessage[];
  whatsappTemplates: WhatsAppTemplate[];
}

export interface Darja {
  id: string;
  name: string;
  department: string;
  sections: string[];
  subjects: string[];
}

export interface Student {
  id: string;
  regNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  cnicBForm: string;
  phone: string;
  guardianPhone: string;
  address: string;
  darjaId: string;
  section: string;
  admissionDate: string;
  dob: string;
  bloodGroup: string;
  status: 'حاضر' | 'فارغ' | 'منتقل' | 'معطل';
  previousEducation: string;
  hostelResident: boolean;
  remarks: string;
}

export interface Teacher {
  id: string;
  empNo: string;
  name: string;
  fatherName: string;
  designation: string;
  department: string;
  qualification: string;
  phone: string;
  cnic: string;
  salary: number;
  joiningDate: string;
  status: 'فعال' | 'رخصت' | 'فارغ';
  assignedClasses: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  darjaId: string;
  section: string;
  status: 'حاضر' | 'غیر حاضر' | 'رخصت' | 'بیمار';
  remarks?: string;
}

export interface HifzRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  darjaId: string;
  sabaq: string; // سبق (e.g. پارہ ۱، رکوع ۳)
  sabaqi: string; // سبقی (e.g. پارہ ۱ مکمل)
  manzil: string; // منزل (e.g. پارہ ۵)
  quality: 'ممتاز' | 'جید جدا' | 'جید' | 'مقبول' | 'ضعیف';
  teacherName: string;
  remarks?: string;
}

export interface TajweedRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  darjaId: string;
  surah: string;
  ayahRange: string;
  makharijGrade: 'ممتاز' | 'جید جدا' | 'جید' | 'مقبول';
  sifaatGrade: 'ممتاز' | 'جید جدا' | 'جید' | 'مقبول';
  teacherName: string;
  remarks?: string;
}

export interface DarsNizamiRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  darjaId: string;
  kitabName: string;
  lessonTitle: string;
  attendance: 'حاضر' | 'غیر حاضر' | 'رخصت';
  performance: 'ممتاز' | 'بہتر' | 'محتاج محنت';
  teacherName: string;
  remarks?: string;
}

export interface DaurHadithRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  darjaId: string;
  kitabHadith: string; // صحیح بخاری، صحیح مسلم، الخ
  bab: string;
  hadithNumbers: string;
  attendance: 'حاضر' | 'غیر حاضر' | 'رخصت';
  teacherName: string;
  remarks?: string;
}

export interface Exam {
  id: string;
  name: string; // سالانہ امتحان، ششماہی، سہ ماہی، ماہانہ
  academicYear: string;
  hijriYear: string;
  examDate: string;
  darjaId: string;
}

export interface SubjectMarks {
  subjectName: string;
  totalMarks: number;
  obtainedMarks: number;
}

export interface ExamMark {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  darjaId: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'ممتاز' | 'جید جدا' | 'جید' | 'مقبول' | 'راسب (فیل)';
  rank?: string;
  remarks?: string;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  rollNo: string;
  darjaId: string;
  month: string;
  year: string;
  tuitionFee: number;
  foodFee: number;
  hostelFee: number;
  examFee: number;
  otherFee: number;
  totalAmount: number;
  discount: number;
  netPaid: number;
  remainingDue: number;
  paymentDate: string;
  paymentMethod: 'نقد (Cash)' | 'بینک ٹرانسفر' | 'ایزی پیسہ / جاز کیش' | 'چیک';
  status: 'مکمل ادا شدہ' | 'جزوی ادا شدہ' | 'بقایا';
  receiverName: string;
}

export interface FinanceTransaction {
  id: string;
  voucherNo: string;
  date: string;
  type: 'آمدن' | 'خرچ';
  category: string;
  description: string;
  amount: number;
  payeePayer: string;
  paymentMethod: string;
  recordedBy: string;
}

export interface SalaryPayment {
  id: string;
  slipNo: string;
  teacherId: string;
  teacherName: string;
  designation: string;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'ادا شدہ' | 'زیر التواء';
  notes?: string;
}

export interface PrintPreviewData {
  documentType: DocumentType;
  title: string;
  orientation?: 'portrait' | 'landscape';
  selectedItem?: any;
  filterDarja?: string;
  filterSection?: string;
  filterDate?: string;
  filterMonth?: string;
  filterYear?: string;
  filterExamId?: string;
}
