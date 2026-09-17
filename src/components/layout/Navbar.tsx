import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Building2, 
  PlusCircle, 
  ShieldCheck,
  Languages
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { generateWhatsAppLink, generateCallLink } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { count: favoritesCount } = useFavorites();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navProperties'), path: '/properties' },
    { name: t('navBuy'), path: '/buy' },
    { name: t('navRent'), path: '/rent' },
    { name: t('navAbout'), path: '/about' },
    { name: t('navContact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2f3e46]/95 backdrop-blur-md border-b border-[#cad2c5]/60 dark:border-[#354f52] transition-colors duration-200">
      {/* Top micro bar for Quetta agency info & fast direct contact */}
      <div className="bg-[#354f52] dark:bg-[#1f2b30] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === 'ur' ? 'کوئٹہ کا تصدیق شدہ رئیل اسٹیٹ نیٹ ورک' : 'Verified Real Estate Network in Quetta'}
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/80">Jinnah Road • Satellite Town • Cantt</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href={generateCallLink('+923128001533')} 
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              title="Call Bismillah State Agency"
            >
              <Phone className="w-3.5 h-3.5 text-[#84a98c]" />
              <span className="font-semibold tracking-wide">+92 312 8001533</span>
            </a>

            <div className="h-3 w-px bg-white/20"></div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1 font-medium hover:text-[#cad2c5] transition-colors cursor-pointer"
              title="Toggle English / Urdu"
            >
              <Languages className="w-3.5 h-3.5 text-[#84a98c]" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[#52796f] dark:bg-[#354f52] flex items-center justify-center text-white shadow-sm group-hover:bg-[#3f5f57] transition-all">
              <Building2 className="w-6 h-6 text-[#cad2c5]" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight text-[#2f3e46] dark:text-white leading-tight">
                {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی' : 'BISMILLAH'}
              </span>
              <span className="block text-xs font-semibold tracking-wider text-[#52796f] dark:text-[#84a98c] uppercase">
                {language === 'ur' ? 'کوئٹہ، بلوچستان' : 'STATE AGENCY • QUETTA'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#52796f] dark:text-[#84a98c] bg-[#e5ede6]/70 dark:bg-[#354f52]/60 font-semibold'
                    : 'text-[#354f52] dark:text-slate-200 hover:text-[#52796f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Primary CTAs */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-[#354f52] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#354f52] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-[#52796f]" />}
            </button>

            {/* Saved Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-lg text-[#354f52] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#354f52] transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-4.5 h-4.5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#52796f] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Submit Property CTA */}
            <Link
              to="/submit-property"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#354f52] dark:text-slate-200 border border-[#cad2c5] dark:border-[#354f52] hover:bg-[#cad2c5]/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#52796f]" />
              <span>{t('navSubmit')}</span>
            </Link>

            {/* Admin or Login Link */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#354f52] text-white hover:bg-[#2f3e46] transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#84a98c]" />
                <span>{t('navAdmin')}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-[#354f52] dark:text-slate-300 hover:text-[#52796f] px-2 py-1"
              >
                {t('navLogin')}
              </Link>
            )}

            {/* Primary WhatsApp CTA */}
            <a
              href={generateWhatsAppLink('+923128001533')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#52796f] hover:bg-[#3f5f57] text-white shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
              <span>{t('whatsappUs')}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-[#354f52] dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/favorites" className="relative p-2 text-[#354f52] dark:text-slate-200">
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-[#52796f] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2f3e46] dark:text-white hover:bg-slate-100 dark:hover:bg-[#354f52]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#52796f] dark:text-[#84a98c] bg-[#e5ede6] dark:bg-[#354f52] font-semibold'
                    : 'text-[#2f3e46] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#354f52]/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/submit-property"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-[#52796f] dark:text-[#84a98c] flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('navSubmit')}</span>
            </Link>
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-white bg-[#354f52] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#84a98c]" />
                <span>{t('navAdmin')}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-[#2f3e46] dark:text-slate-200"
              >
                {t('navLogin')}
              </Link>
            )}
          </nav>

          {/* Quick contact buttons on mobile */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#cad2c5]/60 dark:border-[#354f52]">
            <a
              href={generateCallLink('+923128001533')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 dark:bg-[#354f52] text-[#2f3e46] dark:text-white font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-[#52796f]" />
              <span>{t('callUs')}</span>
            </a>
            <a
              href={generateWhatsAppLink('+923128001533')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#52796f] text-white font-semibold text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('whatsappUs')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
