
import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { AMENITY_OPTIONS, PROPERTY_TYPES } from '../constants';
import { generateListingDescription } from '../services/gemini';
import { Wand2, Upload, X, Loader2, Save, MapPin, Plus } from 'lucide-react';

interface ListingFormProps {
  initialData?: Listing | null;
  onSave: (listing: Listing) => void;
  onCancel: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Listing>>({
    title: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1000,
    propertyType: 'Apartment',
    location: '',
    latitude: 0,
    longitude: 0,
    description: '',
    amenities: [],
    available: true,
    contactPhone: '',
    imageUrl: '',
    images: [],
    currency: '$',
    rating: 4.5,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: initialData.images || (initialData.imageUrl ? [initialData.imageUrl] : [])
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFormData(prev => {
             const newImages = [...(prev.images || []), base64];
             return { 
               ...prev, 
               images: newImages,
               imageUrl: newImages[0] // Update main image if first one
             };
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        imageUrl: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleGeocode = async () => {
    if (!formData.location) {
      alert("Please enter a location first.");
      return;
    }
    
    setIsGeocoding(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        }));
      } else {
        alert("Could not find coordinates for this location. Please enter manually.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to fetch coordinates.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      alert("Please fill in basic details (Title, Location, Price) first to generate a description.");
      return;
    }

    setIsGenerating(true);
    try {
      const description = await generateListingDescription({
        title: formData.title || '',
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        location: formData.location || '',
        amenities: formData.amenities || [],
        price: formData.price || 0,
      });
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate description. Ensure API Key is set.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location) {
      alert("Please complete all required fields.");
      return;
    }

    const images = formData.images && formData.images.length > 0 
      ? formData.images 
      : [`https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`];

    const newListing: Listing = {
      id: initialData?.id || crypto.randomUUID(),
      createdAt: initialData?.createdAt || Date.now(),
      title: formData.title!,
      price: formData.price!,
      currency: formData.currency || '$',
      bedrooms: formData.bedrooms || 0,
      bathrooms: formData.bathrooms || 0,
      sqft: formData.sqft || 0,
      propertyType: formData.propertyType || 'Apartment',
      location: formData.location!,
      latitude: formData.latitude,
      longitude: formData.longitude,
      description: formData.description || '',
      imageUrl: images[0],
      images: images,
      amenities: formData.amenities || [],
      contactPhone: formData.contactPhone || '',
      available: formData.available !== undefined ? formData.available : true,
      rating: formData.rating || 4.5,
    };

    onSave(newListing);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? 'Edit Listing' : 'Create New Listing'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Apartment in City Center"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Coordinates (Lat / Lng)</label>
            <div className="flex gap-2">
               <input
                type="number"
                name="latitude"
                placeholder="Lat"
                value={formData.latitude || ''}
                onChange={handleChange}
                step="any"
                className="w-1/3 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
               <input
                type="number"
                name="longitude"
                placeholder="Lng"
                value={formData.longitude || ''}
                onChange={handleChange}
                step="any"
                className="w-1/3 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <button 
                type="button"
                onClick={handleGeocode}
                disabled={isGeocoding || !formData.location}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-blue-200"
              >
                {isGeocoding ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                Get Coords
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Area (sqft)</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number (No +)</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="e.g. 15551234567"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Gallery Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Property Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {formData.images?.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-lg aspect-square flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
              <Plus className="h-8 w-8 mb-1" />
              <span className="text-xs font-medium">Add Photo</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
              />
            </label>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  formData.amenities?.includes(amenity)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Description & AI */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              Auto-Write with AI
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the property..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center">
           <input
             type="checkbox"
             id="available"
             checked={formData.available}
             onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
           />
           <label htmlFor="available" className="ml-2 block text-sm text-slate-700">
             Available for rent immediately
           </label>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save Listing
          </button>
        </div>
      </form>
    </div>
  );
};
