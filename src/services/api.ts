import { Property, Category, LocationItem, Inquiry, Testimonial, WebsiteSettings, AdminStats, FilterParams } from '../types';

// Read API URL / Key from environment
const rawApiKey = (import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_URL || '').trim();
export const isUrlTarget = rawApiKey.startsWith('http://') || rawApiKey.startsWith('https://');
export const CUSTOM_API_URL = isUrlTarget ? rawApiKey.replace(/\/+$/, '') : '';

export function resolveEndpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (CUSTOM_API_URL) {
    if (CUSTOM_API_URL.endsWith('/api') && cleanPath.startsWith('/api')) {
      return `${CUSTOM_API_URL}${cleanPath.substring(4)}`;
    }
    return `${CUSTOM_API_URL}${cleanPath}`;
  }
  return cleanPath;
}

export function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('bsa_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (rawApiKey && !isUrlTarget) {
    headers['x-api-key'] = rawApiKey;
  }
  return headers;
}

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const targetUrl = resolveEndpoint(endpoint);
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(targetUrl, { ...options, headers });
    return res;
  } catch (err) {
    // If request to custom endpoint (e.g. http://localhost:5000) failed due to network / CORS / unreachable,
    // fallback gracefully to built-in local backend so app preview remains fully functional
    if (CUSTOM_API_URL && targetUrl !== endpoint) {
      console.warn(`API call to ${targetUrl} unreachable, falling back to ${endpoint}`);
      return await fetch(endpoint, { ...options, headers });
    }
    throw err;
  }
}

export const api = {
  // Properties
  async getProperties(params: FilterParams = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    const endpoint = `/api/properties${queryString ? `?${queryString}` : ''}`;
    const res = await apiFetch(endpoint);
    return res.json();
  },

  async getProperty(identifier: string): Promise<{ success: boolean; property: Property; related: Property[] }> {
    const res = await apiFetch(`/api/properties/${identifier}`);
    return res.json();
  },

  async createProperty(data: Partial<Property>) {
    const res = await apiFetch(`/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProperty(id: string, data: Partial<Property>) {
    const res = await apiFetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProperty(id: string) {
    const res = await apiFetch(`/api/properties/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async toggleFeatured(id: string) {
    const res = await apiFetch(`/api/properties/${id}/featured`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async updatePropertyStatus(id: string, status: string) {
    const res = await apiFetch(`/api/properties/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    const res = await apiFetch(`/api/categories`);
    return res.json();
  },

  async createCategory(data: Partial<Category>) {
    const res = await apiFetch(`/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCategory(id: string) {
    const res = await apiFetch(`/api/categories/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Locations
  async getLocations(): Promise<{ success: boolean; locations: LocationItem[] }> {
    const res = await apiFetch(`/api/locations`);
    return res.json();
  },

  async createLocation(data: Partial<LocationItem>) {
    const res = await apiFetch(`/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteLocation(id: string) {
    const res = await apiFetch(`/api/locations/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Inquiries
  async submitInquiry(data: Partial<Inquiry>) {
    const res = await apiFetch(`/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getInquiries(): Promise<{ success: boolean; inquiries: Inquiry[] }> {
    const res = await apiFetch(`/api/inquiries`);
    return res.json();
  },

  async updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    const res = await apiFetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async deleteInquiry(id: string) {
    const res = await apiFetch(`/api/inquiries/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Testimonials
  async getTestimonials(): Promise<{ success: boolean; testimonials: Testimonial[] }> {
    const res = await apiFetch(`/api/testimonials`);
    return res.json();
  },

  async createTestimonial(data: Partial<Testimonial>) {
    const res = await apiFetch(`/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTestimonial(id: string) {
    const res = await apiFetch(`/api/testimonials/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; settings: WebsiteSettings }> {
    const res = await apiFetch(`/api/settings`);
    return res.json();
  },

  async updateSettings(data: Partial<WebsiteSettings>) {
    const res = await apiFetch(`/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin Stats
  async getStats() {
    const res = await apiFetch(`/api/admin/stats`);
    return res.json();
  },

  async getAdminStats(): Promise<{ success: boolean; stats: AdminStats }> {
    return this.getStats();
  },

  async updateInquiry(id: string, data: { status: 'new' | 'contacted' | 'closed' }) {
    return this.updateInquiryStatus(id, data.status);
  },

  // Upload image
  async uploadImage(image: string, alt?: string, order?: number) {
    const res = await apiFetch(`/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image, alt, order })
    });
    return res.json();
  }
};
