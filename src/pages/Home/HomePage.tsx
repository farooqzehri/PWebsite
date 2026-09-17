import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Home,
  Building,
  Store,
  Briefcase,
  Star,
  Quote
} from 'lucide-react';
import { Property, Category, LocationItem, Testimonial } from '../../types';
import { api } from '../../services/api';
import { PropertySearch } from '../../components/search/PropertySearch';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useLanguage } from '../../context/LanguageContext';
import { generateWhatsAppLink, generateCallLink } from '../../utils/formatters';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();

  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredRes, latestRes, catRes, locRes, testRes] = await Promise.all([
          api.getProperties({ featured: true, limit: 4 }),
          api.getProperties({ limit: 6, sort: 'latest' }),
          api.getCategories(),
          api.getLocations(),
          api.getTestimonials()
        ]);

        if (featuredRes.success) setFeaturedProperties(featuredRes.properties || []);
        if (latestRes.success) setLatestProperties(latestRes.properties || []);
        if (catRes.success) setCategories(catRes.categories || []);
        if (locRes.success) setLocations(locRes.locations || []);
        if (testRes.success) setTestimonials(testRes.testimonials || []);
      } catch (e) {
        console.error('Error fetching homepage data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'house': return Home;
      case 'flat': return Building;
      case 'plot': return MapPin;
      case 'shop': return Store;
      case 'office': return Briefcase;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#e5ede6]/60 via-[#f4f7f4] to-transparent dark:from-[#1f2b30] dark:via-[#2f3e46] dark:to-transparent">
        {/* Subtle architectural background texture accent */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#354f52_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#cad2c5]/50 dark:bg-[#354f52] border border-[#52796f]/30 text-xs font-bold text-[#354f52] dark:text-[#cad2c5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#52796f]" />
            <span>{language === 'ur' ? 'کوئٹہ کا قابل اعتماد ترین رئیل اسٹیٹ ادارہ' : 'Quetta\'s Most Trusted Real Estate Agency'}</span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2f3e46] dark:text-white leading-[1.15]">
              {language === 'ur' ? (
                <>کوئٹہ میں اپنا اگلا <span className="text-[#52796f] underline decoration-[#cad2c5]">مکان یا پلاٹ</span> دریافت کریں</>
              ) : (
                <>Find Your Next Property in <span className="text-[#52796f] underline decoration-[#cad2c5]">Quetta</span></>
              )}
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-[#cad2c5] leading-relaxed max-w-2xl mx-auto">
              {language === 'ur'
                ? 'سیٹلائٹ ٹاؤن، جناح روڈ، زرغون روڈ اور کینٹ میں رہائشی مکانات، پلاٹس اور تجارتی دکانوں کی بااعتماد خرید و فروخت۔'
                : 'Verified residential houses, plots, commercial shops, and rental apartments across premier Quetta localities with 100% transparent legal documentation.'}
            </p>
          </div>

          {/* Direct WhatsApp / Call Conversion Row */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a
              href={generateWhatsAppLink('+923128001533')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
              <span>{language === 'ur' ? 'واٹس ایپ پر فوری رابطہ کریں' : 'Instant WhatsApp Inquiry (+92 312 8001533)'}</span>
            </a>

            <a
              href={generateCallLink('+923128001533')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#354f52] border border-[#cad2c5] dark:border-[#52796f] text-[#2f3e46] dark:text-white font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#52796f]" />
              <span>{language === 'ur' ? 'دفتر کال کریں' : 'Call Office Now'}</span>
            </a>
          </div>

          {/* Search Box Component */}
          <div className="pt-4">
            <PropertySearch />
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#52796f] dark:text-[#84a98c] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('featured')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white mt-1">
              {t('exploreFeatured')}
            </h2>
          </div>

          <Link
            to="/properties?featured=true"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#52796f] dark:text-[#84a98c] hover:underline"
          >
            <span>{t('viewAllProperties')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 dark:bg-[#354f52]/40 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* 3. PROPERTY TYPES QUICK EXPLORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
            {language === 'ur' ? 'پراپرٹی کی اہم کیٹیگریز' : 'Explore by Property Category'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
            {language === 'ur'
              ? 'مکانات، پلاٹس اور تجارتی جگہوں کی فوری تلاش'
              : 'Find residential and commercial properties suited for living or investing in Quetta'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((cat) => {
            const IconComponent = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat._id}
                to={`/properties?propertyType=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] hover:border-[#52796f] hover:shadow-md transition-all text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f4f7f4] dark:bg-[#354f52] text-[#52796f] dark:text-[#84a98c] flex items-center justify-center group-hover:bg-[#52796f] group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2f3e46] dark:text-white">
                    {language === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-[#cad2c5] font-medium">
                    {cat.count ? `${cat.count} listings` : 'Browse Listings'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE BISMILLAH STATE AGENCY */}
      <section className="bg-slate-50 dark:bg-[#1f2b30] border-y border-[#cad2c5]/60 dark:border-[#354f52] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#52796f] dark:text-[#84a98c] uppercase tracking-wider">
              {language === 'ur' ? 'ہماری امتیازی خصوصیات' : 'Trusted Local Guidance'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
              {language === 'ur' ? 'بسم اللہ اسٹیٹ ایجنسی کا انتخاب کیوں؟' : 'Why Choose Bismillah State Agency?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/60 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">
                {language === 'ur' ? 'قانونی اور تصدیق شدہ ریکارڈ' : 'Legal & Fard Verification'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                {language === 'ur'
                  ? 'کوئٹہ میں ہر پراپرٹی کی رجسٹری، انتقال اور ریونیو ریکارڈ کی مکمل چھان بین کی جاتی ہے تاکہ آپ کی سرمایہ کاری محفوظ رہے۔'
                  : 'Every property title, registry, and municipal allotment is thoroughly inspected by our experienced team before listing.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/60 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">
                {language === 'ur' ? 'مقامی کوئٹہ مارکیٹ کا گہرا فہم' : 'Authentic Quetta Market Insights'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                {language === 'ur'
                  ? 'سیٹلائٹ ٹاؤن، زرغون روڈ اور کینٹ میں حقیقی مارکیٹ ریٹس کا ادراک تاکہ خریدار اور بیچنے والے دونوں کا حق محفوظ رہے۔'
                  : 'Accurate property evaluations reflecting genuine local supply and demand in Satellite Town, Jinnah Road, and Cantt.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#2f3e46] p-6 rounded-2xl border border-[#cad2c5]/60 dark:border-[#354f52] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#52796f]/15 text-[#52796f] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2f3e46] dark:text-white">
                {language === 'ur' ? 'فوری اور شفاف رابطہ' : 'Transparent WhatsApp Support'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#cad2c5] leading-relaxed">
                {language === 'ur'
                  ? 'کوئی پوشیدہ کمیشن نہیں، فوری واٹس ایپ تفصیلات اور برائے راست سائٹ وزٹ کی سہولت۔'
                  : 'No hidden fees or third-party markups. Connect directly with our agency team via WhatsApp and phone for immediate site visits.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#52796f] dark:text-[#84a98c] uppercase tracking-wider">
              {language === 'ur' ? 'تازہ ترین شامل شدہ' : 'Fresh On Market'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white mt-1">
              {t('exploreLatest')}
            </h2>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#52796f] dark:text-[#84a98c] hover:underline"
          >
            <span>{t('viewAllProperties')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProperties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      </section>

      {/* 6. POPULAR QUETTA LOCALITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
            {t('popularAreas')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
            {language === 'ur' ? 'کوئٹہ کے مقبول ترین رہائشی اور تجارتی مراکز میں پراپرٹی تلاش کریں' : 'Browse properties across key residential and commercial hubs in Quetta'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {locations.slice(0, 6).map((loc) => (
            <Link
              key={loc._id}
              to={`/properties?area=${encodeURIComponent(loc.area)}`}
              className="p-4 rounded-xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/70 dark:border-[#354f52] hover:border-[#52796f] hover:shadow-sm transition-all text-center block"
            >
              <MapPin className="w-5 h-5 text-[#52796f] mx-auto mb-2" />
              <span className="block font-bold text-xs sm:text-sm text-[#2f3e46] dark:text-white truncate">
                {language === 'ur' && loc.areaUrdu ? loc.areaUrdu : loc.area}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#cad2c5]">Quetta</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
              {t('testimonialsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
              {language === 'ur' ? 'کوئٹہ میں ہمارے مطمئن خریداروں اور کرایہ داروں کے تاثرات' : 'What clients in Quetta say about our transparent property services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem) => (
              <div
                key={tItem._id}
                className="p-6 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-4 shadow-xs relative"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(tItem.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5] italic leading-relaxed">
                  "{tItem.message}"
                </p>
                <div className="pt-2 border-t border-[#cad2c5]/40 dark:border-[#354f52] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2f3e46] dark:text-white">
                      {tItem.name}
                    </h4>
                    <span className="text-[11px] text-[#52796f] dark:text-[#84a98c] font-medium">
                      {tItem.role}
                    </span>
                  </div>
                  <Quote className="w-6 h-6 text-[#cad2c5]/40 dark:text-[#354f52]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CONVERSION CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#354f52] dark:bg-[#1f2b30] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'ur'
                ? 'کیا آپ کوئٹہ میں مکان، پلاٹ یا دکان فروخت یا کرایہ پر دینا چاہتے ہیں؟'
                : 'Looking to Buy, Sell, or Rent Property in Quetta?'}
            </h2>
            <p className="text-xs sm:text-sm text-[#cad2c5] leading-relaxed">
              {language === 'ur'
                ? 'ہمارے نمائندے سے واٹس ایپ پر فوری مشورہ حاصل کریں۔ ہم آپ کی پراپرٹی کو صحیح خریدار تک پہنچانے میں مدد کریں گے۔'
                : 'Speak directly with our Quetta property advisors on WhatsApp or submit your property for free marketing.'}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={generateWhatsAppLink('+923128001533')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#84a98c] hover:bg-[#52796f] text-[#2f3e46] hover:text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'ur' ? 'واٹس ایپ پر میسج کریں' : 'Chat on WhatsApp (+92 312 8001533)'}</span>
              </a>

              <Link
                to="/submit-property"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#cad2c5] text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                <span>{language === 'ur' ? 'اپنی پراپرٹی لگائیں' : 'List Your Property Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
