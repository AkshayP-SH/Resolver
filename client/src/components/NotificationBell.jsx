import { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { showToast } from '../services/toast';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    window.refreshNotifications = fetchNotifications;
    return () => {
      delete window.refreshNotifications;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ASSIGNED':
        return <span className="text-info">📋</span>;
      case 'STATUS_CHANGE':
        return <span className="text-success">✅</span>;
      default:
        return <span className="text-base-content/50">🔔</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="btn btn-ghost btn-circle relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-error rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-100 mt-2 w-80 bg-base-100 border border-base-300 rounded-box shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-base-300 flex justify-between items-center bg-base-200/50 sticky top-0">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-base-content/50 text-sm">
              No notifications yet.
            </div>
          ) : (
            <ul className="py-2">
              {notifications.map((n) => (
                <li key={n._id} className={`px-4 py-3 hover:bg-base-200/50 transition-colors border-b border-base-300/50 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                  <div className="flex gap-3">
                    <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'font-semibold' : 'text-base-content/70'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-base-content/40 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {!n.read && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkRead(n._id); }}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}