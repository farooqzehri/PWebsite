import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Phone, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { generateWhatsAppLink } from '../../utils/formatters';

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  propertySlug?: string;
  onSuccess?: () => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  propertyId,
  propertyTitle,
  propertySlug,
  onSuccess
}) => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    propertyTitle 
      ? `Assalamualaikum, I am interested in ${propertyTitle} (ID: ${propertyId || 'BSA'}). Please provide documentation and site visit details.` 
      : 'Assalamualaikum, I would like more information on properties in Quetta.'
  );
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call' | 'email'>('whatsapp');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone/WhatsApp number');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInquiry({
        name,
        phone,
        email,
        message,
        propertyId,
        propertyTitle,
        propertySlug,
        preferredContact
      });

      if (res.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setError('Network error. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#f4f7f4] dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
            {language === 'ur' ? 'آپ کا پیغام کامیابی سے موصول ہو گیا' : 'Inquiry Submitted Successfully'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#cad2c5] mt-1 max-w-sm mx-auto">
            {t('inquirySuccess')}
          </p>
        </div>

        <div className="pt-2">
          <a
            href={generateWhatsAppLink('+923128001533', propertyTitle, propertyId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-semibold text-xs transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
            <span>{language === 'ur' ? 'ابھی فوری واٹس ایپ چیٹ شروع کریں' : 'Also Send via WhatsApp for Instant Response'}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
          {t('inquireNow')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#cad2c5] mt-0.5">
          {t('inquireSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {t('yourName')} *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Muhammad Ali"
          className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {t('yourPhone')} *
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+92 312 0000000"
          className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        />
      </div>

      {/* Email (Optional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {t('yourEmail')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourname@gmail.com"
          className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        />
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
          {t('preferredContact')}
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
            { id: 'call', label: 'Phone Call', icon: Phone },
            { id: 'email', label: 'Email', icon: Mail }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreferredContact(item.id as any)}
                className={`py-2 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer ${
                  preferredContact === item.id
                    ? 'border-[#52796f] bg-[#52796f]/10 text-[#52796f] dark:text-[#84a98c] dark:bg-[#354f52]'
                    : 'border-[#cad2c5] dark:border-[#354f52] text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {t('yourMessage')}
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Submitting...' : t('sendInquiryBtn')}</span>
      </button>

      {/* Fast WhatsApp alternative */}
      <div className="text-center pt-2">
        <a
          href={generateWhatsAppLink('+923128001533', propertyTitle, propertyId)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52796f] dark:text-[#84a98c] hover:underline"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Or chat directly on WhatsApp (+92 312 8001533)</span>
        </a>
      </div>
    </form>
  );
};
