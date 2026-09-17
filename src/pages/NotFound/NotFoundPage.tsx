import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-[#2f3e46] dark:text-white">404</h1>
        <h2 className="text-xl font-bold text-[#2f3e46] dark:text-white">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#cad2c5]">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#52796f] text-white font-bold text-xs hover:bg-[#3f5f57] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
