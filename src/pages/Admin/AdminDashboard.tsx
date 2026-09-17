import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Eye, 
  CheckCircle, 
  Clock, 
  Phone, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  Settings, 
  Save, 
  LogOut,
  ExternalLink,
  X,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { Property, Inquiry, AgencySettings, AdminStats } from '../../types';
import { formatPrice, formatExactPrice, generateWhatsAppLink, generateCallLink, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { AdminMapPicker } from '../../components/common/AdminMapPicker';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Property Modal State (Create / Edit)
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    purpose: 'sale',
    propertyType: 'house',
    price: '',
    area: '',
    areaUnit: 'marla',
    city: 'Quetta',
    areaBlock: 'Satellite Town',
    address: '',
    latitude: '30.1685',
    longitude: '66.9950',
    bedrooms: '3',
    bathrooms: '3',
    parking: '1',
    floors: '2',
    description: '',
    featured: false,
    status: 'available',
    amenities: 'Electricity, Gas (Sui Gas), Water Supply, Boundary Wall',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  });

  // Settings Save State
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Filters for properties tab
  const [propSearch, setPropSearch] = useState('');
  const [propStatusFilter, setPropStatusFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, inqRes, setRes] = await Promise.all([
        api.getAdminStats(),
        api.getProperties({ limit: 100, status: 'all' }),
        api.getInquiries(),
        api.getSettings()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (propsRes.success) setProperties(propsRes.properties || []);
      if (inqRes.success) setInquiries(inqRes.inquiries || []);
      if (setRes.success) setSettings(setRes.settings);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler to open create modal
  const handleOpenCreateModal = () => {
    setEditingProperty(null);
    setPropertyForm({
      title: '',
      purpose: 'sale',
      propertyType: 'house',
      price: '',
      area: '5',
      areaUnit: 'marla',
      city: 'Quetta',
      areaBlock: 'Satellite Town',
      address: '',
      latitude: '30.1685',
      longitude: '66.9950',
      bedrooms: '3',
      bathrooms: '3',
      parking: '1',
      floors: '2',
      description: '',
      featured: false,
      status: 'available',
      amenities: 'Electricity, Gas (Sui Gas), Water Supply, Boundary Wall',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    });
    setPropertyModalOpen(true);
  };

  // Handler to open edit modal
  const handleOpenEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setPropertyForm({
      title: prop.title,
      purpose: prop.purpose,
      propertyType: prop.propertyType,
      price: String(prop.price),
      area: String(prop.area),
      areaUnit: prop.areaUnit,
      city: prop.city,
      areaBlock: prop.areaBlock,
      address: prop.address,
      latitude: prop.latitude !== undefined ? String(prop.latitude) : '30.1798',
      longitude: prop.longitude !== undefined ? String(prop.longitude) : '66.9750',
      bedrooms: String(prop.bedrooms || 0),
      bathrooms: String(prop.bathrooms || 0),
      parking: String(prop.parking || 0),
      floors: String(prop.floors || 1),
      description: prop.description,
      featured: Boolean(prop.featured),
      status: prop.status,
      amenities: (prop.amenities || []).join(', '),
      imageUrl: prop.images && prop.images[0] ? prop.images[0].url : ''
    });
    setPropertyModalOpen(true);
  };

  // Save Property (Create or Update)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...propertyForm,
      price: Number(propertyForm.price),
      area: Number(propertyForm.area),
      latitude: propertyForm.latitude ? parseFloat(propertyForm.latitude) : 30.1798,
      longitude: propertyForm.longitude ? parseFloat(propertyForm.longitude) : 66.9750,
      bedrooms: Number(propertyForm.bedrooms),
      bathrooms: Number(propertyForm.bathrooms),
      parking: Number(propertyForm.parking),
      floors: Number(propertyForm.floors),
      amenities: propertyForm.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: propertyForm.imageUrl ? [{ url: propertyForm.imageUrl, isMain: true, order: 1 }] : []
    };

    if (editingProperty) {
      await api.updateProperty(editingProperty._id, payload);
    } else {
      await api.createProperty(payload);
    }

    setPropertyModalOpen(false);
    loadData();
  };

  // Delete Property
  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      await api.deleteProperty(id);
      loadData();
    }
  };

  // Quick Status Toggle
  const handleStatusChange = async (prop: Property, newStatus: any) => {
    await api.updateProperty(prop._id, { status: newStatus });
    loadData();
  };

  // Quick Featured Toggle
  const handleFeaturedToggle = async (prop: Property) => {
    await api.updateProperty(prop._id, { featured: !prop.featured });
    loadData();
  };

  // Inquiry Status Change
  const handleInquiryStatus = async (inqId: string, status: any) => {
    await api.updateInquiry(inqId, { status });
    loadData();
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inqId: string) => {
    if (window.confirm('Delete this inquiry?')) {
      await api.deleteInquiry(inqId);
      loadData();
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      await api.updateSettings(settings);
      setSettingsFeedback('Agency settings updated successfully!');
      setTimeout(() => setSettingsFeedback(null), 3000);
    } catch {
      setSettingsFeedback('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (propStatusFilter !== 'all' && p.status !== propStatusFilter) return false;
    if (propSearch.trim()) {
      const q = propSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.propertyId.toLowerCase().includes(q) ||
        p.areaBlock.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#52796f] dark:text-[#84a98c] uppercase tracking-wider">
            <span>Bismillah State Agency Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white mt-0.5">
            Admin Portal & CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#cad2c5]">
            Logged in as <span className="font-semibold text-[#2f3e46] dark:text-white">{user?.name || 'Administrator'}</span> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#cad2c5]" />
            <span>Add New Property</span>
          </button>

          <button
            onClick={logout}
            className="p-2.5 rounded-xl border border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#cad2c5]/60 dark:border-[#354f52] pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'properties', label: `Properties (${properties.length})`, icon: SlidersHorizontal },
          { 
            id: 'inquiries', 
            label: `Client Inquiries (${inquiries.filter((i) => i.status === 'new').length} New)`, 
            icon: Users 
          },
          { id: 'settings', label: 'Agency Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#52796f] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#354f52]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5]">Total Properties</span>
              <span className="block text-2xl sm:text-3xl font-black text-[#2f3e46] dark:text-white">
                {stats.totalProperties}
              </span>
              <span className="text-[11px] text-[#52796f] font-medium">In Quetta Catalog</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5]">Active Available</span>
              <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.activeProperties}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Live for Buyers</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5]">Sold / Rented</span>
              <span className="block text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-300">
                {stats.soldOrRented}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Closed Deals</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5]">Client Inquiries</span>
              <span className="block text-2xl sm:text-3xl font-black text-amber-500">
                {stats.totalInquiries}
              </span>
              <span className="text-[11px] text-amber-600 font-medium">{stats.newInquiries} Awaiting Contact</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5]">Total Views</span>
              <span className="block text-2xl sm:text-3xl font-black text-[#52796f] dark:text-[#84a98c]">
                {stats.totalViews}
              </span>
              <span className="text-[11px] text-[#52796f] font-medium">Organic Impressions</span>
            </div>
          </div>

          {/* Quick Actions & Recent Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Leads Preview */}
            <div className="lg:col-span-2 bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
                  Recent Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-semibold text-[#52796f] hover:underline cursor-pointer"
                >
                  View All Leads →
                </button>
              </div>

              {inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq._id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 dark:border-[#354f52] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#2f3e46] dark:text-white">{inq.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#cad2c5] mt-0.5 line-clamp-1">
                      {inq.message}
                    </p>
                    <span className="text-[11px] text-slate-400">{formatDate(inq.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={generateWhatsAppLink(inq.phone, inq.propertyTitle, inq.propertyId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#52796f] hover:bg-[#3f5f57] text-white text-xs font-bold flex items-center gap-1"
                      title="WhatsApp Client"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={generateCallLink(inq.phone)}
                      className="p-2 rounded-lg border border-[#cad2c5] hover:bg-slate-100 text-xs font-semibold"
                      title="Call Client"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quetta Market Guide & Quick Controls */}
            <div className="bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/60 dark:border-[#354f52] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
                Quetta Agency Controls
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenCreateModal}
                  className="w-full py-2.5 px-4 bg-[#52796f] hover:bg-[#3f5f57] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List New Property</span>
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#2f3e46] border border-[#cad2c5] dark:border-[#354f52] text-[#2f3e46] dark:text-white rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#52796f]" />
                  <span>Manage Incoming Leads</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#2f3e46] border border-[#cad2c5] dark:border-[#354f52] text-[#2f3e46] dark:text-white rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#52796f]" />
                  <span>Update Agency Phone/Hours</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#cad2c5]/50 text-xs text-slate-500 space-y-1">
                <p>💡 Tip: Properties marked as <strong>Featured</strong> are pinned to the top of the homepage and search results.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES MANAGEMENT */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={propSearch}
                onChange={(e) => setPropSearch(e.target.value)}
                placeholder="Search by ID, title, or Quetta area..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#2f3e46] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={propStatusFilter}
                onChange={(e) => setPropStatusFilter(e.target.value)}
                className="py-2 px-3 bg-white dark:bg-[#2f3e46] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>

              <button
                onClick={handleOpenCreateModal}
                className="py-2 px-4 bg-[#52796f] hover:bg-[#3f5f57] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1f2b30] border-b border-[#cad2c5]/60 dark:border-[#354f52] text-[#2f3e46] dark:text-slate-200 uppercase font-bold text-[11px] tracking-wider">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Type / Purpose</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cad2c5]/40 dark:divide-[#354f52] text-[#2f3e46] dark:text-slate-200">
                  {filteredProperties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50 dark:hover:bg-[#1f2b30]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images && prop.images[0] ? prop.images[0].url : ''}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg shrink-0 border border-[#cad2c5]"
                          />
                          <div>
                            <span className="font-mono text-[10px] font-bold text-[#52796f] block">
                              {prop.propertyId}
                            </span>
                            <Link
                              to={`/properties/${prop.slug}`}
                              className="font-bold text-xs hover:underline line-clamp-1 max-w-xs"
                            >
                              {prop.title}
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold capitalize block">{prop.propertyType}</span>
                        <span className="text-[10px] uppercase font-mono text-slate-500">For {prop.purpose}</span>
                      </td>

                      <td className="p-4 font-bold text-xs">
                        {formatPrice(prop.price, prop.purpose)}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold block">{prop.areaBlock}</span>
                        <span className="text-slate-400 block text-[10px]">{prop.city}</span>
                        {prop.latitude !== undefined && prop.longitude !== undefined && (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${prop.latitude}&mlon=${prop.longitude}#map=16/${prop.latitude}/${prop.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View coordinates on OpenStreetMap"
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-[#52796f] hover:underline mt-0.5"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            {prop.latitude.toFixed(3)}, {prop.longitude.toFixed(3)}
                          </a>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={prop.status}
                          onChange={(e) => handleStatusChange(prop, e.target.value)}
                          className="py-1 px-2 rounded-lg border border-[#cad2c5] dark:border-slate-700 bg-white dark:bg-[#1f2b30] text-[11px] font-semibold"
                        >
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                          <option value="rented">Rented</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleFeaturedToggle(prop)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            prop.featured
                              ? 'bg-[#52796f] text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800'
                          }`}
                        >
                          {prop.featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/properties/${prop.slug}`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                            title="View Live Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(prop)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 dark:hover:bg-[#1f2b30]"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(prop._id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES / LEADS CRM */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2f3e46] dark:text-white">
              Client Inquiries & Direct WhatsApp Leads
            </h2>
            <span className="text-xs text-slate-500">{inquiries.length} Total Messages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#2f3e46] dark:text-white">{inq.name}</h4>
                      <div className="text-xs text-slate-500">{formatDate(inq.createdAt)}</div>
                    </div>

                    <select
                      value={inq.status}
                      onChange={(e) => handleInquiryStatus(inq._id, e.target.value)}
                      className={`py-1 px-2 rounded-lg text-[11px] font-bold border ${
                        inq.status === 'new'
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : inq.status === 'contacted'
                          ? 'border-blue-300 bg-blue-50 text-blue-800'
                          : 'border-slate-300 bg-slate-50 text-slate-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {inq.propertyTitle && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5]/40 text-xs">
                      <span className="text-slate-400 block text-[10px]">Interested Property:</span>
                      <span className="font-semibold text-[#52796f] line-clamp-1">{inq.propertyTitle}</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-600 dark:text-[#cad2c5] bg-slate-50/50 dark:bg-[#1f2b30]/50 p-3 rounded-xl border border-[#cad2c5]/30">
                    "{inq.message}"
                  </div>

                  <div className="text-xs space-y-1 text-slate-500">
                    <div>Phone: <span className="font-mono text-[#2f3e46] dark:text-white font-semibold">{inq.phone}</span></div>
                    {inq.email && <div>Email: {inq.email}</div>}
                    <div>Preferred: <span className="capitalize font-semibold">{inq.preferredContact}</span></div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-3 border-t border-[#cad2c5]/40 flex items-center gap-2">
                  <a
                    href={generateWhatsAppLink(inq.phone, inq.propertyTitle, inq.propertyId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={generateCallLink(inq.phone)}
                    className="p-2 rounded-xl border border-[#cad2c5] dark:border-[#354f52] hover:bg-slate-100 text-slate-600 dark:text-white text-xs font-semibold"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDeleteInquiry(inq._id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AGENCY SETTINGS */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="max-w-3xl bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#cad2c5]/60 dark:border-[#354f52]">
            <div>
              <h2 className="text-lg font-bold text-[#2f3e46] dark:text-white">Agency Profile & Contact Settings</h2>
              <p className="text-xs text-slate-500">Configure phone, WhatsApp number, and address displayed across the site.</p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-5 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          {settingsFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs">
              {settingsFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Agency Name</label>
              <input
                type="text"
                value={settings.agencyName}
                onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Agency Name (Urdu)</label>
              <input
                type="text"
                value={settings.agencyNameUrdu}
                onChange={(e) => setSettings({ ...settings, agencyNameUrdu: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Phone / Call Line</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Office Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Agency Bio & Description</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs text-[#2f3e46] dark:text-white"
            ></textarea>
          </div>
        </form>
      )}

      {/* CREATE / EDIT PROPERTY MODAL */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#2f3e46] rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto border border-[#cad2c5] dark:border-[#354f52]">
            <div className="flex items-center justify-between pb-3 border-b border-[#cad2c5]/60">
              <h3 className="text-base font-bold text-[#2f3e46] dark:text-white">
                {editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h3>
              <button
                onClick={() => setPropertyModalOpen(false)}
                className="p-1 text-slate-500 hover:text-black dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  placeholder="Property title..."
                  className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Purpose</label>
                  <select
                    value={propertyForm.purpose}
                    onChange={(e) => setPropertyForm({ ...propertyForm, purpose: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={propertyForm.propertyType}
                    onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  >
                    <option value="house">House</option>
                    <option value="flat">Flat</option>
                    <option value="plot">Plot</option>
                    <option value="shop">Shop</option>
                    <option value="office">Office</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={propertyForm.status}
                    onChange={(e) => setPropertyForm({ ...propertyForm, status: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Area Size</label>
                  <input
                    type="number"
                    value={propertyForm.area}
                    onChange={(e) => setPropertyForm({ ...propertyForm, area: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <select
                    value={propertyForm.areaUnit}
                    onChange={(e) => setPropertyForm({ ...propertyForm, areaUnit: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  >
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="sqft">Sq Ft</option>
                    <option value="sqyd">Sq Yard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                    className="w-full py-2 px-2.5 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quetta Locality / Area Block *</label>
                  <input
                    type="text"
                    required
                    value={propertyForm.areaBlock}
                    onChange={(e) => setPropertyForm({ ...propertyForm, areaBlock: e.target.value })}
                    placeholder="e.g. Satellite Town, Sector B"
                    className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                    placeholder="e.g. Street 3, Near Jamia Masjid"
                    className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                  />
                </div>
              </div>

              {/* Interactive OpenStreetMap Coordinate Picker */}
              <AdminMapPicker
                latitude={propertyForm.latitude ? parseFloat(propertyForm.latitude) : undefined}
                longitude={propertyForm.longitude ? parseFloat(propertyForm.longitude) : undefined}
                areaBlock={propertyForm.areaBlock}
                onChange={(lat, lng) => {
                  setPropertyForm((prev) => ({
                    ...prev,
                    latitude: String(lat),
                    longitude: String(lng)
                  }));
                }}
              />

              <div>
                <label className="block font-semibold mb-1">Main Photo Image URL</label>
                <input
                  type="url"
                  value={propertyForm.imageUrl}
                  onChange={(e) => setPropertyForm({ ...propertyForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={propertyForm.amenities}
                  onChange={(e) => setPropertyForm({ ...propertyForm, amenities: e.target.value })}
                  className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  className="w-full py-2 px-3 border rounded-xl bg-slate-50 dark:bg-[#1f2b30] border-[#cad2c5] dark:border-[#354f52]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={propertyForm.featured}
                    onChange={(e) => setPropertyForm({ ...propertyForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#52796f]"
                  />
                  <span>Pin as Featured Property</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPropertyModalOpen(false)}
                    className="py-2 px-4 border rounded-xl hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold rounded-xl"
                  >
                    {editingProperty ? 'Save Updates' : 'Publish Property'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
