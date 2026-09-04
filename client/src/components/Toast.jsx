import { useEffect, useState } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('resolver-toast', handleToast);
    return () => window.removeEventListener('resolver-toast', handleToast);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`alert rounded-none shadow-lg pointer-events-auto transition-all duration-300 ${
            toast.type === 'error' ? 'alert-error' : 
            toast.type === 'warning' ? 'alert-warning' : 'alert-success'
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}