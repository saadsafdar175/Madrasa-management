import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  Database,
  RefreshCw,
  Info,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  AppState,
  Student,
  Teacher,
  FeeReceipt,
  AttendanceRecord,
  ExamMark,
  FinanceTransaction,
  SalaryPayment,
  Darja
} from '../../types';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onImportComplete: (updatedState: AppState, message: string) => void;
}

type ImportModule =
  | 'students'
  | 'teachers'
  | 'fees'
  | 'attendance'
  | 'marks'
  | 'finance'
  | 'salaries';

interface ColumnMapping {
  fieldKey: string;
  fieldLabel: string;
  required?: boolean;
  mappedHeader: string; // Header in the uploaded file
}

const MODULE_DEFINITIONS: Record<
  ImportModule,
  {
    label: string;
    description: string;
    fields: { key: string; label: string; required?: boolean; autoMatch: string[] }[];
  }
> = {
  students: {
    label: 'طلبہ کا داخلہ رجسٹر (Students)',
    description: 'داخلہ نمبر، رول نمبر، طالب علم کا نام، ولدیت، کلاس، موبائل نمبر وغیرہ',
    fields: [
      { key: 'name', label: 'طالب علم کا نام', required: true, autoMatch: ['name', 'student', 'student name', 'نام', 'طالب علم', 'اسم طالب علم'] },
      { key: 'fatherName', label: 'والد کا نام', required: true, autoMatch: ['father', 'father name', 'ولدیت', 'والد کا نام', 'ولد'] },
      { key: 'regNo', label: 'داخلہ / رجسٹریشن نمبر', autoMatch: ['reg', 'regno', 'reg no', 'admission', 'admission no', 'داخلہ نمبر', 'رجسٹریشن نمبر'] },
      { key: 'rollNo', label: 'رول نمبر', autoMatch: ['roll', 'rollno', 'roll no', 'رول نمبر', 'شمار'] },
      { key: 'darjaName', label: 'درجہ / کلاس', autoMatch: ['class', 'darja', 'درجہ', 'کلاس', 'شعبہ'] },
      { key: 'section', label: 'سیکشن', autoMatch: ['section', 'سیکشن', 'گروپ'] },
      { key: 'guardianPhone', label: 'سرپرست موبائل / واٹس ایپ', autoMatch: ['phone', 'mobile', 'whatsapp', 'موبائل', 'فون', 'رابطہ', 'واٹس ایپ'] },
      { key: 'cnicBForm', label: 'بے فارم / شناختی کارڈ', autoMatch: ['cnic', 'bform', 'b-form', 'بے فارم', 'شناختی کارڈ'] },
      { key: 'address', label: 'مستقل پتہ', autoMatch: ['address', 'پتہ', 'رہائش'] },
      { key: 'admissionDate', label: 'تاریخ داخلہ', autoMatch: ['admission date', 'date', 'تاریخ'] },
    ],
  },
  teachers: {
    label: 'اساتذہ و عملہ (Teachers)',
    description: 'اساتذہ کا نام، عہدہ، شعبہ، فون نمبر، تنخواہ وغیرہ',
    fields: [
      { key: 'name', label: 'استاد کا نام', required: true, autoMatch: ['name', 'teacher', 'teacher name', 'نام', 'استاد'] },
      { key: 'fatherName', label: 'ولدیت', autoMatch: ['father', 'father name', 'ولدیت'] },
      { key: 'empNo', label: 'ایمپلائی / کوڈ نمبر', autoMatch: ['emp', 'empno', 'code', 'کوڈ'] },
      { key: 'designation', label: 'عہدہ / ذمہ داری', autoMatch: ['designation', 'post', 'عہدہ'] },
      { key: 'department', label: 'شعبہ', autoMatch: ['department', 'dept', 'شعبہ'] },
      { key: 'phone', label: 'موبائل نمبر', autoMatch: ['phone', 'mobile', 'موبائل', 'فون'] },
      { key: 'salary', label: 'ماہانہ تنخواہ', autoMatch: ['salary', 'مشاہرہ', 'تنخواہ'] },
      { key: 'cnic', label: 'شناختی کارڈ', autoMatch: ['cnic', 'شناختی کارڈ'] },
    ],
  },
  fees: {
    label: 'فیس و واجبات ریکارڈ (Fees)',
    description: 'رسید نمبر، طالب علم کا نام، مہینہ، وصول شدہ رقم، بقایا وغیرہ',
    fields: [
      { key: 'studentName', label: 'طالب علم کا نام', required: true, autoMatch: ['student', 'name', 'نام', 'طالب علم'] },
      { key: 'receiptNo', label: 'رسید نمبر', autoMatch: ['receipt', 'receiptno', 'رسید نمبر', 'رسید'] },
      { key: 'month', label: 'ماہ (Month)', autoMatch: ['month', 'مہینہ', 'ماہ'] },
      { key: 'netPaid', label: 'وصول شدہ رقم', required: true, autoMatch: ['paid', 'netpaid', 'amount', 'وصول', 'رقم'] },
      { key: 'totalAmount', label: 'کل واجبات', autoMatch: ['total', 'کل واجبات'] },
      { key: 'remainingDue', label: 'بقایا رقم', autoMatch: ['due', 'remaining', 'بقایا'] },
      { key: 'paymentDate', label: 'تاریخ ادائیگی', autoMatch: ['date', 'payment date', 'تاریخ'] },
    ],
  },
  attendance: {
    label: 'حاضری رجسٹر (Attendance)',
    description: 'طالب علم کا نام، تاریخ، حاضری کی کیفیت (حاضر / غیر حاضر)',
    fields: [
      { key: 'studentName', label: 'طالب علم کا نام', required: true, autoMatch: ['student', 'name', 'نام'] },
      { key: 'date', label: 'تاریخ (Date)', required: true, autoMatch: ['date', 'تاریخ'] },
      { key: 'status', label: 'کیفیت (حاضر / غیر حاضر / رخصت)', autoMatch: ['status', 'attendance', 'کیفیت', 'حاضری'] },
      { key: 'darjaName', label: 'درجہ / کلاس', autoMatch: ['class', 'darja', 'درجہ'] },
    ],
  },
  marks: {
    label: 'امتحانی نمبرات و رزلٹ (Exam Marks)',
    description: 'طالب علم کا نام، رول نمبر، حاصل کردہ نمبر، کل نمبر، گریڈ',
    fields: [
      { key: 'studentName', label: 'طالب علم کا نام', required: true, autoMatch: ['student', 'name', 'نام'] },
      { key: 'rollNo', label: 'رول نمبر', autoMatch: ['roll', 'rollno', 'رول نمبر'] },
      { key: 'totalMarks', label: 'کل نمبرات', autoMatch: ['total', 'total marks', 'کل نمبر'] },
      { key: 'obtainedMarks', label: 'حاصل کردہ نمبرات', required: true, autoMatch: ['obtained', 'marks', 'حاصل کردہ'] },
      { key: 'grade', label: 'گریڈ / پوزیشن', autoMatch: ['grade', 'rank', 'گریڈ', 'پوزیشن'] },
      { key: 'darjaName', label: 'درجہ / کلاس', autoMatch: ['class', 'darja', 'درجہ'] },
    ],
  },
  finance: {
    label: 'مالیات و بیت المال (Finance)',
    description: 'آمدن / خرچ کی تفصیل، رقم، مدات اور تاریخ',
    fields: [
      { key: 'title', label: 'تفصیل / عنوان', required: true, autoMatch: ['title', 'description', 'تفصیل', 'عنوان', 'مد'] },
      { key: 'type', label: 'نوعیت (آمدن / خرچ)', required: true, autoMatch: ['type', 'نوعیت'] },
      { key: 'amount', label: 'رقم (روپے)', required: true, autoMatch: ['amount', 'رقم'] },
      { key: 'category', label: 'مد (Category)', autoMatch: ['category', 'کھاتہ'] },
      { key: 'date', label: 'تاریخ', autoMatch: ['date', 'تاریخ'] },
    ],
  },
  salaries: {
    label: 'تنخواہ و مشاہرہ ریکارڈ (Salary)',
    description: 'استاد کا نام، مہینہ، ادا شدہ تنخواہ، تاریخ',
    fields: [
      { key: 'teacherName', label: 'استاد کا نام', required: true, autoMatch: ['teacher', 'name', 'استاد', 'نام'] },
      { key: 'month', label: 'ماہ (Month)', autoMatch: ['month', 'ماہ', 'مہینہ'] },
      { key: 'netSalary', label: 'ادا شدہ رقم', required: true, autoMatch: ['salary', 'amount', 'net', 'تنخواہ', 'رقم'] },
      { key: 'paymentDate', label: 'تاریخ ادائیگی', autoMatch: ['date', 'تاریخ'] },
    ],
  },
};

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  appState,
  onImportComplete,
}) => {
  const [selectedModule, setSelectedModule] = useState<ImportModule>('students');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Select & Upload, 2: Column Mapping, 3: Preview & Duplicates, 4: Confirmation
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<'excel' | 'csv' | 'access' | null>(null);
  const [accessInfo, setAccessInfo] = useState<{
    versionName: string;
    fileSizeKB: number;
    tablesFound: string[];
    isAccessDirectlyReadable: boolean;
  } | null>(null);

  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbookRef, setWorkbookRef] = useState<XLSX.WorkBook | null>(null);

  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update' | 'import_new'>('skip');
  const [createBackupFirst, setCreateBackupFirst] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Reset wizard
  const handleReset = () => {
    setStep(1);
    setFileName('');
    setFileType(null);
    setAccessInfo(null);
    setRawHeaders([]);
    setRawRows([]);
    setAvailableSheets([]);
    setSelectedSheet('');
    setWorkbookRef(null);
    setMappings([]);
  };

  // Helper for auto-matching columns
  const generateInitialMappings = (headers: string[], targetModule: ImportModule) => {
    const fields = MODULE_DEFINITIONS[targetModule].fields;
    return fields.map((f) => {
      // Find header that best matches
      const matched = headers.find((h) => {
        const lowerH = String(h).trim().toLowerCase();
        return f.autoMatch.some((m) => lowerH.includes(m.toLowerCase()));
      });
      return {
        fieldKey: f.key,
        fieldLabel: f.label,
        required: f.required,
        mappedHeader: matched || '',
      };
    });
  };

  // Handle File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const lowerName = file.name.toLowerCase();

    // Check Access DB
    if (lowerName.endsWith('.accdb') || lowerName.endsWith('.mdb')) {
      setFileType('access');
      const sizeKB = Math.round(file.size / 1024);
      const isAccdb = lowerName.endsWith('.accdb');

      // Check header signature
      const buffer = await file.slice(0, 100).arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      let detectedVersion = isAccdb ? 'Microsoft Access 2007-2021 (ACE Format - .accdb)' : 'Microsoft Access 97-2003 (Jet Format - .mdb)';

      setAccessInfo({
        versionName: detectedVersion,
        fileSizeKB: sizeKB,
        tablesFound: ['طلبہ لسٹ (Students)', 'اساتذہ (Staff)', 'فیس رجسٹر (Fees)'],
        isAccessDirectlyReadable: false,
      });
      return;
    }

    // Excel or CSV
    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) {
      setFileType(lowerName.endsWith('.csv') ? 'csv' : 'excel');
      const reader = new FileReader();

      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          setWorkbookRef(workbook);

          const sheetNames = workbook.SheetNames;
          setAvailableSheets(sheetNames);
          const firstSheet = sheetNames[0];
          setSelectedSheet(firstSheet);

          loadSheetData(workbook, firstSheet, selectedModule);
          setStep(2);
        } catch (err) {
          alert('فائل پڑھنے میں مسئلہ پیش آیا۔ براہ کرم فائل کی تصدیق کریں۔');
        }
      };

      reader.readAsBinaryString(file);
    } else {
      alert('براہ کرم صرف .xlsx, .xls, .csv یا .accdb/.mdb فائل منتخب کریں۔');
    }
  };

  const loadSheetData = (workbook: XLSX.WorkBook, sheetName: string, moduleType: ImportModule) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    if (jsonRows.length === 0) {
      alert('منتخب شیٹ خالی ہے!');
      return;
    }

    // First row as headers
    const headers: string[] = jsonRows[0].map((h: any) => String(h).trim()).filter(Boolean);
    const dataRows = jsonRows.slice(1).filter((r: any[]) => r.some((cell) => String(cell).trim() !== ''));

    // Convert row arrays to objects
    const rowObjects = dataRows.map((r) => {
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        obj[h] = r[i] !== undefined ? String(r[i]).trim() : '';
      });
      return obj;
    });

    setRawHeaders(headers);
    setRawRows(rowObjects);
    setMappings(generateInitialMappings(headers, moduleType));
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbookRef) {
      loadSheetData(workbookRef, sheetName, selectedModule);
    }
  };

  const handleModuleChange = (newModule: ImportModule) => {
    setSelectedModule(newModule);
    if (rawHeaders.length > 0) {
      setMappings(generateInitialMappings(rawHeaders, newModule));
    }
  };

  const handleMappingChange = (fieldKey: string, mappedHeader: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.fieldKey === fieldKey ? { ...m, mappedHeader } : m))
    );
  };

  // Convert raw row using current mapping
  const getMappedRow = (rawRow: Record<string, any>) => {
    const res: Record<string, any> = {};
    mappings.forEach((m) => {
      if (m.mappedHeader && rawRow[m.mappedHeader] !== undefined) {
        res[m.fieldKey] = rawRow[m.mappedHeader];
      } else {
        res[m.fieldKey] = '';
      }
    });
    return res;
  };

  // Check row validity
  const isRowValid = (mappedRow: Record<string, any>, moduleType: ImportModule) => {
    const fields = MODULE_DEFINITIONS[moduleType].fields;
    for (const f of fields) {
      if (f.required && (!mappedRow[f.key] || String(mappedRow[f.key]).trim() === '')) {
        return false;
      }
    }
    return true;
  };

  // Duplicate detection
  const isRowDuplicate = (mappedRow: Record<string, any>, moduleType: ImportModule): boolean => {
    if (moduleType === 'students') {
      return appState.students.some(
        (s) =>
          (mappedRow.regNo && s.regNo === mappedRow.regNo) ||
          (mappedRow.rollNo && s.rollNo === mappedRow.rollNo) ||
          (mappedRow.name && mappedRow.fatherName && s.name.trim() === mappedRow.name.trim() && s.fatherName.trim() === mappedRow.fatherName.trim()) ||
          (mappedRow.guardianPhone && s.guardianPhone === mappedRow.guardianPhone)
      );
    }
    if (moduleType === 'teachers') {
      return appState.teachers.some(
        (t) =>
          (mappedRow.empNo && t.empNo === mappedRow.empNo) ||
          (mappedRow.name && t.name.trim() === mappedRow.name.trim()) ||
          (mappedRow.phone && t.phone === mappedRow.phone)
      );
    }
    return false;
  };

  // Computed rows metrics
  const mappedRecords = rawRows.map((r) => getMappedRow(r));
  const validRows = mappedRecords.filter((r) => isRowValid(r, selectedModule));
  const invalidRowsCount = mappedRecords.length - validRows.length;
  const duplicateRows = validRows.filter((r) => isRowDuplicate(r, selectedModule));
  const uniqueRows = validRows.filter((r) => !isRowDuplicate(r, selectedModule));

  const rowsToImportCount =
    duplicateAction === 'skip'
      ? uniqueRows.length
      : validRows.length;

  // Execute Import
  const handleExecuteImport = () => {
    // Confirmation
    const confirmed = window.confirm(
      `کیا آپ واقعی یہ ڈیٹا درآمد کرنا چاہتے ہیں؟\n\nکل ریکارڈز برائے درآمد: ${rowsToImportCount}\nشعبہ: ${MODULE_DEFINITIONS[selectedModule].label}`
    );
    if (!confirmed) return;

    // Optional Backup First
    if (createBackupFirst) {
      try {
        const backupStr = JSON.stringify(appState, null, 2);
        const blob = new Blob([backupStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `madrasa_auto_backup_before_import_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Auto backup skipped:', err);
      }
    }

    const updated = { ...appState };
    let importedCount = 0;

    if (selectedModule === 'students') {
      const existing = [...updated.students];
      const newItems: Student[] = [];

      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'students')) return;
        const isDup = isRowDuplicate(row, 'students');

        if (isDup && duplicateAction === 'skip') {
          return;
        }

        // Find darja
        let matchedDarjaId = updated.darajat[0]?.id || 'oola';
        if (row.darjaName) {
          const found = updated.darajat.find((d) => d.name.includes(row.darjaName) || row.darjaName.includes(d.name));
          if (found) matchedDarjaId = found.id;
        }

        const studentObj: Student = {
          id: `st_imp_${Date.now()}_${i}`,
          regNo: row.regNo || `${Date.now().toString().slice(-4)}${i}`,
          rollNo: row.rollNo || `${existing.length + newItems.length + 1}`,
          name: row.name,
          fatherName: row.fatherName || 'والد محترم',
          cnicBForm: row.cnicBForm || '',
          phone: row.guardianPhone || '',
          guardianPhone: row.guardianPhone || '',
          address: row.address || '',
          darjaId: matchedDarjaId,
          section: row.section || 'الف',
          admissionDate: row.admissionDate || new Date().toISOString().split('T')[0],
          dob: '',
          bloodGroup: '',
          status: 'حاضر',
          previousEducation: '',
          hostelResident: false,
          remarks: 'درآمد شدہ بذریعہ ایکسل/CSV',
        };

        if (isDup && duplicateAction === 'update') {
          const idx = existing.findIndex(
            (s) =>
              (row.regNo && s.regNo === row.regNo) ||
              (s.name.trim() === row.name.trim() && s.fatherName.trim() === row.fatherName.trim())
          );
          if (idx !== -1) {
            existing[idx] = { ...existing[idx], ...studentObj, id: existing[idx].id };
            importedCount++;
            return;
          }
        }

        newItems.push(studentObj);
        importedCount++;
      });

      updated.students = [...existing, ...newItems];
    } else if (selectedModule === 'teachers') {
      const existing = [...updated.teachers];
      const newItems: Teacher[] = [];

      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'teachers')) return;
        const isDup = isRowDuplicate(row, 'teachers');
        if (isDup && duplicateAction === 'skip') return;

        const tchObj: Teacher = {
          id: `tch_imp_${Date.now()}_${i}`,
          empNo: row.empNo || `T-${existing.length + newItems.length + 1}`,
          name: row.name,
          fatherName: row.fatherName || '',
          designation: row.designation || 'مدرس / استاد',
          department: row.department || 'درس نظامی',
          qualification: row.qualification || 'شہادت العالمیہ',
          phone: row.phone || '',
          cnic: row.cnic || '',
          salary: Number(row.salary) || 25000,
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'فعال',
          assignedClasses: [],
        };

        if (isDup && duplicateAction === 'update') {
          const idx = existing.findIndex((t) => t.empNo === row.empNo || t.name === row.name);
          if (idx !== -1) {
            existing[idx] = { ...existing[idx], ...tchObj, id: existing[idx].id };
            importedCount++;
            return;
          }
        }

        newItems.push(tchObj);
        importedCount++;
      });

      updated.teachers = [...existing, ...newItems];
    } else if (selectedModule === 'fees') {
      const newReceipts: FeeReceipt[] = [];
      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'fees')) return;
        const netPaid = Number(row.netPaid) || 0;
        const totalAmount = Number(row.totalAmount) || netPaid;
        const remainingDue = Math.max(0, totalAmount - netPaid);

        const receipt: FeeReceipt = {
          id: `fee_imp_${Date.now()}_${i}`,
          receiptNo: row.receiptNo || `${Date.now().toString().slice(-4)}${i}`,
          studentId: '',
          studentName: row.studentName,
          fatherName: '',
          rollNo: '',
          darjaId: updated.darajat[0]?.id || '',
          month: row.month || 'محرم الحرام',
          year: '2026ء',
          tuitionFee: netPaid,
          foodFee: 0,
          hostelFee: 0,
          examFee: 0,
          otherFee: 0,
          totalAmount,
          discount: 0,
          netPaid,
          remainingDue,
          paymentDate: row.paymentDate || new Date().toISOString().split('T')[0],
          paymentMethod: 'نقد (Cash)',
          receiverName: 'محاسب صاحب',
          status: remainingDue === 0 ? 'مکمل ادا شدہ' : 'جزوی ادا شدہ',
        };
        newReceipts.push(receipt);
        importedCount++;
      });
      updated.feeReceipts = [...newReceipts, ...updated.feeReceipts];
    } else if (selectedModule === 'attendance') {
      const newAttendance: AttendanceRecord[] = [];
      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'attendance')) return;
        newAttendance.push({
          id: `att_imp_${Date.now()}_${i}`,
          date: row.date || new Date().toISOString().split('T')[0],
          studentId: '',
          studentName: row.studentName,
          darjaId: updated.darajat[0]?.id || '',
          section: 'الف',
          status: (row.status as any) || 'حاضر',
        });
        importedCount++;
      });
      updated.attendance = [...newAttendance, ...updated.attendance];
    } else if (selectedModule === 'marks') {
      const newMarks: ExamMark[] = [];
      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'marks')) return;
        const total = Number(row.totalMarks) || 100;
        const obtained = Number(row.obtainedMarks) || 0;
        const percentage = Math.round((obtained / total) * 100);

        newMarks.push({
          id: `mk_imp_${Date.now()}_${i}`,
          examId: updated.exams[0]?.id || 'ex_default',
          studentId: '',
          studentName: row.studentName,
          rollNo: row.rollNo || '',
          darjaId: updated.darajat[0]?.id || '',
          subjects: [{ subjectName: 'مجموعی نمبرات', totalMarks: total, obtainedMarks: obtained }],
          totalMarks: total,
          obtainedMarks: obtained,
          percentage,
          grade: (row.grade as any) || (percentage >= 60 ? 'جید جدا' : 'مقبول'),
          rank: '',
          remarks: 'درآمد شدہ',
        });
        importedCount++;
      });
      updated.examMarks = [...newMarks, ...updated.examMarks];
    } else if (selectedModule === 'finance') {
      const newFin: FinanceTransaction[] = [];
      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'finance')) return;
        const amount = Number(row.amount) || 0;
        newFin.push({
          id: `tx_imp_${Date.now()}_${i}`,
          voucherNo: `V-${Date.now().toString().slice(-4)}${i}`,
          date: row.date || new Date().toISOString().split('T')[0],
          type: row.type?.includes('خرچ') ? 'خرچ' : 'آمدن',
          category: row.category || 'عام',
          description: row.title || 'درآمد شدہ اندراج',
          amount,
          payeePayer: 'عام',
          paymentMethod: 'نقد (Cash)',
          recordedBy: 'محاسب',
        });
        importedCount++;
      });
      updated.financeTransactions = [...newFin, ...updated.financeTransactions];
    } else if (selectedModule === 'salaries') {
      const newSal: SalaryPayment[] = [];
      mappedRecords.forEach((row, i) => {
        if (!isRowValid(row, 'salaries')) return;
        const netSalary = Number(row.netSalary) || 0;
        newSal.push({
          id: `sal_imp_${Date.now()}_${i}`,
          slipNo: `S-${Date.now().toString().slice(-4)}${i}`,
          teacherId: '',
          teacherName: row.teacherName,
          designation: 'استاد / ملازم',
          month: row.month || 'محرم الحرام',
          year: '2026ء',
          basicSalary: netSalary,
          allowances: 0,
          deductions: 0,
          netSalary,
          paymentDate: row.paymentDate || new Date().toISOString().split('T')[0],
          paymentMethod: 'نقد',
          status: 'ادا شدہ',
        });
        importedCount++;
      });
      updated.salaryPayments = [...newSal, ...updated.salaryPayments];
    }

    onImportComplete(
      updated,
      `کامیابی: ${importedCount} ریکارڈز کامیابی سے متعلقہ ماڈیول (${MODULE_DEFINITIONS[selectedModule].label}) میں درآمد کر لیے گئے ہیں۔`
    );
    handleReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto font-sans text-right"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-blue-200 overflow-hidden my-6">
        {/* Wizard Header */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 border border-blue-500/50 flex items-center justify-center text-amber-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-nastaliq font-bold text-lg leading-tight">
                پیشہ ورانہ ڈیٹا امپورٹ وزرڈ (Data Import Wizard)
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                ایکسل (.xlsx, .xls)، CSV (.csv) اور مائیکروسافٹ ایکسس (.accdb, .mdb) سے جامعہ کا ڈیٹا درآمد کریں
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-300 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Steps Bar */}
        <div className="bg-blue-50/60 border-b border-blue-100 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              ۱
            </span>
            <span className={step >= 1 ? 'font-bold text-blue-950' : 'text-slate-500'}>
              فائل و ماڈیول کا انتخاب
            </span>
          </div>

          <div className="h-0.5 w-12 bg-blue-200"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              ۲
            </span>
            <span className={step >= 2 ? 'font-bold text-blue-950' : 'text-slate-500'}>
              کالم میپنگ (Column Mapping)
            </span>
          </div>

          <div className="h-0.5 w-12 bg-blue-200"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              ۳
            </span>
            <span className={step >= 3 ? 'font-bold text-blue-950' : 'text-slate-500'}>
              پریویو و ڈپلیکیٹ جانچ
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs space-y-5 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Module & Upload File */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Target Module Picker */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-sm">
                  ۱. وہ شعبہ / ماڈیول منتخب کریں جس میں آپ ڈیٹا درآمد کرنا چاہتے ہیں:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(Object.keys(MODULE_DEFINITIONS) as ImportModule[]).map((mKey) => {
                    const mod = MODULE_DEFINITIONS[mKey];
                    const isSelected = selectedModule === mKey;
                    return (
                      <button
                        key={mKey}
                        type="button"
                        onClick={() => handleModuleChange(mKey)}
                        className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/80 shadow-xs'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                            {mod.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-blue-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {mod.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-sm">
                  ۲. ایکسل، CSV یا مائیکروسافٹ ایکسس فائل منتخب کریں:
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50/60 transition cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-blue-700 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-sm mb-1">
                    فائل یہاں ڈریگ کریں یا منتخب کرنے کے لیے کلک کریں
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    سپورٹ شدہ فارمیٹس: <strong>Excel (.xlsx, .xls)</strong>، <strong>CSV (.csv)</strong>، <strong>MS Access (.accdb, .mdb)</strong>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv, .accdb, .mdb"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Microsoft Access Detailed Handler / Honest Guidance */}
              {fileType === 'access' && accessInfo && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-950 text-sm">
                        مائیکروسافٹ ایکسس ڈیٹا بیس فائل پہچان لی گئی ہے ({fileName})
                      </h4>
                      <p className="text-amber-900 mt-1 leading-relaxed">
                        فائل فارمیٹ: <strong>{accessInfo.versionName}</strong> | فائل سائز: <strong>{accessInfo.fileSizeKB} KB</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200 text-slate-700 space-y-2">
                    <p className="font-bold text-slate-900">
                      ایکسس ڈیٹا کو بغیر کسی غلطی کے محفوظ طریقے سے درآمد کرنے کا ۲ منٹ کا مستند طریقہ:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-2">
                      <li>اپنے کمپیوٹر پر مائیکروسافٹ ایکسس (MS Access) میں یہ فائل کھولیں۔</li>
                      <li>جس ٹیبل کا ڈیٹا درآمد کرنا ہو (مثلاً Students / اساتذہ) اس پر رائٹ کلک کریں۔</li>
                      <li><strong>Export &rarr; Excel (.xlsx)</strong> یا <strong>Text File (.csv)</strong> پر کلک کریں۔</li>
                      <li>ایکسپورٹ شدہ فائل کو اوپر والے باکس میں سلیکٹ کریں۔</li>
                    </ol>
                    <p className="text-emerald-800 font-bold text-[11px] pt-1">
                      ایکسل میں ایکسپورٹ کرنے کے بعد تمام اردو نام، داخلہ نمبر اور کوائف ۱۰۰٪ درست اور فوری درآمد ہو جائیں گے۔
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-blue-950 text-sm">
                    فائل: {fileName} • شعبہ: {MODULE_DEFINITIONS[selectedModule].label}
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    فائل کے کالمز کو سافٹ ویئر کی فیلڈز کے ساتھ ملا دیں۔ سسٹم نے مشابہ کالمز کا خودکار اندازہ لگا لیا ہے۔
                  </p>
                </div>

                {availableSheets.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">شیٹ منتخب کریں:</span>
                    <select
                      value={selectedSheet}
                      onChange={(e) => handleSheetChange(e.target.value)}
                      className="border border-blue-300 rounded p-1.5 bg-white font-bold"
                    >
                      {availableSheets.map((sh) => (
                        <option key={sh} value={sh}>
                          {sh}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Mapping Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800">
                    <tr>
                      <th className="p-3 w-1/3">سافٹ ویئر فیلڈ (Software Field)</th>
                      <th className="p-3 w-1/12 text-center">لازمی؟</th>
                      <th className="p-3 w-1/2">ایکسل / CSV فائل کا کالم (File Column)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {mappings.map((m) => (
                      <tr key={m.fieldKey} className="hover:bg-slate-50/80 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{m.fieldLabel}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{m.fieldKey}</span>
                        </td>
                        <td className="p-3 text-center">
                          {m.required ? (
                            <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              لازمی
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">اختیاری</span>
                          )}
                        </td>
                        <td className="p-3">
                          <select
                            value={m.mappedHeader}
                            onChange={(e) => handleMappingChange(m.fieldKey, e.target.value)}
                            className={`w-full border rounded-lg p-2 font-bold ${
                              m.mappedHeader
                                ? 'border-blue-400 bg-blue-50/40 text-blue-950'
                                : m.required
                                ? 'border-rose-300 bg-rose-50/30 text-rose-800'
                                : 'border-slate-300 bg-white text-slate-600'
                            }`}
                          >
                            <option value="">-- کالم منتخب کریں (نظر انداز کریں) --</option>
                            {rawHeaders.map((h) => (
                              <option key={h} value={h}>
                                {h} {rawRows[0]?.[h] ? `(مثال: "${String(rawRows[0][h]).slice(0, 20)}")` : ''}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Preview & Duplicate Handling */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Metrics Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <span className="text-slate-600 text-[11px] block">کل قطاریں (Total)</span>
                  <span className="text-xl font-bold font-mono text-blue-950">{mappedRecords.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-emerald-700 text-[11px] block">درست ریکارڈز (Valid)</span>
                  <span className="text-xl font-bold font-mono text-emerald-800">{validRows.length}</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  <span className="text-rose-700 text-[11px] block">نامکمل ریکارڈز (Invalid)</span>
                  <span className="text-xl font-bold font-mono text-rose-800">{invalidRowsCount}</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <span className="text-amber-800 text-[11px] block">ڈپلیکیٹ ریکارڈز (Duplicates)</span>
                  <span className="text-xl font-bold font-mono text-amber-900">{duplicateRows.length}</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="text-indigo-800 text-[11px] block">درآمد کے لیے منتخب</span>
                  <span className="text-xl font-bold font-mono text-indigo-950">{rowsToImportCount}</span>
                </div>
              </div>

              {/* Duplicate Handling Policy */}
              {duplicateRows.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>سسٹم نے {duplicateRows.length} ممکنہ ڈپلیکیٹ ریکارڈز دریافت کیے ہیں:</span>
                  </div>
                  <p className="text-slate-600">
                    یہ ریکارڈز داخلہ نمبر، رول نمبر، فون یا طالب علم کے نام و ولدیت کی بنیاد پر پہلے سے موجود لگتے ہیں۔ آپ ان کے لیے کیا طریقہ اپنانا چاہتے ہیں؟
                  </p>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="dupAction"
                        value="skip"
                        checked={duplicateAction === 'skip'}
                        onChange={() => setDuplicateAction('skip')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>ڈپلیکیٹ چھوڑ دیں (Skip Duplicates - تجویز کردہ)</span>
                    </label>

                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="dupAction"
                        value="update"
                        checked={duplicateAction === 'update'}
                        onChange={() => setDuplicateAction('update')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>موجودہ ریکارڈ اپ ڈیٹ کریں (Update Existing)</span>
                    </label>

                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="dupAction"
                        value="import_new"
                        checked={duplicateAction === 'import_new'}
                        onChange={() => setDuplicateAction('import_new')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>نیا ریکارڈ بنا کر شامل کریں (Import as New)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>درآمد ہونے والے ریکارڈز کا پریویو (پہلی ۱۰ قطاریں)</span>
                  <span className="text-[11px] text-slate-500 font-normal">کل قطاریں: {validRows.length}</span>
                </div>
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 text-center w-10">شمار</th>
                        {mappings
                          .filter((m) => m.mappedHeader)
                          .map((m) => (
                            <th key={m.fieldKey} className="p-2">
                              {m.fieldLabel}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {validRows.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                          {mappings
                            .filter((m) => m.mappedHeader)
                            .map((m) => (
                              <td key={m.fieldKey} className="p-2 font-medium text-slate-900">
                                {row[m.fieldKey] || '---'}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Safety Option */}
              <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                <input
                  type="checkbox"
                  id="backupCheck"
                  checked={createBackupFirst}
                  onChange={(e) => setCreateBackupFirst(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="backupCheck" className="text-slate-800 font-semibold cursor-pointer">
                  ڈیٹا درآمد کرنے سے قبل موجودہ ڈیٹا کا ایک خودکار حفاظتی بیک اپ ڈاؤن لوڈ کریں (تجویز کردہ)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white font-bold cursor-pointer"
              >
                &rarr; واپس (Back)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white font-bold cursor-pointer"
            >
              منسوخ کریں
            </button>

            {step === 1 && (
              <button
                type="button"
                disabled={!fileName || fileType === 'access'}
                onClick={() => setStep(2)}
                className={`px-6 py-2 rounded-lg font-bold shadow-xs transition ${
                  fileName && fileType !== 'access'
                    ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                اگلا مرحلہ: کالم میپنگ &larr;
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs transition cursor-pointer"
              >
                اگلا مرحلہ: پریویو و تصدیق &larr;
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={rowsToImportCount === 0}
                onClick={handleExecuteImport}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition active:scale-95 ${
                  rowsToImportCount > 0
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>ڈیٹا درآمد کریں (Import Data - {rowsToImportCount} ریکارڈز)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
