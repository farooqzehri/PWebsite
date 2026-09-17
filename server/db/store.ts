import fs from 'fs';
import path from 'path';
import { Property, Category, LocationItem, Inquiry, Testimonial, WebsiteSettings, User, FilterParams } from '../../src/types';
import { initialProperties, initialCategories, initialLocations, initialTestimonials, initialSettings, initialUsers } from '../data/initialData';

interface DatabaseSchema {
  properties: Property[];
  categories: Category[];
  locations: LocationItem[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  settings: WebsiteSettings;
  users: (User & { passwordHash?: string })[];
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class Store {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = {
      properties: [...initialProperties],
      categories: [...initialCategories],
      locations: [...initialLocations],
      inquiries: [
        {
          _id: "inq-1",
          name: "Muhammad Zubair",
          phone: "+92 300 9876543",
          email: "zubair@gmail.com",
          message: "Interested in the 5-bedroom house in Satellite Town. Can we schedule a site visit this Friday?",
          propertyId: "BSA-0001",
          propertyTitle: "5 Bedroom Luxury Modern House in Satellite Town",
          propertySlug: "5-bedroom-luxury-modern-house-in-satellite-town-quetta",
          preferredContact: "whatsapp",
          status: "new",
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
        }
      ],
      testimonials: [...initialTestimonials],
      settings: { ...initialSettings },
      users: [
        {
          id: "admin-1",
          name: "Bismillah State Agency Admin",
          email: "admin@bismillahstateagency.com",
          role: "admin",
          phone: "+92 312 8001533",
          passwordHash: "admin123" // In production use bcrypt
        }
      ]
    };
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          properties: parsed.properties || [...initialProperties],
          categories: parsed.categories || [...initialCategories],
          locations: parsed.locations || [...initialLocations],
          inquiries: parsed.inquiries || [],
          testimonials: parsed.testimonials || [...initialTestimonials],
          settings: parsed.settings || { ...initialSettings },
          users: parsed.users || [...initialUsers]
        };
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.warn("Could not read store.json, using default initial data:", err);
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error saving store to disk:", err);
    }
  }

  // --- Properties ---
  getProperties(params: FilterParams = {}) {
    let list = [...this.data.properties];

    // Status filter
    if (params.status && params.status !== 'all') {
      list = list.filter(p => p.status.toLowerCase() === params.status?.toLowerCase());
    }

    // Purpose filter (sale / rent)
    if (params.purpose && params.purpose !== 'all') {
      list = list.filter(p => p.purpose.toLowerCase() === params.purpose?.toLowerCase());
    }

    // Property type filter
    if (params.propertyType && params.propertyType !== 'all') {
      const targetType = params.propertyType.toLowerCase();
      list = list.filter(p => {
        const pt = p.propertyType.toLowerCase();
        if (targetType === 'flat' || targetType === 'apartment') {
          return pt === 'flat' || pt === 'apartment';
        }
        return pt === targetType;
      });
    }

    // City filter
    if (params.city && params.city !== 'all') {
      list = list.filter(p => p.city.toLowerCase().includes(params.city!.toLowerCase()));
    }

    // Area filter
    if (params.area && params.area !== 'all') {
      list = list.filter(p => 
        p.areaBlock.toLowerCase().includes(params.area!.toLowerCase()) ||
        p.address.toLowerCase().includes(params.area!.toLowerCase())
      );
    }

    // Price range
    if (params.minPrice) {
      const min = Number(params.minPrice);
      if (!isNaN(min) && min > 0) {
        list = list.filter(p => p.price >= min);
      }
    }
    if (params.maxPrice) {
      const max = Number(params.maxPrice);
      if (!isNaN(max) && max > 0) {
        list = list.filter(p => p.price <= max);
      }
    }

    // Bedrooms
    if (params.bedrooms && params.bedrooms !== 'all') {
      const beds = Number(params.bedrooms);
      if (!isNaN(beds)) {
        if (beds >= 5) {
          list = list.filter(p => (p.bedrooms || 0) >= 5);
        } else {
          list = list.filter(p => p.bedrooms === beds);
        }
      }
    }

    // Bathrooms
    if (params.bathrooms && params.bathrooms !== 'all') {
      const baths = Number(params.bathrooms);
      if (!isNaN(baths)) {
        list = list.filter(p => (p.bathrooms || 0) >= baths);
      }
    }

    // Featured
    if (params.featured === true || params.featured === 'true') {
      list = list.filter(p => p.featured === true);
    }

    // Keyword & Natural Language search
    if (params.search && params.search.trim()) {
      const term = params.search.toLowerCase().trim();

      // Check for price intent in natural search (e.g., "under 2 crore", "under 50k", "50 lac")
      let extractedMaxPrice: number | null = null;
      if (term.includes('crore')) {
        const match = term.match(/(\d+(?:\.\d+)?)\s*crore/);
        if (match) extractedMaxPrice = parseFloat(match[1]) * 10000000;
      } else if (term.includes('lac') || term.includes('lakh')) {
        const match = term.match(/(\d+(?:\.\d+)?)\s*la[ck]h?/);
        if (match) extractedMaxPrice = parseFloat(match[1]) * 100000;
      }

      // Check for bedroom intent
      let extractedBeds: number | null = null;
      const bedMatch = term.match(/(\d+)\s*(?:bed|bedroom)/);
      if (bedMatch) {
        extractedBeds = parseInt(bedMatch[1], 10);
      }

      const words = term.split(/\s+/).filter(w => 
        !['in', 'at', 'near', 'under', 'for', 'a', 'an', 'the', 'with', 'crore', 'lac', 'lakh', 'pkr'].includes(w)
      );

      list = list.filter(p => {
        const haystack = `${p.propertyId} ${p.title} ${p.description} ${p.areaBlock} ${p.city} ${p.address} ${p.propertyType} ${p.purpose}`.toLowerCase();
        
        const matchesWords = words.length === 0 || words.some(w => haystack.includes(w));
        const matchesPrice = extractedMaxPrice ? p.price <= extractedMaxPrice : true;
        const matchesBeds = extractedBeds ? (p.bedrooms || 0) === extractedBeds : true;

        return matchesWords && matchesPrice && matchesBeds;
      });
    }

    // Sorting
    const sort = params.sort || 'latest';
    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      properties: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  getPropertyBySlugOrId(identifier: string) {
    const property = this.data.properties.find(p => 
      p.slug.toLowerCase() === identifier.toLowerCase() ||
      p.propertyId.toLowerCase() === identifier.toLowerCase() ||
      p._id === identifier
    );
    if (property) {
      property.views = (property.views || 0) + 1;
      this.save();
    }
    return property;
  }

  getRelatedProperties(currentProperty: Property, limit = 3) {
    return this.data.properties
      .filter(p => p._id !== currentProperty._id && p.status === 'available')
      .filter(p => p.propertyType === currentProperty.propertyType || p.areaBlock === currentProperty.areaBlock || p.purpose === currentProperty.purpose)
      .slice(0, limit);
  }

  generateNextPropertyId(): string {
    const existing = this.data.properties
      .map(p => {
        const match = p.propertyId.match(/BSA-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = existing.length > 0 ? Math.max(...existing) : 0;
    const next = max + 1;
    return `BSA-${next.toString().padStart(4, '0')}`;
  }

  createProperty(propData: Partial<Property>): Property {
    const propertyId = propData.propertyId || this.generateNextPropertyId();
    const slugBase = (propData.title || `property-${propertyId}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${propData.city ? propData.city.toLowerCase() : 'quetta'}`.replace(/--+/g, '-');

    const newProp: Property = {
      _id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      propertyId,
      title: propData.title || "Untitled Property",
      slug,
      price: Number(propData.price) || 0,
      purpose: propData.purpose || "sale",
      propertyType: propData.propertyType || "house",
      description: propData.description || "",
      bedrooms: propData.bedrooms !== undefined ? Number(propData.bedrooms) : undefined,
      bathrooms: propData.bathrooms !== undefined ? Number(propData.bathrooms) : undefined,
      area: Number(propData.area) || 0,
      areaUnit: propData.areaUnit || "Marla",
      address: propData.address || "Quetta, Balochistan",
      city: propData.city || "Quetta",
      areaBlock: propData.areaBlock || "Satellite Town",
      latitude: propData.latitude || 30.1798,
      longitude: propData.longitude || 66.9750,
      images: propData.images && propData.images.length > 0 ? propData.images : [
        { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: "Property Image", order: 1 }
      ],
      video: propData.video || "",
      status: propData.status || "available",
      featured: Boolean(propData.featured),
      published: propData.published !== undefined ? Boolean(propData.published) : true,
      parking: propData.parking ? Number(propData.parking) : undefined,
      floors: propData.floors ? Number(propData.floors) : undefined,
      furnished: propData.furnished || "Unfurnished",
      amenities: propData.amenities || [],
      views: 0,
      favoritesCount: 0,
      agent: {
        name: "Bismillah State Agency Representative",
        phone: "+92 312 8001533",
        whatsapp: "+92 312 8001533"
      },
      seoTitle: `${propData.title || 'Property'} in ${propData.city || 'Quetta'} | Bismillah State Agency`,
      seoDescription: `${propData.title} for ${propData.purpose} in ${propData.areaBlock || 'Quetta'}. Contact Bismillah State Agency on +92 312 8001533.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.properties.unshift(newProp);
    this.save();
    return newProp;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const idx = this.data.properties.findIndex(p => p._id === id || p.propertyId === id);
    if (idx === -1) return null;

    const existing = this.data.properties[idx];
    const updated: Property = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.data.properties[idx] = updated;
    this.save();
    return updated;
  }

  deleteProperty(id: string): boolean {
    const initialLen = this.data.properties.length;
    this.data.properties = this.data.properties.filter(p => p._id !== id && p.propertyId !== id);
    const deleted = this.data.properties.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  createCategory(cat: Partial<Category>): Category {
    const newCat: Category = {
      _id: `cat-${Date.now()}`,
      name: cat.name || "New Category",
      nameUrdu: cat.nameUrdu || "",
      slug: (cat.name || "new-category").toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: cat.icon || "Building",
      description: cat.description || "",
      count: 0,
      enabled: cat.enabled !== undefined ? cat.enabled : true
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const len = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c._id !== id);
    const ok = this.data.categories.length < len;
    if (ok) this.save();
    return ok;
  }

  // --- Locations ---
  getLocations(): LocationItem[] {
    return this.data.locations;
  }

  createLocation(loc: Partial<LocationItem>): LocationItem {
    const newLoc: LocationItem = {
      _id: `loc-${Date.now()}`,
      country: loc.country || "Pakistan",
      province: loc.province || "Balochistan",
      city: loc.city || "Quetta",
      cityUrdu: loc.cityUrdu || "کوئٹہ",
      area: loc.area || "New Area",
      areaUrdu: loc.areaUrdu || "",
      blocks: loc.blocks || [],
      featured: Boolean(loc.featured)
    };
    this.data.locations.push(newLoc);
    this.save();
    return newLoc;
  }

  updateLocation(id: string, updates: Partial<LocationItem>): LocationItem | null {
    const idx = this.data.locations.findIndex(l => l._id === id);
    if (idx === -1) return null;
    this.data.locations[idx] = { ...this.data.locations[idx], ...updates };
    this.save();
    return this.data.locations[idx];
  }

  deleteLocation(id: string): boolean {
    const len = this.data.locations.length;
    this.data.locations = this.data.locations.filter(l => l._id !== id);
    const ok = this.data.locations.length < len;
    if (ok) this.save();
    return ok;
  }

  // --- Inquiries ---
  getInquiries(): Inquiry[] {
    return this.data.inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createInquiry(inq: Partial<Inquiry>): Inquiry {
    const newInquiry: Inquiry = {
      _id: `inq-${Date.now()}`,
      name: inq.name || "Anonymous",
      phone: inq.phone || "",
      email: inq.email || "",
      message: inq.message || "",
      propertyId: inq.propertyId,
      propertyTitle: inq.propertyTitle,
      propertySlug: inq.propertySlug,
      preferredContact: inq.preferredContact || "whatsapp",
      status: "new",
      createdAt: new Date().toISOString()
    };
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Inquiry | null {
    const idx = this.data.inquiries.findIndex(i => i._id === id);
    if (idx === -1) return null;
    this.data.inquiries[idx].status = status;
    this.save();
    return this.data.inquiries[idx];
  }

  deleteInquiry(id: string): boolean {
    const len = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => i._id !== id);
    const ok = this.data.inquiries.length < len;
    if (ok) this.save();
    return ok;
  }

  // --- Testimonials ---
  getTestimonials(): Testimonial[] {
    return this.data.testimonials;
  }

  createTestimonial(t: Partial<Testimonial>): Testimonial {
    const item: Testimonial = {
      _id: `test-${Date.now()}`,
      name: t.name || "Client",
      role: t.role || "Property Client",
      message: t.message || "",
      image: t.image,
      rating: t.rating || 5,
      published: t.published !== undefined ? t.published : true,
      createdAt: new Date().toISOString()
    };
    this.data.testimonials.unshift(item);
    this.save();
    return item;
  }

  updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const idx = this.data.testimonials.findIndex(t => t._id === id);
    if (idx === -1) return null;
    this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updates };
    this.save();
    return this.data.testimonials[idx];
  }

  deleteTestimonial(id: string): boolean {
    const len = this.data.testimonials.length;
    this.data.testimonials = this.data.testimonials.filter(t => t._id !== id);
    const ok = this.data.testimonials.length < len;
    if (ok) this.save();
    return ok;
  }

  // --- Settings ---
  getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- Users & Auth ---
  findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Partial<User & { passwordHash?: string }>) {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: user.name || "User",
      email: user.email || "",
      role: user.role || "visitor",
      phone: user.phone || "",
      passwordHash: user.passwordHash || "secret123"
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- Admin Stats ---
  getStats() {
    const props = this.data.properties;
    const inquiries = this.data.inquiries;

    const totalProperties = props.length;
    const available = props.filter(p => p.status === 'available').length;
    const sold = props.filter(p => p.status === 'sold').length;
    const rented = props.filter(p => p.status === 'rented').length;
    const featured = props.filter(p => p.featured).length;
    const newInquiries = inquiries.filter(i => i.status === 'new').length;
    const totalViews = props.reduce((acc, p) => acc + (p.views || 0), 0);

    // Breakdown by type
    const byType: Record<string, number> = {};
    props.forEach(p => {
      byType[p.propertyType] = (byType[p.propertyType] || 0) + 1;
    });

    // Breakdown by purpose
    const byPurpose: Record<string, number> = {
      sale: props.filter(p => p.purpose === 'sale').length,
      rent: props.filter(p => p.purpose === 'rent').length
    };

    return {
      totalProperties,
      available,
      activeProperties: available,
      soldOrRented: sold + rented,
      sold,
      rented,
      featured,
      newInquiries,
      totalInquiries: inquiries.length,
      totalViews,
      byType,
      byPurpose
    };
  }
}

export const db = new Store();
