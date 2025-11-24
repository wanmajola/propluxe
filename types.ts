
export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  imageUrl: string; // Kept for backward compatibility/thumbnail
  images: string[]; // New field for gallery
  amenities: string[];
  contactPhone: string; // WhatsApp number
  available: boolean;
  createdAt: number;
  rating?: number;
}

export type ViewState = 'BROWSE' | 'ADMIN_DASHBOARD' | 'ADD_LISTING' | 'EDIT_LISTING' | 'VIEW_LISTING';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface FilterState {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  amenities: string[];
}
