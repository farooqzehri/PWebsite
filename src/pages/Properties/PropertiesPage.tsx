import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Building2, Search, X } from 'lucide-react';
import { Property, FilterParams } from '../../types';
import { api } from '../../services/api';
import { PropertyCard } from '../../components/property/PropertyCard';
import { FilterSidebar } from '../../components/property/FilterSidebar';
import { useLanguage } from '../../context/LanguageContext';

export const PropertiesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL search params
  const currentFilters: FilterParams = {
    purpose: searchParams.get('purpose') || undefined,
    propertyType: searchParams.get('propertyType') || undefined,
    city: searchParams.get('city') || undefined,
    area: searchParams.get('area') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    bedrooms: searchParams.get('bedrooms') || undefined,
    bathrooms: searchParams.get('bathrooms') || undefined,
    status: searchParams.get('status') || 'available',
    featured: searchParams.get('featured') || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as any) || 'latest',
    page: Number(searchParams.get('page')) || 1,
    limit: 12
  };

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getProperties(currentFilters);
      if (res.success) {
        setProperties(res.properties || []);
        setTotal(res.total || 0);
        setPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (newFilters: FilterParams) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        params.set(key, String(val));
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Header & Breadcrumb Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
            {language === 'ur' ? 'کوئٹہ میں پراپرٹیز' : 'Properties in Quetta'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#cad2c5] mt-1">
            {loading ? 'Searching properties...' : `${total} ${total === 1 ? 'property' : 'properties'} found`}
          </p>
        </div>

        {/* Mobile Filter & Sort Triggers */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 py-2 px-3.5 rounded-xl border border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] text-xs font-bold text-[#2f3e46] dark:text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#52796f]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={currentFilters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Property Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {currentFilters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5ede6] dark:bg-[#354f52] text-[#2f3e46] dark:text-white">
                <span>Search: {currentFilters.search}</span>
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('search');
                    setSearchParams(p);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.purpose && currentFilters.purpose !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5ede6] dark:bg-[#354f52] text-[#2f3e46] dark:text-white capitalize">
                <span>Purpose: {currentFilters.purpose}</span>
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('purpose');
                    setSearchParams(p);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.propertyType && currentFilters.propertyType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5ede6] dark:bg-[#354f52] text-[#2f3e46] dark:text-white capitalize">
                <span>Type: {currentFilters.propertyType}</span>
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('propertyType');
                    setSearchParams(p);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.area && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e5ede6] dark:bg-[#354f52] text-[#2f3e46] dark:text-white">
                <span>Area: {currentFilters.area}</span>
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('area');
                    setSearchParams(p);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Properties List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-slate-100 dark:bg-[#354f52]/40 animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f4f7f4] dark:bg-[#1f2b30] text-[#52796f] flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2f3e46] dark:text-white">
                  {t('noPropertiesFound')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#cad2c5] mt-1 max-w-md mx-auto">
                  {t('tryAdjustingFilters')}
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#52796f] text-white text-xs font-bold hover:bg-[#3f5f57] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('clearFilters')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-[#cad2c5]/60 dark:border-[#354f52] flex justify-center items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="py-2 px-4 rounded-xl border border-[#cad2c5] dark:border-[#354f52] text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    page === idx + 1
                      ? 'bg-[#52796f] text-white'
                      : 'border border-[#cad2c5] dark:border-[#354f52] text-[#2f3e46] dark:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="py-2 px-4 rounded-xl border border-[#cad2c5] dark:border-[#354f52] text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#2f3e46] h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#cad2c5] dark:border-[#354f52]">
              <span className="font-bold text-sm text-[#2f3e46] dark:text-white">Filter Properties</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-black dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={currentFilters}
              onChange={(nf) => {
                handleFilterChange(nf);
                setMobileFilterOpen(false);
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
