
import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { AMENITY_OPTIONS, PROPERTY_TYPES } from '../constants';
import { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClear: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onClear }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync local state when parent filters change (e.g. cleared)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
  };
  
  const updateLocalFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePropertyTypeChange = (type: string) => {
    const current = localFilters.propertyTypes;
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateLocalFilter('propertyTypes', next);
  };

  const handleAmenityChange = (amenity: string) => {
    const current = localFilters.amenities;
    const next = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateLocalFilter('amenities', next);
  };

  return (
    <div className="w-full bg-white lg:bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900">Custom Filter</h2>
        <button onClick={onClear} className="text-sm font-medium text-blue-600 hover:text-blue-700">Clear all</button>
      </div>

      <div className="space-y-6">
        
        {/* Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-900 text-sm">Location</h3>
          </div>
          <div className="relative">
             <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="City, State..." 
               value={localFilters.location}
               onChange={(e) => updateLocalFilter('location', e.target.value)}
               className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-100 transition-all"
             />
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-900 text-sm mb-4">Price Range</h3>
           <div className="space-y-3">
             <div className="flex items-center">
                <input 
                  type="radio" 
                  name="price" 
                  id="p1" 
                  checked={localFilters.maxPrice === 1000}
                  onChange={() => {
                    updateLocalFilter('minPrice', 0);
                    updateLocalFilter('maxPrice', 1000);
                  }}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="p1" className="ml-2 text-sm text-slate-600">Under $1,000</label>
             </div>
             <div className="flex items-center">
                <input 
                  type="radio" 
                  name="price" 
                  id="p2" 
                  checked={localFilters.maxPrice === 5000 && localFilters.minPrice === 1000}
                  onChange={() => {
                    updateLocalFilter('minPrice', 1000);
                    updateLocalFilter('maxPrice', 5000);
                  }}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="p2" className="ml-2 text-sm text-slate-600">$1,000 - $5,000</label>
             </div>
             <div className="flex items-center">
                <input 
                  type="radio" 
                  name="price" 
                  id="p3" 
                  checked={localFilters.minPrice === 5000}
                  onChange={() => {
                    updateLocalFilter('minPrice', 5000);
                    updateLocalFilter('maxPrice', 100000);
                  }}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="p3" className="ml-2 text-sm text-slate-600">More Than $5,000</label>
             </div>
           </div>
           
           <div className="mt-4 pt-4 border-t border-slate-100">
             <p className="text-xs font-medium text-slate-500 mb-2">Custom Range</p>
             <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 placeholder="Min"
                 value={localFilters.minPrice || ''}
                 onChange={(e) => updateLocalFilter('minPrice', Number(e.target.value))}
                 className="w-full px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100 focus:border-blue-200"
               />
               <span className="text-slate-300">-</span>
               <input 
                 type="number" 
                 placeholder="Max"
                 value={localFilters.maxPrice < 100000 ? localFilters.maxPrice : ''}
                 onChange={(e) => updateLocalFilter('maxPrice', Number(e.target.value))}
                 className="w-full px-3 py-2 bg-slate-50 rounded-lg text-sm outline-none border border-slate-100 focus:border-blue-200"
               />
             </div>
           </div>
        </div>

        {/* Type Of Place */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-900 text-sm mb-4">Type Of Place</h3>
           <div className="space-y-3">
             {PROPERTY_TYPES.slice(0, 4).map(type => (
               <div key={type} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={type}
                    checked={localFilters.propertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeChange(type)}
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={type} className="ml-2 text-sm text-slate-600">{type}</label>
               </div>
             ))}
           </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-900 text-sm mb-4">Amenities</h3>
           <div className="flex flex-wrap gap-2">
             {AMENITY_OPTIONS.slice(0, 8).map(amenity => (
               <button
                 key={amenity}
                 onClick={() => handleAmenityChange(amenity)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                   localFilters.amenities.includes(amenity)
                     ? 'bg-blue-600 text-white shadow-md'
                     : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 {amenity}
               </button>
             ))}
           </div>
        </div>
        
        <button 
          onClick={handleApply}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Apply Filters
        </button>

      </div>
    </div>
  );
};
