
import React, { useState } from 'react';
import { Listing } from '../types';
import { Bed, Bath, MapPin, Check, MessageCircle, ArrowLeft, Send, SquareDashedBottom, ChevronLeft, ChevronRight } from 'lucide-react';
import { Map } from './Map';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onBack }) => {
  const [enquiry, setEnquiry] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.imageUrl];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setEnquiry({ name: '', email: '', message: '' });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const whatsappUrl = `https://wa.me/${listing.contactPhone}?text=${encodeURIComponent(`Hi, I'm interested in your property: ${listing.title}`)}`;

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-12">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gallery Carousel */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="relative group h-[400px]">
              <img 
                src={images[activeImageIndex]} 
                alt={listing.title} 
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 left-8 text-white">
                 <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">{listing.propertyType}</div>
                 <h1 className="text-3xl font-bold mb-1 shadow-sm">{listing.title}</h1>
                 <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                 </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide bg-white border-b border-slate-100">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative min-w-[80px] h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-blue-600 ring-1 ring-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            <div className="p-8">
              <div className="flex gap-4 md:gap-8 py-6 border-b border-slate-100 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-fit">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <Bed className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{listing.bedrooms} Beds</div>
                    <div className="text-xs text-slate-500">Bedroom</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 min-w-fit">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <Bath className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{listing.bathrooms} Baths</div>
                    <div className="text-xs text-slate-500">Bathroom</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 min-w-fit">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <SquareDashedBottom className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{listing.sqft} sqft</div>
                    <div className="text-xs text-slate-500">Land Area</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">About this property</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-xl">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location Map */}
              <div className="mt-8">
                 <h3 className="text-xl font-bold text-slate-900 mb-4">Location</h3>
                 <div className="h-64 rounded-2xl overflow-hidden border border-slate-100">
                    {listing.latitude && listing.longitude ? (
                       <Map listings={[listing]} interactive={false} zoom={15} center={[listing.latitude, listing.longitude]} />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                        Map data not available
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Price Card */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-1">Price per month</p>
              <div className="text-4xl font-bold text-slate-900 mb-6">{listing.currency}{listing.price}</div>
              
              {listing.contactPhone && (
               <a 
                 href={whatsappUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg mb-3"
               >
                 <MessageCircle className="h-5 w-5" />
                 WhatsApp Agent
               </a>
              )}
           </div>

          {/* Enquiry Form */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Send Enquiry</h3>
            
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={enquiry.name}
                  onChange={e => setEnquiry({...enquiry, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={enquiry.email}
                  onChange={e => setEnquiry({...enquiry, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <textarea
                  required
                  value={enquiry.message}
                  onChange={e => setEnquiry({...enquiry, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all text-sm"
                  placeholder="Hi, I am interested in..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-slate-200 flex justify-center items-center gap-2"
              >
                {sent ? (
                  <>Sent <Check className="h-4 w-4" /></>
                ) : (
                  <>Send Message <Send className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
