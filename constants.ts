
import { Listing } from './types';

export const DEFAULT_CURRENCY = '$';

export const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Condo', 'Bungalow', 'Cottage', 'Penthouse', 'Studio'];

export const AMENITY_OPTIONS = [
  'Wifi', 'Kitchen', 'Washer', 'Dryer', 'Air Conditioning', 
  'Heating', 'Dedicated Workspace', 'TV', 'Hair Dryer', 'Iron',
  'Pool', 'Hot Tub', 'Gym', 'BBQ Grill', 'Parking', 'Elevator',
  'Garage', 'Garden', 'Security', 'Balcony', 'Rooftop', 'Concierge'
];

// Helper to generate realistic data
const generateListings = (): Listing[] => {
  const listings: Listing[] = [];
  const jakartaCenter = { lat: -6.2088, lng: 106.8456 };
  
  const prefixes = ['Grand', 'Cozy', 'Modern', 'Luxury', 'Urban', 'Secluded', 'Bright', 'Elegant', 'Prime', 'Chic'];
  const suffixes = ['Residence', 'Villa', 'Apartment', 'Loft', 'Studio', 'Haven', 'Mansion', 'Estate', 'Hideaway', 'Suites'];
  const locations = [
    'Menteng, Jakarta', 'Kuningan, Jakarta', 'Sudirman, Jakarta', 'Kemang, Jakarta', 
    'Pondok Indah, Jakarta', 'Senopati, Jakarta', 'PIK, Jakarta', 'Kelapa Gading, Jakarta',
    'Cilandak, Jakarta', 'Gandaria, Jakarta'
  ];

  const imagesBase = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600596542815-2250657d2fc5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512918760532-3edbed4eef8b?auto=format&fit=crop&q=80&w=800'
  ];

  for (let i = 0; i < 30; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[(i * 3) % suffixes.length];
    const propertyType = PROPERTY_TYPES[i % PROPERTY_TYPES.length];
    const location = locations[i % locations.length];
    
    // Generate slight random offset for coordinates around Jakarta
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Select 3 random images for the gallery
    const mainImageIndex = i % imagesBase.length;
    const gallery = [
      imagesBase[mainImageIndex],
      imagesBase[(mainImageIndex + 1) % imagesBase.length],
      imagesBase[(mainImageIndex + 2) % imagesBase.length],
      imagesBase[(mainImageIndex + 3) % imagesBase.length],
    ];

    listings.push({
      id: `listing-${i + 1}`,
      title: `${prefix} ${location.split(',')[0]} ${suffix}`,
      price: Math.floor(Math.random() * 4000) + 500, // $500 - $4500
      currency: DEFAULT_CURRENCY,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      sqft: Math.floor(Math.random() * 3000) + 500,
      propertyType: propertyType,
      location: location,
      latitude: jakartaCenter.lat + latOffset,
      longitude: jakartaCenter.lng + lngOffset,
      description: `Experience the epitome of ${prefix.toLowerCase()} living in this stunning ${propertyType.toLowerCase()}. Located in the heart of ${location.split(',')[0]}, this property features premium finishes, spacious interiors, and breathtaking views. Perfect for those seeking comfort and style.`,
      imageUrl: gallery[0],
      images: gallery,
      amenities: AMENITY_OPTIONS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 3),
      contactPhone: '628123456789',
      available: Math.random() > 0.2, // 80% available
      createdAt: Date.now() - Math.floor(Math.random() * 10000000),
      rating: Number((4 + Math.random()).toFixed(1)),
    });
  }

  return listings;
};

export const SAMPLE_LISTINGS = generateListings();
