import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Property } from '../../types';
import { formatPrice, formatArea, generateWhatsAppLink } from '../../utils/formatters';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, language } = useLanguage();
  const favorited = isFavorite(property._id);

  const mainImage = property.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const isSoldOrRented = property.status === 'sold' || property.status === 'rented';

  return (
    <div className="group bg-white dark:bg-[#354f52]/50 border border-[#cad2c5]/70 dark:border-[#354f52] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Media & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status & Purpose Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-[#52796f] text-white shadow-xs tracking-wide">
              {t('featured')}
            </span>
          )}

          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider shadow-xs ${
            property.purpose === 'sale' ? 'bg-[#2f3e46] text-white' : 'bg-[#84a98c] text-white'
          }`}>
            {property.purpose === 'sale' ? t('forSale') : t('forRent')}
          </span>

          {isSoldOrRented && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-600 text-white shadow-xs">
              {property.status === 'sold' ? t('sold') : t('rented')}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property._id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-10 cursor-pointer ${
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-black/50 text-slate-700 dark:text-slate-200 hover:bg-white'
          }`}
          title={favorited ? "Remove from saved" : "Save property"}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Property ID Chip */}
        <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
          {property.propertyId}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xl font-extrabold text-[#2f3e46] dark:text-white tracking-tight">
              {formatPrice(property.price, property.purpose)}
            </span>
            <span className="text-xs font-semibold text-[#52796f] dark:text-[#84a98c] capitalize">
              {property.propertyType}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.slug}`} className="block group-hover:text-[#52796f] transition-colors">
            <h3 className="font-bold text-base text-[#2f3e46] dark:text-slate-100 line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#cad2c5] mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#52796f] dark:text-[#84a98c] shrink-0" />
            <span className="truncate">{property.areaBlock}, {property.city}</span>
          </div>
        </div>

        {/* Specs: Beds, Baths, Area */}
        <div className="pt-2.5 border-t border-[#cad2c5]/50 dark:border-[#354f52]/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-[#52796f]" />
                <span className="font-semibold">{property.bedrooms}</span> {t('beds')}
              </span>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-[#52796f]" />
                <span className="font-semibold">{property.bathrooms}</span> {t('baths')}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 font-semibold text-[#2f3e46] dark:text-[#cad2c5]">
            <Maximize2 className="w-3.5 h-3.5 text-[#52796f]" />
            {formatArea(property.area, property.areaUnit)}
          </span>
        </div>

        {/* Actions Bar */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/properties/${property.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#f4f7f4] dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white border border-[#cad2c5] dark:border-[#354f52] hover:bg-[#cad2c5]/30 transition-all"
          >
            <span>{t('viewProperty')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={generateWhatsAppLink('+923128001533', property.title, property.propertyId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-[#52796f] hover:bg-[#3f5f57] text-white transition-colors"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
          </a>
        </div>

      </div>
    </div>
  );
};
