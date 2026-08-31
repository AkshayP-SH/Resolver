import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ isOpen, onClose, menuItems, currentPage, onPageChange }) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-base-100 shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <Link to="/" className="text-xl font-black tracking-tighter">
            RESOLVER
          </Link>
          <button onClick={onClose} className="btn btn-ghost btn-sm rounded-none">
            ✕
          </button>
        </div>

        <div className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                onClose();
              }}
              className={`btn btn-block justify-start rounded-none mb-2 ${currentPage === item.id ? 'btn-primary' : 'btn-ghost'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            className="btn btn-outline btn-block rounded-none"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}