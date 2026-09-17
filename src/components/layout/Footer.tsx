import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, MessageCircle, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateWhatsAppLink, generateCallLink } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#2f3e46] text-white border-t border-[#354f52]">
      {/* Top Value Banner */}
      <div className="border-b border-[#354f52] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#52796f]/40 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[#84a98c]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">
                {language === 'ur' ? '100٪ تصدیق شدہ دستاویزات' : 'Verified Quetta Properties'}
              </h4>
              <p className="text-xs text-[#cad2c5]">
                {language === 'ur' ? 'زمین اور مالکانہ حقوق کی مکمل قانونی چھان بین' : 'Clear land records and verified ownership documentation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#52796f]/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-[#84a98c]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">
                {language === 'ur' ? 'فوری واٹس ایپ رابطہ' : 'Direct WhatsApp Inquiries'}
              </h4>
              <p className="text-xs text-[#cad2c5]">
                {language === 'ur' ? 'ہماری ٹیم فوری تفصیلات فراہم کرتی ہے' : 'Immediate response with photos and location details'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-[#52796f]/40 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#84a98c]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">
                {language === 'ur' ? 'مقامی کوئٹہ مارکیٹ کا تجربہ' : 'Local Quetta Market Mastery'}
              </h4>
              <p className="text-xs text-[#cad2c5]">
                {language === 'ur' ? 'سیٹلائٹ ٹاؤن، جناح روڈ، کینٹ اور گردونواح' : 'Expert valuation in Satellite Town, Jinnah Rd, Cantt & Zarghoon Rd'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#52796f] flex items-center justify-center text-white">
                <Building2 className="w-6 h-6 text-[#cad2c5]" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-white leading-tight">
                  {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی' : 'BISMILLAH STATE AGENCY'}
                </span>
                <span className="block text-xs font-semibold tracking-wider text-[#84a98c]">
                  QUETTA, BALOCHISTAN, PAKISTAN
                </span>
              </div>
            </div>

            <p className="text-sm text-[#cad2c5] leading-relaxed max-w-sm">
              {language === 'ur'
                ? 'کوئٹہ میں مکانات، فلیٹس، تجارتی دکانیں اور رہائشی پلاٹس خریدنے اور بیچنے کے لیے سب سے قابل اعتماد رئیل اسٹیٹ ادارہ۔'
                : 'Your dedicated property partner in Quetta, Balochistan. Specializing in residential houses, plots, commercial markets, and rental accommodations with complete transparency.'}
            </p>

            <div className="pt-2">
              <a
                href={generateWhatsAppLink('+923128001533')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#52796f] hover:bg-[#3f5f57] text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
                <span>{language === 'ur' ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp (+92 312 8001533)'}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">
              {language === 'ur' ? 'اہم لنکس' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#cad2c5]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">{t('navHome')}</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">{t('navProperties')}</Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-white transition-colors">{t('navBuy')}</Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-white transition-colors">{t('navRent')}</Link>
              </li>
              <li>
                <Link to="/submit-property" className="hover:text-white transition-colors">{t('navSubmit')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('navAbout')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('navContact')}</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">
              {language === 'ur' ? 'پراپرٹی کی اقسام' : 'Property Types'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#cad2c5]">
              <li>
                <Link to="/properties?propertyType=house" className="hover:text-white transition-colors">
                  {language === 'ur' ? 'مکانات برائے فروخت' : 'Houses & Villas'}
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=plot" className="hover:text-white transition-colors">
                  {language === 'ur' ? 'رہائشی و تجارتی پلاٹس' : 'Residential & Commercial Plots'}
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=flat" className="hover:text-white transition-colors">
                  {language === 'ur' ? 'فلیٹس اور اپارٹمنٹس' : 'Apartments & Flats'}
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=shop" className="hover:text-white transition-colors">
                  {language === 'ur' ? 'دکانیں اور مارکیٹ شاپس' : 'Commercial Shops'}
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=office" className="hover:text-white transition-colors">
                  {language === 'ur' ? 'کارپوریٹ دفاتر' : 'Corporate Offices'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">
              {language === 'ur' ? 'دفتر و رابطہ' : 'Contact Office'}
            </h4>
            <div className="space-y-3 text-sm text-[#cad2c5]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#84a98c] shrink-0 mt-0.5" />
                <span>Office #4, Commercial Plaza, Main Jinnah Road, Quetta, Balochistan</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#84a98c] shrink-0" />
                <a href={generateCallLink('+923128001533')} className="hover:text-white font-medium">
                  +92 312 8001533
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#84a98c] shrink-0" />
                <a href="mailto:info@bismillahstateagency.com" className="hover:text-white">
                  info@bismillahstateagency.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#84a98c] shrink-0" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#354f52] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#cad2c5]">
          <p>© {new Date().getFullYear()} Bismillah State Agency. All rights reserved. Quetta, Balochistan, Pakistan.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-[#84a98c] transition-colors">Agency Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
