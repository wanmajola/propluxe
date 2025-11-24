
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ListingCard } from './components/ListingCard';
import { ListingForm } from './components/ListingForm';
import { ListingDetail } from './components/ListingDetail';
import { FilterSidebar } from './components/FilterSidebar';
import { Map } from './components/Map';
import { Listing, ViewState, FilterState } from './types';
import { getListings, saveListing, deleteListing } from './services/storage';
import { MapPin, Search, Map as MapIcon, PlusCircle, List, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('BROWSE');
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: 0,
    maxPrice: 100000,
    propertyTypes: [],
    amenities: []
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Initial Load
  useEffect(() => {
    setListings(getListings());
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, isMapView]);

  const handleNavigate = (newView: ViewState) => {
    setView(newView);
    if (newView !== 'VIEW_LISTING') {
      setSelectedListingId(null);
    }
  };

  const handleListingClick = (id: string) => {
    setSelectedListingId(id);
    setView('VIEW_LISTING');
  };

  const handleSaveListing = (listing: Listing) => {
    const updated = saveListing(listing);
    setListings(updated);
    setView('ADMIN_DASHBOARD');
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const updated = deleteListing(id);
      setListings(updated);
    }
  };

  const handleEditClick = (id: string) => {
    setSelectedListingId(id);
    setView('EDIT_LISTING');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Logic
  const filteredListings = listings.filter(l => {
    const matchLocation = l.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchPrice = l.price >= filters.minPrice && l.price <= filters.maxPrice;
    const matchType = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(l.propertyType);
    const matchAmenities = filters.amenities.every(a => l.amenities.includes(a));
    
    return matchLocation && matchPrice && matchType && matchAmenities;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: 0,
      maxPrice: 100000,
      propertyTypes: [],
      amenities: []
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'ADD_LISTING':
        return (
          <div className="py-8 px-4 max-w-4xl mx-auto">
            <ListingForm 
              onSave={handleSaveListing} 
              onCancel={() => handleNavigate('ADMIN_DASHBOARD')} 
            />
          </div>
        );
      case 'EDIT_LISTING':
        const listingToEdit = listings.find(l => l.id === selectedListingId);
        return (
          <div className="py-8 px-4 max-w-4xl mx-auto">
            <ListingForm 
              initialData={listingToEdit}
              onSave={handleSaveListing} 
              onCancel={() => handleNavigate('ADMIN_DASHBOARD')} 
            />
          </div>
        );
      case 'VIEW_LISTING':
        const listingToView = listings.find(l => l.id === selectedListingId);
        if (!listingToView) return <div>Listing not found</div>;
        return (
          <div className="py-8 px-4">
            <ListingDetail 
              listing={listingToView} 
              onBack={() => handleNavigate('BROWSE')} 
            />
          </div>
        );
      case 'ADMIN_DASHBOARD':
        return (
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Property Manager</h1>
              <button 
                onClick={() => setView('ADD_LISTING')}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Listing
              </button>
            </div>
            
            {listings.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                 <p className="text-slate-500 mb-4">No properties listed yet.</p>
                 <button onClick={() => setView('ADD_LISTING')} className="text-blue-600 font-bold hover:underline">Create your first listing</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    isAdmin={true}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteListing}
                    onClick={handleListingClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'BROWSE':
      default:
        return (
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sidebar Filters */}
              <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
                <FilterSidebar 
                  filters={filters} 
                  onFilterChange={setFilters} 
                  onClear={clearFilters}
                />
              </div>

              {/* Main Content */}
              <div className="col-span-1 lg:col-span-9 xl:col-span-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'House', 'Villa', 'Apartment'].map(type => (
                      <button 
                        key={type}
                        onClick={() => {
                          if (type === 'All') setFilters(prev => ({ ...prev, propertyTypes: [] }));
                          else setFilters(prev => ({ ...prev, propertyTypes: [type] }));
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          (type === 'All' && filters.propertyTypes.length === 0) || filters.propertyTypes.includes(type)
                           ? 'bg-blue-600 text-white shadow-md'
                           : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsMapView(!isMapView)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isMapView ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {isMapView ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
                    {isMapView ? 'List View' : 'Map View'}
                  </button>
                </div>

                {isMapView ? (
                  <div className="bg-slate-100 rounded-3xl overflow-hidden h-[700px] relative border border-slate-200 shadow-inner">
                     {/* Map always shows all filtered results for context */}
                     <Map 
                       listings={filteredListings} 
                       onMarkerClick={handleListingClick} 
                     />
                  </div>
                ) : (
                  <>
                    {filteredListings.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl">
                        <p className="text-slate-500 text-lg">No listings found matching your filters.</p>
                        <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                          {paginatedListings.map(listing => (
                            <ListingCard 
                              key={listing.id} 
                              listing={listing} 
                              isAdmin={false}
                              onClick={handleListingClick}
                            />
                          ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center mt-12 gap-2">
                            <button 
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            
                            <div className="flex gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                    currentPage === page 
                                      ? 'bg-slate-900 text-white shadow-md' 
                                      : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>

                            <button 
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar 
        currentView={view} 
        onNavigate={handleNavigate} 
      />
      <main className="animate-fadeIn">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
