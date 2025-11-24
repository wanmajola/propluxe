
import React from 'react';
import { Listing } from '../types';
import { MapPin, Bookmark, Star, Edit, Trash2 } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isAdmin, onEdit, onDelete, onClick }) => {
  // Use first image from array, fallback to imageUrl, fallback to placeholder
  const displayImage = listing.images?.[0] || listing.imageUrl || 'https://via.placeholder.com/400';

  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full relative"
      onClick={() => onClick(listing.id)}
    >
      {/* Image Section */}
      <div className="relative h-56 p-3">
        <div className="w-full h-full overflow-hidden rounded-2xl relative">
          <img 
            src={displayImage} 
            alt={listing.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm z-10">
            {listing.propertyType || 'Residence'}
          </div>

          {/* Bookmark Icon */}
          <div className="absolute top-3 right-3 p-2 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-blue-600 hover:text-white transition-colors z-10">
            <Bookmark className="h-4 w-4" />
          </div>

          {!listing.available && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
              Rented
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 pb-5 pt-2 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{listing.title}</h3>
        
        <div className="flex items-center text-slate-400 text-sm mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
          <span className="truncate">{listing.location}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-50 pt-4">
          <div>
            <div className="flex items-baseline gap-1">
               <span className="text-xl font-bold text-slate-900">{listing.currency}{listing.price}</span>
               <span className="text-xs text-slate-400 font-medium">/month</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-slate-700">{listing.rating || '4.8'}/5</span>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-3 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onEdit?.(listing.id)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete?.(listing.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
