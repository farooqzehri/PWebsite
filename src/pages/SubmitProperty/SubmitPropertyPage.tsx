import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload, 
  CheckCircle, 
  MessageCircle, 
  Phone, 
  Building2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { generateWhatsAppLink } from '../../utils/formatters';

export const SubmitPropertyPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    purpose: 'sale',
    propertyType: 'house',
    price: '',
    area: '',
    areaUnit: 'marla',
    city: 'Quetta',
    areaBlock: 'Satellite Town',
    address: '',
    bedrooms: '3',
    bathrooms: '3',
    description: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    amenities: 'Electricity, Gas (Sui Gas), Water Supply, Boundary Wall'
  });

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quettaAreas = [
    'Satellite Town',
    'Jinnah Road',
    'Zarghoon Road',
    'Samungli Road',
    'Cantt',
    'Chiltan Housing Scheme',
    'Model Town',
    'Shahbaz Town',
    'Airport Road',
    'Brewery Road',
    'Nawa Killi',
    'Spiny Road'
  ];

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please provide a property headline/title');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid price in PKR');
      return;
    }
    if (!formData.ownerName.trim() || !formData.ownerPhone.trim()) {
      setError('Owner name and WhatsApp/phone number are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        area: Number(formData.area) || 5,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: images.map((url, i) => ({ url, isMain: i === 0, order: i + 1 })),
        status: 'available',
        featured: false
      };

      const res = await api.createProperty(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to submit property. Please try again.');
      }
    } catch {
      setError('Network error. Please WhatsApp us your property details directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2f3e46] dark:text-white">
            {language === 'ur' ? 'پراپرٹی کامیابی سے جمع ہوگئی ہے' : 'Property Submitted Successfully!'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#cad2c5] max-w-md mx-auto">
            {language === 'ur'
              ? 'بسم اللہ اسٹیٹ ایجنسی کی ٹیم آپ سے جلد رابطہ کرے گی اور قانونی تصدیق کے بعد اسے لائیو کر دیا جائے گا۔'
              : 'Our agency team will review your property details, verify documents, and contact you for listing confirmation.'}
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={generateWhatsAppLink(
              '+923128001533',
              formData.title,
              'BSA-NEW',
              `I have submitted my property (${formData.title} in ${formData.areaBlock}, Quetta) for PKR ${formData.price}. Please confirm.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#52796f] text-white font-bold text-sm shadow-md hover:bg-[#3f5f57]"
          >
            <MessageCircle className="w-4 h-4 text-[#cad2c5]" />
            <span>Notify on WhatsApp (+92 312 8001533)</span>
          </a>

          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 rounded-xl border border-[#cad2c5] dark:border-[#354f52] font-semibold text-sm hover:bg-slate-50 dark:hover:bg-[#354f52]"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52796f]/15 text-[#52796f] text-xs font-bold">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'مفت لسٹنگ اور مارکیٹنگ' : 'Free Listing & Direct Buyers'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2f3e46] dark:text-white">
          {language === 'ur' ? 'کوئٹہ میں اپنی پراپرٹی فروخت یا کرایہ پر دیں' : 'List Your Property in Quetta'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cad2c5]">
          Fill out the form below or message our agency team directly on WhatsApp to list your house, plot, flat, or shop.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796f] dark:text-[#84a98c]">
            1. Property Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
              Property Title / Headline *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 5 Marla Brand New Double Storey House in Satellite Town"
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Purpose *
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              >
                <option value="house">House</option>
                <option value="flat">Flat / Apartment</option>
                <option value="plot">Plot</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="commercial">Commercial Building</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Demand Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 25000000 (2.5 Crore)"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Area Size *
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. 5"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Area Unit *
              </label>
              <select
                value={formData.areaUnit}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq Ft</option>
                <option value="sqyd">Sq Yard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Quetta Location */}
        <div className="space-y-4 pt-4 border-t border-[#cad2c5]/60 dark:border-[#354f52]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796f] dark:text-[#84a98c]">
            2. Location in Quetta
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Area / Scheme *
              </label>
              <select
                value={formData.areaBlock}
                onChange={(e) => setFormData({ ...formData, areaBlock: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              >
                {quettaAreas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Address / Street / Sector
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Street 4, Sector B"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Photos */}
        <div className="space-y-3 pt-4 border-t border-[#cad2c5]/60 dark:border-[#354f52]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796f] dark:text-[#84a98c]">
            3. Property Photos
          </h3>

          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (or leave default showcase photo)"
              className="flex-1 py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="py-2.5 px-4 bg-[#52796f] text-white rounded-xl text-xs font-bold hover:bg-[#3f5f57] cursor-pointer"
            >
              Add Photo
            </button>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-[#cad2c5]">
                <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Owner / Contact */}
        <div className="space-y-4 pt-4 border-t border-[#cad2c5]/60 dark:border-[#354f52]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796f] dark:text-[#84a98c]">
            4. Owner Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Muhammad Tariq"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                WhatsApp / Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                placeholder="+92 312 0000000"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="optional@gmail.com"
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
              Property Description & Salient Features
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe nearby landmarks, road width, construction quality, water availability, etc."
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f]"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{submitting ? 'Submitting Property...' : 'Submit Property for Listing'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
