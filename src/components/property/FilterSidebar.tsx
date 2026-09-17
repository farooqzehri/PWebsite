import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FilterParams } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FilterSidebarProps {
  filters: FilterParams;
  onChange: (newFilters: FilterParams) => void;
  onReset: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  className = ''
}) => {
  const { t, language } = useLanguage();

  const handleFieldChange = (key: keyof FilterParams, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const quettaAreas = [
    'Satellite Town',
    'Jinnah Road',
    'Zarghoon Road',
    'Samungli Road',
    'Cantt',
    'Chiltan Housing Scheme',
    'Model Town',
    'Shahbaz Town',
    'Airport Road',
    'Brewery Road'
  ];

  const types = [
    { value: 'all', label: t('allTypes') },
    { value: 'house', label: t('house') },
    { value: 'flat', label: t('flat') },
    { value: 'plot', label: t('plot') },
    { value: 'shop', label: t('shop') },
    { value: 'office', label: t('office') },
    { value: 'commercial', label: t('commercial') },
    { value: 'land', label: t('land') },
    { value: 'warehouse', label: t('warehouse') }
  ];

  return (
    <aside className={`bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/70 dark:border-[#354f52] rounded-2xl p-5 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#2f3e46] dark:text-white">
          <Filter className="w-4 h-4 text-[#52796f]" />
          <span>{language === 'ur' ? 'فلٹرز کی تفصیل' : 'Property Filters'}</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#cad2c5] hover:text-[#52796f] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('clearFilters')}</span>
        </button>
      </div>

      {/* Purpose: Buy / Rent / All */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('purpose')}
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#1f2b30] rounded-xl text-xs font-semibold">
          {['all', 'sale', 'rent'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleFieldChange('purpose', p)}
              className={`py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                (filters.purpose || 'all') === p
                  ? 'bg-[#52796f] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#2f3e46]'
              }`}
            >
              {p === 'all' ? t('allPurposes') : p === 'sale' ? t('forSale') : t('forRent')}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('propertyType')}
        </label>
        <select
          value={filters.propertyType || 'all'}
          onChange={(e) => handleFieldChange('propertyType', e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        >
          {types.map((tp) => (
            <option key={tp.value} value={tp.value}>
              {tp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quetta Location / Area */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('location')}
        </label>
        <select
          value={filters.area || ''}
          onChange={(e) => handleFieldChange('area', e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        >
          <option value="">{t('allLocations')}</option>
          {quettaAreas.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('priceRange')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleFieldChange('minPrice', e.target.value)}
            placeholder={t('minPrice')}
            className="w-full py-2 px-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
          />
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
            placeholder={t('maxPrice')}
            className="w-full py-2 px-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('bedrooms')}
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', '1', '2', '3', '4', '5'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleFieldChange('bedrooms', b)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                (String(filters.bedrooms) || 'all') === b
                  ? 'bg-[#52796f] text-white'
                  : 'bg-slate-100 dark:bg-[#1f2b30] text-slate-600 dark:text-slate-300 hover:bg-[#cad2c5]/40'
              }`}
            >
              {b === '5' ? '5+' : b === 'all' ? t('anyBeds') : b}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Only Checkbox */}
      <div className="pt-2 border-t border-[#cad2c5]/50 dark:border-[#354f52]">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.featured)}
            onChange={(e) => handleFieldChange('featured', e.target.checked)}
            className="w-4 h-4 rounded text-[#52796f] focus:ring-[#52796f] accent-[#52796f]"
          />
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#52796f]" />
            {t('featured')} Only
          </span>
        </label>
      </div>

      {/* Status filter (Available / Sold / Rented) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('status')}
        </label>
        <select
          value={filters.status || 'available'}
          onChange={(e) => handleFieldChange('status', e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="available">{t('available')}</option>
          <option value="sold">{t('sold')}</option>
          <option value="rented">{t('rented')}</option>
        </select>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {t('sortBy')}
        </label>
        <select
          value={filters.sort || 'latest'}
          onChange={(e) => handleFieldChange('sort', e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
        >
          <option value="latest">{t('sortLatest')}</option>
          <option value="price-low">{t('sortPriceAsc')}</option>
          <option value="price-high">{t('sortPriceDesc')}</option>
          <option value="views">{t('sortViews')}</option>
        </select>
      </div>
    </aside>
  );
};
