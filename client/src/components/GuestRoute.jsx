import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMyProfile } from '../services/api';

export default function GuestRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMyProfile();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false); 
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}