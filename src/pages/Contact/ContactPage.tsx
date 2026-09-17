import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { generateWhatsAppLink, generateCallLink } from '../../utils/formatters';
import { PropertyMap } from '../../components/common/PropertyMap';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in your name, phone number, and message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name,
        phone,
        email,
        message: subject ? `[${subject}] ${message}` : message,
        preferredContact: 'whatsapp'
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Submission failed. Please reach out via WhatsApp directly.');
      }
    } catch {
      setError('Network error. Please call or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52796f]/15 text-[#52796f] text-xs font-bold">
          <Phone className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'ہم سے رابطہ کریں' : 'Quetta Office & Support'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2f3e46] dark:text-white">
          {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی سے رابطہ کریں' : 'Get in Touch with Our Quetta Team'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
          Whether you want to buy, sell, rent, or inquire about property valuations in Quetta, our licensed brokers are ready to assist you.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Contact Info Cards */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">
              Office Information
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-[#2f3e46] dark:text-white">Physical Address</span>
                  <span>Office #4, Commercial Plaza, Main Jinnah Road, Quetta, Balochistan, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-[#2f3e46] dark:text-white">Direct Phone</span>
                  <a href={generateCallLink('+923128001533')} className="hover:text-[#52796f] font-semibold text-sm">
                    +92 312 8001533
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-[#2f3e46] dark:text-white">Official WhatsApp</span>
                  <a
                    href={generateWhatsAppLink('+923128001533')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#52796f] dark:text-[#84a98c] font-bold hover:underline"
                  >
                    +92 312 8001533 (Instant Response)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-[#2f3e46] dark:text-white">Email Address</span>
                  <a href="mailto:info@bismillahstateagency.com" className="hover:text-[#52796f]">
                    info@bismillahstateagency.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-[#2f3e46] dark:text-white">Visiting Hours</span>
                  <span>Monday – Saturday: 9:00 AM – 8:00 PM</span>
                  <span className="block text-slate-400">Friday: Break from 1:00 PM – 3:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Banner */}
          <div className="bg-[#52796f] rounded-2xl p-6 text-white space-y-3">
            <h4 className="font-bold text-base">Want an Instant Reply?</h4>
            <p className="text-xs text-[#cad2c5] leading-relaxed">
              Our brokers are active on WhatsApp 7 days a week. Send us a message with your budget and preferred Quetta location.
            </p>
            <a
              href={generateWhatsAppLink('+923128001533')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#2f3e46] font-bold text-xs hover:bg-[#cad2c5] transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#52796f]" />
              <span>Chat on WhatsApp Now</span>
            </a>
          </div>

        </div>

        {/* Right: Interactive Message Form */}
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-[#f4f7f4] dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-3xl p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2f3e46] dark:text-white">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5] max-w-md mx-auto">
                Thank you for contacting Bismillah State Agency. One of our property consultants will call or WhatsApp you shortly.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 bg-[#52796f] text-white rounded-xl text-xs font-bold hover:bg-[#3f5f57]"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#2f3e46] dark:text-white">
                  Send Us an Inquiry
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#cad2c5] mt-0.5">
                  We usually respond within 30 minutes during business hours.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Tariq"
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Phone / WhatsApp Number *
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Subject / Area of Interest
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Buying Plot in Satellite Town"
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Your Message & Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your budget, required bedrooms, or any questions regarding Quetta properties..."
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Inquiry to Bismillah Agency'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Location Map for Office using OpenStreetMap */}
      <div className="pt-6">
        <PropertyMap
          latitude={30.1798}
          longitude={66.9750}
          title="Bismillah State Agency Head Office"
          address="Office #4, Commercial Plaza, Main Jinnah Road"
          city="Quetta"
          areaBlock="Jinnah Road"
        />
      </div>

    </div>
  );
};
