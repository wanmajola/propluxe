import React from 'react';
import { Home, LayoutDashboard, PlusCircle, Search, Bell, MessageSquare, ChevronDown, User } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm py-3">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer min-w-[150px]" onClick={() => onNavigate('BROWSE')}>
            <div className="bg-slate-900 text-white p-1.5 rounded-lg mr-2">
              <Home className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">PropLuxe</span>
          </div>
          
          {/* Center Links */}
          <div className="hidden lg:flex items-center space-x-8">
             <button onClick={() => onNavigate('BROWSE')} className={`text-sm font-medium ${currentView === 'BROWSE' ? 'text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full' : 'text-slate-500 hover:text-slate-900'}`}>Buy</button>
             <button onClick={() => onNavigate('BROWSE')} className={`text-sm font-medium ${currentView === 'BROWSE' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Rent</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Favorites</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Help</button>
             <button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={`text-sm font-medium ${currentView === 'ADMIN_DASHBOARD' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Manager</button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Anything..." 
                className="pl-9 pr-8 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Icons */}
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-100 transition-all">
               <MessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-100 transition-all relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-full transition-colors">
               <div className="h-9 w-9 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
               </div>
               <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-900">John Doe</p>
                  <p className="text-[10px] text-slate-500">Landlord</p>
               </div>
               <ChevronDown className="h-4 w-4 text-slate-400 hidden xl:block" />
            </div>

            {/* Mobile Add Listing */}
            <button
              onClick={() => onNavigate('ADD_LISTING')}
              className="lg:hidden p-2 text-blue-600"
            >
              <PlusCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};