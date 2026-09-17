import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    navHome: 'Home',
    navProperties: 'Properties',
    navBuy: 'Buy',
    navRent: 'Rent',
    navAbout: 'About Us',
    navContact: 'Contact',
    navSubmit: 'Submit Property',
    navAdmin: 'Admin Dashboard',
    navLogin: 'Login',
    navFavorites: 'Saved',
    
    // Header & CTAs
    callUs: 'Call Us',
    whatsappUs: 'WhatsApp',
    searchPlaceholder: 'Search by area, bedrooms, or type (e.g. 3 bed house Satellite Town)...',
    searchButton: 'Search Properties',
    listPropertyButton: 'List Your Property',
    
    // Filters & Labels
    purpose: 'Purpose',
    allPurposes: 'All',
    forSale: 'For Sale',
    forRent: 'For Rent',
    propertyType: 'Property Type',
    allTypes: 'All Types',
    house: 'House',
    flat: 'Flat / Apartment',
    plot: 'Plot',
    commercial: 'Commercial',
    shop: 'Shop',
    office: 'Office',
    land: 'Land',
    warehouse: 'Warehouse',
    farmhouse: 'Farmhouse',
    location: 'Location / Area',
    allLocations: 'All Areas in Quetta',
    priceRange: 'Price Range',
    anyPrice: 'Any Price',
    minPrice: 'Min Price (PKR)',
    maxPrice: 'Max Price (PKR)',
    bedrooms: 'Bedrooms',
    anyBeds: 'Any',
    bathrooms: 'Bathrooms',
    status: 'Status',
    available: 'Available',
    sold: 'Sold',
    rented: 'Rented',
    featured: 'Featured',
    sortBy: 'Sort By',
    sortLatest: 'Latest Added',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortViews: 'Most Viewed',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',

    // Property Card & Details
    viewProperty: 'View Details',
    id: 'Property ID',
    beds: 'Beds',
    baths: 'Baths',
    area: 'Area',
    overview: 'Property Overview',
    description: 'Description',
    features: 'Key Features & Amenities',
    locationOnMap: 'Location & Map',
    openGoogleMaps: 'Open in Google Maps',
    relatedProperties: 'Related Properties in Quetta',
    share: 'Share',
    savedToFavorites: 'Saved to favorites',
    removedFromFavorites: 'Removed from favorites',

    // Inquiry Form
    inquireNow: 'Send an Inquiry',
    inquireSubtitle: 'Our property advisors in Quetta will respond promptly.',
    yourName: 'Your Full Name',
    yourPhone: 'Phone / WhatsApp Number',
    yourEmail: 'Email Address (Optional)',
    yourMessage: 'Message or specific questions',
    preferredContact: 'Preferred Contact Method',
    sendInquiryBtn: 'Submit Inquiry',
    inquirySuccess: 'Thank you! Your inquiry has been submitted. We will contact you shortly.',

    // Common
    agencyName: 'Bismillah State Agency',
    quettaBalochistan: 'Quetta, Balochistan, Pakistan',
    noPropertiesFound: 'No properties found matching your criteria.',
    tryAdjustingFilters: 'Try adjusting your search criteria or clearing filters.',
    exploreFeatured: 'Featured Properties in Quetta',
    exploreLatest: 'Latest Properties in Quetta',
    popularAreas: 'Prime Quetta Localities',
    testimonialsTitle: 'Client Trust & Experiences',
    viewAllProperties: 'View All Properties'
  },
  ur: {
    // Navigation
    navHome: 'صفحہ اول',
    navProperties: 'تمام پراپرٹیز',
    navBuy: 'خریدیں',
    navRent: 'کرایہ',
    navAbout: 'ہمارے بارے میں',
    navContact: 'رابطہ کریں',
    navSubmit: 'پراپرٹی لگائیں',
    navAdmin: 'ایڈمن ڈیش بورڈ',
    navLogin: 'لاگ ان',
    navFavorites: 'محفوظ شدہ',
    
    // Header & CTAs
    callUs: 'کال کریں',
    whatsappUs: 'واٹس ایپ',
    searchPlaceholder: 'علاقہ، کمرے یا پراپرٹی کی قسم لکھیں (مثلاً سیٹلائٹ ٹاؤن مکان)...',
    searchButton: 'تلاش کریں',
    listPropertyButton: 'اپنی پراپرٹی درج کریں',
    
    // Filters & Labels
    purpose: 'مقصد',
    allPurposes: 'تمام',
    forSale: 'برائے فروخت',
    forRent: 'برائے کرایہ',
    propertyType: 'پراپرٹی کی نوعیت',
    allTypes: 'تمام اقسام',
    house: 'مکان',
    flat: 'فلیٹ / اپارٹمنٹ',
    plot: 'پلاٹ',
    commercial: 'کمرشل',
    shop: 'دکان',
    office: 'دفتر',
    land: 'اراضی',
    warehouse: 'گودام',
    farmhouse: 'فارم ہاؤس',
    location: 'علاقہ / لوکیشن',
    allLocations: 'کوئٹہ کے تمام علاقے',
    priceRange: 'قیمت کی حد',
    anyPrice: 'کوئی بھی قیمت',
    minPrice: 'کم سے کم قیمت (روپے)',
    maxPrice: 'زیادہ سے زیادہ قیمت (روپے)',
    bedrooms: 'بیڈ رومز',
    anyBeds: 'کوئی بھی',
    bathrooms: 'باتھ رومز',
    status: 'حالت',
    available: 'دستیاب',
    sold: 'فروخت شدہ',
    rented: 'کرائے پر دیا گیا',
    featured: 'خصوصی پراپرٹی',
    sortBy: 'ترتیب دیں',
    sortLatest: 'سب سے نئی',
    sortPriceAsc: 'قیمت: کم سے زیادہ',
    sortPriceDesc: 'قیمت: زیادہ سے کم',
    sortViews: 'سب سے زیادہ دیکھی گئی',
    clearFilters: 'فلٹرز ختم کریں',
    applyFilters: 'فلٹرز لگائیں',

    // Property Card & Details
    viewProperty: 'تفصیلات دیکھیں',
    id: 'پراپرٹی آئی ڈی',
    beds: 'کمرے',
    baths: 'باتھ',
    area: 'رقبہ',
    overview: 'پراپرٹی کا جائزہ',
    description: 'تفصیل',
    features: 'اہم خصوصیات اور سہولیات',
    locationOnMap: 'مقام اور گوگل میپ',
    openGoogleMaps: 'گوگل میپ پر دیکھیں',
    relatedProperties: 'ملتی جلتی پراپرٹیز',
    share: 'شیئر کریں',
    savedToFavorites: 'محفوظ کر لیا گیا',
    removedFromFavorites: 'محفوظ فہرست سے ہٹا دیا گیا',

    // Inquiry Form
    inquireNow: 'معلومات حاصل کریں',
    inquireSubtitle: 'کوئٹہ میں ہمارے پراپرٹی مشیر آپ سے جلد رابطہ کریں گے۔',
    yourName: 'آپ کا پورا نام',
    yourPhone: 'فون یا واٹس ایپ نمبر',
    yourEmail: 'ای میل (اختیاری)',
    yourMessage: 'پیغام یا خاص سوالات',
    preferredContact: 'رابطے کا ترجیحی طریقہ',
    sendInquiryBtn: 'پیغام بھیجیں',
    inquirySuccess: 'شکریہ! آپ کا پیغام موصول ہو گیا۔ ہم جلد رابطہ کریں گے۔',

    // Common
    agencyName: 'بسم اللہ اسٹیٹ ایجنسی',
    quettaBalochistan: 'کوئٹہ، بلوچستان، پاکستان',
    noPropertiesFound: 'آپ کے معیار کے مطابق کوئی پراپرٹی نہیں ملی۔',
    tryAdjustingFilters: 'براہ کرم فلٹرز بدل کر دوبارہ کوشش کریں۔',
    exploreFeatured: 'کوئٹہ کی منتخب خصوصی پراپرٹیز',
    exploreLatest: 'کوئٹہ کی تازہ ترین پراپرٹیز',
    popularAreas: 'کوئٹہ کے مقبول ترین علاقے',
    testimonialsTitle: 'صارفین کا اعتماد اور تاثرات',
    viewAllProperties: 'تمام پراپرٹیز دیکھیں'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('bsa_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bsa_language', lang);
  };

  const isRTL = language === 'ur';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
