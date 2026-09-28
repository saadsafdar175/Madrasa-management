import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Award,
  BookMarked,
  Scroll,
  FileSpreadsheet,
  Receipt,
  Wallet,
  Coins,
  Settings,
  MessageSquare
} from 'lucide-react';
import { NavModule } from '../types';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  madrasaName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  madrasaName,
}) => {
  const menuItems = [
    { id: 'dashboard' as NavModule, label: 'ڈیش بورڈ (خلاصہ)', icon: LayoutDashboard },
    { id: 'students' as NavModule, label: 'طلبہ کرام (داخلہ و کوائف)', icon: Users },
    { id: 'teachers' as NavModule, label: 'اساتذہ و عملہ', icon: GraduationCap },
    { id: 'attendance' as NavModule, label: 'حاضری رجسٹر', icon: CalendarCheck },
    { id: 'hifz' as NavModule, label: 'شعبہ حفظ القرآن', icon: BookOpen },
    { id: 'tajweed' as NavModule, label: 'شعبہ تجوید و قراءت', icon: Award },
    { id: 'dars-nizami' as NavModule, label: 'شعبہ درسِ نظامی', icon: BookMarked },
    { id: 'daur-hadith' as NavModule, label: 'دورۂ حدیث شریف', icon: Scroll },
    { id: 'exams' as NavModule, label: 'امتحانات، مارکس و DMC', icon: FileSpreadsheet },
    { id: 'fees' as NavModule, label: 'فیس و چندہ رسیدات', icon: Receipt },
    { id: 'finance' as NavModule, label: 'مالیات و بیت المال', icon: Wallet },
    { id: 'salaries' as NavModule, label: 'تنخواہ و مشاہرہ', icon: Coins },
    { id: 'whatsapp' as NavModule, label: 'واٹس ایپ میسجنگ (WhatsApp)', icon: MessageSquare, badge: 'جدید' },
    { id: 'settings' as NavModule, label: 'ترتیبات و معلوماتِ جامعہ', icon: Settings },
  ];

  return (
    <aside className="no-print w-64 bg-[#0B1E36] text-blue-100 flex flex-col h-screen border-l border-blue-900/60 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-blue-900/60 bg-[#08172b] flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-800 border border-blue-600 flex items-center justify-center text-amber-300 font-bold text-xl shadow-xs">
          ☪
        </div>
        <div className="overflow-hidden">
          <h1 className="font-nastaliq font-bold text-white text-base leading-tight truncate" title={madrasaName}>
            {madrasaName}
          </h1>
          <p className="text-[11px] text-blue-300 font-sans">
            نظامِ انتظام و پرنٹنگ سسٹم
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-blue-900">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-right cursor-pointer ${
                isActive
                  ? 'bg-blue-700 text-white font-bold shadow-md border-r-4 border-amber-400'
                  : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-blue-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status / Clean Data Note */}
      <div className="p-3 border-t border-blue-900/60 bg-[#08172b] text-[11px] text-blue-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          زیرو ڈیمو ڈیٹا فعال ہے
        </span>
        <span className="font-mono text-[10px] text-blue-400">v2.1</span>
      </div>
    </aside>
  );
};
