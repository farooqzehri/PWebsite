export type PropertyPurpose = 'sale' | 'rent' | 'lease';

export type PropertyType = 
  | 'house'
  | 'flat'
  | 'apartment'
  | 'plot'
  | 'commercial'
  | 'shop'
  | 'office'
  | 'land'
  | 'warehouse'
  | 'farmhouse';

export type PropertyStatus = 'available' | 'sold' | 'rented';

export type AreaUnit = 'Marla' | 'Kanal' | 'Sq. Ft.' | 'Sq. Yd.' | 'Acre';

export interface PropertyImage {
  url: string;
  publicId?: string;
  alt?: string;
  order: number;
}

export interface Property {
  _id: string;
  propertyId: string; // e.g. BSA-0001
  title: string;
  slug: string;
  price: number;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: AreaUnit;
  address: string;
  city: string;
  areaBlock: string;
  latitude?: number;
  longitude?: number;
  images: PropertyImage[];
  video?: string;
  status: PropertyStatus;
  featured: boolean;
  published: boolean;
  parking?: number;
  floors?: number;
  furnished?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  amenities?: string[];
  views: number;
  favoritesCount: number;
  owner?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  agent?: {
    name: string;
    phone: string;
    whatsapp: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  id?: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  icon?: string;
  description?: string;
  count?: number;
  enabled: boolean;
}

export interface LocationItem {
  _id: string;
  id?: string;
  country: string;
  province: string;
  city: string;
  cityUrdu?: string;
  area: string;
  areaUrdu?: string;
  blocks?: string[];
  featured?: boolean;
}

export interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  propertySlug?: string;
  preferredContact?: 'whatsapp' | 'call' | 'email';
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  message: string;
  image?: string;
  rating: number;
  published: boolean;
  createdAt: string;
}

export interface WebsiteSettings {
  agencyName: string;
  agencyNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressUrdu: string;
  city: string;
  heroTitle: string;
  heroTitleUrdu: string;
  heroSubtitle: string;
  heroSubtitleUrdu: string;
  hours?: string;
  description?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export type AgencySettings = WebsiteSettings;

export interface AdminStats {
  totalProperties: number;
  activeProperties: number;
  soldOrRented: number;
  totalViews: number;
  totalInquiries: number;
  newInquiries: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'visitor' | 'property_owner';
  phone?: string;
}

export interface FilterParams {
  purpose?: string;
  propertyType?: string;
  city?: string;
  area?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  status?: string;
  featured?: boolean | string;
  search?: string;
  sort?: 'latest' | 'price-low' | 'price-high' | 'views';
  page?: number;
  limit?: number;
}
