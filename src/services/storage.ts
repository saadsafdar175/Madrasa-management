import {
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
  MadrasaSettings,
  Darja,
  AppState,
  WhatsAppMessage,
  WhatsAppTemplate
} from '../types';
import { DEFAULT_DARAJAT, DEFAULT_SETTINGS, DEFAULT_WHATSAPP_TEMPLATES } from '../constants';
import { saveStateToIndexedDB } from './indexedDB';

const STORAGE_KEYS = {
  SETTINGS: 'madrasa_settings_v2',
  DARAJAT: 'madrasa_darajat_v2',
  STUDENTS: 'madrasa_students_v2',
  TEACHERS: 'madrasa_teachers_v2',
  ATTENDANCE: 'madrasa_attendance_v2',
  HIFZ: 'madrasa_hifz_v2',
  TAJWEED: 'madrasa_tajweed_v2',
  DARS_NIZAMI: 'madrasa_dars_nizami_v2',
  DAUR_HADITH: 'madrasa_daur_hadith_v2',
  EXAMS: 'madrasa_exams_v2',
  MARKS: 'madrasa_marks_v2',
  FEES: 'madrasa_fees_v2',
  FINANCE: 'madrasa_finance_v2',
  SALARY: 'madrasa_salary_v2',
  WHATSAPP_HISTORY: 'madrasa_whatsapp_history_v2',
  WHATSAPP_TEMPLATES: 'madrasa_whatsapp_templates_v2',
};

// Guarantee: ZERO DEMO/SAMPLE RECORDS
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

// Initial state strictly with ZERO records in all tables
export const getInitialAppState = (): AppState => {
  return {
    settings: loadData<MadrasaSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    darajat: loadData<Darja[]>(STORAGE_KEYS.DARAJAT, DEFAULT_DARAJAT),
    students: loadData<Student[]>(STORAGE_KEYS.STUDENTS, []),
    teachers: loadData<Teacher[]>(STORAGE_KEYS.TEACHERS, []),
    attendance: loadData<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []),
    hifzRecords: loadData<HifzRecord[]>(STORAGE_KEYS.HIFZ, []),
    tajweedRecords: loadData<TajweedRecord[]>(STORAGE_KEYS.TAJWEED, []),
    darsNizamiRecords: loadData<DarsNizamiRecord[]>(STORAGE_KEYS.DARS_NIZAMI, []),
    daurHadithRecords: loadData<DaurHadithRecord[]>(STORAGE_KEYS.DAUR_HADITH, []),
    exams: loadData<Exam[]>(STORAGE_KEYS.EXAMS, []),
    examMarks: loadData<ExamMark[]>(STORAGE_KEYS.MARKS, []),
    feeReceipts: loadData<FeeReceipt[]>(STORAGE_KEYS.FEES, []),
    financeTransactions: loadData<FinanceTransaction[]>(STORAGE_KEYS.FINANCE, []),
    salaryPayments: loadData<SalaryPayment[]>(STORAGE_KEYS.SALARY, []),
    whatsappHistory: loadData<WhatsAppMessage[]>(STORAGE_KEYS.WHATSAPP_HISTORY, []),
    whatsappTemplates: loadData<WhatsAppTemplate[]>(STORAGE_KEYS.WHATSAPP_TEMPLATES, DEFAULT_WHATSAPP_TEMPLATES),
  };
};

export const persistAppState = (state: AppState) => {
  saveData(STORAGE_KEYS.SETTINGS, state.settings);
  saveData(STORAGE_KEYS.DARAJAT, state.darajat);
  saveData(STORAGE_KEYS.STUDENTS, state.students);
  saveData(STORAGE_KEYS.TEACHERS, state.teachers);
  saveData(STORAGE_KEYS.ATTENDANCE, state.attendance);
  saveData(STORAGE_KEYS.HIFZ, state.hifzRecords);
  saveData(STORAGE_KEYS.TAJWEED, state.tajweedRecords);
  saveData(STORAGE_KEYS.DARS_NIZAMI, state.darsNizamiRecords);
  saveData(STORAGE_KEYS.DAUR_HADITH, state.daurHadithRecords);
  saveData(STORAGE_KEYS.EXAMS, state.exams);
  saveData(STORAGE_KEYS.MARKS, state.examMarks);
  saveData(STORAGE_KEYS.FEES, state.feeReceipts);
  saveData(STORAGE_KEYS.FINANCE, state.financeTransactions);
  saveData(STORAGE_KEYS.SALARY, state.salaryPayments);
  saveData(STORAGE_KEYS.WHATSAPP_HISTORY, state.whatsappHistory);
  saveData(STORAGE_KEYS.WHATSAPP_TEMPLATES, state.whatsappTemplates);

  // Store in IndexedDB for robust offline persistence
  saveStateToIndexedDB(state);
};

export const clearAllRecords = (): Partial<AppState> => {
  // Clear all storage keys for records while keeping settings and Darajat
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TEACHERS);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.HIFZ);
  localStorage.removeItem(STORAGE_KEYS.TAJWEED);
  localStorage.removeItem(STORAGE_KEYS.DARS_NIZAMI);
  localStorage.removeItem(STORAGE_KEYS.DAUR_HADITH);
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  localStorage.removeItem(STORAGE_KEYS.MARKS);
  localStorage.removeItem(STORAGE_KEYS.FEES);
  localStorage.removeItem(STORAGE_KEYS.FINANCE);
  localStorage.removeItem(STORAGE_KEYS.SALARY);
  localStorage.removeItem(STORAGE_KEYS.WHATSAPP_HISTORY);

  // Also remove older storage versions if any existed
  const keysToRemove = [
    'madrasa_students',
    'madrasa_teachers',
    'madrasa_attendance',
    'madrasa_hifz',
    'madrasa_tajweed',
    'madrasa_dars_nizami',
    'madrasa_daur_hadith',
    'madrasa_exams',
    'madrasa_marks',
    'madrasa_fees',
    'madrasa_finance',
    'madrasa_salary',
    'madrasa_whatsapp_history'
  ];
  keysToRemove.forEach(k => localStorage.removeItem(k));

  return {
    students: [],
    teachers: [],
    attendance: [],
    hifzRecords: [],
    tajweedRecords: [],
    darsNizamiRecords: [],
    daurHadithRecords: [],
    exams: [],
    examMarks: [],
    feeReceipts: [],
    financeTransactions: [],
    salaryPayments: [],
    whatsappHistory: [],
  };
};
