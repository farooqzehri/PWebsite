import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useLanguage();
  const [tooltipVisible, setTooltipVisible] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Floating Micro-Bubble notification */}
      {tooltipVisible && (
        <div className="relative bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white px-3.5 py-2 rounded-2xl shadow-xl border border-[#cad2c5] dark:border-[#354f52] text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>
            {language === 'ur' ? 'کوئٹہ پراپرٹی ہیلپ لائن' : 'Direct Quetta Property Desk'}
          </span>
          <button
            onClick={() => setTooltipVisible(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Float Button */}
      <a
        href={generateWhatsAppLink(
          '+923128001533',
          undefined,
          undefined,
          'Assalamualaikum Bismillah State Agency, I want to inquire about properties in Quetta.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bismillah State Agency on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#52796f] hover:bg-[#3f5f57] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative cursor-pointer"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
};
