import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, Edit, Check, AlertCircle, WifiOff } from 'lucide-react';
import { WhatsAppTemplate, WhatsAppMessage } from '../../types';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientType: 'طالب علم / سرپرست' | 'استاد' | 'دیگر';
  phone: string;
  defaultTemplateCategory?: string;
  dataVariables?: {
    student_name?: string;
    father_name?: string;
    class?: string;
    date?: string;
    fee_amount?: string;
    result?: string;
    remarks?: string;
  };
  templates: WhatsAppTemplate[];
  onRecordMessageSent: (msg: WhatsAppMessage) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientType,
  phone,
  defaultTemplateCategory,
  dataVariables = {},
  templates,
  onRecordMessageSent,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [targetPhone, setTargetPhone] = useState<string>(phone || '');
  const [messageText, setMessageText] = useState<string>('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  // Clean phone number helper
  const cleanPhoneForWhatsApp = (rawPhone: string) => {
    let cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('03')) {
      cleaned = '92' + cleaned.slice(1);
    } else if (cleaned.startsWith('3') && cleaned.length === 10) {
      cleaned = '92' + cleaned;
    }
    return cleaned;
  };

  // Helper to replace variables
  const replaceVariables = (tplContent: string) => {
    let res = tplContent;
    const today = new Date().toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    res = res.replace(/\{student_name\}/g, dataVariables.student_name || recipientName || 'طالب علم');
    res = res.replace(/\{father_name\}/g, dataVariables.father_name || 'والد محترم');
    res = res.replace(/\{class\}/g, dataVariables.class || 'مدرسہ کلاس');
    res = res.replace(/\{date\}/g, dataVariables.date || today);
    res = res.replace(/\{fee_amount\}/g, dataVariables.fee_amount || '0');
    res = res.replace(/\{result\}/g, dataVariables.result || 'کامیاب');
    res = res.replace(/\{remarks\}/g, dataVariables.remarks || 'اطلاع دی جاتی ہے');
    return res;
  };

  useEffect(() => {
    setTargetPhone(phone || '');
    if (templates.length > 0) {
      let matched = templates.find(t => t.category === defaultTemplateCategory);
      if (!matched) matched = templates[0];
      setSelectedTemplateId(matched.id);
      setMessageText(replaceVariables(matched.content));
    } else {
      setMessageText('');
    }
  }, [isOpen, phone, defaultTemplateCategory, recipientName]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setMessageText(replaceVariables(tpl.content));
    }
  };

  const handleOpenWhatsApp = () => {
    if (!isOnline) {
      alert('واٹس ایپ میسجنگ کے لیے انٹرنیٹ کنکشن درکار ہے۔ آپ فی الوقت آف لائن ہیں۔');
      return;
    }

    const cleaned = cleanPhoneForWhatsApp(targetPhone);
    if (!cleaned) {
      alert('براہ کرم درست موبائل / واٹس ایپ نمبر درج کریں۔');
      return;
    }

    if (!messageText.trim()) {
      alert('براہ کرم پیغام تحریر کریں۔');
      return;
    }

    const tplName = templates.find(t => t.id === selectedTemplateId)?.name || 'براہ راست پیغام';

    // Record in message history
    const historyItem: WhatsAppMessage = {
      id: `wamsg_${Date.now()}`,
      timestamp: new Date().toLocaleString('ur-PK'),
      recipientType,
      recipientName,
      phone: targetPhone,
      templateType: tplName,
      message: messageText,
      status: 'واٹس ایپ پر بھیجا گیا',
    };
    onRecordMessageSent(historyItem);

    // Open official WhatsApp URL with pre-filled message
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleaned)}&text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');

    setStatusNotice('واٹس ایپ ویب / ایپ میں میسج کھول دیا گیا ہے۔');
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto font-sans text-right" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-blue-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              WA
            </div>
            <div>
              <h3 className="font-nastaliq font-bold text-base leading-tight">
                واٹس ایپ پیغام ارسال کریں (WhatsApp Message)
              </h3>
              <p className="text-[11px] text-blue-200">
                وصول کنندہ: <strong className="text-white">{recipientName}</strong> ({recipientType})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Status Alert */}
          {statusNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Recipient and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div>
              <label className="block text-slate-700 font-bold mb-1">وصول کنندہ کا نام</label>
              <input
                type="text"
                disabled
                value={recipientName}
                className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">واٹس ایپ نمبر *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                <input
                  type="text"
                  value={targetPhone}
                  onChange={e => setTargetPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-white border border-blue-300 rounded p-2 pr-8 font-mono text-left focus:ring-2 focus:ring-blue-600"
                  dir="ltr"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">پاکستانی نمبر کے لیے (03...) یا انٹرنیشنل کوڈ لکھیں</span>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">پیغام کا ٹیمپلیٹ (Message Template)</label>
              <span className="text-[11px] text-blue-700 font-medium">حقیقی ڈیٹا خودکار داخل ہوتا ہے</span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={e => handleTemplateChange(e.target.value)}
              className="w-full border border-blue-300 rounded-lg p-2 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-600"
            >
              {templates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea (Editable) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">پیغام کی عبارت (ترمیم کر سکتے ہیں)</label>
              <span className="text-[10px] text-slate-500 font-mono">حروف: {messageText.length}</span>
            </div>
            <textarea
              rows={6}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-600 bg-white"
              placeholder="پیغام یہاں لکھیں..."
            />
          </div>

          {/* Internet requirement Notice */}
          <div className={`p-3 rounded-lg text-[11px] flex items-start gap-2 border ${
            isOnline
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isOnline ? 'text-amber-600' : 'text-rose-600'}`} />
            <div>
              <p className="font-bold">
                {isOnline ? 'ضروری وضاحت برائے واٹس ایپ:' : '⚠️ آف لائن الرٹ: WhatsApp کے لیے انٹرنیٹ درکار ہے'}
              </p>
              <p className={isOnline ? 'text-amber-800' : 'text-rose-800'}>
                {isOnline
                  ? 'واٹس ایپ کے لیے انٹرنیٹ کنکشن ہونا ضروری ہے۔ نیچے دیے گئے بٹن پر کلک کرنے سے سرکاری واٹس ایپ ویب / ایپ میں اس نمبر کے لیے یہ تیار شدہ پیغام کھل جائے گا جہاں آپ تصدیق کے بعد باآسانی سینڈ کر سکتے ہیں۔'
                  : 'آپ کا سسٹم فی الحال آف لائن ہے۔ تمام ڈیٹا بیس اور رپورٹیں آف لائن محفوظ ہیں، لیکن واٹس ایپ پیغام ارسال کرنے کے لیے انٹرنیٹ کنکشن فعال کرنا ضروری ہے۔'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              منسوخ کریں
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition active:scale-95 cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-400 text-white cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isOnline ? '🟢 واٹس ایپ پر کھولیں (Open WhatsApp)' : '🔴 WhatsApp کے لیے انٹرنیٹ درکار ہے'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
