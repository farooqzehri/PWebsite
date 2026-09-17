import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Building2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { api } from '../../services/api';
import { Property } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useLanguage } from '../../context/LanguageContext';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const { t, language } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.getProperties({ limit: 100 });
        if (res.success && res.properties) {
          const matched = res.properties.filter((p) => favorites.includes(p._id));
          setProperties(matched);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>{t('savedProperties')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#cad2c5] mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved in your browser
          </p>
        </div>

        {properties.length > 0 && (
          <button
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-xl bg-slate-100 dark:bg-[#354f52]/40 animate-pulse"></div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2f3e46] dark:text-white">
              {t('noFavoritesYet')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#cad2c5] mt-1">
              Click the heart icon on any Quetta property to save it here for quick access and comparison.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#52796f] text-white font-bold text-xs hover:bg-[#3f5f57] transition-all"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
};
