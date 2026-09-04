import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ menuItems, currentPage, onPageChange, isMobileOpen, onMobileClose }) {
  const handleNavClick = (id) => {
    onPageChange(id);
    onMobileClose();
  };

  const NavContent = ({ isMobile }) => (
    <>
      <div className="h-16 flex items-center border-b border-base-300 shrink-0 px-4">
        <Link to="/" className="flex items-center gap-3 w-full overflow-hidden">
          <img src="/favicon.svg" alt="Resolver" className="w-6 h-6 shrink-0" />
          {/* text fades in on desktop hover, always shows on mobile */}
          <span className={`font-black text-xl tracking-tighter whitespace-nowrap transition-all duration-300 ${
            isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto overflow-hidden'
          }`}>
            RESOLVER
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-none transition-colors relative ${
                isActive 
                  ? 'bg-base-200 text-primary' 
                  : 'text-base-content/60 hover:bg-base-200/50 hover:text-base-content'
              }`}
              title={!isMobile ? item.label : ''}
            >
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r" />}
              
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">{item.icon}</div>
              
              <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto overflow-hidden'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-base-300 p-3 shrink-0 space-y-1">
        <Link
          to="/profile"
          className="w-full flex items-center gap-3 p-2.5 text-base-content/60 hover:bg-base-200/50 hover:text-base-content rounded-none"
        >
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
            isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto overflow-hidden'
          }`}>
            Profile
          </span>
        </Link>
        
        <div className={`flex items-center gap-3 p-2.5 transition-all duration-300 ${
          isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto overflow-hidden'
        }`}>
          <span className="font-semibold text-sm text-base-content/60 whitespace-nowrap">Theme</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>

        {isMobile && (
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="w-full flex items-center gap-3 p-2.5 text-error hover:bg-error/10 rounded-none"
          >
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">Logout</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen bg-base-100 border-r border-base-300 transition-all duration-300 z-40 group md:w-16 md:hover:w-60">
        <NavContent isMobile={false} />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-base-100 shadow-lg z-50 transform transition-transform duration-300 md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent isMobile={true} />
      </aside>
    </>
  );
}