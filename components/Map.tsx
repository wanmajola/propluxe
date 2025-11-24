
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { Listing } from '../types';
import { Loader2 } from 'lucide-react';

interface MapProps {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  interactive?: boolean;
}

export const Map: React.FC<MapProps> = ({ 
  listings, 
  center = [-6.2088, 106.8456], // Default to Jakarta
  zoom = 12,
  onMarkerClick,
  interactive = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive ? 'center' : false,
      doubleClickZoom: interactive,
      attributionControl: false, // Save space
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });

    // Loading events
    tileLayer.on('loading', () => {
      setIsLoading(true);
    });

    tileLayer.on('load', () => {
      // Small delay to prevent rapid flickering on fast loads
      setTimeout(() => setIsLoading(false), 250);
    });

    tileLayer.addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    listings.forEach(listing => {
      if (listing.latitude && listing.longitude) {
        // Create custom div icon for price
        const priceIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="custom-marker-price">${listing.currency}${listing.price}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([listing.latitude, listing.longitude], { icon: priceIcon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div class="cursor-pointer" onclick="window.dispatchEvent(new CustomEvent('listing-click', {detail: '${listing.id}'}))">
              <div class="w-full h-24 overflow-hidden bg-slate-100">
                <img src="${listing.imageUrl}" class="w-full h-full object-cover" />
              </div>
              <div class="p-3">
                <div class="font-bold text-slate-900 text-sm truncate">${listing.title}</div>
                <div class="text-xs text-slate-500 mt-1">${listing.bedrooms} Beds • ${listing.bathrooms} Baths</div>
                <div class="font-bold text-blue-600 text-sm mt-1">${listing.currency}${listing.price}/mo</div>
              </div>
            </div>
          `);

        marker.on('click', () => {
           if (onMarkerClick) onMarkerClick(listing.id);
        });

        markersRef.current.push(marker);
        bounds.extend([listing.latitude, listing.longitude]);
      }
    });

    // Fit bounds if we have markers and it's the main map view (interactive)
    if (markersRef.current.length > 0 && interactive && listings.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (listings.length === 1 && listings[0].latitude && listings[0].longitude) {
      // For single listing detail view
      mapRef.current.setView([listings[0].latitude, listings[0].longitude], 15);
    }

  }, [listings, interactive]);

  // Handle center updates
  useEffect(() => {
    if (mapRef.current && center) {
       mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Listen for popup clicks via custom event (hack for HTML string onclick)
  useEffect(() => {
    const handlePopupClick = (e: any) => {
      if (onMarkerClick) onMarkerClick(e.detail);
    };
    window.addEventListener('listing-click', handlePopupClick);
    return () => window.removeEventListener('listing-click', handlePopupClick);
  }, [onMarkerClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full z-0" />
      
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-slate-50/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 pointer-events-none">
           <div className="bg-white p-3 rounded-full shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
           </div>
        </div>
      )}
    </div>
  );
};
