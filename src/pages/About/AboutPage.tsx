import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateWhatsAppLink, generateCallLink } from '../../utils/formatters';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 py-10 sm:py-16">
      
      {/* 1. Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#52796f]/15 text-[#52796f] text-xs font-bold">
          <Building2 className="w-4 h-4" />
          <span>{language === 'ur' ? 'کوئٹہ کا قابل اعتماد ادارہ' : 'Quetta\'s Leading Real Estate Partner'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2f3e46] dark:text-white">
          {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی کے بارے میں' : 'About Bismillah State Agency'}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-[#cad2c5] max-w-2xl mx-auto">
          {language === 'ur'
            ? 'ہم گزشتہ ایک دہائی سے کوئٹہ کے باسیوں اور بیرون ملک مقیم پاکستانیوں کو محفوظ اور شفاف رئیل اسٹیٹ خدمات فراہم کر رہے ہیں۔'
            : 'Dedicated to ethical, transparent, and legal real estate advisory across Quetta and Balochistan.'}
        </p>
      </section>

      {/* 2. Core Story & Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
              {language === 'ur' ? 'ہماری کہانی اور نصب العین' : 'Rooted in Quetta, Built on Unbroken Trust'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#cad2c5] leading-relaxed">
              Bismillah State Agency was established with a singular vision: to bring modern professionalism, accurate documentation, and absolute transparency to the real estate landscape of Quetta, Balochistan.
            </p>
            <p className="text-sm text-slate-600 dark:text-[#cad2c5] leading-relaxed">
              Buying a home or investing life savings into a commercial plot is a monumental milestone. Our dedicated team verifies every registry, intiqal, and demarcation with local revenue authorities before offering any property to our clients.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/60 dark:border-[#354f52]">
                <span className="block text-2xl font-black text-[#52796f] dark:text-[#84a98c]">10+</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-[#cad2c5]">Years Serving Quetta</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/60 dark:border-[#354f52]">
                <span className="block text-2xl font-black text-[#52796f] dark:text-[#84a98c]">500+</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-[#cad2c5]">Verified Deals Closed</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[#cad2c5] dark:border-[#354f52] shadow-lg aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80"
              alt="Real estate office Quetta"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="font-bold text-base">Office #4, Commercial Plaza, Main Jinnah Road</span>
              <span className="text-xs text-[#cad2c5]">Quetta, Balochistan, Pakistan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Values */}
      <section className="bg-[#f4f7f4] dark:bg-[#1f2b30] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#cad2c5]/60 dark:border-[#354f52]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
              Our Core Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
              How we protect your hard-earned wealth and ensure peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/70 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">Clear Title Guarantee</h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                Zero disputed plots or unverified lands. We inspect mutation documents and revenue ledgers to verify true ownership.
              </p>
            </div>

            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/70 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">Accurate Market Valuation</h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                We provide real price comparisons from closed transactions so buyers never overpay and sellers receive honest value.
              </p>
            </div>

            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/70 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">Overseas Client Support</h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                Dedicated WhatsApp video tours, transparent payment escrow guidance, and family property management for Quetta expats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#354f52] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Have a question or want to visit our Quetta office?</h3>
            <p className="text-xs sm:text-sm text-[#cad2c5]">
              Call +92 312 8001533 or chat directly with our principal broker on WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={generateWhatsAppLink('+923128001533')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#84a98c] hover:bg-[#52796f] text-[#2f3e46] hover:text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Now</span>
            </a>

            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-[#cad2c5] text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
