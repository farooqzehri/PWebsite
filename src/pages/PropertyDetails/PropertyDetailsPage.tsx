import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Layers, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  Eye, 
  Building2,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Property } from '../../types';
import { api } from '../../services/api';
import { formatPrice, formatExactPrice, formatArea, generateWhatsAppLink, generateCallLink, formatDate } from '../../utils/formatters';
import { ImageGallery } from '../../components/property/ImageGallery';
import { PropertyMap } from '../../components/common/PropertyMap';
import { InquiryForm } from '../../components/property/InquiryForm';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';

export const PropertyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProperty(slug);
        if (res.success && res.property) {
          setProperty(res.property);
          setRelated(res.related || []);
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Dynamic page title update for SEO
          document.title = `${res.property.title} – Bismillah State Agency Quetta`;
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property in Quetta: ${property?.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-[450px] w-full bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-16 h-16 text-[#52796f] mx-auto" />
        <h1 className="text-2xl font-bold text-[#2f3e46] dark:text-white">Property Not Found</h1>
        <p className="text-sm text-slate-500">The property you requested is not available or has been removed.</p>
        <Link
          to="/properties"
          className="inline-block py-2.5 px-5 bg-[#52796f] text-white rounded-xl text-sm font-bold"
        >
          Browse Quetta Properties
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(property._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#cad2c5]">
        <Link to="/" className="hover:text-[#52796f]">{t('navHome')}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/properties" className="hover:text-[#52796f]">{t('navProperties')}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#2f3e46] dark:text-white truncate max-w-xs">{property.title}</span>
      </nav>

      {/* 2. Top Header & Title Bar */}
      <div className="space-y-3 pb-6 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#354f52] text-[#2f3e46] dark:text-white border border-[#cad2c5] dark:border-slate-700">
              {property.propertyId}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
              property.purpose === 'sale' ? 'bg-[#2f3e46] text-white' : 'bg-[#84a98c] text-white'
            }`}>
              {property.purpose === 'sale' ? t('forSale') : t('forRent')}
            </span>
            {property.featured && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#52796f] text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{t('featured')}</span>
              </span>
            )}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              property.status === 'available'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
            }`}>
              {property.status === 'available' ? t('available') : property.status === 'sold' ? t('sold') : t('rented')}
            </span>
          </div>

          {/* Social Share & Favorite Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(property._id)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                favorited
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Big Title & Price Row */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2f3e46] dark:text-white tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-[#cad2c5] mt-1.5">
              <MapPin className="w-4 h-4 text-[#52796f] shrink-0" />
              <span>{property.address}, {property.areaBlock}, {property.city}</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-2xl sm:text-4xl font-black text-[#52796f] dark:text-[#84a98c] tracking-tight">
              {formatPrice(property.price, property.purpose)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {formatExactPrice(property.price)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Image Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* 4. Quick Action Callouts (WhatsApp + Call) */}
      <div className="bg-[#f4f7f4] dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#52796f] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#cad2c5]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2f3e46] dark:text-white">
              {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی سے براہ راست رابطہ' : 'Direct Inquiry with Bismillah State Agency'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#cad2c5]">
              {language === 'ur'
                ? 'فوری واٹس ایپ تفصیلات، قانونی دستاویزات اور سائٹ وزٹ کے لیے رابطہ کریں۔'
                : 'Immediate site visits, title inspection, and price negotiation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={generateCallLink('+923128001533')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#354f52] bg-white dark:bg-[#354f52] text-[#2f3e46] dark:text-white font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#52796f]" />
            <span>Call +92 312 8001533</span>
          </a>

          <a
            href={generateWhatsAppLink('+923128001533', property.title, property.propertyId, window.location.href)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
            <span>WhatsApp Agent</span>
          </a>
        </div>
      </div>

      {/* 5. Main Content Grid (Overview & Description vs Inquiry Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Overview, Description, Amenities, Location */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Property Overview Badges */}
          <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
              {t('overview')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">{t('area')}</span>
                <span className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Maximize2 className="w-4 h-4 text-[#52796f]" />
                  {formatArea(property.area, property.areaUnit)}
                </span>
              </div>

              {property.bedrooms !== undefined && property.bedrooms > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">{t('bedrooms')}</span>
                  <span className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Bed className="w-4 h-4 text-[#52796f]" />
                    {property.bedrooms} Beds
                  </span>
                </div>
              )}

              {property.bathrooms !== undefined && property.bathrooms > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">{t('bathrooms')}</span>
                  <span className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Bath className="w-4 h-4 text-[#52796f]" />
                    {property.bathrooms} Baths
                  </span>
                </div>
              )}

              {property.parking !== undefined && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">Parking</span>
                  <span className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Car className="w-4 h-4 text-[#52796f]" />
                    {property.parking} Vehicles
                  </span>
                </div>
              )}

              {property.floors !== undefined && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">Floors</span>
                  <span className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Layers className="w-4 h-4 text-[#52796f]" />
                    {property.floors}
                  </span>
                </div>
              )}

              {property.furnished && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52]">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#cad2c5] block">Furnished</span>
                  <span className="text-xs font-bold text-[#2f3e46] dark:text-white block mt-1">
                    {property.furnished}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
              {t('description')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5] leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
                {t('features')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-[#2f3e46] dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-[#52796f]/15 text-[#52796f] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location & OpenStreetMap */}
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={property.title}
            priceFormatted={formatPrice(property.price, property.purpose)}
            address={property.address}
            city={property.city}
            areaBlock={property.areaBlock}
          />

        </div>

        {/* Right Col: Lead Inquiry Form */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <InquiryForm
            propertyId={property.propertyId}
            propertyTitle={property.title}
            propertySlug={property.slug}
          />

          {/* Agency Assurance Card */}
          <div className="bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/60 dark:border-[#354f52] rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#52796f] dark:text-[#84a98c]">
              Agency Guarantee
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#cad2c5]">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#52796f] shrink-0 mt-0.5" />
                <span>Verified physical inspection in Quetta</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#52796f] shrink-0 mt-0.5" />
                <span>Zero hidden agency fees or commissions</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#52796f] shrink-0 mt-0.5" />
                <span>Direct meeting with owner & token processing</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* 6. Related Properties */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-[#cad2c5]/60 dark:border-[#354f52] space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f3e46] dark:text-white">
            {t('relatedProperties')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((relProp) => (
              <PropertyCard key={relProp._id} property={relProp} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
