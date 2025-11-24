
import { Listing } from '../types';
import { SAMPLE_LISTINGS } from '../constants';

const STORAGE_KEY = 'propluxe_listings_v2'; // Bumped version to invalidate old cache if needed, or we can logic check

export const getListings = (): Listing[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with sample data if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LISTINGS));
      return SAMPLE_LISTINGS;
    }
    
    const parsed: Listing[] = JSON.parse(stored);
    
    // Migration logic: Ensure all listings have 'images' array
    const migrated = parsed.map(listing => ({
      ...listing,
      images: listing.images || (listing.imageUrl ? [listing.imageUrl] : [])
    }));

    return migrated;
  } catch (error) {
    console.error("Failed to load listings", error);
    return [];
  }
};

export const saveListing = (listing: Listing): Listing[] => {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === listing.id);
  
  // Ensure listing has imageUrl for backward compat if images array exists
  if (listing.images && listing.images.length > 0 && !listing.imageUrl) {
    listing.imageUrl = listing.images[0];
  }

  let newListings;
  if (index >= 0) {
    newListings = [...listings];
    newListings[index] = listing;
  } else {
    newListings = [listing, ...listings];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
  return newListings;
};

export const deleteListing = (id: string): Listing[] => {
  const listings = getListings();
  const newListings = listings.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
  return newListings;
};
