import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PropertySearchProps {
  initialPurpose?: string;
  className?: string;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ initialPurpose = 'all', className = '' }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [keyword, setKeyword] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const quettaAreas = [
    { value: '', label: t('allLocations') },
    { value: 'Satellite Town', label: 'Satellite Town' },
    { value: 'Jinnah Road', label: 'Jinnah Road' },
    { value: 'Zarghoon Road', label: 'Zarghoon Road' },
    { value: 'Samungli Road', label: 'Samungli Road' },
    { value: 'Cantt', label: 'Cantt Quetta' },
    { value: 'Chiltan Housing Scheme', label: 'Chiltan Housing Scheme' },
    { value: 'Model Town', label: 'Model Town' },
    { value: 'Shahbaz Town', label: 'Shahbaz Town' },
    { value: 'Airport Road', label: 'Airport Road' },
    { value: 'Brewery Road', label: 'Brewery Road' }
  ];

  const propertyTypes = [
    { value: 'all', label: t('allTypes') },
    { value: 'house', label: t('house') },
    { value: 'flat', label: t('flat') },
    { value: 'plot', label: t('plot') },
    { value: 'shop', label: t('shop') },
    { value: 'office', label: t('office') },
    { value: 'commercial', label: t('commercial') }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose && purpose !== 'all') params.set('purpose', purpose);
    if (keyword.trim()) params.set('search', keyword.trim());
    if (area) params.set('area', area);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (maxPrice) params.set('maxPrice', maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  const handleSuggestionClick = (query: string, p?: string, type?: string) => {
    const params = new URLSearchParams();
    if (p) params.set('purpose', p);
    if (type) params.set('propertyType', type);
    params.set('search', query);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white/95 dark:bg-[#2f3e46]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#cad2c5]/80 dark:border-[#354f52] p-4 sm:p-6 transition-all ${className}`}>
      {/* Purpose Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-[#cad2c5]/50 dark:border-[#354f52] pb-3">
        <button
          type="button"
          onClick={() => setPurpose('all')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            purpose === 'all'
              ? 'bg-[#52796f] text-white shadow-xs'
              : 'text-[#354f52] dark:text-[#cad2c5] hover:bg-slate-100 dark:hover:bg-[#354f52]'
          }`}
        >
          {t('allPurposes')}
        </button>
        <button
          type="button"
          onClick={() => setPurpose('sale')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            purpose === 'sale'
              ? 'bg-[#52796f] text-white shadow-xs'
              : 'text-[#354f52] dark:text-[#cad2c5] hover:bg-slate-100 dark:hover:bg-[#354f52]'
          }`}
        >
          {t('forSale')}
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            purpose === 'rent'
              ? 'bg-[#52796f] text-white shadow-xs'
              : 'text-[#354f52] dark:text-[#cad2c5] hover:bg-slate-100 dark:hover:bg-[#354f52]'
          }`}
        >
          {t('forRent')}
        </button>
      </div>

      {/* Main Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Natural Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-sm text-[#2f3e46] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          />
        </div>

        {/* Structured Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Area in Quetta */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52796f]" />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#52796f] appearance-none cursor-pointer"
            >
              {quettaAreas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52796f]" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#52796f] appearance-none cursor-pointer"
            >
              {propertyTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Max Budget (PKR) */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52796f]" />
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#52796f] appearance-none cursor-pointer"
            >
              <option value="">{t('anyPrice')}</option>
              {purpose === 'rent' ? (
                <>
                  <option value="40000">Under PKR 40 Thousand</option>
                  <option value="60000">Under PKR 60 Thousand</option>
                  <option value="100000">Under PKR 1 Lac</option>
                  <option value="200000">Under PKR 2 Lac</option>
                </>
              ) : (
                <>
                  <option value="10000000">Under PKR 1 Crore</option>
                  <option value="20000000">Under PKR 2 Crore</option>
                  <option value="35000000">Under PKR 3.5 Crore</option>
                  <option value="50000000">Under PKR 5 Crore</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Submit Search CTA */}
        <div className="pt-1 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#cad2c5]" />
            <span>{t('searchButton')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/submit-property')}
            className="py-3 px-5 rounded-xl border border-[#cad2c5] dark:border-[#354f52] text-[#2f3e46] dark:text-white hover:bg-slate-50 dark:hover:bg-[#354f52] font-semibold text-sm transition-all cursor-pointer"
          >
            {t('listPropertyButton')}
          </button>
        </div>

        {/* Smart Query Suggestions */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium text-[#52796f] dark:text-[#84a98c]">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ur' ? 'تجویز کردہ تلاش:' : 'Popular searches:'}
          </span>
          <button
            type="button"
            onClick={() => handleSuggestionClick('5 bedroom Satellite Town', 'sale', 'house')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f2b30] hover:bg-[#cad2c5]/40 text-[#2f3e46] dark:text-[#cad2c5] transition-colors cursor-pointer"
          >
            5 Bed Satellite Town
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Flat Zarghoon Road', 'rent', 'flat')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f2b30] hover:bg-[#cad2c5]/40 text-[#2f3e46] dark:text-[#cad2c5] transition-colors cursor-pointer"
          >
            Flat Zarghoon Road
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Plot Chiltan Housing Scheme', 'sale', 'plot')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f2b30] hover:bg-[#cad2c5]/40 text-[#2f3e46] dark:text-[#cad2c5] transition-colors cursor-pointer"
          >
            Plot Chiltan Housing
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Shop Jinnah Road', 'sale', 'shop')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f2b30] hover:bg-[#cad2c5]/40 text-[#2f3e46] dark:text-[#cad2c5] transition-colors cursor-pointer"
          >
            Shop Jinnah Road
          </button>
        </div>
      </form>
    </div>
  );
};
