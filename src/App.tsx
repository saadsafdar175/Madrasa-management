/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppState,
  NavModule,
  PrintPreviewData,
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
  WhatsAppMessage,
  WhatsAppTemplate
} from './types';
import {
  getInitialAppState,
  persistAppState,
  clearAllRecords
} from './services/storage';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { PrintModal } from './components/print/PrintModal';
import { WhatsAppModal } from './components/whatsapp/WhatsAppModal';
import { DataImportModal } from './components/import/DataImportModal';
import { loadStateFromIndexedDB } from './services/indexedDB';

// Modules
import { DashboardView } from './components/modules/DashboardView';
import { StudentsView } from './components/modules/StudentsView';
import { TeachersView } from './components/modules/TeachersView';
import { AttendanceView } from './components/modules/AttendanceView';
import { HifzView } from './components/modules/HifzView';
import { TajweedView } from './components/modules/TajweedView';
import { DarsNizamiView } from './components/modules/DarsNizamiView';
import { DaurHadithView } from './components/modules/DaurHadithView';
import { ExamsView } from './components/modules/ExamsView';
import { FeesView } from './components/modules/FeesView';
import { FinanceView } from './components/modules/FinanceView';
import { SalariesView } from './components/modules/SalariesView';
import { WhatsAppView } from './components/modules/WhatsAppView';
import { SettingsView } from './components/modules/SettingsView';

export default function App() {
  const [appState, setAppState] = useState<AppState>(getInitialAppState);
  const [currentModule, setCurrentModule] = useState<NavModule>('dashboard');
  const [printPreviewData, setPrintPreviewData] = useState<PrintPreviewData | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // WhatsApp Modal state
  const [whatsAppModalConfig, setWhatsAppModalConfig] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  } | null>(null);

  // Hydrate from IndexedDB on startup (if data exists in IndexedDB)
  useEffect(() => {
    loadStateFromIndexedDB().then((idbState) => {
      if (idbState && (idbState.students?.length > 0 || idbState.teachers?.length > 0 || idbState.feeReceipts?.length > 0)) {
        setAppState(idbState);
      }
    });
  }, []);

  // Auto-save changes to storage (LocalStorage + IndexedDB)
  useEffect(() => {
    persistAppState(appState);
  }, [appState]);

  // Handle open print preview
  const handleOpenPrint = (data: PrintPreviewData) => {
    setPrintPreviewData(data);
  };

  const handleImportComplete = (updatedState: AppState, message: string) => {
    setAppState(updatedState);
    alert(message);
  };

  // WhatsApp Handlers
  const handleOpenWhatsAppModal = (config: {
    recipientName: string;
    recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
    phone: string;
    defaultTemplateCategory?: string;
    dataVariables?: Record<string, string>;
  }) => {
    setWhatsAppModalConfig({
      isOpen: true,
      ...config,
    });
  };

  const handleRecordWhatsAppSent = (msg: WhatsAppMessage) => {
    setAppState((prev: AppState) => ({
      ...prev,
      whatsappHistory: [msg, ...prev.whatsappHistory],
    }));
  };

  const handleSaveWhatsAppTemplate = (tpl: WhatsAppTemplate) => {
    setAppState((prev: AppState) => {
      const exists = prev.whatsappTemplates.some(t => t.id === tpl.id);
      const updated = exists
        ? prev.whatsappTemplates.map(t => (t.id === tpl.id ? t : t))
        : [tpl, ...prev.whatsappTemplates];
      return { ...prev, whatsappTemplates: updated };
    });
  };

  const handleDeleteWhatsAppTemplate = (id: string) => {
    setAppState((prev: AppState) => ({
      ...prev,
      whatsappTemplates: prev.whatsappTemplates.filter(t => t.id !== id),
    }));
  };

  // Handlers for data operations
  const handleSaveStudent = (student: Student) => {
    setAppState((prev: AppState) => {
      const exists = prev.students.some((s: Student) => s.id === student.id);
      const updated = exists
        ? prev.students.map((s: Student) => (s.id === student.id ? student : s))
        : [student, ...prev.students];
      return { ...prev, students: updated };
    });
  };

  const handleDeleteStudent = (id: string) => {
    setAppState((prev: AppState) => ({
      ...prev,
      students: prev.students.filter((s: Student) => s.id !== id),
    }));
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    setAppState((prev: AppState) => {
      const exists = prev.teachers.some((t: Teacher) => t.id === teacher.id);
      const updated = exists
        ? prev.teachers.map((t: Teacher) => (t.id === teacher.id ? teacher : t))
        : [teacher, ...prev.teachers];
      return { ...prev, teachers: updated };
    });
  };

  const handleDeleteTeacher = (id: string) => {
    setAppState((prev: AppState) => ({
      ...prev,
      teachers: prev.teachers.filter((t: Teacher) => t.id !== id),
    }));
  };

  const handleSaveAttendanceBatch = (newRecords: AttendanceRecord[]) => {
    setAppState((prev: AppState) => {
      // replace matching dates/students or append
      const existing = prev.attendance.filter(
        (a: AttendanceRecord) => !newRecords.some(nr => nr.date === a.date && nr.studentId === a.studentId)
      );
      return { ...prev, attendance: [...newRecords, ...existing] };
    });
  };

  const handleSaveHifz = (record: HifzRecord) => {
    setAppState((prev: AppState) => ({ ...prev, hifzRecords: [record, ...prev.hifzRecords] }));
  };

  const handleDeleteHifz = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, hifzRecords: prev.hifzRecords.filter((r: HifzRecord) => r.id !== id) }));
  };

  const handleSaveTajweed = (record: TajweedRecord) => {
    setAppState((prev: AppState) => ({ ...prev, tajweedRecords: [record, ...prev.tajweedRecords] }));
  };

  const handleDeleteTajweed = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, tajweedRecords: prev.tajweedRecords.filter((r: TajweedRecord) => r.id !== id) }));
  };

  const handleSaveDarsNizami = (record: DarsNizamiRecord) => {
    setAppState((prev: AppState) => ({ ...prev, darsNizamiRecords: [record, ...prev.darsNizamiRecords] }));
  };

  const handleDeleteDarsNizami = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, darsNizamiRecords: prev.darsNizamiRecords.filter((r: DarsNizamiRecord) => r.id !== id) }));
  };

  const handleSaveDaurHadith = (record: DaurHadithRecord) => {
    setAppState((prev: AppState) => ({ ...prev, daurHadithRecords: [record, ...prev.daurHadithRecords] }));
  };

  const handleDeleteDaurHadith = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, daurHadithRecords: prev.daurHadithRecords.filter((r: DaurHadithRecord) => r.id !== id) }));
  };

  const handleSaveExam = (exam: Exam) => {
    setAppState((prev: AppState) => ({ ...prev, exams: [exam, ...prev.exams] }));
  };

  const handleSaveExamMark = (mark: ExamMark) => {
    setAppState((prev: AppState) => ({ ...prev, examMarks: [mark, ...prev.examMarks] }));
  };

  const handleDeleteExamMark = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, examMarks: prev.examMarks.filter((m: ExamMark) => m.id !== id) }));
  };

  const handleSaveFeeReceipt = (receipt: FeeReceipt) => {
    setAppState((prev: AppState) => ({ ...prev, feeReceipts: [receipt, ...prev.feeReceipts] }));
  };

  const handleDeleteFeeReceipt = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, feeReceipts: prev.feeReceipts.filter((f: FeeReceipt) => f.id !== id) }));
  };

  const handleSaveTransaction = (tx: FinanceTransaction) => {
    setAppState((prev: AppState) => ({ ...prev, financeTransactions: [tx, ...prev.financeTransactions] }));
  };

  const handleDeleteTransaction = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, financeTransactions: prev.financeTransactions.filter((t: FinanceTransaction) => t.id !== id) }));
  };

  const handleSaveSalaryPayment = (payment: SalaryPayment) => {
    setAppState((prev: AppState) => ({ ...prev, salaryPayments: [payment, ...prev.salaryPayments] }));
  };

  const handleDeleteSalaryPayment = (id: string) => {
    setAppState((prev: AppState) => ({ ...prev, salaryPayments: prev.salaryPayments.filter((s: SalaryPayment) => s.id !== id) }));
  };

  const handleSaveSettings = (settings: MadrasaSettings) => {
    setAppState((prev: AppState) => ({ ...prev, settings }));
  };

  const handleClearAll = () => {
    const cleared = clearAllRecords();
    setAppState(prev => ({
      ...prev,
      ...cleared,
    }));
  };

  const handleRestoreState = (newState: AppState) => {
    setAppState(newState);
  };

  // Titles mapping
  const titles: Record<NavModule, string> = {
    dashboard: 'ڈیش بورڈ - خلاصہ و سرگرمیاں',
    students: 'شعبہ طلبہ - داخلہ رجسٹر و پروفائلز',
    teachers: 'شعبہ اساتذہ و عملہ جامعہ',
    attendance: 'شعبہ حاضری - یومیہ و ماہانہ رجسٹر',
    hifz: 'شعبہ تحفیظ القرآن الکریم',
    tajweed: 'شعبہ تجوید و قراءت',
    'dars-nizami': 'شعبہ درسِ نظامی (عالیہ و ثانویہ)',
    'daur-hadith': 'دورۂ حدیث شریف (عالمیہ)',
    exams: 'امتحانات، کشف الدرجات و DMC',
    fees: 'فیس و چندہ وصولی و رسیدات',
    finance: 'بیت المال و مالیاتی حسابات',
    salaries: 'تنخواہ و مشاہرہ اساتذہ',
    whatsapp: 'واٹس ایپ رابطہ و میسجنگ سروس',
    settings: 'ترتیبات، معلوماتِ جامعہ و بیک اپ',
  };

  // Quick print handlers based on active module
  const getModuleQuickPrint = (): (() => void) | undefined => {
    switch (currentModule) {
      case 'dashboard':
      case 'students':
        return () => handleOpenPrint({ documentType: 'student-list', title: 'فہرستِ طلبہ کرام (داخلہ رجسٹر)' });
      case 'teachers':
        return () => handleOpenPrint({ documentType: 'teacher-list', title: 'فہرستِ اساتذہ کرام و عملہ جامعہ' });
      case 'attendance':
        return () => handleOpenPrint({ documentType: 'attendance-report', title: 'رپورٹِ حاضری طلبہ کرام' });
      case 'hifz':
        return () => handleOpenPrint({ documentType: 'hifz-report', title: 'شعبہ تحفیظ القرآن الکریم - کارکردگی رپورٹ' });
      case 'tajweed':
        return () => handleOpenPrint({ documentType: 'tajweed-report', title: 'شعبہ تجوید و قراءت رپورٹ' });
      case 'dars-nizami':
        return () => handleOpenPrint({ documentType: 'dars-nizami-report', title: 'شعبہ درس نظامی رپورٹ' });
      case 'daur-hadith':
        return () => handleOpenPrint({ documentType: 'daur-hadith-report', title: 'دورۂ حدیث شریف رپورٹ' });
      case 'exams':
        return () => handleOpenPrint({ documentType: 'marks-sheet', title: 'کشف الدرجات (مارکس شیٹ)' });
      case 'fees':
        return () => handleOpenPrint({ documentType: 'fee-report', title: 'رپورٹ فیس و بقایاجاتِ طلبہ' });
      case 'finance':
        return () => handleOpenPrint({ documentType: 'finance-report', title: 'مالیاتی گوشوارہ و روزنامچہ' });
      case 'salaries':
        return () => handleOpenPrint({ documentType: 'salary-report', title: 'تنخواہ و مشاہرہ رجسٹر' });
      default:
        return undefined;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F9] overflow-hidden font-sans text-slate-800" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        madrasaName={appState.settings.madrasaName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <HeaderBar
          settings={appState.settings}
          pageTitle={titles[currentModule]}
          onQuickPrint={getModuleQuickPrint()}
          quickPrintLabel="🖨 پرنٹ اسکرین"
        />

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-200">
          {currentModule === 'dashboard' && (
            <DashboardView
              state={appState}
              onNavigate={setCurrentModule}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'students' && (
            <StudentsView
              students={appState.students}
              darajat={appState.darajat}
              onSaveStudent={handleSaveStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenPrint={handleOpenPrint}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
              onOpenImportWizard={() => setIsImportModalOpen(true)}
            />
          )}

          {currentModule === 'teachers' && (
            <TeachersView
              teachers={appState.teachers}
              onSaveTeacher={handleSaveTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onOpenPrint={handleOpenPrint}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
            />
          )}

          {currentModule === 'attendance' && (
            <AttendanceView
              attendance={appState.attendance}
              students={appState.students}
              darajat={appState.darajat}
              onSaveAttendanceBatch={handleSaveAttendanceBatch}
              onOpenPrint={handleOpenPrint}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
            />
          )}

          {currentModule === 'hifz' && (
            <HifzView
              hifzRecords={appState.hifzRecords}
              students={appState.students}
              teachers={appState.teachers}
              onSaveRecord={handleSaveHifz}
              onDeleteRecord={handleDeleteHifz}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'tajweed' && (
            <TajweedView
              tajweedRecords={appState.tajweedRecords}
              students={appState.students}
              onSaveRecord={handleSaveTajweed}
              onDeleteRecord={handleDeleteTajweed}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'dars-nizami' && (
            <DarsNizamiView
              darsNizamiRecords={appState.darsNizamiRecords}
              students={appState.students}
              darajat={appState.darajat}
              onSaveRecord={handleSaveDarsNizami}
              onDeleteRecord={handleDeleteDarsNizami}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'daur-hadith' && (
            <DaurHadithView
              daurHadithRecords={appState.daurHadithRecords}
              students={appState.students}
              onSaveRecord={handleSaveDaurHadith}
              onDeleteRecord={handleDeleteDaurHadith}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'exams' && (
            <ExamsView
              exams={appState.exams}
              examMarks={appState.examMarks}
              students={appState.students}
              darajat={appState.darajat}
              onSaveExam={handleSaveExam}
              onSaveExamMark={handleSaveExamMark}
              onDeleteExamMark={handleDeleteExamMark}
              onOpenPrint={handleOpenPrint}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
            />
          )}

          {currentModule === 'fees' && (
            <FeesView
              feeReceipts={appState.feeReceipts}
              students={appState.students}
              darajat={appState.darajat}
              onSaveFeeReceipt={handleSaveFeeReceipt}
              onDeleteFeeReceipt={handleDeleteFeeReceipt}
              onOpenPrint={handleOpenPrint}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
            />
          )}

          {currentModule === 'finance' && (
            <FinanceView
              financeTransactions={appState.financeTransactions}
              onSaveTransaction={handleSaveTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'salaries' && (
            <SalariesView
              salaryPayments={appState.salaryPayments}
              teachers={appState.teachers}
              onSavePayment={handleSaveSalaryPayment}
              onDeletePayment={handleDeleteSalaryPayment}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentModule === 'whatsapp' && (
            <WhatsAppView
              students={appState.students}
              teachers={appState.teachers}
              feeReceipts={appState.feeReceipts}
              attendance={appState.attendance}
              examMarks={appState.examMarks}
              templates={appState.whatsappTemplates}
              history={appState.whatsappHistory}
              darajat={appState.darajat}
              onSaveTemplate={handleSaveWhatsAppTemplate}
              onDeleteTemplate={handleDeleteWhatsAppTemplate}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
            />
          )}

          {currentModule === 'settings' && (
            <SettingsView
              settings={appState.settings}
              darajat={appState.darajat}
              onSaveSettings={handleSaveSettings}
              onClearAllRecords={handleClearAll}
              fullState={appState}
              onRestoreState={handleRestoreState}
              onOpenImportWizard={() => setIsImportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Print Preview Modal */}
      {printPreviewData && (
        <PrintModal
          previewData={printPreviewData}
          settings={appState.settings}
          darajat={appState.darajat}
          students={appState.students}
          teachers={appState.teachers}
          attendance={appState.attendance}
          hifzRecords={appState.hifzRecords}
          tajweedRecords={appState.tajweedRecords}
          darsNizamiRecords={appState.darsNizamiRecords}
          daurHadithRecords={appState.daurHadithRecords}
          exams={appState.exams}
          examMarks={appState.examMarks}
          feeReceipts={appState.feeReceipts}
          financeTransactions={appState.financeTransactions}
          salaryPayments={appState.salaryPayments}
          onClose={() => setPrintPreviewData(null)}
        />
      )}

      {/* WhatsApp Modal */}
      {whatsAppModalConfig && whatsAppModalConfig.isOpen && (
        <WhatsAppModal
          isOpen={whatsAppModalConfig.isOpen}
          recipientName={whatsAppModalConfig.recipientName}
          recipientType={whatsAppModalConfig.recipientType}
          phone={whatsAppModalConfig.phone}
          defaultTemplateCategory={whatsAppModalConfig.defaultTemplateCategory}
          dataVariables={whatsAppModalConfig.dataVariables}
          templates={appState.whatsappTemplates}
          onRecordMessageSent={handleRecordWhatsAppSent}
          onClose={() => setWhatsAppModalConfig(null)}
        />
      )}

      {/* Data Import Wizard Modal */}
      {isImportModalOpen && (
        <DataImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          appState={appState}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
}
